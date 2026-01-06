"use client"

import { Loader2 } from "lucide-react"
import { useState } from "react"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { usePortfolio } from "@/contexts/portfolio-context"
import { useToast } from "@/hooks/use-toast"

interface DeletePortfolioDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    portfolioId: string
    portfolioName: string
}

export function DeletePortfolioDialog({
    open,
    onOpenChange,
    portfolioId,
    portfolioName,
}: DeletePortfolioDialogProps) {
    const { deletePortfolio } = usePortfolio()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)

    async function onDelete() {
        setIsLoading(true)
        try {
            await deletePortfolio(portfolioId)
            toast({
                title: "Portfolio deleted",
                description: `${portfolioName} has been deleted successfully.`,
            })
            onOpenChange(false)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete portfolio. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete
                        <span className="font-semibold text-foreground"> {portfolioName} </span>
                        and all assets and goals associated with it.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            onDelete()
                        }}
                        disabled={isLoading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete Portfolio
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
