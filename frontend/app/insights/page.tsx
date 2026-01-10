"use client"

import { MobileNav } from "@/components/dashboard/mobile-nav"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ActionSuggestions, BehavioralInsights, KeyAlerts, PerformanceAttribution, PortfolioHealthSummary } from "@/components/insights"
import { ProtectedRoute } from "@/components/protected-route"
import { Badge } from "@/components/ui/badge"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { PortfolioProvider, usePortfolio } from "@/contexts/portfolio-context"
import { usePerformance } from "@/hooks/use-performance"
import { generateInsights } from "@/lib/insights-logic"
import { useMemo } from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function InsightsContent() {
    const { assets, isLoading: assetsLoading } = usePortfolio()
    // We need 1M (or broader) history for volatility drift
    const { history, isLoading: historyLoading } = usePerformance()

    const insights = useMemo(() => {
        if (assetsLoading || historyLoading) return null;
        return generateInsights(assets, history);
    }, [assets, history, assetsLoading, historyLoading]);

    if (assetsLoading || historyLoading) {
        return (
            <SidebarInset className="bg-blue-50/50 dark:bg-background pb-16 md:pb-0">
                <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-sidebar px-4 backdrop-blur md:px-6">
                    <SidebarTrigger className="md:hidden" />
                    <div className="flex flex-1 items-center justify-between">
                        <div>
                            <Skeleton className="h-7 w-32 mb-1" />
                            <Skeleton className="h-4 w-48 hidden sm:block" />
                        </div>
                    </div>
                </header>

                <main className="flex flex-col gap-6 p-4 md:p-8 w-full">
                    {/* Alerts Skeleton */}
                    <div className="space-y-4">
                        <Skeleton className="h-7 w-24" />
                        <div className="space-y-3">
                            <Skeleton className="h-20 w-full rounded-lg" />
                        </div>
                    </div>

                    {/* Health Skeleton */}
                    <div className="space-y-4">
                        <Skeleton className="h-7 w-32" />
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <Card key={i}>
                                    <CardHeader className="p-4 pb-2">
                                        <Skeleton className="h-3 w-24" />
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <Skeleton className="h-8 w-16 mb-1" />
                                        <Skeleton className="h-3 w-20" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Performance Skeleton */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-7 w-48" />
                            <Skeleton className="h-5 w-16" />
                        </div>
                        <Card className="p-4">
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Skeleton key={i} className="h-10 w-full" />
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Behavioral & Suggestions Skeleton */}
                    <div className="space-y-4">
                        <Skeleton className="h-7 w-48" />
                        <div className="grid gap-4 md:grid-cols-2">
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                    </div>
                </main>
                <MobileNav />
            </SidebarInset>
        )
    }

    if (!insights) return null;

    return (
        <SidebarInset className="bg-blue-50/50 dark:bg-background pb-16 md:pb-0">
            <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-sidebar px-4 backdrop-blur md:px-6">
                <SidebarTrigger className="md:hidden" />
                <div className="flex flex-1 items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold md:text-xl">Insights</h1>
                            <Badge variant="outline" className="text-[10px] h-5">Rule-based Analysis</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground hidden sm:block">Smart analysis of your portfolio</p>
                    </div>
                </div>
            </header>

            <main className="flex flex-col gap-6 p-4 md:p-8 w-full">

                {/* 1. Alerts (High Priority) */}
                <KeyAlerts alerts={insights.alerts} />

                {/* 2. Health Summary */}
                <PortfolioHealthSummary health={insights.health} />

                {/* 3. Performance Drivers */}
                <PerformanceAttribution items={insights.attribution} />

                {/* 4. Behavioral */}
                <BehavioralInsights behaviors={insights.behavior} />

                {/* 5. Suggestions */}
                <ActionSuggestions />

            </main>

            <MobileNav />
        </SidebarInset>
    )
}

export default function InsightsPage() {
    return (
        <ProtectedRoute>
            <PortfolioProvider>
                <SidebarProvider>
                    <DashboardSidebar />
                    <InsightsContent />
                </SidebarProvider>
            </PortfolioProvider>
        </ProtectedRoute>
    )
}
