"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePortfolio } from "@/contexts/portfolio-context";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpDown, Package, Pencil, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { EditAssetDialog } from "./edit-asset-dialog";

type SortKey = "value" | "pl" | "quantity" | "symbol";
type SortDirection = "asc" | "desc";

export function HoldingsTable() {
    const { assets, portfolio, removeAsset, isLoading } = usePortfolio();
    const { toast } = useToast();
    const [deletingAssetId, setDeletingAssetId] = useState<string | null>(null);

    // Search, Filter, Sort State
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<"all" | "etf" | "stock" | "crypto">("all");
    const [sortKey, setSortKey] = useState<SortKey>("value");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

    // Edit State
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState<any | null>(null);

    // Delete State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [assetToDelete, setAssetToDelete] = useState<{ id: string; symbol: string } | null>(null);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: portfolio?.currency || "USD",
        }).format(value);
    };

    const handleDeleteClick = (asset: { id: string; symbol: string }) => {
        setAssetToDelete(asset);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!assetToDelete) return;

        setDeletingAssetId(assetToDelete.id);
        try {
            await removeAsset(assetToDelete.id);
            toast({
                title: "Asset removed",
                description: `${assetToDelete.symbol} has been removed from your portfolio.`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to remove asset",
                variant: "destructive",
            });
        } finally {
            setDeletingAssetId(null);
            setDeleteDialogOpen(false);
            setAssetToDelete(null);
        }
    };

    const handleEdit = (asset: any) => {
        setEditingAsset(asset);
        setEditDialogOpen(true);
    };

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDirection("desc"); // Default to desc for new metrics usually
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

    // Filter and Sort Logic
    const filteredAndSortedAssets = useMemo(() => {
        let result = [...assets];

        // Filter by Type
        if (filterType !== "all") {
            result = result.filter(a => a.type === filterType);
        }

        // Filter by Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(a => a.symbol.toLowerCase().includes(query));
        }

        // Sort
        result.sort((a, b) => {
            let valA: number | string = 0;
            let valB: number | string = 0;

            const currentPriceA = a.currentPrice ? parseFloat(a.currentPrice.toString()) : 0;
            const quantityA = parseFloat(a.quantity.toString());
            const valueA = currentPriceA * quantityA;
            const plA = a.pl ? parseFloat(a.pl.toString()) : 0;

            const currentPriceB = b.currentPrice ? parseFloat(b.currentPrice.toString()) : 0;
            const quantityB = parseFloat(b.quantity.toString());
            const valueB = currentPriceB * quantityB;
            const plB = b.pl ? parseFloat(b.pl.toString()) : 0;

            switch (sortKey) {
                case "value":
                    valA = valueA;
                    valB = valueB;
                    break;
                case "quantity":
                    valA = quantityA;
                    valB = quantityB;
                    break;
                case "pl":
                    valA = plA;
                    valB = plB;
                    break;
                case "symbol":
                    valA = a.symbol;
                    valB = b.symbol;
                    break;
            }

            if (valA < valB) return sortDirection === "asc" ? -1 : 1;
            if (valA > valB) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });

        return result;
    }, [assets, filterType, searchQuery, sortKey, sortDirection]);

    const SortIcon = ({ active }: { active: boolean }) => (
        <ArrowUpDown className={`ml-2 h-3 w-3 ${active ? "opacity-100" : "opacity-30"}`} />
    );

    return (
        <div className="space-y-4">
            <Card className="shadow-md bg-sidebar">
                <CardHeader className="md:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Active Holdings</CardTitle>
                            <CardDescription>Detailed overview of your current investments</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search assets..."
                                    className="pl-8 w-[150px] md:w-[200px]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={filterType} onValueChange={(v: any) => setFilterType(v)}>
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue placeholder="All Assets" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Assets</SelectItem>
                                    <SelectItem value="etf">ETFs</SelectItem>
                                    <SelectItem value="stock">Stocks</SelectItem>
                                    <SelectItem value="crypto">Crypto</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
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
                    ) : filteredAndSortedAssets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="rounded-full bg-muted p-4 mb-4">
                                <Package className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No assets found</h3>
                            <p className="text-sm text-muted-foreground text-center max-w-sm">
                                {assets.length === 0 ? "Add your first asset to start tracking." : "Try adjusting your filters or search query."}
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop View */}
                            <div className="hidden md:block overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead className="w-[180px] pl-8 cursor-pointer hover:text-foreground" onClick={() => handleSort("symbol")}>
                                                <div className="flex items-center">Asset <SortIcon active={sortKey === "symbol"} /></div>
                                            </TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead className="text-right cursor-pointer hover:text-foreground" onClick={() => handleSort("quantity")}>
                                                <div className="flex items-center justify-end">Quantity <SortIcon active={sortKey === "quantity"} /></div>
                                            </TableHead>
                                            <TableHead className="text-right">Avg Buy</TableHead>
                                            <TableHead className="text-right">Price</TableHead>
                                            <TableHead className="text-right cursor-pointer hover:text-foreground" onClick={() => handleSort("value")}>
                                                <div className="flex items-center justify-end">Value <SortIcon active={sortKey === "value"} /></div>
                                            </TableHead>
                                            <TableHead className="text-right cursor-pointer hover:text-foreground" onClick={() => handleSort("pl")}>
                                                <div className="flex items-center justify-end">Gain / Loss <SortIcon active={sortKey === "pl"} /></div>
                                            </TableHead>
                                            <TableHead className="text-right pr-8">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredAndSortedAssets.map((asset) => {
                                            const currentPrice = asset.currentPrice ? parseFloat(asset.currentPrice.toString()) : 0;
                                            const avgPrice = asset.avgPrice ? parseFloat(asset.avgPrice.toString()) : 0;
                                            const quantity = parseFloat(asset.quantity.toString());
                                            const totalValue = currentPrice * quantity;
                                            const pl = asset.pl ? parseFloat(asset.pl.toString()) : 0;
                                            const plPercentage = avgPrice > 0 ? ((currentPrice - avgPrice) / avgPrice) * 100 : 0;
                                            const isPositive = pl >= 0;

                                            return (
                                                <TableRow key={asset.id} className="hover:bg-muted/30 transition-colors">
                                                    <TableCell className="pl-8">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold">{asset.symbol}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAssetTypeBadge(asset.type)}`}>
                                                            {asset.type.toUpperCase()}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono text-muted-foreground">
                                                        {quantity}
                                                    </TableCell>
                                                    <TableCell className="text-right text-muted-foreground">
                                                        {avgPrice > 0 ? formatCurrency(avgPrice) : "—"}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {currentPrice > 0 ? formatCurrency(currentPrice) : "—"}
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold">
                                                        {formatCurrency(totalValue)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {avgPrice > 0 ? (
                                                            <div className="flex flex-col items-end">
                                                                <span className={isPositive ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>
                                                                    {isPositive ? "+" : ""}
                                                                    {formatCurrency(pl)}
                                                                </span>
                                                                <span className={`text-xs ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
                                                                    ({isPositive ? "+" : ""}
                                                                    {plPercentage.toFixed(2)}%)
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground">—</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right pr-8">
                                                        <div className="flex justify-end gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                                onClick={() => handleEdit(asset)}
                                                            >
                                                                <Pencil className="h-3.5 w-3.5" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                                                                onClick={() => handleDeleteClick(asset)}
                                                                disabled={deletingAssetId === asset.id}
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden divide-y">
                                {filteredAndSortedAssets.map((asset) => {
                                    const currentPrice = asset.currentPrice ? parseFloat(asset.currentPrice.toString()) : 0;
                                    const avgPrice = asset.avgPrice ? parseFloat(asset.avgPrice.toString()) : 0;
                                    const quantity = parseFloat(asset.quantity.toString());
                                    const totalValue = currentPrice * quantity;
                                    const pl = asset.pl ? parseFloat(asset.pl.toString()) : 0;
                                    const plPercentage = avgPrice > 0 ? ((currentPrice - avgPrice) / avgPrice) * 100 : 0;
                                    const isPositive = pl >= 0;

                                    return (
                                        <div key={asset.id} className="p-4 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div className="flex gap-3">
                                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getAssetTypeBadge(asset.type)} bg-opacity-20`}>
                                                        <span className="text-xs font-bold">{asset.symbol.substring(0, 2)}</span>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">{asset.symbol}</div>
                                                        <div className="text-xs text-muted-foreground">{asset.type.toUpperCase()}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`font-medium ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
                                                        {isPositive ? "+" : ""}{plPercentage.toFixed(2)}%
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">{formatCurrency(totalValue)}</div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="flex flex-col">
                                                    <span className="text-muted-foreground text-xs">Quantity</span>
                                                    <span className="font-mono">{quantity}</span>
                                                </div>
                                                <div className="flex flex-col text-right">
                                                    <span className="text-muted-foreground text-xs">Current Price</span>
                                                    <span>{formatCurrency(currentPrice)}</span>
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-2 pt-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={() => handleEdit(asset)}
                                                >
                                                    <Pencil className="h-3.5 w-3.5 mr-2" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-900/20"
                                                    onClick={() => handleDeleteClick(asset)}
                                                    disabled={deletingAssetId === asset.id}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <EditAssetDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} asset={editingAsset} />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently remove <span className="font-bold text-foreground">{assetToDelete?.symbol}</span> from your portfolio.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-rose-600 hover:bg-rose-700">
                            Delete Asset
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
