import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

// Configuration
const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_KEY || 'your_api_key_here';
const COINGECKO_MAP: Record<string, string> = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'SOL': 'solana',
    'ADA': 'cardano',
    'DOT': 'polkadot',
    'DOGE': 'dogecoin',
    'USDT': 'tether',
    'XRP': 'ripple'
};

/* -------------------------------------------------------------------------- */
/*                               Core Functions                               */
/* -------------------------------------------------------------------------- */

// Fetch Exchange Rate (USD -> Target)
async function getExchangeRate(target: string): Promise<number> {
    if (target === 'USD') return 1;
    try {
        const url = `https://api.exchangerate-api.com/v4/latest/USD`;
        const res = await axios.get(url);
        const rate = res.data.rates[target.toUpperCase()];
        return rate || 1;
    } catch (e) {
        console.error('Failed to fetch exchange rate:', e.message);
        return 1;
    }
}

// Fetch Stock Price (Alpha Vantage)
async function getStockPrice(symbol: string): Promise<number | null> {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`;
    try {
        const res = await axios.get(url);
        const quote = res.data['Global Quote'];
        if (quote && quote['05. price']) {
            return parseFloat(quote['05. price']);
        }
        console.warn(`No price data for stock ${symbol}`, res.data);
        return null;
    } catch (e) {
        console.error(`Error fetching stock ${symbol}:`, e.message);
        return null;
    }
}

// Fetch Crypto Price (CoinGecko)
async function getCryptoPrice(symbol: string, currency: string): Promise<number | null> {
    const id = COINGECKO_MAP[symbol.toUpperCase()] || symbol.toLowerCase();
    const curr = currency.toLowerCase();
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=${curr}`;

    try {
        const res = await axios.get(url);
        if (res.data[id] && res.data[id][curr]) {
            return res.data[id][curr];
        }
        console.warn(`No price data for crypto ${symbol}`, res.data);
        return null;
    } catch (e) {
        console.error(`Error fetching crypto ${symbol}:`, e.message);
        return null;
    }
}

/* -------------------------------------------------------------------------- */
/*                                Main Script                                 */
/* -------------------------------------------------------------------------- */

async function main() {
    console.log('🚀 Starting Asset Price Fixer...');

    // 1. Get all portfolios
    const portfolios = await prisma.portfolio.findMany({
        include: { assets: true }
    });

    for (const portfolio of portfolios) {
        const currency = portfolio.currency;
        console.log(`\n📂 Portfolio: ${portfolio.name} (${currency})`);

        // 1. Get Rate (once per portfolio)
        const rate = await getExchangeRate(currency);
        console.log(`💱 Exchange Rate (USD -> ${currency}): ${rate}`);

        for (const asset of portfolio.assets) {
            console.log(`   🔹 Processing ${asset.symbol} (${asset.type})...`);

            let newPrice: number | null = null;

            // 2. Fetch Price
            if (asset.type === 'crypto') {
                newPrice = await getCryptoPrice(asset.symbol, currency);
            } else {
                const usdPrice = await getStockPrice(asset.symbol);
                if (usdPrice) {
                    newPrice = usdPrice * rate;
                }
            }

            // 3. Update DB
            if (newPrice) {
                console.log(`      ✅ New Price: ${newPrice.toFixed(2)} ${currency} (Old: ${asset.currentPrice})`);
                await prisma.portfolioAsset.update({
                    where: { id: asset.id },
                    data: {
                        currentPrice: newPrice,
                        lastPriceUpdate: new Date()
                    }
                });
            } else {
                console.log(`      ⚠️ Failed to fetch price. Keeping old value.`);
            }

            // Brief pause to avoid rate limits
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    console.log('\n✅ All Done!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
