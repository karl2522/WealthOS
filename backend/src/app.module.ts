import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { redisStore } from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GoalModule } from './goal/goal.module';
import { MarketDataModule } from './market-data/market-data.module';
import { PortfolioAssetModule } from './portfolio-asset/portfolio-asset.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');
        if (redisUrl) {
          return {
            store: await redisStore({
              url: redisUrl,
            }),
          };
        }
        return {
          store: await redisStore({
            socket: {
              host: configService.get<string>('REDIS_HOST') || 'localhost',
              port: configService.get<number>('REDIS_PORT') || 6379,
            },
          }),
        };
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 100, // 100 requests per ttl globally
      },
    ]),
    PrismaModule,
    AuthModule,
    PortfolioModule,
    PortfolioAssetModule,
    GoalModule,
    MarketDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

