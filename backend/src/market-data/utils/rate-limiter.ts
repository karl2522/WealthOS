export class RateLimiter {
    private tokens: number;
    private lastRefill: number;
    private readonly limit: number;
    private readonly interval: number; // in milliseconds

    constructor(limit: number, intervalMs: number) {
        this.limit = limit;
        this.interval = intervalMs;
        this.tokens = limit;
        this.lastRefill = Date.now();
    }

    async waitForToken(): Promise<void> {
        this.refill();

        if (this.tokens > 0) {
            this.tokens--;
            return;
        }

        const now = Date.now();
        const timeSinceLastRefill = now - this.lastRefill;
        const timeToNextRefill = this.interval - timeSinceLastRefill;

        if (timeToNextRefill > 0) {
            await new Promise(resolve => setTimeout(resolve, timeToNextRefill));
            this.refill();
        }

        // Recursive call (in case multiple waiters woke up and took tokens)
        return this.waitForToken();
    }

    private refill() {
        const now = Date.now();
        const timePassed = now - this.lastRefill;

        if (timePassed >= this.interval) {
            this.tokens = this.limit;
            this.lastRefill = now;
        }
    }

    // Helper for debugging/metrics
    getRemainingTokens(): number {
        this.refill();
        return this.tokens;
    }
}
