import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePortfolio } from "@/contexts/portfolio-context"
import { Lightbulb } from "lucide-react"

export function AllocationInsightsPanel() {
    const { assets, totalValue } = usePortfolio()

    const insights: string[] = []

    if (assets.length === 0) return null

    // Concentration Logic
    const sortedAssets = [...assets].sort((a, b) => {
        const valA = (a.quantity || 0) * (a.currentPrice || 0)
        const valB = (b.quantity || 0) * (b.currentPrice || 0)
        return valB - valA
    })

    if (sortedAssets.length > 0) {
        const largest = sortedAssets[0]
        const largestVal = (largest.quantity || 0) * (largest.currentPrice || 0)
        const pct = totalValue > 0 ? (largestVal / totalValue) * 100 : 0

        if (pct > 50) {
            insights.push(`Your portfolio is heavily concentrated in ${largest.symbol} (${pct.toFixed(0)}%). Consider diversifying to reduce single-asset risk.`)
        }
    }

    // Asset Class Logic
    const types = new Set(assets.map(a => a.type))
    const stocksOnly = types.size === 1 && types.has('Stock')
    const noEtfs = !types.has('ETF')

    if (stocksOnly) {
        insights.push("Stocks make up 100% of your portfolio. This may lead to higher volatility.")
    }

    if (noEtfs && assets.length > 0) {
        insights.push("Consider adding ETFs to broaden your market exposure with lower effort.")
    }

    if (insights.length === 0) {
        insights.push("Your portfolio looks balanced. Keep monitoring your allocations periodically.")
    }

    return (
        <Card className="bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-base text-blue-900 dark:text-blue-100">Portfolio Insights</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm text-blue-800 dark:text-blue-200">
                    {insights.map((insight, i) => (
                        <li key={i}>{insight}</li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
