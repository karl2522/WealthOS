import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class UpdatePortfolioAssetDto {
    @IsOptional()
    @IsNumber()
    @IsPositive()
    quantity?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    avgPrice?: number;
}
