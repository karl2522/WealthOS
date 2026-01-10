"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PortfolioAsset, usePortfolio } from "@/contexts/portfolio-context";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, DollarSign, Trophy } from "lucide-react";

export function HoldingsSummary() {
    const { portfolio, totalValue, isLoading } = usePortfolio();

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="border-none shadow-md overflow-hidden bg-sidebar backdrop-blur-sm">
                        <CardContent className="p-6">
                            <Skeleton className="h-4 w-24 mb-4" />
                            <Skeleton className="h-8 w-32 mb-2" />
                            <Skeleton className="h-4 w-20" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: portfolio?.currency || "USD",
        }).format(value);
    };

    const assets = portfolio?.assets || [];

    // Calculate Top Gainer and Loser based on P/L %
    type AssetWithPL = PortfolioAsset & { plPercent: number };
    let topGainer: AssetWithPL | null = null;
    let topLoser: AssetWithPL | null = null;
    let maxPLPercent = -Infinity;
    let minPLPercent = Infinity;

    for (const asset of assets) {
        const currentPrice = asset.currentPrice ? parseFloat(asset.currentPrice.toString()) : 0;
        const avgPrice = asset.avgPrice ? parseFloat(asset.avgPrice.toString()) : 0;

        if (avgPrice > 0) {
            const plPercent = ((currentPrice - avgPrice) / avgPrice) * 100;

            if (plPercent > maxPLPercent) {
                maxPLPercent = plPercent;
                topGainer = { ...asset, plPercent };
            }

            if (plPercent < minPLPercent) {
                minPLPercent = plPercent;
                topLoser = { ...asset, plPercent };
            }
        }
    }

    // If max is still -Infinity (no assets or no avg price), reset
    if (maxPLPercent === -Infinity) topGainer = null;
    if (minPLPercent === Infinity) topLoser = null;

    // Filter out if they are the same (e.g. only 1 asset), or if values are 0
    if (topGainer && topGainer.plPercent < 0) topGainer = null; // Only show positive as gainer
    if (topLoser && topLoser.plPercent >= 0) topLoser = null; // Only show negative as loser

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {/* Total Value */}
            <Card className="border-none shadow-md overflow-hidden bg-sidebar backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">Total Holdings Value</span>
                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <DollarSign className="size-4" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold md:text-3xl tracking-tight leading-none mb-1">
                            {formatCurrency(totalValue)}
                        </span>
                        <div className="text-sm text-muted-foreground">
                            {assets.length} Active Asset{assets.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Top Gainer */}
            <Card className="border-none shadow-md overflow-hidden bg-sidebar backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">Top Performer</span>
                        <div className="size-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                            <Trophy className="size-4" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        {topGainer ? (
                            <>
                                <span className="text-2xl font-bold md:text-3xl tracking-tight leading-none mb-1">
                                    {topGainer.symbol}
                                </span>
                                <div className="flex items-center text-sm font-medium text-emerald-600">
                                    <ArrowUpRight className="size-4 mr-0.5" />
                                    +{topGainer.plPercent.toFixed(2)}%
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="text-2xl font-bold md:text-3xl tracking-tight leading-none mb-1 text-muted-foreground">
                                    —
                                </span>
                                <div className="text-sm text-muted-foreground">No gains recorded</div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Top Loser */}
            <Card className="border-none shadow-md overflow-hidden bg-sidebar backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">Needs Attention</span>
                        <div className="size-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600">
                            <AlertTriangle className="size-4" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        {topLoser ? (
                            <>
                                <span className="text-2xl font-bold md:text-3xl tracking-tight leading-none mb-1">
                                    {topLoser.symbol}
                                </span>
                                <div className="flex items-center text-sm font-medium text-rose-600">
                                    <ArrowDownRight className="size-4 mr-0.5" />
                                    {topLoser.plPercent.toFixed(2)}%
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="text-2xl font-bold md:text-3xl tracking-tight leading-none mb-1 text-muted-foreground">
                                    —
                                </span>
                                <div className="text-sm text-muted-foreground">No losses recorded</div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
