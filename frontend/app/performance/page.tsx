"use client"

import { MobileNav } from "@/components/dashboard/mobile-nav"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { PerformanceAssetTable } from "@/components/performance/performance-asset-table"
import { PerformanceChart } from "@/components/performance/performance-chart"
import { PerformanceSummaryCards } from "@/components/performance/performance-summary-cards"
import { ProtectedRoute } from "@/components/protected-route"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { PortfolioProvider } from "@/contexts/portfolio-context"
import { usePerformance } from "@/hooks/use-performance"

function PerformanceContent() {
    const { history, range, setRange, isLoading } = usePerformance()

    return (
        <SidebarInset className="bg-blue-50/50 dark:bg-background pb-16 md:pb-0">
            <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-sidebar px-4 backdrop-blur md:px-6">
                <SidebarTrigger className="md:hidden" />
                <div className="flex flex-1 items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold md:text-xl">Performance</h1>
                        <p className="text-xs text-muted-foreground hidden sm:block">Track your portfolio growth and returns</p>
                    </div>
                </div>
            </header>

            <main className="flex flex-col gap-6 p-4 md:p-8">
                <PerformanceSummaryCards />

                <PerformanceChart
                    history={history}
                    range={range}
                    onRangeChange={setRange}
                    isLoading={isLoading}
                />

                <div className="grid gap-6 md:grid-cols-1">
                    <PerformanceAssetTable />
                </div>
            </main>

            <MobileNav />
        </SidebarInset>
    )
}

export default function PerformancePage() {
    return (
        <ProtectedRoute>
            <PortfolioProvider>
                <SidebarProvider>
                    <DashboardSidebar />
                    <PerformanceContent />
                </SidebarProvider>
            </PortfolioProvider>
        </ProtectedRoute>
    )
}
