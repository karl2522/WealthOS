export class MarketPriceDto {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    lastUpdated: Date;
    source: 'alphavantage' | 'coingecko' | 'cache' | 'fallback';
}
