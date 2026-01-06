import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePortfolioAssetDto } from './dto/create-portfolio-asset.dto';
import { UpdatePortfolioAssetDto } from './dto/update-portfolio-asset.dto';
import { PortfolioAssetService } from './portfolio-asset.service';

@Controller('portfolio/:portfolioId/assets')
@UseGuards(JwtAuthGuard)
export class PortfolioAssetController {
    constructor(private readonly portfolioAssetService: PortfolioAssetService) { }

    @Get('debug-price')
    async debugPrice(@Query('symbol') symbol: string, @Query('currency') currency: string) {
        // Temporary debug endpoint
        return this.portfolioAssetService.debugGetPrice(symbol, currency);
    }

    @Post()
    create(
        @Param('portfolioId') portfolioId: string,
        @Request() req,
        @Body() createDto: CreatePortfolioAssetDto,
    ) {
        return this.portfolioAssetService.create(portfolioId, req.user.userId, createDto);
    }

    @Get()
    findAll(@Param('portfolioId') portfolioId: string, @Request() req) {
        return this.portfolioAssetService.findAll(portfolioId, req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Param('portfolioId') portfolioId: string, @Request() req) {
        return this.portfolioAssetService.findOne(id, portfolioId, req.user.userId);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Param('portfolioId') portfolioId: string,
        @Request() req,
        @Body() updateDto: UpdatePortfolioAssetDto,
    ) {
        return this.portfolioAssetService.update(id, portfolioId, req.user.userId, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Param('portfolioId') portfolioId: string, @Request() req) {
        return this.portfolioAssetService.remove(id, portfolioId, req.user.userId);
    }
}
