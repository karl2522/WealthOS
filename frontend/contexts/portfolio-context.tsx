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
    portfolios: Portfolio[]; // All available portfolios
    assets: PortfolioAsset[];
    goals: Goal[];
    totalValue: number;
    totalPL: number;
    isLoading: boolean;
    refreshPortfolio: () => Promise<void>;
    selectPortfolio: (portfolioId: string) => void;
    updatePortfolio: (id: string, data: Partial<Portfolio>) => Promise<void>;
    deletePortfolio: (id: string) => Promise<void>;
    addAsset: (asset: any) => Promise<void>;
    removeAsset: (assetId: string) => Promise<void>;
    updateAsset: (assetId: string, data: any) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
    const { user, loading: authLoading } = useAuth();
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPortfolios = async () => {
        if (authLoading) return;

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
                const fetchedPortfolios = response.data;
                setPortfolios(fetchedPortfolios);

                // Check localStorage for saved selection
                const savedId = localStorage.getItem(`selectedPortfolio_${user.id}`);
                const found = savedId ? fetchedPortfolios.find((p: Portfolio) => p.id === savedId) : null;

                // Fallback to primary or first
                const active = found || fetchedPortfolios.find((p: Portfolio) => p.isPrimary) || fetchedPortfolios[0];

                setPortfolio(active);
                // Ensure storage is synced if we fell back
                if (active.id !== savedId) {
                    localStorage.setItem(`selectedPortfolio_${user.id}`, active.id);
                }
            }
        } catch (error) {
            console.error("Failed to fetch portfolios:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPortfolios();
    }, [user, authLoading]);

    const selectPortfolio = (portfolioId: string) => {
        const found = portfolios.find(p => p.id === portfolioId);
        if (found && user) {
            setPortfolio(found);
            localStorage.setItem(`selectedPortfolio_${user.id}`, found.id);
        }
    };

    const refreshPortfolio = async () => {
        // Just re-fetch everything to be safe and keep selection logic consistent
        await fetchPortfolios();
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

    const updateAsset = async (assetId: string, data: any) => {
        if (!portfolio) return;

        try {
            await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/portfolio/${portfolio.id}/assets/${assetId}`,
                data,
                { withCredentials: true }
            );

            await refreshPortfolio();
        } catch (error) {
            console.error("Failed to update asset:", error);
            throw error;
        }
    };

    const updatePortfolio = async (id: string, data: Partial<Portfolio>) => {
        try {
            const response = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/portfolio/${id}`,
                data,
                { withCredentials: true }
            );

            const updated = response.data;

            // Update in list
            setPortfolios(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));

            // Update active if it matches
            if (portfolio?.id === id) {
                setPortfolio(prev => prev ? { ...prev, ...updated } : null);
            }
        } catch (error) {
            console.error("Failed to update portfolio:", error);
            throw error;
        }
    };

    const deletePortfolio = async (id: string) => {
        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/portfolio/${id}`,
                { withCredentials: true }
            );

            // Remove from list
            const remaining = portfolios.filter(p => p.id !== id);
            setPortfolios(remaining);

            // If we deleted the active one, switch to another
            if (portfolio?.id === id) {
                const next = remaining[0] || null;
                setPortfolio(next);
                if (next && user?.id) {
                    localStorage.setItem(`selectedPortfolio_${user.id}`, next.id);
                } else if (user?.id) {
                    localStorage.removeItem(`selectedPortfolio_${user.id}`);
                }
            }
        } catch (error) {
            console.error("Failed to delete portfolio:", error);
            throw error;
        }
    };

    const value: PortfolioContextType = {
        portfolio,
        portfolios,
        assets: portfolio?.assets || [],
        goals: portfolio?.goals || [],
        totalValue: portfolio?.totalValue || 0,
        totalPL: portfolio?.totalPL || 0,
        isLoading,
        refreshPortfolio,
        selectPortfolio,
        updatePortfolio,
        deletePortfolio,
        addAsset,
        removeAsset,
        updateAsset,
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
