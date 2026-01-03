"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip } from "recharts"

export function HeroChart() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const data = [
        { name: "Jan", value: 4000 },
        { name: "Feb", value: 6500 },
        { name: "Mar", value: 5500 },
        { name: "Apr", value: 8500 },
        { name: "May", value: 10000 },
    ]

    // Custom Bar component/shape could be used for more intricate rounding,
    // but standard radius prop works well for this look.

    if (!mounted) return <div className="h-48 w-full bg-slate-50/50 rounded-xl" />

    return (
        <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <Tooltip
                        cursor={{ fill: '#f1f5f9', radius: 4 }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar
                        dataKey="value"
                        fill="#2563eb" // blue-600
                        radius={[8, 8, 8, 8]}
                        barSize={60}
                        className="hover:fill-blue-500 transition-all duration-300"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
