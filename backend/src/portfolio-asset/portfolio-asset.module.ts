import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PortfolioAssetController } from './portfolio-asset.controller';
import { PortfolioAssetService } from './portfolio-asset.service';
import { PriceFetcherService } from './services/price-fetcher.service';

@Module({
    imports: [PrismaModule],
    controllers: [PortfolioAssetController],
    providers: [PortfolioAssetService, PriceFetcherService],
    exports: [PortfolioAssetService],
})
export class PortfolioAssetModule { }
