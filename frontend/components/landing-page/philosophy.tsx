import { FadeIn } from "@/components/animations/fade-in"

export default function PhilosophySection() {
    return (
        <section
            id="philosophy"
            className="snap-section bg-black text-white flex flex-col items-center justify-center px-6"
        >
            <div className="max-w-4xl text-center space-y-12">
                <FadeIn>
                    <div className="space-y-6">
                        <span className="text-blue-400 font-mono text-sm tracking-[0.2em] uppercase">The Philosophy</span>
                        <h2 className="text-5xl md:text-6xl font-medium tracking-tight leading-tight italic font-serif">
                            "Consistency over hype. Index-first, long-term, wealth built through discipline."
                        </h2>
                    </div>
                </FadeIn>
                <FadeIn delay={0.2} fullWidth>
                    <div className="grid md:grid-cols-3 gap-8 pt-12 border-t border-white/10">
                        <div className="space-y-3">
                            <h4 className="text-lg font-semibold">Long Term</h4>
                            <p className="text-gray-400 text-sm">
                                We optimize for decades, not days. Compounding is the only free lunch.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-lg font-semibold">Index First</h4>
                            <p className="text-gray-400 text-sm">
                                Market exposure is the core. We focus on broad-based index growth.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-lg font-semibold">Transparency</h4>
                            <p className="text-gray-400 text-sm">
                                Real-time data and clarity into every asset and fee in your portfolio.
                            </p>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    )
}
