import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateGoalDto {
    @IsString()
    name: string;

    @IsNumber()
    @IsPositive()
    targetAmount: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    monthlyContribution?: number;
}
