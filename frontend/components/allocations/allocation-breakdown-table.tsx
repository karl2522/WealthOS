import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { usePortfolio } from "@/contexts/portfolio-context"

export function AllocationBreakdownTable() {
    const { assets, totalValue, isLoading } = usePortfolio()

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Header Skeleton */}
                        <div className="flex justify-between pb-4 border-b">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton key={i} className="h-4 w-16" />
                            ))}
                        </div>
                        {/* Row Skeletons */}
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between py-2">
                                <div className="flex flex-col gap-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-3 w-3 rounded-full" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Calculate data
    const tableData = assets.map(asset => {
        const value = (asset.quantity || 0) * (asset.currentPrice || 0)
        const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0

        let riskColor = "bg-green-500"
        if (percentage > 50) riskColor = "bg-red-500"
        else if (percentage > 30) riskColor = "bg-yellow-500"

        return {
            ...asset,
            value,
            percentage,
            riskColor
        }
    }).sort((a, b) => b.value - a.value)

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 2
        }).format(val)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Detailed Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Asset</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Allocation</TableHead>
                            <TableHead className="text-right">Value</TableHead>
                            <TableHead className="text-center w-[100px]">Risk</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tableData.map((asset) => (
                            <TableRow key={asset.id}>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span>{asset.symbol}</span>
                                        <span className="text-xs text-muted-foreground hidden sm:inline">
                                            {asset.quantity} shares
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{asset.type}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {asset.percentage.toFixed(1)}%
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                    {formatCurrency(asset.value)}
                                </TableCell>
                                <TableCell className="flex justify-center">
                                    <div className={`h-3 w-3 rounded-full ${asset.riskColor}`} title="Concentration RIsk" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
