import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { usePortfolio } from "@/contexts/portfolio-context"
import { AlertTriangle, CheckCircle, PieChart } from "lucide-react"

export function AllocationSummaryCards() {
    const { assets, totalValue, isLoading } = usePortfolio()

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
                            <Skeleton className="h-8 w-16 mb-1" />
                            <Skeleton className="h-3 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    // Largest Allocation Logic
    const sortedAssets = [...assets].sort((a, b) => {
        const valA = (a.quantity || 0) * (a.currentPrice || 0)
        const valB = (b.quantity || 0) * (b.currentPrice || 0)
        return valB - valA
    })

    const largestAsset = sortedAssets[0]
    const largestValue = largestAsset ? (largestAsset.quantity || 0) * (largestAsset.currentPrice || 0) : 0
    const largestPercentage = totalValue > 0 ? (largestValue / totalValue) * 100 : 0

    // Diversification Logic
    const assetCount = assets.length
    let diversificationScore = "Low"
    let diversificationColor = "text-red-500"

    if (assetCount >= 5) {
        diversificationScore = "High"
        diversificationColor = "text-green-500"
    } else if (assetCount >= 2) {
        diversificationScore = "Moderate"
        diversificationColor = "text-yellow-500"
    }

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {/* Coverage Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Allocation Coverage</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">100%</div>
                    <p className="text-xs text-muted-foreground">Based on current market value</p>
                </CardContent>
            </Card>

            {/* Largest Exposure Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Largest Exposure</CardTitle>
                    {largestPercentage > 50 ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    ) : (
                        <PieChart className="h-4 w-4 text-muted-foreground" />
                    )}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {largestAsset ? largestAsset.symbol : "—"}
                        {largestAsset && <span className="text-lg font-normal text-muted-foreground ml-2">{largestPercentage.toFixed(0)}%</span>}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {largestPercentage > 50 ? "High concentration risk" : "Single-asset concentration"}
                    </p>
                </CardContent>
            </Card>

            {/* Diversification Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Diversification</CardTitle>
                    <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${diversificationColor}`}>
                        {diversificationScore}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {assetCount} unique {assetCount === 1 ? 'asset' : 'assets'}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
