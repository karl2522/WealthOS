import { Card, CardContent } from "@/components/ui/card"
import { ArrowDownRight, ArrowUpRight, DollarSign, TrendingUp } from "lucide-react"

export function PortfolioSummary() {
    const stats = [
        {
            label: "Total Balance",
            value: "$1,248,590.00",
            change: "+12.4%",
            trend: "up",
            icon: DollarSign,
        },
        {
            label: "Monthly Profit",
            value: "$14,240.45",
            change: "+3.2%",
            trend: "up",
            icon: TrendingUp,
        },
        {
            label: "Annual Yield",
            value: "8.4%",
            change: "-0.5%",
            trend: "down",
            icon: ArrowUpRight,
        },
    ]

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
                            <span className="text-2xl font-bold md:text-3xl tracking-tight leading-none mb-1">{stat.value}</span>
                            <div
                                className={`flex items-center text-sm font-medium ${stat.trend === "up" ? "text-emerald-600" : "text-rose-600"
                                    }`}
                            >
                                {stat.trend === "up" ? (
                                    <ArrowUpRight className="size-4 mr-0.5" />
                                ) : (
                                    <ArrowDownRight className="size-4 mr-0.5" />
                                )}
                                {stat.change}
                                <span className="text-muted-foreground ml-1.5 font-normal">from last month</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
