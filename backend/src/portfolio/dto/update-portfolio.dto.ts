import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdatePortfolioDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEnum(['PHP', 'USD'])
    currency?: 'PHP' | 'USD';

    @IsOptional()
    @IsEnum(['conservative', 'balanced', 'growth'])
    riskProfile?: 'conservative' | 'balanced' | 'growth';
}
