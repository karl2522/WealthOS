import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalService } from './goal.service';

@Controller('portfolio/:portfolioId/goals')
@UseGuards(JwtAuthGuard)
export class GoalController {
    constructor(private readonly goalService: GoalService) { }

    @Post()
    create(@Param('portfolioId') portfolioId: string, @Request() req, @Body() createDto: CreateGoalDto) {
        return this.goalService.create(portfolioId, req.user.userId, createDto);
    }

    @Get()
    findAll(@Param('portfolioId') portfolioId: string, @Request() req) {
        return this.goalService.findAll(portfolioId, req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Param('portfolioId') portfolioId: string, @Request() req) {
        return this.goalService.findOne(id, portfolioId, req.user.userId);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Param('portfolioId') portfolioId: string,
        @Request() req,
        @Body() updateDto: UpdateGoalDto,
    ) {
        return this.goalService.update(id, portfolioId, req.user.userId, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Param('portfolioId') portfolioId: string, @Request() req) {
        return this.goalService.remove(id, portfolioId, req.user.userId);
    }
}
