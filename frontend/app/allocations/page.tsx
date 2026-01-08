'use client';

import { AllocationBreakdownTable } from "@/components/allocations/allocation-breakdown-table";
import { AllocationCharts } from "@/components/allocations/allocation-charts";
import { AllocationInsightsPanel } from "@/components/allocations/allocation-insights";
import { AllocationSummaryCards } from "@/components/allocations/allocation-summary-cards";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { ProtectedRoute } from "@/components/protected-route";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PortfolioProvider } from "@/contexts/portfolio-context";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RefreshCw } from "lucide-react";

export default function AllocationsPage() {
    return (
        <ProtectedRoute>
            <PortfolioProvider>
                <SidebarProvider>
                    <DashboardSidebar />
                    <SidebarInset className="bg-blue-50/50 dark:bg-background pb-16 md:pb-0">
                        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-sidebar px-4 backdrop-blur md:px-6">
                            <SidebarTrigger className="md:hidden" />
                            <div className="flex flex-1 items-center justify-between">
                                <div>
                                    <h1 className="text-lg font-bold md:text-xl">Allocations</h1>
                                    <p className="text-xs text-muted-foreground hidden sm:block">How your portfolio is distributed across assets</p>
                                </div>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="cursor-not-allowed">
                                            <Button variant="outline" disabled size="sm" className="hidden sm:flex pointer-events-none">
                                                <RefreshCw className="mr-2 h-4 w-4" />
                                                Rebalance
                                            </Button>
                                            <Button variant="outline" disabled size="icon" className="sm:hidden pointer-events-none">
                                                <RefreshCw className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Coming soon</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </header>

                        <main className="flex flex-col gap-6 p-4 md:p-8">
                            <AllocationSummaryCards />
                            <AllocationCharts />
                            <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
                                <AllocationBreakdownTable />
                                <div className="space-y-6">
                                    <AllocationInsightsPanel />
                                </div>
                            </div>
                        </main>

                        <MobileNav />
                    </SidebarInset>
                </SidebarProvider>
            </PortfolioProvider>
        </ProtectedRoute>
    )
}
