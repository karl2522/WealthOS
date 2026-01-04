"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
    { name: "Stocks", value: 65, color: "oklch(0.55 0.18 250)" }, // Blue
    { name: "Bonds", value: 20, color: "oklch(0.75 0.12 250)" }, // Lighter Blue
    { name: "Crypto", value: 10, color: "oklch(0.45 0.15 250)" }, // Darker Blue
    { name: "Cash", value: 5, color: "oklch(0.85 0.08 250)" }, // Pale Blue
]

export function AssetAllocation() {
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
                            <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                            <div className="size-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <div className="flex flex-col">
                                <span className="text-xs font-medium">{item.name}</span>
                                <span className="text-sm font-bold">{item.value}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
