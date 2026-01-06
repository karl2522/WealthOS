import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PriceFetcherService {
  private readonly logger = new Logger(PriceFetcherService.name);

  constructor(private config: ConfigService) {}

  async fetchPrice(symbol: string, type: 'etf' | 'stock' | 'crypto'): Promise<number | null> {
    try {
      if (type === 'crypto') {
        return await this.fetchCryptoPrice(symbol);
      } else {
        return await this.fetchStockPrice(symbol);
      }
    } catch (error) {
      this.logger.error(`Failed to fetch price for ${symbol}:`, error.message);
      return null;
    }
  }

  private async fetchStockPrice(symbol: string): Promise<number | null> {
    // Alpha Vantage API
    const apiKey = this.config.get('ALPHA_VANTAGE_KEY');

    if (!apiKey) {
      this.logger.warn('Alpha Vantage API key not configured, using mock price');
      return this.generateMockPrice(symbol);
    }

    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data['Global Quote'] && data['Global Quote']['05. price']) {
        return parseFloat(data['Global Quote']['05. price']);
      }

      this.logger.warn(`No price data from Alpha Vantage for ${symbol}, using mock`);
      return this.generateMockPrice(symbol);
    } catch (error) {
      this.logger.error(`Alpha Vantage API error for ${symbol}:`, error);
      return this.generateMockPrice(symbol);
    }
  }

  private async fetchCryptoPrice(symbol: string): Promise<number | null> {
    // CoinGecko API (no key required for basic usage)
    const coinId = this.getCoinGeckoId(symbol);

    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data[coinId] && data[coinId].usd) {
        return data[coinId].usd;
      }

      this.logger.warn(`No price data from CoinGecko for ${symbol}, using mock`);
      return this.generateMockPrice(symbol);
    } catch (error) {
      this.logger.error(`CoinGecko API error for ${symbol}:`, error);
      return this.generateMockPrice(symbol);
    }
  }

  private getCoinGeckoId(symbol: string): string {
    const mapping = {
      BTC: 'bitcoin',
      ETH: 'ethereum',
      SOL: 'solana',
    };
    return mapping[symbol.toUpperCase()] || symbol.toLowerCase();
  }

  // Fallback mock prices for development/demo
  private generateMockPrice(symbol: string): number {
    const mockPrices = {
      // Stocks
      NVDA: 500 + Math.random() * 50,
      AAPL: 180 + Math.random() * 20,
      MSFT: 380 + Math.random() * 30,
      TSLA: 250 + Math.random() * 25,
      GOOGL: 140 + Math.random() * 15,

      // ETFs
      VOO: 430 + Math.random() * 20,
      SPY: 470 + Math.random() * 25,
      QQQ: 390 + Math.random() * 20,
      VTI: 240 + Math.random() * 15,

      // Crypto
      BTC: 45000 + Math.random() * 5000,
      ETH: 2500 + Math.random() * 500,
      SOL: 110 + Math.random() * 20,
    };

    return mockPrices[symbol.toUpperCase()] || 100 + Math.random() * 50;
  }
}
