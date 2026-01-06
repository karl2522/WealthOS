# API Integration Guide

## Overview

WealthOS uses two external APIs for real-time asset pricing:

1. **Alpha Vantage** - For stocks and ETFs
2. **CoinGecko** - For cryptocurrency prices

## Setup Instructions

### 1. Alpha Vantage (Required for Stocks/ETFs)

**Get Your API Key:**
1. Visit: https://www.alphavantage.co/support/#api-key
2. Enter your email
3. You'll receive a free API key instantly

**Free Tier Limits:**
- 25 API calls per day
- 5 API calls per minute

**Add to Backend .env:**
```env
ALPHA_VANTAGE_KEY=your-api-key-here
```

### 2. CoinGecko (Automatic for Crypto)

**No API Key Required!**

CoinGecko's public API is used for cryptocurrency prices and works without authentication.

**Free Tier Limits:**
- 10-30 calls/minute
- No daily limit for basic endpoints

**Premium options:** https://www.coingecko.com/api (optional)

## How It Works

### Price Caching Strategy

**15-Minute Cache:**
- Prices are fetched once and cached in the database
- `lastPriceUpdate` timestamp tracks freshness
- Auto-refreshes only when cache is stale (> 15 minutes)

**Benefits:**
- Avoids hitting rate limits
- Fast dashboard loading
- Reduced API costs

### Fallback Mechanism

**If API fails or no API key:**
- System uses **mock prices** for development
- Prices are realistic but not real-time
- Logs warning in console

**Mock prices include:**
- NVDA: ~$500
- AAPL: ~$180
- VOO: ~$430
- BTC: ~$45,000
- ETH: ~$2,500
- And more...

## Testing Your Setup

### With API Keys (Production)

1. Add `ALPHA_VANTAGE_KEY` to `.env`
2. Restart backend: `npm run start:dev`
3. Add a stock (e.g., AAPL) in the dashboard
4. Check console logs for: "Fetched price from Alpha Vantage"

### Without API Keys (Development)

1. Simply start the backend
2. Add any asset
3. Console will show: "Using mock price for development"
4. Prices will work but won't be real-time

## API Endpoints Used

### Alpha Vantage

**Endpoint:**
```
https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={SYMBOL}&apikey={API_KEY}
```

**Response:**
```json
{
  "Global Quote": {
    "05. price": "185.92"
  }
}
```

### CoinGecko

**Endpoint:**
```
https://api.coingecko.com/api/v3/simple/price?ids={COIN_ID}&vs_currencies=usd
```

**Response:**
```json
{
  "bitcoin": {
    "usd": 45000
  }
}
```

## Troubleshooting

### "Rate limit exceeded"
- **Solution:** Wait for the rate limit window to reset
- **Prevention:** Caching prevents this in normal usage

### "No price data returned"
- **Check:** API key is correct in `.env`
- **Check:** Symbol is valid (e.g., "AAPL" not "Apple")
- **Fallback:** System will use mock price

### "API key not configured"
- **Action:** Add `ALPHA_VANTAGE_KEY` to `.env` file
- **Note:** App will work with mock prices until configured

## Production Recommendations

### For MVP/Demo:
✅ Use free tiers (Alpha Vantage + CoinGecko)
✅ 15-minute cache is sufficient
✅ Mock fallback provides good UX

### For Production Scale:
- Consider paid API tiers for higher limits
- Implement background job for batch updates
- Add Redis for distributed caching
- Set up monitoring/alerts for API failures

## Environment Variables Reference

```env
# Required for stocks/ETFs
ALPHA_VANTAGE_KEY=your-key-here

# Optional: Override default endpoints (advanced)
ALPHA_VANTAGE_URL=https://www.alphavantage.co/query
COINGECKO_URL=https://api.coingecko.com/api/v3
```

## Summary

✅ **Zero config needed** for basic functionality (uses mocks)
✅ **One API key** (Alpha Vantage) unlocks real stock prices
✅ **Crypto works automatically** via CoinGecko
✅ **Smart caching** prevents rate limit issues
✅ **Graceful fallbacks** ensure app always works
