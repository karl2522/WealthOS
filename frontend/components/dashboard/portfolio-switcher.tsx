import { Check, ChevronsUpDown, Pencil, Plus, Trash2, Wallet } from "lucide-react"
import * as React from "react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { usePortfolio } from "@/contexts/portfolio-context"
import { CreatePortfolioDialog } from "./create-portfolio-dialog"
import { DeletePortfolioDialog } from "./delete-portfolio-dialog"
import { EditPortfolioDialog } from "./edit-portfolio-dialog"

export function PortfolioSwitcher() {
    const { isMobile } = useSidebar()
    const { portfolio, portfolios, selectPortfolio } = usePortfolio()
    const [activePortfolioId, setActivePortfolioId] = React.useState<string | null>(null)

    // Dialog states
    const [showEditDialog, setShowEditDialog] = React.useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
    const [showCreateDialog, setShowCreateDialog] = React.useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)

    // Helper to open specific dialog
    const handleEdit = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        setIsDropdownOpen(false)
        setActivePortfolioId(id)
        setShowEditDialog(true)
    }

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        setIsDropdownOpen(false)
        setActivePortfolioId(id)
        setShowDeleteDialog(true)
    }

    const activePortfolio = portfolios.find(p => p.id === activePortfolioId)

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    {!portfolio ? (
                        <SidebarMenuButton
                            size="lg"
                            onClick={() => setShowCreateDialog(true)}
                            className="bg-sidebar-accent/50 text-sidebar-accent-foreground border border-dashed border-sidebar-border"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary-foreground">
                                <Plus className="size-4 text-foreground" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">Create Portfolio</span>
                                <span className="truncate text-xs text-muted-foreground">No portfolios found</span>
                            </div>
                        </SidebarMenuButton>
                    ) : (
                        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                        <Wallet className="size-4" />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold uppercase">{portfolio.name}</span>
                                        <span className="truncate text-xs text-muted-foreground">{portfolio.currency} Portfolio</span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                align="start"
                                side={isMobile ? "bottom" : "right"}
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="text-xs text-muted-foreground">
                                    Switch Portfolio
                                </DropdownMenuLabel>
                                {portfolios.map((p) => (
                                    <div key={p.id} className="group flex items-center justify-between pr-2 hover:bg-muted/50 rounded-sm">
                                        <DropdownMenuItem
                                            onClick={() => selectPortfolio(p.id)}
                                            className="flex-1 gap-2 p-2 cursor-pointer focus:bg-transparent"
                                        >
                                            <div className="flex size-6 items-center justify-center rounded-sm border">
                                                <Wallet className="size-4 shrink-0" />
                                            </div>
                                            {p.name} <span className="text-xs text-muted-foreground">({p.currency})</span>
                                            {portfolio.id === p.id && <Check className="ml-auto size-4" />}
                                        </DropdownMenuItem>

                                        {/* Management Actions */}
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => handleEdit(e, p.id)}
                                                className="p-1.5 hover:bg-background shadow-sm border border-transparent hover:border-border rounded-md text-muted-foreground hover:text-foreground transition-all"
                                                title="Rename Portfolio"
                                            >
                                                <Pencil className="size-3" />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, p.id)}
                                                className="p-1.5 hover:bg-destructive/10 border border-transparent hover:border-destructive/20 rounded-md text-muted-foreground hover:text-destructive transition-all"
                                                title="Delete Portfolio"
                                            >
                                                <Trash2 className="size-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="gap-2 p-2 cursor-pointer"
                                    onClick={() => setShowCreateDialog(true)}
                                >
                                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                        <Plus className="size-4" />
                                    </div>
                                    <div className="font-medium text-muted-foreground">Add Portfolio</div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </SidebarMenuItem>
            </SidebarMenu>

            {/* Dialogs - Kept stable outside conditional rendering */}
            <CreatePortfolioDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />

            <EditPortfolioDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                portfolioId={activePortfolioId || ""}
                currentName={activePortfolio?.name || ""}
            />

            <DeletePortfolioDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                portfolioId={activePortfolioId || ""}
                portfolioName={activePortfolio?.name || ""}
            />
        </>
    )
}
