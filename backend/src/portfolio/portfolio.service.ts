import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

@Injectable()
export class PortfolioService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, createPortfolioDto: CreatePortfolioDto) {
        // Check if this is the user's first portfolio
        const existingPortfolios = await this.prisma.portfolio.count({
            where: { userId },
        });

        const portfolio = await this.prisma.portfolio.create({
            data: {
                ...createPortfolioDto,
                userId,
                isPrimary: existingPortfolios === 0, // First portfolio is primary
            },
            include: {
                assets: true,
                goals: true,
            },
        });

        return this.enrichPortfolio(portfolio);
    }

    async findAll(userId: string) {
        const portfolios = await this.prisma.portfolio.findMany({
            where: { userId },
            include: {
                assets: true,
                goals: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return portfolios.map((p) => this.enrichPortfolio(p));
    }

    async findOne(id: string, userId: string) {
        const portfolio = await this.prisma.portfolio.findUnique({
            where: { id },
            include: {
                assets: true,
                goals: true,
            },
        });

        if (!portfolio) {
            throw new NotFoundException('Portfolio not found');
        }

        if (portfolio.userId !== userId) {
            throw new ForbiddenException('You do not have access to this portfolio');
        }

        // Trigger snapshot for today
        await this.recordSnapshot(id);

        return this.enrichPortfolio(portfolio);
    }

    async update(id: string, userId: string, updatePortfolioDto: UpdatePortfolioDto) {
        // Verify ownership
        await this.findOne(id, userId);

        const portfolio = await this.prisma.portfolio.update({
            where: { id },
            data: updatePortfolioDto,
            include: {
                assets: true,
                goals: true,
            },
        });

        return this.enrichPortfolio(portfolio);
    }

    async remove(id: string, userId: string) {
        // Verify ownership
        await this.findOne(id, userId);

        await this.prisma.portfolio.delete({
            where: { id },
        });

        return { message: 'Portfolio deleted successfully' };
    }

    async getHistory(portfolioId: string, range: string) {
        const now = new Date();
        const startDate = new Date();
        startDate.setUTCHours(0, 0, 0, 0);

        switch (range) {
            case '1M':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case '3M':
                startDate.setMonth(now.getMonth() - 3);
                break;
            case '6M':
                startDate.setMonth(now.getMonth() - 6);
                break;
            case '1Y':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            case 'ALL':
                startDate.setFullYear(1970);
                break;
            default:
                startDate.setMonth(now.getMonth() - 1);
        }

        return this.prisma.portfolioSnapshot.findMany({
            where: {
                portfolioId,
                date: {
                    gte: startDate
                }
            },
            orderBy: {
                date: 'asc'
            }
        });
    }

    async recordSnapshot(portfolioId: string) {
        const portfolio = await this.prisma.portfolio.findUnique({
            where: { id: portfolioId },
            include: { assets: true }
        });

        if (!portfolio) return;

        const enriched = this.enrichPortfolio(portfolio);

        const totalInvested = portfolio.assets.reduce((sum, asset) => {
            const avg = asset.avgPrice ? parseFloat(asset.avgPrice.toString()) : 0;
            const qty = parseFloat(asset.quantity.toString());
            return sum + (avg * qty);
        }, 0);

        const totalValue = enriched.totalValue;
        const totalPL = enriched.totalPL;

        let returnPct = 0;
        if (totalInvested > 0) {
            returnPct = ((totalValue - totalInvested) / totalInvested) * 100;
        }

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        await this.prisma.portfolioSnapshot.upsert({
            where: {
                portfolioId_date: {
                    portfolioId,
                    date: today
                }
            },
            create: {
                portfolioId,
                date: today,
                totalValue,
                totalInvested,
                totalPL,
                returnPct,
                currency: portfolio.currency
            },
            update: {
                totalValue,
                totalInvested,
                totalPL,
                returnPct,
                currency: portfolio.currency
            }
        });
    }

    // Helper: Add calculated fields to portfolio
    private enrichPortfolio(portfolio: any) {
        const totalValue = portfolio.assets.reduce((sum, asset) => {
            const price = asset.currentPrice ? parseFloat(asset.currentPrice.toString()) : 0;
            const quantity = parseFloat(asset.quantity.toString());
            return sum + price * quantity;
        }, 0);

        const totalPL = portfolio.assets.reduce((sum, asset) => {
            if (!asset.avgPrice || !asset.currentPrice) return sum;
            const pl =
                (parseFloat(asset.currentPrice.toString()) - parseFloat(asset.avgPrice.toString())) *
                parseFloat(asset.quantity.toString());
            return sum + pl;
        }, 0);

        return {
            ...portfolio,
            totalValue,
            totalPL,
        };
    }
}
