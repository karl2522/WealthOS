'use client';

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-provider";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

import Image from "next/image";

export default function Navbar() {
    const { user, loading } = useAuth();

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <header className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-center mix-blend-difference text-white">
            <div className="w-full max-w-7xl flex items-center justify-between">
                <Link href="/" onClick={(e) => scrollToSection(e, 'hero')} className="flex items-center gap-2 cursor-pointer">
                    <div className="relative w-8 h-8 rounded-md overflow-hidden">
                        <Image
                            src="/logo.png"
                            alt="WealthOS Logo"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <span className="text-xl font-bold tracking-tight">WealthOS</span>
                </Link>
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <a href="#philosophy" onClick={(e) => scrollToSection(e, 'philosophy')} className="hover:opacity-70 transition-opacity">
                        Philosophy
                    </a>
                    <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:opacity-70 transition-opacity">
                        Features
                    </a>
                    <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="hover:opacity-70 transition-opacity">
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
