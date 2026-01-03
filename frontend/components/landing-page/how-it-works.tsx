import { FadeIn } from "@/components/animations/fade-in"
import { Lock } from "lucide-react"

export default function HowItWorksSection() {
    const steps = [
        { step: "01", title: "Create Portfolio", desc: "Set your long-term goals and risk parameters." },
        { step: "02", title: "Add Assets", desc: "Securely link your bank, brokerage, and crypto accounts." },
        {
            step: "03",
            title: "Track Growth",
            desc: "Monitor your path to financial independence in real-time.",
        },
    ]

    return (
        <section id="how-it-works" className="snap-section bg-[#0a0a0a] text-white flex items-center justify-center px-6">
            <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-24">
                <FadeIn direction="right">
                    <div className="space-y-12">
                        <h2 className="text-5xl font-semibold tracking-tight leading-tight">Your journey to disciplined wealth.</h2>
                        <div className="space-y-8">
                            {steps.map((s, i) => (
                                <div key={i} className="flex gap-6 group">
                                    <span className="text-blue-500 font-mono text-xl pt-1">{s.step}</span>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-medium group-hover:text-blue-400 transition-colors">{s.title}</h3>
                                        <p className="text-gray-400 text-lg leading-relaxed">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>
                <FadeIn direction="left" delay={0.2} fullWidth className="hidden lg:flex items-center justify-center">
                    <div className="w-full aspect-video bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-[40px] border border-white/10 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-[url('/abstract-grid.jpg')] opacity-30" />
                        <Lock className="w-16 h-16 text-white/40" />
                    </div>
                </FadeIn>
            </div>
        </section>
    )
}
