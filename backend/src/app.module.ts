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
        // Prioritize REDIS_PUBLIC_URL as per Railway config
        const redisPublicUrl = configService.get<string>('REDIS_PUBLIC_URL');
        const redisUrl = configService.get<string>('REDIS_URL');
        // Support both naming conventions: REDIS_HOST (standard) and REDISHOST (Railway)
        const redisHost = configService.get<string>('REDIS_HOST') || configService.get<string>('REDISHOST');
        const redisPort = configService.get<number>('REDIS_PORT') || configService.get<number>('REDISPORT') || 6379;
        const redisPassword = configService.get<string>('REDIS_PASSWORD') || configService.get<string>('REDISPASSWORD');
        const redisUser = configService.get<string>('REDIS_USER') || configService.get<string>('REDISUSER');

        console.log('Redis Config Debug:');
        console.log(`REDIS_PUBLIC_URL present: ${!!redisPublicUrl}`);
        console.log(`REDIS_URL present: ${!!redisUrl}`);
        console.log(`REDISHOST: ${redisHost}`);
        console.log(`REDISPORT: ${redisPort}`);
        console.log(`REDISPASSWORD present: ${!!redisPassword}`);

        // 1. Try Public URL
        if (redisPublicUrl) {
          console.log('Using REDIS_PUBLIC_URL');
          return {
            store: await redisStore({
              url: redisPublicUrl,
            }),
          };
        }

        // 2. Try Standard URL
        if (redisUrl) {
          console.log('Using REDIS_URL');
          return {
            store: await redisStore({
              url: redisUrl,
            }),
          };
        }

        // 3. Try Host/Port/Password
        if (redisHost) {
          console.log('Using REDISHOST/PORT config');
          return {
            store: await redisStore({
              socket: {
                host: redisHost,
                port: redisPort,
              },
              password: redisPassword,
              username: redisUser,
            }),
          };
        }

        console.log('Using localhost fallback');
        return {
          store: await redisStore({
            socket: {
              host: 'localhost',
              port: 6379,
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

