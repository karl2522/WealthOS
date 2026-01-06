"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { CheckCircle2, Coins, PieChart, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart as RechartsChart, ResponsiveContainer } from "recharts";

interface Portfolio {
    id: string;
    name: string;
}

interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    deadline?: string;
}

interface Asset {
    id: string;
    symbol: string;
    type: "etf" | "stock" | "crypto";
    quantity: number;
    avgPrice: number | null;
    currentPrice: number | null;
}

const ASSET_COLORS = {
    etf: "#10b981", // Green
    stock: "#3b82f6", // Blue
    crypto: "#f97316", // Orange
};

const ASSET_ICONS = {
    etf: PieChart,
    stock: TrendingUp,
    crypto: Coins,
};

export default function Step4Page() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [goal, setGoal] = useState<Goal | null>(null);
    const [asset, setAsset] = useState<Asset | null>(null);

    useEffect(() => {
        async function fetchOnboardingData() {
            const portfolioId = localStorage.getItem("onboarding_portfolio_id");

            if (!portfolioId) {
                toast({
                    title: "Error",
                    description: "Portfolio not found. Please start over.",
                    variant: "destructive",
                });
                router.push("/onboarding/step1");
                return;
            }

            try {
                // Fetch portfolio
                const portfolioRes = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/portfolio`,
                    { withCredentials: true }
                );
                const foundPortfolio = portfolioRes.data.find((p: any) => p.id === portfolioId);

                if (!foundPortfolio) {
                    throw new Error("Portfolio not found");
                }

                setPortfolio(foundPortfolio);

                // Fetch assets
                const assetsRes = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/portfolio/${portfolioId}/assets`,
                    { withCredentials: true }
                );

                if (assetsRes.data.length > 0) {
                    setAsset(assetsRes.data[0]);
                }

                // Fetch goals
                const goalsRes = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/portfolio/${portfolioId}/goals`,
                    { withCredentials: true }
                );

                if (goalsRes.data.length > 0) {
                    setGoal(goalsRes.data[0]);
                }
            } catch (error: any) {
                console.error("Failed to fetch onboarding data:", error);
                toast({
                    title: "Error",
                    description: "Failed to load portfolio data",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        }

        fetchOnboardingData();
    }, [router, toast]);

    const handleComplete = () => {
        localStorage.removeItem("onboarding_portfolio_id");
        toast({
            title: "Setup complete!",
            description: "Welcome to WealthOS. Let's start tracking your wealth.",
        });
        router.push("/dashboard");
    };

    const handleGoBack = () => {
        router.push("/onboarding/step3");
    };

    if (isLoading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="text-center space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto"></div>
                </div>
                <div className="space-y-4">
                    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    const totalValue =
        asset && asset.currentPrice
            ? asset.quantity * asset.currentPrice
            : asset && asset.avgPrice
                ? asset.quantity * asset.avgPrice
                : 0;

    const chartData = asset
        ? [
            {
                name: asset.type.toUpperCase(),
                value: 100,
                color: ASSET_COLORS[asset.type],
            },
        ]
        : [];

    const AssetIcon = asset ? ASSET_ICONS[asset.type] : TrendingUp;

    return (
        <div className="space-y-8">
            {/* Success Header */}
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    You're All Set!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Review your portfolio setup before we get started
                </p>
            </div>

            {/* Portfolio Summary Cards */}
            <div className="space-y-4">
                {/* Portfolio Name */}
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Portfolio Name
                    </h3>
                    <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {portfolio?.name}
                    </p>
                </div>

                {/* Goal */}
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Savings Goal
                    </h3>
                    {goal ? (
                        <div className="space-y-1">
                            <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {goal.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Target: ${goal.targetAmount.toLocaleString()}
                                {goal.deadline && ` by ${new Date(goal.deadline).toLocaleDateString()}`}
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">
                            No goal set yet
                        </p>
                    )}
                </div>

                {/* First Asset */}
                {asset && (
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                            Starting Asset
                        </h3>
                        <div className="flex items-start gap-4">
                            <div
                                className="h-12 w-12 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${ASSET_COLORS[asset.type]}20` }}
                            >
                                <AssetIcon
                                    className="h-6 w-6"
                                    style={{ color: ASSET_COLORS[asset.type] }}
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {asset.symbol}
                                    </p>
                                    <span
                                        className="px-2 py-0.5 rounded text-xs font-medium text-white"
                                        style={{ backgroundColor: ASSET_COLORS[asset.type] }}
                                    >
                                        {asset.type.toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {asset.quantity} shares
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Total Value & Chart */}
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                        Starting Portfolio Value
                    </h3>
                    <div className="flex items-center gap-8">
                        <div className="flex-1">
                            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                ${totalValue.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </p>
                            {asset && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    100% {asset.type.toUpperCase()}
                                </p>
                            )}
                        </div>
                        {chartData.length > 0 && (
                            <div className="h-24 w-24">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={28}
                                            outerRadius={40}
                                            paddingAngle={0}
                                            dataKey="value"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </RechartsChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleGoBack}
                >
                    Go Back
                </Button>
                <Button type="button" className="flex-1" size="lg" onClick={handleComplete}>
                    Complete Setup
                </Button>
            </div>
        </div>
    );
}
