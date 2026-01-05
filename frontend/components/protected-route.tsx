'use client';

import { useAuth } from '@/contexts/auth-provider';
import { Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
                <div className="flex flex-col items-center gap-6">
                    {/* Animated logo */}
                    <div className="relative">
                        <div className="absolute inset-0 animate-ping">
                            <div className="h-16 w-16 rounded-xl bg-blue-600/20"></div>
                        </div>
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xl animate-pulse">
                            <Shield className="h-9 w-9" />
                        </div>
                    </div>

                    {/* Loading text */}
                    <div className="text-center space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900">Loading WealthOS</h3>
                        <div className="flex items-center gap-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
}
