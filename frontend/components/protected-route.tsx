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

    if (loading) {
        // Return children immediately to allow skeletons to show
        // The useEffect above handles redirection if auth fails
        return <>{children}</>;
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
}

