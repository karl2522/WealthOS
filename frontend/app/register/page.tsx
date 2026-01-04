'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { Check, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const { toast } = useToast();

    // Password strength validation
    const passwordRequirements = {
        length: formData.password.length >= 8,
        uppercase: /[A-Z]/.test(formData.password),
        lowercase: /[a-z]/.test(formData.password),
        number: /[0-9]/.test(formData.password),
    };

    const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);
    const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!allRequirementsMet) {
            toast({
                title: 'Weak Password',
                description: 'Please meet all password requirements',
                variant: 'destructive',
            });
            return;
        }

        if (!passwordsMatch) {
            toast({
                title: 'Passwords Don\'t Match',
                description: 'Please make sure your passwords match',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        try {
            await register(formData.email, formData.password, formData.firstName, formData.lastName);
            toast({
                title: 'Account Created!',
                description: 'Welcome to WealthOS',
            });
        } catch (error: any) {
            toast({
                title: 'Registration Failed',
                description: error.message || 'Something went wrong',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-4">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-20" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-20" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100 p-8 md:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block mb-6">
                            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                                WealthOS
                            </div>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Create your account</h1>
                        <p className="text-muted-foreground">Start building wealth with clarity</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-sm font-medium">
                                    First Name
                                </Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="h-11 rounded-xl border-gray-200 focus:border-blue-500"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-sm font-medium">
                                    Last Name
                                </Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="h-11 rounded-xl border-gray-200 focus:border-blue-500"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="h-11 rounded-xl border-gray-200 focus:border-blue-500"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">
                                Password
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="h-11 rounded-xl border-gray-200 focus:border-blue-500"
                                disabled={isLoading}
                            />

                            {/* Password requirements */}
                            {formData.password.length > 0 && (
                                <div className="mt-3 space-y-1.5 text-xs">
                                    <RequirementItem met={passwordRequirements.length} text="At least 8 characters" />
                                    <RequirementItem met={passwordRequirements.uppercase} text="One uppercase letter" />
                                    <RequirementItem met={passwordRequirements.lowercase} text="One lowercase letter" />
                                    <RequirementItem met={passwordRequirements.number} text="One number" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium">
                                Confirm Password
                            </Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="h-11 rounded-xl border-gray-200 focus:border-blue-500"
                                disabled={isLoading}
                            />
                            {formData.confirmPassword.length > 0 && (
                                <RequirementItem met={passwordsMatch} text="Passwords match" />
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                'Create account'
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-muted-foreground">or</span>
                        </div>
                    </div>

                    {/* Sign in link */}
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-muted-foreground mt-8">
                    By continuing, you agree to our{' '}
                    <Link href="#" className="underline hover:text-foreground transition-colors">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="#" className="underline hover:text-foreground transition-colors">
                        Privacy Policy
                    </Link>
                </p>
            </div>
        </div>
    );
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
    return (
        <div className={`flex items-center gap-2 ${met ? 'text-emerald-600' : 'text-muted-foreground'}`}>
            {met ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
            <span>{text}</span>
        </div>
    );
}
