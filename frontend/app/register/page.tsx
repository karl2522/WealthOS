'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check, Eye, EyeOff, Loader2, Shield } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function SignUpPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const { toast } = useToast();

    // Password validation
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumberOrSymbol = /[\d\W]/.test(password);

    const validRequirements = [hasMinLength, hasUpperCase, hasLowerCase, hasNumberOrSymbol].filter(Boolean).length;
    const passwordStrength = validRequirements === 4 ? 'strong' : validRequirements >= 2 ? 'medium' : 'weak';

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await register(email, password, firstName, lastName);
            toast({
                title: "Account created",
                description: "Welcome to WealthOS!",
                variant: "success",
            });
        } catch (error: any) {
            toast({
                title: "Registration failed",
                description: error.message || "Please check your information and try again",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4 md:p-8 overflow-hidden">
            {/* Subtle blue accent orbs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-300/5 rounded-full blur-3xl"></div>
            <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 z-10">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" />
                    Back to home
                </Button>
            </Link>
            <div className="w-full max-w-[min(480px,95vw)] space-y-8 relative z-10">
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
                        <Shield className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">WealthOS</h1>
                        <p className="text-sm text-muted-foreground">Create an account to start your investment journey</p>
                    </div>
                </div>
                <Card className="border shadow-2xl bg-white">
                    <form onSubmit={handleSubmit}>
                        <CardHeader className="space-y-2 pb-6">
                            <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
                            <CardDescription className="text-base">Enter your information to get started</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first-name" className="text-sm font-medium">First name</Label>
                                    <Input
                                        id="first-name"
                                        placeholder="John"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                        disabled={loading}
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last-name" className="text-sm font-medium">Last name</Label>
                                    <Input
                                        id="last-name"
                                        placeholder="Doe"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                        disabled={loading}
                                        className="h-11"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a strong password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setPasswordFocused(true)}
                                        onBlur={() => setPasswordFocused(false)}
                                        required
                                        disabled={loading}
                                        className="h-11 pr-10 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-contacts-auto-fill-button]:hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>

                                {/* Password strength and requirements */}
                                {password && (passwordFocused || password.length > 0) && (
                                    <div className="space-y-3 pt-2">
                                        {/* Strength indicator with progress bar */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-muted-foreground">Password strength</span>
                                                <span className={`text-xs font-semibold ${passwordStrength === 'strong' ? 'text-green-600' :
                                                    passwordStrength === 'medium' ? 'text-amber-600' :
                                                        'text-red-600'
                                                    }`}>
                                                    {passwordStrength === 'strong' ? 'Strong' :
                                                        passwordStrength === 'medium' ? 'Medium' :
                                                            'Weak'}
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-300 ${passwordStrength === 'strong' ? 'bg-green-600' :
                                                        passwordStrength === 'medium' ? 'bg-amber-600' :
                                                            'bg-red-600'
                                                        }`}
                                                    style={{ width: `${(validRequirements / 4) * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Requirements checklist */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2 text-xs">
                                                <Check className={`h-3.5 w-3.5 ${hasMinLength ? 'text-green-600' : 'text-gray-300'}`} />
                                                <span className={hasMinLength ? 'text-green-600' : 'text-muted-foreground'}>
                                                    At least 8 characters
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <Check className={`h-3.5 w-3.5 ${hasUpperCase ? 'text-green-600' : 'text-gray-300'}`} />
                                                <span className={hasUpperCase ? 'text-green-600' : 'text-muted-foreground'}>
                                                    One uppercase letter
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <Check className={`h-3.5 w-3.5 ${hasLowerCase ? 'text-green-600' : 'text-gray-300'}`} />
                                                <span className={hasLowerCase ? 'text-green-600' : 'text-muted-foreground'}>
                                                    One lowercase letter
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <Check className={`h-3.5 w-3.5 ${hasNumberOrSymbol ? 'text-green-600' : 'text-gray-300'}`} />
                                                <span className={hasNumberOrSymbol ? 'text-green-600' : 'text-muted-foreground'}>
                                                    One number or symbol
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-5 pt-6">
                            <Button
                                type="submit"
                                className="w-full text-base font-semibold h-12 bg-blue-600 hover:bg-blue-700"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    'Create account'
                                )}
                            </Button>
                            <div className="text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                                    Sign in
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
                <p className="px-4 text-center text-xs text-muted-foreground leading-relaxed">
                    By creating an account, you agree to our{" "}
                    <Link href="/terms" className="underline underline-offset-4 hover:text-blue-600 font-medium">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline underline-offset-4 hover:text-blue-600 font-medium">
                        Privacy Policy
                    </Link>
                    .
                </p>
            </div>
        </div>
    )
}
