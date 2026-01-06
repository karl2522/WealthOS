"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
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

// Hardcoded symbols for MVP
const SYMBOLS = {
    etf: ["VOO", "SPY", "QQQ", "VTI"],
    stock: ["NVDA", "AAPL", "MSFT", "TSLA", "GOOGL", "AMZN", "META"],
    crypto: ["BTC", "ETH", "SOL"],
};

export default function Step3Page() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [assetType, setAssetType] = useState<"etf" | "stock" | "crypto">("etf");
    const [open, setOpen] = useState(false);
    const [selectedSymbol, setSelectedSymbol] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
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
        setOpen(false);
    };

    const onSubmit = async (data: AssetFormData) => {
        const portfolioId = localStorage.getItem("onboarding_portfolio_id");

        if (!portfolioId) {
            toast({
                title: "Error",
                description: "Portfolio not found. Please go back to step 1.",
                variant: "destructive",
            });
            router.push("/onboarding/step1");
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/portfolio/${portfolioId}/assets`,
                { ...data, createdVia: "onboarding" },
                { withCredentials: true }
            );

            toast({
                title: "Asset added!",
                description: `${data.symbol} has been added to your portfolio.`,
            });

            // Clear onboarding data
            localStorage.removeItem("onboarding_portfolio_id");

            // Redirect to dashboard
            router.push("/dashboard");
        } catch (error: any) {
            console.error("Failed to add asset:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to add asset",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentSymbols = SYMBOLS[assetType];

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Add Your First Asset
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Let's start tracking your investments
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
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
                    <Label htmlFor="avgPrice">
                        Average Buy Price (Optional)
                    </Label>
                    <Input
                        id="avgPrice"
                        type="number"
                        step="any"
                        placeholder="e.g., 430.50"
                        {...register("avgPrice", { valueAsNumber: true })}
                    />
                    <p className="text-xs text-gray-500">
                        We'll fetch the current price if you leave this empty
                    </p>
                    {errors.avgPrice && (
                        <p className="text-sm text-red-600">{errors.avgPrice.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Adding Asset..." : "Complete Setup"}
                </Button>
            </form>
        </div>
    );
}
