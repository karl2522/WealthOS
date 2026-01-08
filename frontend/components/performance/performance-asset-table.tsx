"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { usePortfolio } from "@/contexts/portfolio-context"
import { ArrowUpDown } from "lucide-react"
import { useState } from "react"

type SortField = 'symbol' | 'type' | 'invested' | 'value' | 'gain' | 'returnPct'
type SortOrder = 'asc' | 'desc'

export function PerformanceAssetTable() {
    const { assets, isLoading, portfolio } = usePortfolio()
    const [sortField, setSortField] = useState<SortField>('returnPct')
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: portfolio?.currency || 'USD',
        }).format(val)
    }

    const tableData = assets.map(asset => {
        const qty = asset.quantity || 0
        const avg = asset.avgPrice || 0
        const curr = asset.currentPrice || 0

        const invested = qty * avg
        const value = qty * curr
        const gain = value - invested
        const returnPct = invested > 0 ? (gain / invested) * 100 : 0

        return {
            ...asset,
            invested,
            value,
            gain,
            returnPct
        }
    })

    const sortedData = [...tableData].sort((a, b) => {
        const mul = sortOrder === 'asc' ? 1 : -1
        switch (sortField) {
            case 'symbol': return a.symbol.localeCompare(b.symbol) * mul
            case 'type': return a.type.localeCompare(b.type) * mul
            case 'invested': return (a.invested - b.invested) * mul
            case 'value': return (a.value - b.value) * mul
            case 'gain': return (a.gain - b.gain) * mul
            case 'returnPct': return (a.returnPct - b.returnPct) * mul
            default: return 0
        }
    })

    const toggleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortOrder('desc')
        }
    }

    const SortHead = ({ field, label, right = false }: { field: SortField, label: string, right?: boolean }) => (
        <TableHead className={right ? "text-right" : ""}>
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 data-[state=open]:bg-accent"
                onClick={() => toggleSort(field)}
            >
                {label}
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        </TableHead>
    )

    return (
        <Card>
            <CardHeader>
                <CardTitle>Asset Performance</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <SortHead field="symbol" label="Asset" />
                            <SortHead field="type" label="Type" />
                            <SortHead field="invested" label="Invested" right />
                            <SortHead field="value" label="Current Value" right />
                            <SortHead field="gain" label="Gain / Loss" right />
                            <SortHead field="returnPct" label="Return %" right />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedData.map((asset) => (
                            <TableRow key={asset.id}>
                                <TableCell className="font-medium">
                                    {asset.symbol}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{asset.type}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatCurrency(asset.invested)}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {formatCurrency(asset.value)}
                                </TableCell>
                                <TableCell className={`text-right ${asset.gain >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                                    {asset.gain >= 0 ? "+" : ""}{formatCurrency(asset.gain)}
                                </TableCell>
                                <TableCell className={`text-right font-bold ${asset.returnPct >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                                    {asset.returnPct.toFixed(2)}%
                                </TableCell>
                            </TableRow>
                        ))}
                        {sortedData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No assets found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
