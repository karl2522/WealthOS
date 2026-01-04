import { AssetAllocation } from "@/components/dashboard/asset-allocation"
import { HoldingsTable } from "@/components/dashboard/holdings-table"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { PerformanceChart } from "@/components/dashboard/performance-chart"
import { PortfolioSummary } from "@/components/dashboard/portfolio-summary"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function DashboardPage() {
    return (
        <SidebarProvider>
            <DashboardSidebar />
            <SidebarInset className="bg-blue-50/50 dark:bg-background pb-16 md:pb-0">
                <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-sidebar px-4 backdrop-blur md:px-6">
                    <SidebarTrigger className="md:hidden" />
                    <div className="flex flex-1 items-center justify-between">
                        <h1 className="text-lg font-bold md:text-xl">Dashboard</h1>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground hidden md:inline-block">Last sync: 2 mins ago</span>
                        </div>
                    </div>
                </header>

                <main className="flex flex-col gap-6 p-4 md:gap-8 md:p-8">
                    {/* Top Summary Cards */}
                    <PortfolioSummary />

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Performance Chart - Spans 2 cols on large screens */}
                        <div className="lg:col-span-2">
                            <PerformanceChart />
                        </div>

                        {/* Asset Allocation */}
                        <AssetAllocation />
                    </div>

                    {/* Holdings Table */}
                    <HoldingsTable />
                </main>

                {/* Mobile-only bottom navigation */}
                <MobileNav />
            </SidebarInset>
        </SidebarProvider>
    )
}
