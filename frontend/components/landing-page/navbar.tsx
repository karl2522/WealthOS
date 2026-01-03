import { Button } from "@/components/ui/button"

export default function Navbar() {
    return (
        <header className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-center mix-blend-difference text-white">
            <div className="w-full max-w-7xl flex items-center justify-between">
                <div className="text-xl font-bold tracking-tight">WealthOS</div>
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
                <Button
                    variant="outline"
                    className="rounded-full px-6 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all"
                >
                    Get Started
                </Button>
            </div>
        </header>
    )
}

