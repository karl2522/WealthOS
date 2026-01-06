import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateGoalDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    targetAmount?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    monthlyContribution?: number;
}
