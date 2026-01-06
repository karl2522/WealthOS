import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalService {
    constructor(private prisma: PrismaService) { }

    async create(portfolioId: string, userId: string, dto: CreateGoalDto) {
        // Verify portfolio ownership
        await this.verifyPortfolioOwnership(portfolioId, userId);

        const goal = await this.prisma.goal.create({
            data: {
                portfolioId,
                name: dto.name,
                targetAmount: new Decimal(dto.targetAmount),
                monthlyContribution: dto.monthlyContribution ? new Decimal(dto.monthlyContribution) : null,
            },
        });

        return goal;
    }

    async findAll(portfolioId: string, userId: string) {
        // Verify portfolio ownership
        await this.verifyPortfolioOwnership(portfolioId, userId);

        return this.prisma.goal.findMany({
            where: { portfolioId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string, portfolioId: string, userId: string) {
        // Verify portfolio ownership
        await this.verifyPortfolioOwnership(portfolioId, userId);

        const goal = await this.prisma.goal.findUnique({
            where: { id },
        });

        if (!goal || goal.portfolioId !== portfolioId) {
            throw new NotFoundException('Goal not found');
        }

        return goal;
    }

    async update(id: string, portfolioId: string, userId: string, dto: UpdateGoalDto) {
        // Verify ownership
        await this.findOne(id, portfolioId, userId);

        const goal = await this.prisma.goal.update({
            where: { id },
            data: {
                name: dto.name,
                targetAmount: dto.targetAmount ? new Decimal(dto.targetAmount) : undefined,
                monthlyContribution: dto.monthlyContribution
                    ? new Decimal(dto.monthlyContribution)
                    : undefined,
            },
        });

        return goal;
    }

    async remove(id: string, portfolioId: string, userId: string) {
        // Verify ownership
        await this.findOne(id, portfolioId, userId);

        await this.prisma.goal.delete({
            where: { id },
        });

        return { message: 'Goal deleted successfully' };
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
}
