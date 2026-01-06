import { Module } from '@nestjs/common';
import { MarketDataModule } from '../market-data/market-data.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PortfolioAssetController } from './portfolio-asset.controller';
import { PortfolioAssetService } from './portfolio-asset.service';

@Module({
    imports: [PrismaModule, MarketDataModule],
    controllers: [PortfolioAssetController],
    providers: [PortfolioAssetService],
    exports: [PortfolioAssetService],
})
export class PortfolioAssetModule { }
