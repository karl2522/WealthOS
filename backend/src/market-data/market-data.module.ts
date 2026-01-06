import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MarketDataService } from './market-data.service';

@Module({
    imports: [ConfigModule],
    providers: [MarketDataService],
    exports: [MarketDataService],
})
export class MarketDataModule { }
