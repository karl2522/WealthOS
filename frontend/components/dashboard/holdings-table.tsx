"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePortfolio } from "@/contexts/portfolio-context";
import { useToast } from "@/hooks/use-toast";
import { Package, Trash2 } from "lucide-react";
import { useState } from "react";

export function HoldingsTable() {
    const { assets, portfolio, removeAsset, isLoading } = usePortfolio();
    const { toast } = useToast();
    const [deletingAssetId, setDeletingAssetId] = useState<string | null>(null);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: portfolio?.currency || "USD",
        }).format(value);
    };

    const handleDelete = async (assetId: string, symbol: string) => {
        setDeletingAssetId(assetId);
        try {
            await removeAsset(assetId);
            toast({
                title: "Asset removed",
                description: `${symbol} has been removed from your portfolio.`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to remove asset",
                variant: "destructive",
            });
        } finally {
            setDeletingAssetId(null);
        }
    };

    const getAssetTypeBadge = (type: string) => {
        const colors = {
            etf: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
            stock: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
            crypto: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
        };
        return colors[type.toLowerCase() as keyof typeof colors] || colors.stock;
    };

    return (
        <Card className="shadow-md bg-sidebar">
            <CardHeader>
                <CardTitle>Active Holdings</CardTitle>
                <CardDescription>Detailed overview of your current investments</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                {isLoading ? (
                    <div className="p-6 space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton className="h-12 w-12" />
                                <div className="flex-1">
                                    <Skeleton className="h-4 w-24 mb-2" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                                <Skeleton className="h-4 w-20" />
                            </div>
                        ))}
                    </div>
                ) : assets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="rounded-full bg-muted p-4 mb-4">
                            <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No assets yet</h3>
                        <p className="text-sm text-muted-foreground text-center max-w-sm">
                            Add your first asset to start tracking your wealth and see your portfolio grow.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-[100px] pl-6">Symbol</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="hidden md:table-cell">Quantity</TableHead>
                                    <TableHead className="text-right">Avg Price</TableHead>
                                    <TableHead className="text-right">Current Price</TableHead>
                                    <TableHead className="text-right">Total Value</TableHead>
                                    <TableHead className="text-right">P/L</TableHead>
                                    <TableHead className="text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assets.map((asset) => {
                                    const currentPrice = asset.currentPrice ? parseFloat(asset.currentPrice.toString()) : 0;
                                    const avgPrice = asset.avgPrice ? parseFloat(asset.avgPrice.toString()) : 0;
                                    const quantity = parseFloat(asset.quantity.toString());
                                    const totalValue = currentPrice * quantity;
                                    const pl = asset.pl ? parseFloat(asset.pl.toString()) : 0;
                                    const plPercentage = avgPrice > 0 ? ((currentPrice - avgPrice) / avgPrice) * 100 : 0;
                                    const isPositive = pl >= 0;

                                    return (
                                        <TableRow key={asset.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-bold pl-6">{asset.symbol}</TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAssetTypeBadge(asset.type)}`}>
                                                    {asset.type.toUpperCase()}
                                                </span>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-muted-foreground">
                                                {quantity}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {avgPrice > 0 ? formatCurrency(avgPrice) : "—"}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {currentPrice > 0 ? formatCurrency(currentPrice) : "—"}
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatCurrency(totalValue)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {avgPrice > 0 ? (
                                                    <div className="flex flex-col items-end">
                                                        <span className={isPositive ? "text-emerald-600" : "text-rose-600"}>
                                                            {isPositive ? "+" : ""}
                                                            {formatCurrency(pl)}
                                                        </span>
                                                        <Badge
                                                            variant={isPositive ? "secondary" : "destructive"}
                                                            className="font-mono text-xs mt-1"
                                                        >
                                                            {isPositive ? "+" : ""}
                                                            {plPercentage.toFixed(2)}%
                                                        </Badge>
                                                    </div>
                                                ) : (
                                                    "—"
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(asset.id, asset.symbol)}
                                                    disabled={deletingAssetId === asset.id}
                                                >
                                                    <Trash2 className="h-4 w-4 text-rose-600" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

