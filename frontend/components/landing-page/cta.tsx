import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CTASection() {
    return (
        <section className="snap-section bg-blue-600 flex items-center justify-center px-6 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('/abstract-pattern.png')] mix-blend-overlay" />
            <div className="max-w-4xl text-center space-y-10 relative z-10">
                <h2 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none">
                    Start building wealth the disciplined way.
                </h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Button
                        size="lg"
                        className="rounded-full px-12 h-16 text-xl bg-white text-blue-600 hover:bg-slate-100 transition-all font-semibold"
                    >
                        Get Started Now
                    </Button>
                    <button className="text-lg font-medium hover:underline flex items-center gap-2">
                        Speak with our team <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    )
}
