import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { MarketDataService } from '../market-data/market-data.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePortfolioAssetDto } from './dto/create-portfolio-asset.dto';
import { UpdatePortfolioAssetDto } from './dto/update-portfolio-asset.dto';

@Injectable()
export class PortfolioAssetService {
    constructor(
        private prisma: PrismaService,
        private marketData: MarketDataService,
    ) { }

    async debugGetPrice(symbol: string, currency: string) {
        return this.marketData.getPrice(symbol, 'stock', currency);
    }

    async create(portfolioId: string, userId: string, dto: CreatePortfolioAssetDto) {
        // Verify portfolio ownership and get currency
        const portfolio = await this.getPortfolioAndVerify(portfolioId, userId);

        // Check if asset already exists (unique constraint: portfolioId, symbol, type)
        const existing = await this.prisma.portfolioAsset.findFirst({
            where: {
                portfolioId,
                symbol: dto.symbol.toUpperCase(),
                type: dto.type,
            },
        });

        if (existing) {
            // UPSERT: Update existing asset
            return this.updateExisting(existing.id, dto, portfolio.currency);
        }

        // CREATE: New asset - Fetch initial market data in portfolio currency
        const marketPrice = await this.marketData.getPrice(dto.symbol, dto.type, portfolio.currency);

        const asset = await this.prisma.portfolioAsset.create({
            data: {
                portfolioId,
                symbol: dto.symbol.toUpperCase(),
                type: dto.type,
                quantity: new Decimal(dto.quantity),
                avgPrice: dto.avgPrice ? new Decimal(dto.avgPrice) : null,
                currentPrice: marketPrice?.price ? new Decimal(marketPrice.price) : null,
                lastPriceUpdate: marketPrice?.lastUpdated ?? new Date(),
                createdVia: dto.createdVia || 'dashboard',
            },
        });

        return this.enrichAsset(asset, marketPrice);
    }

    async findAll(portfolioId: string, userId: string) {
        const portfolio = await this.getPortfolioAndVerify(portfolioId, userId);

        const assets = await this.prisma.portfolioAsset.findMany({
            where: { portfolioId },
            orderBy: { createdAt: 'desc' },
        });

        // Enrich with real-time market data
        const enriched = await Promise.all(
            assets.map(async (asset) => {
                const marketPrice = await this.marketData.getPrice(asset.symbol, asset.type as any, portfolio.currency);

                // Optimistic update of DB if price is fresh (optional but good for consistency)
                if (marketPrice && (!asset.lastPriceUpdate || Date.now() - asset.lastPriceUpdate.getTime() > 15 * 60 * 1000)) {
                    // Fire and forget update
                    this.prisma.portfolioAsset.update({
                        where: { id: asset.id },
                        data: {
                            currentPrice: new Decimal(marketPrice.price),
                            lastPriceUpdate: new Date(),
                        }
                    }).catch(() => { }); // ignore error
                }

                return this.enrichAsset(asset, marketPrice);
            })
        );

        return enriched;
    }

    async findOne(id: string, portfolioId: string, userId: string) {
        const portfolio = await this.getPortfolioAndVerify(portfolioId, userId);

        const asset = await this.prisma.portfolioAsset.findUnique({
            where: { id },
        });

        if (!asset || asset.portfolioId !== portfolioId) {
            throw new NotFoundException('Asset not found');
        }

        const marketPrice = await this.marketData.getPrice(asset.symbol, asset.type as any, portfolio.currency);
        return this.enrichAsset(asset, marketPrice);
    }

    async update(id: string, portfolioId: string, userId: string, dto: UpdatePortfolioAssetDto) {
        const portfolio = await this.getPortfolioAndVerify(portfolioId, userId);

        // Also verify asset belongs to portfolio
        const checkAsset = await this.prisma.portfolioAsset.findUnique({ where: { id } });
        if (!checkAsset || checkAsset.portfolioId !== portfolioId) throw new NotFoundException('Asset not found');

        const asset = await this.prisma.portfolioAsset.update({
            where: { id },
            data: {
                quantity: dto.quantity ? new Decimal(dto.quantity) : undefined,
                avgPrice: dto.avgPrice ? new Decimal(dto.avgPrice) : undefined,
            },
        });

        const marketPrice = await this.marketData.getPrice(asset.symbol, asset.type as any, portfolio.currency);
        return this.enrichAsset(asset, marketPrice);
    }

    async remove(id: string, portfolioId: string, userId: string) {
        // Verify ownership
        await this.getPortfolioAndVerify(portfolioId, userId);
        const checkAsset = await this.prisma.portfolioAsset.findUnique({ where: { id } });
        if (!checkAsset || checkAsset.portfolioId !== portfolioId) throw new NotFoundException('Asset not found');

        await this.prisma.portfolioAsset.delete({
            where: { id },
        });

        return { message: 'Asset removed successfully' };
    }

    // Helper: Update existing asset (upsert logic)
    private async updateExisting(existingId: string, dto: CreatePortfolioAssetDto, currency: string) {
        const existing = await this.prisma.portfolioAsset.findUnique({
            where: { id: existingId },
        });

        if (!existing) {
            throw new NotFoundException('Asset not found');
        }

        // Calculate weighted average price
        const existingQty = parseFloat(existing.quantity.toString());
        const existingAvg = existing.avgPrice ? parseFloat(existing.avgPrice.toString()) : 0;
        const newQty = dto.quantity;
        const newAvg = dto.avgPrice || 0;

        const totalQty = existingQty + newQty;
        const weightedAvg =
            existingAvg && newAvg ? (existingQty * existingAvg + newQty * newAvg) / totalQty : null;

        const asset = await this.prisma.portfolioAsset.update({
            where: { id: existingId },
            data: {
                quantity: new Decimal(totalQty),
                avgPrice: weightedAvg ? new Decimal(weightedAvg) : existing.avgPrice,
            },
        });

        const marketPrice = await this.marketData.getPrice(asset.symbol, asset.type as any, currency);
        return this.enrichAsset(asset, marketPrice);
    }

    // Helper: Verify user owns portfolio and return it
    private async getPortfolioAndVerify(portfolioId: string, userId: string) {
        const portfolio = await this.prisma.portfolio.findUnique({
            where: { id: portfolioId },
        });

        if (!portfolio) {
            throw new NotFoundException('Portfolio not found');
        }

        if (portfolio.userId !== userId) {
            throw new ForbiddenException('You do not have access to this portfolio');
        }

        return portfolio;
    }

    // Helper: Enrich asset with real-time market data
    private enrichAsset(asset: any, marketPrice: any) {
        // Use real-time price if available, otherwise fallback to DB logic (mock/stale)
        // Wait, current logic:
        // If marketPrice is available, use it for calculations and overrides.
        // If not, use stored currentPrice.

        const currentPrice = marketPrice?.price
            ? new Decimal(marketPrice.price)
            : asset.currentPrice;

        const lastPriceUpdate = marketPrice?.lastUpdated || asset.lastPriceUpdate;

        const priceChange = marketPrice?.change || 0;
        const priceChangePercent = marketPrice?.changePercent || 0;

        const pl =
            asset.avgPrice && currentPrice
                ? (parseFloat(currentPrice.toString()) - parseFloat(asset.avgPrice.toString())) *
                parseFloat(asset.quantity.toString())
                : null;

        return {
            ...asset,
            currentPrice,
            lastPriceUpdate,
            priceChange,
            priceChangePercent,
            pl,
        };
    }
}
