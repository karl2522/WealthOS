import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePortfolioAssetDto } from './dto/create-portfolio-asset.dto';
import { UpdatePortfolioAssetDto } from './dto/update-portfolio-asset.dto';
import { PriceFetcherService } from './services/price-fetcher.service';

@Injectable()
export class PortfolioAssetService {
    private readonly PRICE_CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

    constructor(
        private prisma: PrismaService,
        private priceFetcher: PriceFetcherService,
    ) { }

    async create(portfolioId: string, userId: string, dto: CreatePortfolioAssetDto) {
        // Verify portfolio ownership
        await this.verifyPortfolioOwnership(portfolioId, userId);

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
            return this.updateExisting(existing.id, dto);
        }

        // CREATE: New asset
        const currentPrice = await this.priceFetcher.fetchPrice(dto.symbol, dto.type);

        const asset = await this.prisma.portfolioAsset.create({
            data: {
                portfolioId,
                symbol: dto.symbol.toUpperCase(),
                type: dto.type,
                quantity: new Decimal(dto.quantity),
                avgPrice: dto.avgPrice ? new Decimal(dto.avgPrice) : null,
                currentPrice: currentPrice ? new Decimal(currentPrice) : null,
                lastPriceUpdate: currentPrice ? new Date() : null,
                createdVia: dto.createdVia || 'dashboard',
            },
        });

        return this.enrichAsset(asset);
    }

    async findAll(portfolioId: string, userId: string) {
        // Verify portfolio ownership
        await this.verifyPortfolioOwnership(portfolioId, userId);

        const assets = await this.prisma.portfolioAsset.findMany({
            where: { portfolioId },
            orderBy: { createdAt: 'desc' },
        });

        // Refresh stale prices
        const enrichedAssets = await Promise.all(
            assets.map((asset) => this.refreshPriceIfStale(asset)),
        );

        return enrichedAssets.map((asset) => this.enrichAsset(asset));
    }

    async findOne(id: string, portfolioId: string, userId: string) {
        // Verify portfolio ownership
        await this.verifyPortfolioOwnership(portfolioId, userId);

        const asset = await this.prisma.portfolioAsset.findUnique({
            where: { id },
        });

        if (!asset || asset.portfolioId !== portfolioId) {
            throw new NotFoundException('Asset not found');
        }

        const refreshed = await this.refreshPriceIfStale(asset);
        return this.enrichAsset(refreshed);
    }

    async update(id: string, portfolioId: string, userId: string, dto: UpdatePortfolioAssetDto) {
        // Verify ownership
        await this.findOne(id, portfolioId, userId);

        const asset = await this.prisma.portfolioAsset.update({
            where: { id },
            data: {
                quantity: dto.quantity ? new Decimal(dto.quantity) : undefined,
                avgPrice: dto.avgPrice ? new Decimal(dto.avgPrice) : undefined,
            },
        });

        return this.enrichAsset(asset);
    }

    async remove(id: string, portfolioId: string, userId: string) {
        // Verify ownership
        await this.findOne(id, portfolioId, userId);

        await this.prisma.portfolioAsset.delete({
            where: { id },
        });

        return { message: 'Asset removed successfully' };
    }

    // Helper: Update existing asset (upsert logic)
    private async updateExisting(existingId: string, dto: CreatePortfolioAssetDto) {
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

        return this.enrichAsset(asset);
    }

    // Helper: Refresh price if cached price is stale (> 15 minutes)
    private async refreshPriceIfStale(asset: any) {
        const isCacheStale =
            !asset.lastPriceUpdate ||
            Date.now() - asset.lastPriceUpdate.getTime() > this.PRICE_CACHE_DURATION_MS;

        if (isCacheStale) {
            const freshPrice = await this.priceFetcher.fetchPrice(asset.symbol, asset.type);

            if (freshPrice) {
                return await this.prisma.portfolioAsset.update({
                    where: { id: asset.id },
                    data: {
                        currentPrice: new Decimal(freshPrice),
                        lastPriceUpdate: new Date(),
                    },
                });
            }
        }

        return asset;
    }

    // Helper: Verify user owns portfolio
    private async verifyPortfolioOwnership(portfolioId: string, userId: string) {
        const portfolio = await this.prisma.portfolio.findUnique({
            where: { id: portfolioId },
        });

        if (!portfolio) {
            throw new NotFoundException('Portfolio not found');
        }

        if (portfolio.userId !== userId) {
            throw new ForbiddenException('You do not have access to this portfolio');
        }
    }

    // Helper: Add calculated P/L to asset
    private enrichAsset(asset: any) {
        const pl =
            asset.avgPrice && asset.currentPrice
                ? (parseFloat(asset.currentPrice.toString()) - parseFloat(asset.avgPrice.toString())) *
                parseFloat(asset.quantity.toString())
                : null;

        return {
            ...asset,
            pl,
        };
    }
}
