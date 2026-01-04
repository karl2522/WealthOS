import { HeroChart } from "@/components/hero-chart"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, BarChart3, PieChart, ShieldCheck, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
    return (
        <section className="snap-section bg-[#f5f5f3] flex items-center justify-center pt-24 pb-12 px-6">
            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-medium shadow-sm w-fit">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Developed by Jared Omen
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.1] text-balance">
                            Build wealth with clarity.
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                            Professional-grade portfolio tracking and long-term investment insights for disciplined builders.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 pt-2">
                        <Link href="/register">
                            <Button
                                size="lg"
                                className="rounded-full px-10 h-12 text-base bg-black hover:bg-black/90 text-white gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all cursor-pointer"
                            >
                                Get Started <ArrowUpRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                    {/* Main Dashboard Card */}
                    <div className="bg-white rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-gray-100 p-6 md:p-8 flex flex-col gap-6 relative z-10 backdrop-blur-xl bg-white/90">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Net Worth</p>
                                <h3 className="text-3xl md:text-4xl font-bold tracking-tight">$1,248,590.00</h3>
                                <div className="flex items-center gap-2 text-emerald-600 font-medium text-xs">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    <span>+12.4% this year</span>
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="pt-2">
                            <HeroChart />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Allocation</p>
                                    <PieChart className="w-4 h-4 text-slate-400" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[92%]" />
                                    </div>
                                    <span className="text-sm font-bold">92%</span>
                                </div>
                                <p className="text-xs font-medium text-slate-500">Low-cost Index Funds</p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Strategy</p>
                                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider">
                                        Disciplined
                                    </span>
                                </div>
                                <p className="text-sm font-bold">Global Aggressive</p>
                            </div>
                        </div>
                    </div>

                    {/* Background Decorative Element */}
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -z-10" />
                    <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -z-10" />
                </div>
            </div>
        </section>
    )
}
