"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePortfolio } from "@/contexts/portfolio-context";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const editAssetSchema = z.object({
    quantity: z.number().positive("Quantity must be positive"),
    avgPrice: z.union([z.number().positive(), z.undefined(), z.nan()]).optional().transform(val => isNaN(val as number) ? undefined : val),
});

type EditAssetFormData = z.infer<typeof editAssetSchema>;

interface EditAssetDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    asset: any | null;
}

export function EditAssetDialog({ open, onOpenChange, asset }: EditAssetDialogProps) {
    const { toast } = useToast();
    const { updateAsset } = usePortfolio();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<EditAssetFormData>({
        resolver: zodResolver(editAssetSchema),
    });

    useEffect(() => {
        if (asset) {
            setValue("quantity", parseFloat(asset.quantity.toString()));
            if (asset.avgPrice) {
                setValue("avgPrice", parseFloat(asset.avgPrice.toString()));
            } else {
                setValue("avgPrice", undefined);
            }
        }
    }, [asset, setValue]);

    const onSubmit = async (data: EditAssetFormData) => {
        if (!asset) return;
        setIsSubmitting(true);
        try {
            await updateAsset(asset.id, data);

            toast({
                title: "Asset upated",
                description: `${asset.symbol} has been updated.`,
            });

            onOpenChange(false);
            reset();
        } catch (error: any) {
            console.error("Failed to update asset:", error);
            toast({
                title: "Error",
                description: "Failed to update asset",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit {asset?.symbol}</DialogTitle>
                    <DialogDescription>
                        Update the quantity or average buy price for this asset.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    {/* Quantity */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-quantity">Quantity</Label>
                        <Input
                            id="edit-quantity"
                            type="number"
                            step="any"
                            placeholder="e.g., 10"
                            {...register("quantity", { valueAsNumber: true })}
                        />
                        {errors.quantity && (
                            <p className="text-sm text-red-600">{errors.quantity.message}</p>
                        )}
                    </div>

                    {/* Average Price */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-avgPrice">Average Buy Price</Label>
                        <Input
                            id="edit-avgPrice"
                            type="number"
                            step="any"
                            placeholder="e.g., 430.50"
                            {...register("avgPrice", { valueAsNumber: true })}
                        />
                        <p className="text-xs text-muted-foreground">
                            Leave empty if unknown
                        </p>
                        {errors.avgPrice && (
                            <p className="text-sm text-red-600">{errors.avgPrice.message}</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
