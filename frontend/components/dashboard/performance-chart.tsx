"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { usePortfolio } from "@/contexts/portfolio-context"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
    { name: "Jan", total: 4000 },
    { name: "Feb", total: 3000 },
    { name: "Mar", total: 2000 },
    { name: "Apr", total: 2780 },
    { name: "May", total: 1890 },
    { name: "Jun", total: 2390 },
    { name: "Jul", total: 3490 },
    { name: "Aug", total: 4000 },
    { name: "Sep", total: 4500 },
    { name: "Oct", total: 5200 },
    { name: "Nov", total: 5800 },
    { name: "Dec", total: 6400 },
]

export function PerformanceChart() {
    const { isLoading } = usePortfolio();

    if (isLoading) {
        return (
            <Card className="h-full shadow-md bg-sidebar">
                <CardHeader className="space-y-2">
                    <Skeleton className="h-5 w-[140px]" />
                    <Skeleton className="h-4 w-[250px]" />
                </CardHeader>
                <CardContent className="h-[300px] md:h-[350px]">
                    <Skeleton className="h-full w-full rounded-md" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="h-full shadow-md bg-sidebar">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="space-y-1">
                    <CardTitle>Portfolio Performance</CardTitle>
                    <CardDescription>Visualizing your net worth growth over the past year</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    {["1D", "1W", "1M", "1Y", "ALL"].map((range) => (
                        <button
                            key={range}
                            className={`text-xs px-2.5 py-1 rounded-md transition-colors ${range === "1Y" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="h-[300px] md:h-[350px]">
                <ChartContainer
                    config={{
                        total: { label: "Value", color: "hsl(var(--primary))" },
                    }}
                    className="h-full"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#colorTotal)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
