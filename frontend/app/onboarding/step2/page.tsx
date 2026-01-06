"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { GraduationCap, Home, Plane, Target, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const goalSchema = z.object({
    name: z.string().min(1, "Goal name is required"),
    targetAmount: z.number().positive("Target amount must be positive"),
    monthlyContribution: z.number().positive().optional(),
});

type GoalFormData = z.infer<typeof goalSchema>;

const predefinedGoals = [
    { value: "Emergency Fund", icon: Wallet },
    { value: "Retirement", icon: Target },
    { value: "House", icon: Home },
    { value: "Travel", icon: Plane },
    { value: "Education", icon: GraduationCap },
    { value: "Custom", icon: Target },
];

export default function Step2Page() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedGoalType, setSelectedGoalType] = useState<string>("Emergency Fund");
    const [isCustomGoal, setIsCustomGoal] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<GoalFormData>({
        resolver: zodResolver(goalSchema),
        defaultValues: {
            name: "Emergency Fund",
        },
    });

    const handleGoalSelect = (value: string) => {
        setSelectedGoalType(value);
        setValue("name", value);
        setIsCustomGoal(value === "Custom");
    };

    const handleSkip = () => {
        router.push("/onboarding/step3");
    };

    const onSubmit = async (data: GoalFormData) => {
        const portfolioId = localStorage.getItem("onboarding_portfolio_id");

        if (!portfolioId) {
            toast({
                title: "Error",
                description: "Portfolio not found. Please go back to step 1.",
                variant: "destructive",
            });
            router.push("/onboarding/step1");
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/portfolio/${portfolioId}/goals`,
                data,
                { withCredentials: true }
            );

            toast({
                title: "Goal created!",
                description: `Your ${data.name} goal has been set.`,
            });

            router.push("/onboarding/step3");
        } catch (error: any) {
            console.error("Failed to create goal:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to create goal",
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
                    Set Your Savings Goal
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    What are you investing for? You can add more goals later.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Goal Type Selection */}
                <div className="space-y-3">
                    <Label>Choose a Goal</Label>
                    <Select value={selectedGoalType} onValueChange={handleGoalSelect}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {predefinedGoals.map((goal) => (
                                <SelectItem key={goal.value} value={goal.value}>
                                    <div className="flex items-center gap-2">
                                        <goal.icon className="h-4 w-4" />
                                        {goal.value}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Custom Goal Name */}
                {isCustomGoal && (
                    <div className="space-y-2">
                        <Label htmlFor="customName">Custom Goal Name</Label>
                        <Input
                            id="customName"
                            placeholder="e.g., New Car, Wedding"
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600">{errors.name.message}</p>
                        )}
                    </div>
                )}

                {/* Target Amount */}
                <div className="space-y-2">
                    <Label htmlFor="targetAmount">Target Amount</Label>
                    <Input
                        id="targetAmount"
                        type="number"
                        placeholder="10000"
                        {...register("targetAmount", { valueAsNumber: true })}
                    />
                    {errors.targetAmount && (
                        <p className="text-sm text-red-600">{errors.targetAmount.message}</p>
                    )}
                </div>

                {/* Monthly Contribution */}
                <div className="space-y-2">
                    <Label htmlFor="monthlyContribution">
                        Monthly Contribution (Optional)
                    </Label>
                    <Input
                        id="monthlyContribution"
                        type="number"
                        placeholder="500"
                        {...register("monthlyContribution", { valueAsNumber: true })}
                    />
                    {errors.monthlyContribution && (
                        <p className="text-sm text-red-600">{errors.monthlyContribution.message}</p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={handleSkip}
                    >
                        Skip for Now
                    </Button>
                    <Button type="submit" className="flex-1" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Continue to Assets"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
