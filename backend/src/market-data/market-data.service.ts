import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import NodeCache from 'node-cache';
import PQueue from 'p-queue';
import { MarketPriceDto } from './dto/market-price.dto';
import { RateLimiter } from './utils/rate-limiter';

@Injectable()
export class MarketDataService {
    private readonly logger = new Logger(MarketDataService.name);
    private readonly cache: NodeCache;
    private readonly alphaVantageKey: string;
    private readonly useRealPrices: boolean;

    // Rate Limiter: 5 calls per minute (60000ms)
    private readonly rateLimiter = new RateLimiter(5, 60000);

    // Request Queue: Concurrency 1 (process one at a time to respect limiter)
    private readonly queue = new PQueue({ concurrency: 1 });

    constructor(private configService: ConfigService) {
        this.cache = new NodeCache({
            stdTTL: 300, // 5 minutes default
            checkperiod: 60,
            useClones: false,
            maxKeys: 1000,
        });
        this.alphaVantageKey = this.configService.get<string>('ALPHA_VANTAGE_KEY') || '';
        // Enable real prices only if key is present matches default "your_api_key_here"
        this.useRealPrices = !!this.alphaVantageKey && this.alphaVantageKey !== 'your_api_key_here';
    }

    async getPrice(symbol: string, type: 'stock' | 'etf' | 'crypto', targetCurrency: string = 'USD'): Promise<MarketPriceDto | null> {
        const target = targetCurrency.toUpperCase();
        this.logger.log(`getPrice called for ${symbol} with target ${target}`);

        const cacheKey = `price:${type}:${symbol}:${target}`;
        const cached = this.cache.get<MarketPriceDto>(cacheKey);

        if (cached) {
            this.logger.debug(`Cache hit for ${symbol} in ${target}`);
            return cached;
        }

        if (!this.useRealPrices) {
            this.logger.debug(`Real prices disabled, using mock for ${symbol}`);
            return this.getMockPrice(symbol, target);
        }

        // Queue the request
        return this.queue.add(async () => {
            // Check cache again just in case it was populated while waiting in queue
            const cachedAgain = this.cache.get<MarketPriceDto>(cacheKey);
            if (cachedAgain) return cachedAgain;

            if (type !== 'crypto') {
                // Stock/ETF - Apply Rate Limiter
                await this.rateLimiter.waitForToken();
            }

            try {
                let price: MarketPriceDto | null = null;

                // Stock/ETF (Usually in USD from AlphaVantage)
                if (type !== 'crypto') {
                    const usdPrice = await this.fetchStockPrice(symbol);
                    if (usdPrice) {
                        this.logger.log(`Fetched USD price for ${symbol}: ${usdPrice.price}`);

                        if (target !== 'USD') {
                            const rate = await this.getExchangeRate('USD', target);
                            this.logger.log(`Using exchange rate USD -> ${target}: ${rate}`);

                            price = {
                                ...usdPrice,
                                price: usdPrice.price * rate,
                                change: usdPrice.change * rate,
                            };
                        } else {
                            price = usdPrice;
                        }
                    }
                }
                // Crypto (CoinGecko - No Strict Rate Limit for public, but good to be safe)
                else {
                    price = await this.fetchCryptoPrice(symbol, target);
                }

                if (price) {
                    const ttl = type === 'crypto' ? 600 : 300;
                    this.cache.set(cacheKey, price, ttl);
                    return price;
                }
            } catch (error) {
                this.logger.error(`Failed to fetch price for ${symbol}: ${error.message}`);
                // Optional: Return last known price from DB (would need DB injection, skipping for now)
            }
            return null;
        });
    }

    private async getExchangeRate(from: string, to: string): Promise<number> {
        const fromCode = from.toUpperCase();
        const toCode = to.toUpperCase();
        const key = `rate:${fromCode}:${toCode}`;

        // Check cache
        const cached = this.cache.get<number>(key);
        if (cached) return cached;

        try {
            const url = `https://api.exchangerate-api.com/v4/latest/${fromCode}`;
            this.logger.log(`Fetching exchange rate from ${url}`);
            const response = await axios.get(url);

            const rate = response.data.rates[toCode];

            if (rate) {
                this.cache.set(key, rate, 24 * 60 * 60);
                return rate;
            } else {
                this.logger.warn(`Rate for ${toCode} not found in API response`);
            }
        } catch (e) {
            this.logger.error(`Failed to fetch exchange rate ${fromCode}->${toCode}: ${e.message}`);
        }

        this.logger.warn('Falling back to 1.0 exchange rate');
        return 1;
    }

