"use client";

import { AddAssetDialog } from "@/components/dashboard/add-asset-dialog";
import { HoldingsSummary } from "@/components/dashboard/holdings-summary";
import { HoldingsTable } from "@/components/dashboard/holdings-table";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PortfolioProvider } from "@/contexts/portfolio-context";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function HoldingsPage() {
    const [addAssetOpen, setAddAssetOpen] = useState(false);

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
                                    <h1 className="text-lg font-bold md:text-xl">Holdings</h1>
                                    <p className="text-xs text-muted-foreground hidden sm:block">All assets in your portfolio</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Button onClick={() => setAddAssetOpen(true)} size="sm">
                                        <Plus className="h-4 w-4 sm:mr-2" />
                                        <span className="hidden sm:inline">Add Asset</span>
                                    </Button>
                                </div>
                            </div>
                        </header>

                        <main className="flex flex-col gap-6 p-4 md:gap-8 md:p-8">
                            {/* Portfolio Summary Strip */}
                            <HoldingsSummary />

                            {/* Holdings Table */}
                            <HoldingsTable />
                        </main>

                        {/* Mobile-only bottom navigation */}
                        <MobileNav />
                    </SidebarInset>
                </SidebarProvider>

                {/* Add Asset Dialog */}
                <AddAssetDialog open={addAssetOpen} onOpenChange={setAddAssetOpen} />
            </PortfolioProvider>
        </ProtectedRoute>
    );
}
