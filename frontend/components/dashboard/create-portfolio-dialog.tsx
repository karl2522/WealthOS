"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { usePortfolio } from "@/contexts/portfolio-context"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

const formSchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
    currency: z.string().min(1, "Currency is required"),
})

interface CreatePortfolioDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreatePortfolioDialog({
    open,
    onOpenChange,
}: CreatePortfolioDialogProps) {
    const { refreshPortfolio, selectPortfolio } = usePortfolio()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            currency: "USD",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/portfolio`,
                values,
                { withCredentials: true }
            );

            await refreshPortfolio();
            // Automatically select the new portfolio
            if (response.data && response.data.id) {
                selectPortfolio(response.data.id);
            }

            toast({
                title: "Portfolio created",
                description: "Your new portfolio is ready.",
            })
            onOpenChange(false)
            form.reset();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create portfolio. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Portfolio</DialogTitle>
                    <DialogDescription>
                        Add a separate portfolio to track different assets or goals.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Portfolio Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Retirement Fund" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Base Currency</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select currency" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="USD">USD ($)</SelectItem>
                                            <SelectItem value="EUR">EUR (€)</SelectItem>
                                            <SelectItem value="GBP">GBP (£)</SelectItem>
                                            <SelectItem value="JPY">JPY (¥)</SelectItem>
                                            <SelectItem value="PHP">PHP (₱)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Portfolio
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
