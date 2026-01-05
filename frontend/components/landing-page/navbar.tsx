'use client';

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-provider";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
    const { user, loading } = useAuth();

    return (
        <header className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-center mix-blend-difference text-white">
            <div className="w-full max-w-7xl flex items-center justify-between">
                <Link href="/" className="text-xl font-bold tracking-tight cursor-pointer">
                    WealthOS
                </Link>
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <a href="#philosophy" className="hover:opacity-70 transition-opacity">
                        Philosophy
                    </a>
                    <a href="#features" className="hover:opacity-70 transition-opacity">
                        Features
                    </a>
                    <a href="#how-it-works" className="hover:opacity-70 transition-opacity">
                        How it Works
                    </a>
                </nav>


                {!user ? (
                    <div className="flex items-center gap-3">
                        <Link href="/login">
                            <Button
                                variant="outline"
                                className="rounded-full px-6 border-white text-white hover:bg-white hover:text-black transition-all cursor-pointer font-medium bg-transparent"
                            >
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button
                                className="rounded-full px-6 bg-white text-black hover:bg-white/90 transition-all cursor-pointer font-medium"
                            >
                                Get Started
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <Link href="/dashboard">
                        <Button
                            className="rounded-full px-6 bg-white text-black hover:bg-white/90 transition-all cursor-pointer font-medium"
                        >
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Go to Dashboard
                        </Button>
                    </Link>
                )}
            </div>
        </header>
    )
}
