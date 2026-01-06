"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolio } from "@/contexts/portfolio-context";
import { PieChart as PieChartIcon } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export function AssetAllocation() {
    const { assets, totalValue, isLoading } = usePortfolio();

    if (isLoading) {
        return (
            <Card className="shadow-md bg-sidebar">
                <CardHeader>
                    <CardTitle>Allocation</CardTitle>
                    <CardDescription>Asset distribution across categories</CardDescription>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[200px] md:h-[240px] rounded-full mx-auto w-[200px] md:w-[240px]" />
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Calculate allocation by asset type
    const allocationByType = assets.reduce(
        (acc, asset) => {
            const type = asset.type.toLowerCase();
            const currentPrice = asset.currentPrice ? parseFloat(asset.currentPrice.toString()) : 0;
            const quantity = parseFloat(asset.quantity.toString());
            const value = currentPrice * quantity;

            if (!acc[type]) {
                acc[type] = 0;
            }
            acc[type] += value;

            return acc;
        },
        {} as Record<string, number>
    );

    const typeColors: Record<string, string> = {
        etf: "hsl(var(--chart-1))",
        stock: "hsl(var(--chart-2))",
        crypto: "hsl(var(--chart-3))",
    };

    const typeLabels: Record<string, string> = {
        etf: "ETFs",
        stock: "Stocks",
        crypto: "Crypto",
    };

    const chartData = Object.entries(allocationByType).map(([type, value]) => ({
        name: typeLabels[type] || type,
        value: totalValue > 0 ? (value / totalValue) * 100 : 0,
        absoluteValue: value,
        color: typeColors[type] || "hsl(var(--chart-4))",
    }));

    if (chartData.length === 0) {
        return (
            <Card className="shadow-md bg-sidebar">
                <CardHeader>
                    <CardTitle>Allocation</CardTitle>
                    <CardDescription>Asset distribution across categories</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center h-[200px] md:h-[240px]">
                        <div className="rounded-full bg-muted p-4 mb-4">
                            <PieChartIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Add assets to see allocation
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-md bg-sidebar">
            <CardHeader>
                <CardTitle>Allocation</CardTitle>
                <CardDescription>Asset distribution across categories</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] md:h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) => `${value.toFixed(2)}%`}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                    {chartData.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                            <div className="size-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <div className="flex flex-col">
                                <span className="text-xs font-medium">{item.name}</span>
                                <span className="text-sm font-bold">{item.value.toFixed(1)}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

