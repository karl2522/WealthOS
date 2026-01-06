import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreatePortfolioDto {
    @IsString()
    name: string;

    @IsEnum(['PHP', 'USD'])
    currency: 'PHP' | 'USD';

    @IsOptional()
    @IsEnum(['conservative', 'balanced', 'growth'])
    riskProfile?: 'conservative' | 'balanced' | 'growth';
}
