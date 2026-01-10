import { PortfolioAsset } from "@/contexts/portfolio-context";
import { PortfolioSnapshot } from "@/hooks/use-performance";

export type InsightSeverity = "info" | "warning" | "critical";

export interface AlertInsight {
    type: "alert";
    severity: InsightSeverity;
    title: string;
    message: string;
    priority: number;
}

export interface PortfolioHealth {
    concentrationRisk: "Low" | "Moderate" | "High";
    diversificationScore: number;
    volatility: "Low" | "Moderate" | "High";
    stability: "Stable" | "Unstable";
}

export interface AttributionItem {
    symbol: string;
    contributionPct: number;
    gain: number;
    invested: number;
}

export interface BehavioralInsight {
    type: "behavior";
    message: string;
    priority: number;
}

export interface InsightsResult {
    alerts: AlertInsight[];
    health: PortfolioHealth;
    attribution: AttributionItem[];
    behavior: BehavioralInsight[];
}

const THRESHOLDS = {
    CONCENTRATION: {
        WARNING: 50,
        CRITICAL: 60
    },
    DIVERSIFICATION: {
        LOW: 3,
        HIGH: 8
    },
    VOLATILITY: { // Stubbed for now, based on % change variance
        MODERATE: 5,
        HIGH: 10
    }
};

export function generateInsights(
    assets: PortfolioAsset[],
    history: PortfolioSnapshot[]
): InsightsResult {
    const alerts: AlertInsight[] = [];
    const behavior: BehavioralInsight[] = [];
    let health: PortfolioHealth = {
        concentrationRisk: "Low",
        diversificationScore: 1,
        volatility: "Low",
        stability: "Stable"
    };

    if (!assets || assets.length === 0) {
        return { alerts, health, attribution: [], behavior };
    }

    // --- 1. Calculations ---
    const totalValue = assets.reduce((sum, a) => sum + ((a.quantity || 0) * (a.currentPrice || 0)), 0);

    // Sort assets by value for convenience
    const sortedByValue = [...assets].map(a => ({
        ...a,
        value: (a.quantity || 0) * (a.currentPrice || 0)
    })).sort((a, b) => b.value - a.value);

    // --- 2. Alerts Logic ---

    // Concentration Alert
    if (sortedByValue.length > 0) {
        const topAsset = sortedByValue[0];
        const topPct = totalValue > 0 ? (topAsset.value / totalValue) * 100 : 0;

        if (topPct >= THRESHOLDS.CONCENTRATION.CRITICAL) {
            alerts.push({
                type: "alert",
                severity: "critical",
                title: "Critical Concentration Risk",
                message: `${topAsset.symbol} makes up ${topPct.toFixed(0)}% of your portfolio.`,
                priority: 10
            });
            health.concentrationRisk = "High";
        } else if (topPct >= THRESHOLDS.CONCENTRATION.WARNING) {
            alerts.push({
                type: "alert",
                severity: "warning",
                title: "High Concentration",
                message: `${topAsset.symbol} makes up ${topPct.toFixed(0)}% of your portfolio.`,
                priority: 5
            });
            health.concentrationRisk = "Moderate";
        }
    }

    // --- 3. Health Logic ---
    const assetCount = assets.length;
    let divScore = 1;
    if (assetCount >= THRESHOLDS.DIVERSIFICATION.HIGH) divScore = 10;
    else if (assetCount >= THRESHOLDS.DIVERSIFICATION.LOW) divScore = 5 + (assetCount - 3); // Simple linear scale
    else divScore = assetCount * 2;
    health.diversificationScore = Math.min(10, Math.max(1, divScore));

    // Volatility (Stub logic using history)
    if (history.length >= 2) {
        // Simple drift check
        const first = history[0].totalValue;
        const last = history[history.length - 1].totalValue;
        const drift = Math.abs((last - first) / first) * 100;

        if (drift > THRESHOLDS.VOLATILITY.HIGH) health.volatility = "High";
        else if (drift > THRESHOLDS.VOLATILITY.MODERATE) health.volatility = "Moderate";
    }

    // Stability
    const positiveDays = history.filter(h => h.totalPL >= 0).length;
    const stabilityRatio = history.length > 0 ? positiveDays / history.length : 0;
    health.stability = stabilityRatio > 0.4 ? "Stable" : "Unstable";


    // --- 4. Attribution Logic ---
    const totalPL = assets.reduce((sum, a) => {
        const qty = a.quantity || 0;
        const curr = a.currentPrice || 0;
        const avg = a.avgPrice || 0;
        return sum + (qty * (curr - avg));
    }, 0);

    const attribution: AttributionItem[] = assets.map(a => {
        const qty = a.quantity || 0;
        const curr = a.currentPrice || 0;
        const avg = a.avgPrice || 0;
        const gain = qty * (curr - avg);
        const invested = qty * avg;

        // Contribution calculation: If total PL is positive, how much did this asset add?
        // If total PL is negative, how much did this drag it down?
        // Simplifying: % of absolute PL sum to handle mixed signs elegantly is tricky.
        // Simple approach: (Asset Gain / Total Gain) * 100.
        // Caution: If Total PL is near 0, this explodes. 

        let contributionPct = 0;
        if (Math.abs(totalPL) > 1) { // Avoid div/0
            contributionPct = (gain / Math.abs(totalPL)) * 100;
        }

        return {
            symbol: a.symbol,
            contributionPct,
            gain,
            invested
        };
    }).sort((a, b) => Math.abs(b.gain) - Math.abs(a.gain)); // Sort by magnitude of impact

    // --- 5. Behavioral Logic ---
    // Deduplicated: Don't add concentration behavior if alert exists
    const hasConcentrationAlert = alerts.some(a => a.title.includes("Concentration"));
    if (!hasConcentrationAlert && sortedByValue.length > 0) {
        // Maybe add a gentle nudge?
        // behavior.push({ ... })
    }

    // Check for recent Crypto surge (Example rule)
    const cryptoAssets = assets.filter(a => a.type === "Crypto");
    if (cryptoAssets.length > 0 && history.length > 30) {
        // This requires complex history diffing per asset, which we don't have perfect snapshots for yet.
        // We'll use current state proxy.
        const cryptoValue = cryptoAssets.reduce((sum, a) => sum + ((a.quantity || 0) * (a.currentPrice || 0)), 0);
        const cryptoPct = (cryptoValue / totalValue) * 100;
        if (cryptoPct > 30) {
            behavior.push({
                type: "behavior",
                message: `You have significant exposure to Crypto (${cryptoPct.toFixed(0)}%).`,
                priority: 3
            });
        }
    }

    // Rebalancing behavior check (Stub)
    // if (lastRebalance > 90 days) ...

    // Sort alerts by priority
    alerts.sort((a, b) => b.priority - a.priority);

    return { alerts, health, attribution, behavior };
}
