"use client";

import axios from "axios";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth-provider";

interface PortfolioAsset {
    id: string;
    symbol: string;
    type: string;
    quantity: number;
    avgPrice: number | null;
    currentPrice: number | null;
    lastPriceUpdate: Date | null;
    pl: number | null;
    createdAt: Date;
}

interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    monthlyContribution: number | null;
    createdAt: Date;
}

interface Portfolio {
    id: string;
    name: string;
    currency: string;
    riskProfile: string | null;
    isPrimary: boolean;
    assets: PortfolioAsset[];
    goals: Goal[];
    totalValue: number;
    totalPL: number;
    createdAt: Date;
}

interface PortfolioContextType {
    portfolio: Portfolio | null;
    assets: PortfolioAsset[];
    goals: Goal[];
    totalValue: number;
    totalPL: number;
    isLoading: boolean;
    refreshPortfolio: () => Promise<void>;
    addAsset: (asset: any) => Promise<void>;
    removeAsset: (assetId: string) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPortfolio = async () => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/portfolio`,
                { withCredentials: true }
            );

            if (response.data.length > 0) {
                // Get the primary portfolio (or first one)
                const primaryPortfolio = response.data.find((p: Portfolio) => p.isPrimary) || response.data[0];
                setPortfolio(primaryPortfolio);
            }
        } catch (error) {
            console.error("Failed to fetch portfolio:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPortfolio();
    }, [user]);

    const refreshPortfolio = async () => {
        await fetchPortfolio();
    };

    const addAsset = async (assetData: any) => {
        if (!portfolio) return;

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/portfolio/${portfolio.id}/assets`,
                assetData,
                { withCredentials: true }
            );

            await refreshPortfolio();
        } catch (error) {
            console.error("Failed to add asset:", error);
            throw error;
        }
    };

    const removeAsset = async (assetId: string) => {
        if (!portfolio) return;

        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/portfolio/${portfolio.id}/assets/${assetId}`,
                { withCredentials: true }
            );

            await refreshPortfolio();
        } catch (error) {
            console.error("Failed to remove asset:", error);
            throw error;
        }
    };

    const value: PortfolioContextType = {
        portfolio,
        assets: portfolio?.assets || [],
        goals: portfolio?.goals || [],
        totalValue: portfolio?.totalValue || 0,
        totalPL: portfolio?.totalPL || 0,
        isLoading,
        refreshPortfolio,
        addAsset,
        removeAsset,
    };

    return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
    const context = useContext(PortfolioContext);
    if (context === undefined) {
        throw new Error("usePortfolio must be used within a PortfolioProvider");
    }
    return context;
}
