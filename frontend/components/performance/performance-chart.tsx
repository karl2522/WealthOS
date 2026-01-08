"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"; // Assuming these exist from other charts
import { Skeleton } from "@/components/ui/skeleton"
import { PortfolioSnapshot } from "@/hooks/use-performance"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
// If date-fns is not available, I'll use native Intl.DateTimeFormat.

interface PerformanceChartProps {
    history: PortfolioSnapshot[];
    range: string;
    onRangeChange: (range: string) => void;
    isLoading: boolean;
}

export function PerformanceChart({ history, range, onRangeChange, isLoading }: PerformanceChartProps) {

    if (isLoading) {
        return (
            <Card className="col-span-2">
                <CardHeader>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[350px] w-full rounded-md" />
                </CardContent>
            </Card>
        )
    }

    const hasData = history.length > 0;

    const ranges = ["1M", "3M", "1Y", "ALL"]

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: history[0]?.currency || 'USD',
            maximumFractionDigits: 0
        }).format(val)
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
    }

    return (
        <Card className="col-span-2 shadow-md">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 space-y-0">
                <div className="space-y-1">
                    <CardTitle>Portfolio Performance</CardTitle>
                    <CardDescription>Value growth over time</CardDescription>
                </div>
                <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                    {ranges.map((r) => (
                        <Button
                            key={r}
                            variant={range === r ? "secondary" : "ghost"}
                            size="sm"
                            className="h-8 px-3 text-xs"
                            onClick={() => onRangeChange(r)}
                        >
                            {r}
                        </Button>
                    ))}
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full">
                    {hasData ? (
                        <ChartContainer
                            config={{
                                totalValue: { label: "Value", color: "hsl(var(--primary))" },
                            }}
                            className="h-full"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="fillTotalValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        minTickGap={32}
                                        tickFormatter={formatDate}
                                    />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `$${value}`} // Simple format for axis
                                        width={60}
                                    />
                                    <ChartTooltip
                                        content={
                                            <ChartTooltipContent
                                                labelFormatter={(value) => {
                                                    return new Date(value).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })
                                                }}
                                                indicator="dot"
                                            />
                                        }
                                    />
                                    <Area
                                        dataKey="totalValue"
                                        type="monotone"
                                        fill="url(#fillTotalValue)"
                                        fillOpacity={0.4}
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-4 border border-dashed rounded-md">
                            <p className="text-muted-foreground mb-2">Performance tracking starts once your portfolio is active.</p>
                            <p className="text-xs text-muted-foreground">Check back after market updates.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