    // ... fetchStockPrice, fetchCryptoPrice, getMockPrice ... 
    // (Assuming these exist below the replaced block, I'll keep the replace somewhat scoped if possible, 
    // but the instruction implies replacing the top half. I will double check the file content end line.)

    // Need to make sure I don't delete the private methods. 
    // The previous view_file only showed up to line 100.
    // I will use replace logic carefully.

    // Let's use start/end lines from the view.
    // Line 1 to 90 covers imports and getPrice.
    // getExchangeRate starts at 91.

    // I need to install 'p-queue' in the next step.


    // Private methods below
    private async fetchStockPrice(symbol: string): Promise<MarketPriceDto | null> {
        try {
            const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.alphaVantageKey}`;
            const response = await this.fetchWithRetry(url);

            // Check for API limit or error
            if (response.data['Note'] || response.data['Information']) {
                this.logger.warn(`Alpha Vantage API limit or info for ${symbol}: ${JSON.stringify(response.data)}`);
                // If we hit the limit, we might want to throw to trigger retry or just fail. 
                // Since Alpha Vantage 429 comes as 200 OK with "Note", axios-retry won't catch it. 
                // But our rate limiter + queue should prevent this. 
                return null;
            }

            const quote = response.data['Global Quote'];
            if (!quote || Object.keys(quote).length === 0) {
                this.logger.warn(`No global quote found for ${symbol}`);
                return null;
            }

            return {
                symbol: symbol,
                price: parseFloat(quote['05. price']),
                change: parseFloat(quote['09. change']),
                changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
                lastUpdated: new Date(),
                source: 'alphavantage',
            };
        } catch (error) {
            this.logger.error(`Error fetching stock price from Alpha Vantage for ${symbol}`, error);
            return null;
        }
    }

    private async fetchWithRetry(url: string, retries = 3, backoff = 1000): Promise<any> {
        for (let i = 0; i < retries; i++) {
            try {
                return await axios.get(url);
            } catch (error) {
                const isLast = i === retries - 1;
                if (isLast) throw error;

                const delay = backoff * Math.pow(2, i);
                this.logger.warn(`Request failed to ${url}, retrying (${i + 1}/${retries}) in ${delay}ms... Error: ${error.message}`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    private async fetchCryptoPrice(symbol: string, currency: string): Promise<MarketPriceDto | null> {
        try {
            // Map common symbols to CoinGecko IDs
            const idMap: Record<string, string> = {
                'BTC': 'bitcoin',
                'ETH': 'ethereum',
                'SOL': 'solana',
                'ADA': 'cardano',
                'DOT': 'polkadot',
                'DOGE': 'dogecoin',
                'USDT': 'tether',
                'XRP': 'ripple'
            };

            const id = idMap[symbol.toUpperCase()] || symbol.toLowerCase();
            const curr = currency.toLowerCase();

            const url = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=${curr}&include_24hr_change=true`;
            const response = await axios.get(url);

            const data = response.data[id];
            if (!data) {
                this.logger.warn(`No CoinGecko data found for ${symbol} (id: ${id})`);
                return null;
            }

            return {
                symbol: symbol,
                price: data[curr],
                change: (data[curr] * (data[`${curr}_24h_change`] / 100)), // Approx change value from percent
                changePercent: data[`${curr}_24h_change`],
                lastUpdated: new Date(),
                source: 'coingecko',
            };
        } catch (error) {
            this.logger.error(`Error fetching crypto price from CoinGecko for ${symbol}`, error);
            return null;
        }
    }

    // Fallback mock generator
    private getMockPrice(symbol: string, currency: string): MarketPriceDto {
        let basePrice = Math.random() * 1000;
        // Simple mock logic: if 'PHP' multiply by 58 mostly for demo
        if (currency === 'PHP') basePrice *= 58;

        return {
            symbol: symbol,
            price: parseFloat(basePrice.toFixed(2)),
            change: parseFloat((Math.random() * 10 - 5).toFixed(2)),
            changePercent: parseFloat((Math.random() * 5 - 2.5).toFixed(2)),
            lastUpdated: new Date(),
            source: 'fallback',
        };
    }
}
