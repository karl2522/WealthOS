import { usePortfolio } from "@/contexts/portfolio-context";
import axios from "axios";
import { useEffect, useState } from "react";

export interface PortfolioSnapshot {
    id: string;
    date: string;
    totalValue: number;
    totalInvested: number;
    totalPL: number;
    returnPct: number;
    currency: string;
}

export function usePerformance() {
    const { portfolio } = usePortfolio();
    const [history, setHistory] = useState<PortfolioSnapshot[]>([]);
    const [range, setRange] = useState("1M");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!portfolio?.id) {
            setIsLoading(false);
            return;
        }

        const fetchHistory = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/portfolio/${portfolio.id}/history?range=${range}`,
                    { withCredentials: true }
                );

                // Ensure data is numeric (Prisma Decimals usually come as strings)
                const formattedData = res.data.map((item: any) => ({
                    ...item,
                    totalValue: Number(item.totalValue),
                    totalInvested: Number(item.totalInvested),
                    totalPL: Number(item.totalPL),
                    returnPct: Number(item.returnPct)
                }));

                setHistory(formattedData);
            } catch (err) {
                console.error("Failed to fetch performance history:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [portfolio?.id, range]);

    return { history, range, setRange, isLoading };
}
