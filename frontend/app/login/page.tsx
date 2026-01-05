'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Eye, EyeOff, Shield } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { toast } = useToast();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
            toast({
                title: "Login successful",
                description: "Welcome back to WealthOS!",
            });
        } catch (error: any) {
            toast({
                title: "Login failed",
                description: error.message || "Invalid email or password",
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
            <div className="w-full max-w-[min(420px,90vw)] space-y-8 relative z-10">
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
                        <Shield className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">WealthOS</h1>
                        <p className="text-sm text-muted-foreground">Sign in to manage your portfolio</p>
                    </div>
                </div>
                <Card className="border shadow-2xl bg-white">
                    <form onSubmit={handleSubmit}>
                        <CardHeader className="space-y-2 pb-6">
                            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                            <CardDescription className="text-base">Enter your credentials to access your account</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
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
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                    <Link href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-5 pt-6">
                            <Button
                                type="submit"
                                className="w-full text-base font-semibold h-12 bg-blue-600 hover:bg-blue-700"
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </Button>
                            <div className="text-center text-sm text-muted-foreground">
                                Don&apos;t have an account?{" "}
                                <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                                    Sign up
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
                <p className="px-4 text-center text-xs text-muted-foreground leading-relaxed">
                    By continuing, you agree to our{" "}
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
