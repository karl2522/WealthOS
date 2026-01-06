"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Shield, TrendingUp, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const portfolioSchema = z.object({
    name: z.string().min(1, "Portfolio name is required"),
    currency: z.enum(["PHP", "USD"]),
    riskProfile: z.enum(["conservative", "balanced", "growth"]).optional(),
});

type PortfolioFormData = z.infer<typeof portfolioSchema>;

export default function Step1Page() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<PortfolioFormData>({
        resolver: zodResolver(portfolioSchema),
        defaultValues: {
            name: "My Portfolio",
            currency: "USD",
            riskProfile: "balanced",
        },
    });

    const selectedRiskProfile = watch("riskProfile");
    const selectedCurrency = watch("currency");

    const riskProfiles = [
        {
            value: "conservative",
            label: "Conservative",
            icon: Shield,
            description: "Lower risk, steady growth",
        },
        {
            value: "balanced",
            label: "Balanced",
            icon: Zap,
            description: "Moderate risk, balanced returns",
        },
        {
            value: "growth",
            label: "Growth",
            icon: TrendingUp,
            description: "Higher risk, maximum growth",
        },
    ];

    const onSubmit = async (data: PortfolioFormData) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/portfolio`,
                data,
                { withCredentials: true }
            );

            // Store portfolio ID for next steps
            localStorage.setItem("onboarding_portfolio_id", response.data.id);

            toast({
                title: "Portfolio created!",
                description: `${data.name} is ready to go.`,
            });

            router.push("/onboarding/step2");
        } catch (error: any) {
            console.error("Failed to create portfolio:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to create portfolio",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Create Your Portfolio
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Let's start by setting up your investment portfolio
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Portfolio Name */}
                <div className="space-y-2">
                    <Label htmlFor="name">Portfolio Name</Label>
                    <Input
                        id="name"
                        placeholder="My Portfolio"
                        {...register("name")}
                        className="text-lg"
                    />
                    {errors.name && (
                        <p className="text-sm text-red-600">{errors.name.message}</p>
                    )}
                </div>

                {/* Base Currency */}
                <div className="space-y-3">
                    <Label>Base Currency</Label>
                    <RadioGroup
                        value={selectedCurrency}
                        onValueChange={(value) => setValue("currency", value as "PHP" | "USD")}
                        className="grid grid-cols-2 gap-4"
                    >
                        <Label
                            htmlFor="currency-php"
                            className={`flex cursor-pointer items-center justify-center rounded-lg border-2 p-4 transition-all ${selectedCurrency === "PHP"
                                    ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                                    : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                                }`}
                        >
                            <RadioGroupItem value="PHP" id="currency-php" className="sr-only" />
                            <div className="text-center">
                                <div className="text-2xl font-bold">₱</div>
                                <div className="mt-1 text-sm font-medium">PHP</div>
                            </div>
                        </Label>

                        <Label
                            htmlFor="currency-usd"
                            className={`flex cursor-pointer items-center justify-center rounded-lg border-2 p-4 transition-all ${selectedCurrency === "USD"
                                    ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                                    : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                                }`}
                        >
                            <RadioGroupItem value="USD" id="currency-usd" className="sr-only" />
                            <div className="text-center">
                                <div className="text-2xl font-bold">$</div>
                                <div className="mt-1 text-sm font-medium">USD</div>
                            </div>
                        </Label>
                    </RadioGroup>
                </div>

                {/* Investment Style */}
                <div className="space-y-3">
                    <Label>Investment Style (Optional)</Label>
                    <div className="grid gap-3 sm:grid-cols-3">
                        {riskProfiles.map((profile) => {
                            const Icon = profile.icon;
                            const isSelected = selectedRiskProfile === profile.value;

                            return (
                                <Card
                                    key={profile.value}
                                    className={`cursor-pointer transition-all ${isSelected
                                            ? "border-blue-600 bg-blue-50 shadow-md dark:bg-blue-950"
                                            : "hover:border-gray-300 hover:shadow"
                                        }`}
                                    onClick={() => setValue("riskProfile", profile.value as any)}
                                >
                                    <CardContent className="p-4 text-center">
                                        <Icon
                                            className={`mx-auto h-8 w-8 ${isSelected ? "text-blue-600" : "text-gray-400"
                                                }`}
                                        />
                                        <h3 className="mt-2 font-semibold">{profile.label}</h3>
                                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                            {profile.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Continue to Goals"}
                </Button>
            </form>
        </div>
    );
}
