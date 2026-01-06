"use client";

import { Check } from "lucide-react";
import { usePathname } from "next/navigation";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const getStep = () => {
        if (pathname.includes("step1")) return 1;
        if (pathname.includes("step2")) return 2;
        if (pathname.includes("step3")) return 3;
        return 1;
    };

    const currentStep = getStep();

    const steps = [
        { number: 1, label: "Create Portfolio" },
        { number: 2, label: "Set Goals" },
        { number: 3, label: "Add Asset" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Progress Bar */}
            <div className="border-b bg-white/80 backdrop-blur dark:bg-gray-800/80">
                <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
                    <div className="flex items-center justify-center">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex items-center">
                                {/* Step Circle */}
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 transition-all ${step.number < currentStep
                                            ? "border-green-500 bg-green-500 text-white shadow-lg shadow-green-500/30"
                                            : step.number === currentStep
                                                ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                                                : "border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-gray-700"
                                            }`}
                                    >
                                        {step.number < currentStep ? (
                                            <Check className="h-5 w-5 sm:h-6 sm:w-6" />
                                        ) : (
                                            <span className="text-sm sm:text-base font-semibold">{step.number}</span>
                                        )}
                                    </div>
                                    <span
                                        className={`mt-2 hidden md:block text-xs font-medium whitespace-nowrap ${step.number <= currentStep ? "text-gray-900 dark:text-gray-100" : "text-gray-500"
                                            }`}
                                    >
                                        {step.label}
                                    </span>
                                </div>

                                {/* Connector Line */}
                                {index < steps.length - 1 && (
                                    <div
                                        className={`mx-3 sm:mx-4 h-0.5 w-16 sm:w-24 md:w-32 transition-colors ${step.number < currentStep ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="mx-auto max-w-2xl px-4 py-12">{children}</main>
        </div>
    );
}
