'use client';

import { useAuth } from '@/contexts/auth-provider';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [portfolioLoading, setPortfolioLoading] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        async function checkPortfolio() {
            // Skip portfolio check if already on onboarding pages
            if (pathname?.startsWith('/onboarding')) {
                setPortfolioLoading(false);
                return;
            }

            if (!user) return;

            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/portfolio`,
                    { withCredentials: true }
                );

                if (response.data.length === 0) {
                    // No portfolios found, redirect to onboarding
                    router.push('/onboarding/step1');
                } else {
                    setPortfolioLoading(false);
                }
            } catch (error) {
                console.error('Failed to fetch portfolios:', error);
                setPortfolioLoading(false);
            }
        }

        if (!loading && user) {
            checkPortfolio();
        }
    }, [user, loading, router, pathname]);

    if (loading || portfolioLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-500"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
}

