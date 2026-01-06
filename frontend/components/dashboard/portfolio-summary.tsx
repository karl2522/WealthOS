"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolio } from "@/contexts/portfolio-context";
import { ArrowDownRight, ArrowUpRight, DollarSign, Target, TrendingUp } from "lucide-react";

export function PortfolioSummary() {
    const { portfolio, totalValue, totalPL, isLoading } = usePortfolio();

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

    const plPercentage = totalValue > 0 ? (totalPL / (totalValue - totalPL)) * 100 : 0;
    const isPositivePL = totalPL >= 0;

    const stats = [
        {
            label: "Total Portfolio Value",
            value: formatCurrency(totalValue),
            change: `${isPositivePL ? "+" : ""}${formatCurrency(totalPL)}`,
            trend: isPositivePL ? "up" : "down",
            icon: DollarSign,
        },
        {
            label: "Unrealized P/L",
            value: formatCurrency(totalPL),
            change: `${isPositivePL ? "+" : ""}${plPercentage.toFixed(2)}%`,
            trend: isPositivePL ? "up" : "down",
            icon: TrendingUp,
        },
        {
            label: "Total Assets",
            value: portfolio?.assets?.length || 0,
            change: portfolio?.goals?.length ? `${portfolio.goals.length} goal${portfolio.goals.length > 1 ? "s" : ""}` : "No goals yet",
            trend: "neutral",
            icon: Target,
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
                <Card key={stat.label} className="border-none shadow-md overflow-hidden bg-sidebar backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <stat.icon className="size-4" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold md:text-3xl tracking-tight leading-none mb-1">
                                {stat.value}
                            </span>
                            <div
                                className={`flex items-center text-sm font-medium ${stat.trend === "up"
                                        ? "text-emerald-600"
                                        : stat.trend === "down"
                                            ? "text-rose-600"
                                            : "text-muted-foreground"
                                    }`}
                            >
                                {stat.trend === "up" && <ArrowUpRight className="size-4 mr-0.5" />}
                                {stat.trend === "down" && <ArrowDownRight className="size-4 mr-0.5" />}
                                {stat.change}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

