import { IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreatePortfolioAssetDto {
    @IsString()
    symbol: string;

    @IsEnum(['etf', 'stock', 'crypto'])
    type: 'etf' | 'stock' | 'crypto';

    @IsNumber()
    @IsPositive()
    quantity: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    avgPrice?: number;

    @IsOptional()
    @IsEnum(['onboarding', 'dashboard'])
    createdVia?: 'onboarding' | 'dashboard';
}
