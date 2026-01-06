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
