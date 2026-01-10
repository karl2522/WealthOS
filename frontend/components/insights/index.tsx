"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertInsight, AttributionItem, BehavioralInsight, PortfolioHealth } from "@/lib/insights-logic"
import { AlertTriangle, Info, Lightbulb } from "lucide-react"

export function KeyAlerts({ alerts }: { alerts: AlertInsight[] }) {
    if (alerts.length === 0) return null;

    const severityStyles = {
        critical: "border-l-4 border-l-rose-500 bg-rose-50/50 dark:bg-rose-950/20",
        warning: "border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20",
        info: "border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20",
    }
    const icons = {
        critical: <AlertTriangle className="h-4 w-4 text-rose-600" />,
        warning: <AlertTriangle className="h-4 w-4 text-amber-600" />,
        info: <Info className="h-4 w-4 text-blue-600" />
    }

    return (
        <section className="space-y-4">
            <h2 className="text-lg font-semibold">Alerts</h2>
            <div className="space-y-3">
                {alerts.map((alert, i) => (
                    <Alert key={i} className={severityStyles[alert.severity]}>
                        <div className="flex items-center gap-3">
                            {icons[alert.severity]}
                            <div className="flex-1">
                                <AlertTitle className="mb-1 font-medium">{alert.title}</AlertTitle>
                                <AlertDescription className="text-muted-foreground">{alert.message}</AlertDescription>
                            </div>
                        </div>
                    </Alert>
                ))}
            </div>
        </section>
    )
}

export function PortfolioHealthSummary({ health }: { health: PortfolioHealth }) {

    const MetricCard = ({ title, value, sub, color }: any) => (
        <Card>
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className={`text-2xl font-bold ${color}`}>{value}</div>
                <div className="text-xs text-muted-foreground mt-1">{sub}</div>
            </CardContent>
        </Card>
    )

    return (
        <section className="space-y-4">
            <h2 className="text-lg font-semibold">Portfolio Health</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Concentration"
                    value={health.concentrationRisk}
                    sub="Risk Level"
                    color={health.concentrationRisk === "High" ? "text-rose-600" : health.concentrationRisk === "Moderate" ? "text-amber-600" : "text-emerald-600"}
                />
                <MetricCard
                    title="Diversification"
                    value={`${health.diversificationScore}/10`}
                    sub="Score"
                    color={health.diversificationScore >= 8 ? "text-emerald-600" : health.diversificationScore >= 5 ? "text-amber-600" : "text-rose-600"}
                />
                <MetricCard
                    title="Volatility"
                    value={health.volatility}
                    sub="Recent 30d"
                    color={health.volatility === "High" ? "text-rose-600" : "text-blue-600"}
                />
                <MetricCard
                    title="Stability"
                    value={health.stability}
                    sub="Consistency"
                    color={health.stability === "Stable" ? "text-emerald-600" : "text-amber-600"}
                />
            </div>
        </section>
    )
}

export function PerformanceAttribution({ items }: { items: AttributionItem[] }) {
    // Show top 5 sorted by absolute impact
    const topItems = items.slice(0, 5);

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Performance Drivers</h2>
                <Badge variant="outline">Top 5</Badge>
            </div>

            <Card className="p-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Asset</TableHead>
                            <TableHead className="text-right">Contribution</TableHead>
                            <TableHead className="text-right">Total Gain/Loss</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {topItems.map((item) => (
                            <TableRow key={item.symbol}>
                                <TableCell className="font-medium">{item.symbol}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={item.contributionPct > 0 ? "default" : "secondary"}>
                                        {item.contributionPct > 0 ? "+" : ""}{item.contributionPct.toFixed(1)}%
                                    </Badge>
                                </TableCell>
                                <TableCell className={`text-right font-medium ${item.gain >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                                    {item.gain >= 0 ? "+" : "-"}${Math.abs(item.gain).toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}
                        {topItems.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-20 text-muted-foreground">
                                    Not enough data to calculate attribution.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </section>
    )
}

export function BehavioralInsights({ behaviors }: { behaviors: BehavioralInsight[] }) {
    if (behaviors.length === 0) return null;

    return (
        <section className="space-y-4">
            <h2 className="text-lg font-semibold">Behavioral Observations</h2>
            <div className="grid gap-4 md:grid-cols-2">
                {behaviors.map((b, i) => (
                    <Card key={i} className="bg-slate-50 dark:bg-slate-900 border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center gap-3 p-4">
                            <Lightbulb className="h-5 w-5 text-indigo-500" />
                            <CardDescription className="text-foreground font-medium">
                                {b.message}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </section>
    )
}

export function ActionSuggestions() {
    const suggestions = [
        { title: "Rebalance Portfolio", desc: "Align assets with your target goals." },
        { title: "Tax-Loss Harvesting", desc: "Offset gains by realizing losses." },
        { title: "Increase Diversification", desc: "Add new asset classes to reduce risk." }
    ]

    return (
        <section className="space-y-4">
            <h2 className="text-lg font-semibold">Suggested Actions</h2>
            <div className="grid gap-4 md:grid-cols-3">
                {suggestions.map((s, i) => (
                    <Card key={i} className="bg-muted/40">
                        <CardHeader className="p-4">
                            <CardTitle className="text-sm font-medium">{s.title}</CardTitle>
                            <CardDescription className="text-xs mt-1">{s.desc}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="w-full">
                                        <Button disabled className="w-full h-8 text-xs" variant="secondary">
                                            Start Action
                                        </Button>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>Planned feature</TooltipContent>
                            </Tooltip>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}
