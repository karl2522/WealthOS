import { FadeIn } from "@/components/animations/fade-in"
import { ShieldCheck } from "lucide-react"

export default function TechnologySection() {
    return (
        <section className="snap-section bg-white flex items-center justify-center px-6 text-center">
            <div className="max-w-3xl space-y-12">
                <FadeIn>
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-sm font-medium">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            Enterprise-grade security by default
                        </div>
                        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
                            Built on a foundation of trust and modern technology.
                        </h2>
                    </div>
                </FadeIn>
                <FadeIn delay={0.2}>
                    <div className="flex flex-wrap justify-center gap-12 pt-8">
                        <div className="flex items-center gap-2 text-xl font-bold text-slate-300">NEXT.JS</div>
                        <div className="flex items-center gap-2 text-xl font-bold text-slate-300">NESTJS</div>
                        <div className="flex items-center gap-2 text-xl font-bold text-slate-300">POSTGRES</div>
                        <div className="flex items-center gap-2 text-xl font-bold text-slate-300">REDIS</div>
                    </div>
                </FadeIn>
                <FadeIn delay={0.4}>
                    <p className="text-xs text-muted-foreground max-w-lg mx-auto leading-relaxed pt-12 uppercase tracking-[0.1em]">
                        Disclaimer: WealthOS is a technology platform, not a financial advisor. All investment involves risk. No
                        financial advice is provided or implied.
                    </p>
                </FadeIn>
            </div>
        </section>
    )
}
