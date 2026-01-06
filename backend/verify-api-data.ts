import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

async function verify() {
    const symbol = 'AAPL';
    const apiKey = process.env.ALPHA_VANTAGE_KEY;
    const targetCurrency = 'PHP';

    console.log('--- Verifying Alpha Vantage API ---');
    if (!apiKey || apiKey === 'your_api_key_here') {
        console.error('❌ ALPHA_VANTAGE_KEY is missing or invalid in .env');
        return;
    }

    const stockUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
    try {
        console.log(`Fetching ${symbol} from Alpha Vantage...`);
        const stockRes = await axios.get(stockUrl);
        console.log('Raw Response:', JSON.stringify(stockRes.data, null, 2));

        const quote = stockRes.data['Global Quote'];
        const price = quote ? parseFloat(quote['05. price']) : null;

        if (price) {
            console.log(`✅ USD Price for ${symbol}: $${price}`);

            console.log('\n--- Verifying Exchange Rate API ---');
            const rateUrl = `https://api.exchangerate-api.com/v4/latest/USD`;
            try {
                console.log(`Fetching exchange rates from ${rateUrl}...`);
                const rateRes = await axios.get(rateUrl);
                const rate = rateRes.data.rates[targetCurrency];

                if (rate) {
                    console.log(`✅ Rate USD -> ${targetCurrency}: ${rate}`);
                    console.log(`\n--- CALCULATION CHECK ---`);
                    console.log(`$${price} * ${rate} = ${(price * rate).toLocaleString()} ${targetCurrency}`);
                } else {
                    console.error(`❌ Exchange rate for ${targetCurrency} not found.`);
                }
            } catch (e) {
                console.error('❌ Error fetching rates:', e.message);
            }

        } else {
            console.error('❌ Failed to extract price. Check API limit or key.');
        }
    } catch (e) {
        console.error('❌ Error fetching stock:', e.message);
    }
}

verify();
