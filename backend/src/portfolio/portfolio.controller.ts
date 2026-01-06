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
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
@UseGuards(JwtAuthGuard)
export class PortfolioController {
    constructor(private readonly portfolioService: PortfolioService) { }

    @Post()
    create(@Request() req, @Body() createPortfolioDto: CreatePortfolioDto) {
        return this.portfolioService.create(req.user.userId, createPortfolioDto);
    }

    @Get()
    findAll(@Request() req) {
        return this.portfolioService.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.portfolioService.findOne(id, req.user.userId);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Request() req,
        @Body() updatePortfolioDto: UpdatePortfolioDto,
    ) {
        return this.portfolioService.update(id, req.user.userId, updatePortfolioDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.portfolioService.remove(id, req.user.userId);
    }
}
