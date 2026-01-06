"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePortfolio } from "@/contexts/portfolio-context";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const assetSchema = z.object({
    symbol: z.string().min(1, "Symbol is required"),
    type: z.enum(["etf", "stock", "crypto"]),
    quantity: z.number().positive("Quantity must be positive"),
    avgPrice: z.union([z.number().positive(), z.undefined(), z.nan()]).optional().transform(val => isNaN(val as number) ? undefined : val),
});

type AssetFormData = z.infer<typeof assetSchema>;

const SYMBOLS = {
    etf: ["VOO", "SPY", "QQQ", "VTI"],
    stock: ["NVDA", "AAPL", "MSFT", "TSLA", "GOOGL", "AMZN", "META"],
    crypto: ["BTC", "ETH", "SOL"],
};

interface AddAssetDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddAssetDialog({ open, onOpenChange }: AddAssetDialogProps) {
    const { toast } = useToast();
    const { addAsset } = usePortfolio();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [assetType, setAssetType] = useState<"etf" | "stock" | "crypto">("etf");
    const [symbolOpen, setSymbolOpen] = useState(false);
    const [selectedSymbol, setSelectedSymbol] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<AssetFormData>({
        resolver: zodResolver(assetSchema),
        defaultValues: {
            type: "etf",
        },
    });

    const handleTabChange = (value: string) => {
        const type = value as "etf" | "stock" | "crypto";
        setAssetType(type);
        setValue("type", type);
        setSelectedSymbol("");
        setValue("symbol", "");
    };

    const handleSymbolSelect = (symbol: string) => {
        setSelectedSymbol(symbol);
        setValue("symbol", symbol);
        setSymbolOpen(false);
    };

    const onSubmit = async (data: AssetFormData) => {
        setIsSubmitting(true);
        try {
            await addAsset({ ...data, createdVia: "dashboard" });

            toast({
                title: "Asset added!",
                description: `${data.symbol} has been added to your portfolio.`,
            });

            // Reset form and close dialog
            reset();
            setSelectedSymbol("");
            setAssetType("etf");
            onOpenChange(false);
        } catch (error: any) {
            console.error("Failed to add asset:", error);

            // Check if it's a duplicate (upsert case)
            if (error.response?.status === 200 || error.response?.data?.message?.includes("updated")) {
                toast({
                    title: "Asset updated!",
                    description: `${data.symbol} quantity has been updated.`,
                });
                reset();
                setSelectedSymbol("");
                onOpenChange(false);
            } else {
                toast({
                    title: "Error",
                    description: error.response?.data?.message || "Failed to add asset",
                    variant: "destructive",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentSymbols = SYMBOLS[assetType];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Asset</DialogTitle>
                    <DialogDescription>
                        Add a new asset to your portfolio or update an existing one.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    {/* Asset Type Tabs */}
                    <div className="space-y-2">
                        <Label>Asset Type</Label>
                        <Tabs value={assetType} onValueChange={handleTabChange} className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="etf" className="cursor-pointer transition-all">ETF</TabsTrigger>
                                <TabsTrigger value="stock" className="cursor-pointer transition-all">Stock</TabsTrigger>
                                <TabsTrigger value="crypto" className="cursor-pointer transition-all">Crypto</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* Symbol Search */}
                    <div className="space-y-2">
                        <Label>Symbol</Label>
                        <Popover open={symbolOpen} onOpenChange={setSymbolOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={symbolOpen}
                                    className="w-full justify-between"
                                >
                                    {selectedSymbol || "Select symbol..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput placeholder="Search symbol..." />
                                    <CommandEmpty>No symbol found.</CommandEmpty>
                                    <CommandGroup>
                                        {currentSymbols.map((symbol) => (
                                            <CommandItem
                                                key={symbol}
                                                value={symbol}
                                                onSelect={() => handleSymbolSelect(symbol)}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedSymbol === symbol ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {symbol}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {errors.symbol && (
                            <p className="text-sm text-red-600">{errors.symbol.message}</p>
                        )}
                    </div>

                    {/* Quantity */}
                    <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                            id="quantity"
                            type="number"
                            step="any"
                            placeholder="e.g., 10"
                            {...register("quantity", { valueAsNumber: true })}
                        />
                        {errors.quantity && (
                            <p className="text-sm text-red-600">{errors.quantity.message}</p>
                        )}
                    </div>

                    {/* Average Price */}
                    <div className="space-y-2">
                        <Label htmlFor="avgPrice">Average Buy Price (Optional)</Label>
                        <Input
                            id="avgPrice"
                            type="number"
                            step="any"
                            placeholder="e.g., 430.50"
                            {...register("avgPrice", { valueAsNumber: true })}
                        />
                        <p className="text-xs text-gray-500">
                            Leave empty to use current market price
                        </p>
                        {errors.avgPrice && (
                            <p className="text-sm text-red-600">{errors.avgPrice.message}</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" disabled={isSubmitting}>
                            {isSubmitting ? "Adding..." : "Add Asset"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
