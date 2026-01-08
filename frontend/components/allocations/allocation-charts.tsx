"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usePortfolio } from "@/contexts/portfolio-context"
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function AllocationCharts() {
    const { assets, totalValue } = usePortfolio()

    // TYPE ALLOCATION (Donut)
    const typeMap = new Map<string, number>()
    assets.forEach(asset => {
        const val = (asset.quantity || 0) * (asset.currentPrice || 0)
        typeMap.set(asset.type, (typeMap.get(asset.type) || 0) + val)
    })

    const typeData = Array.from(typeMap.entries()).map(([name, value]) => ({
        name,
        value,
        percentage: totalValue > 0 ? (value / totalValue) * 100 : 0
    })).sort((a, b) => b.value - a.value)

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1']

    // ASSET ALLOCATION (Horizontal Bar) - Top 5
    const assetData = [...assets]
        .map(asset => ({
            name: asset.symbol,
            value: (asset.quantity || 0) * (asset.currentPrice || 0),
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)
        .map(item => ({
            ...item,
            percentage: totalValue > 0 ? (item.value / totalValue) * 100 : 0
        }))


    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD', // Assuming USD for now based on context usually, or from portfolio currency
            maximumFractionDigits: 0
        }).format(val)
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                    <CardTitle>Asset Class Allocation</CardTitle>
                    <CardDescription>Distribution by asset type</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={typeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {typeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => [formatCurrency(value), 'Value']}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>Top Assets</CardTitle>
                    <CardDescription>Largest holdings by value</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={assetData}
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            >
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={50}
                                    tick={{ fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    formatter={(value: number) => [formatCurrency(value), 'Value']}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={32}>
                                    {/* Label list could act as percentage if needed, but simple tooltip is usually cleaner for bars */}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
