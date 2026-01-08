"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { usePortfolio } from "@/contexts/portfolio-context"
import { ArrowDownRight, ArrowUpRight, DollarSign, TrendingUp, Wallet } from "lucide-react"

export function PerformanceSummaryCards() {
    const { totalValue, totalPL, portfolio, isLoading } = usePortfolio()

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-24 mb-1" />
                            <Skeleton className="h-3 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    const totalInvested = totalValue - totalPL
    const returnPct = totalInvested !== 0 ? (totalPL / totalInvested) * 100 : 0
    const isPositive = totalPL >= 0

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: portfolio?.currency || 'USD',
        }).format(val)
    }

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {/* Total Value */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
                    <p className="text-xs text-muted-foreground">Current market value</p>
                </CardContent>
            </Card>

            {/* Total Gain/Loss */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Gain / Loss</CardTitle>
                    <TrendingUp className={`h-4 w-4 ${isPositive ? "text-emerald-500" : "text-rose-500"}`} />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
                        {isPositive ? "+" : ""}{formatCurrency(totalPL)}
                    </div>
                    <div className={`flex items-center text-xs ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
                        {isPositive ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
                        {returnPct.toFixed(2)}% Return
                    </div>
                </CardContent>
            </Card>

            {/* Total Invested */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totalInvested)}</div>
                    <p className="text-xs text-muted-foreground">Net contributions</p>
                </CardContent>
            </Card>
        </div>
    )
}
