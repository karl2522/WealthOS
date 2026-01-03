import { FadeIn } from "@/components/animations/fade-in"
import { Card } from "@/components/ui/card"
import { BarChart3, PieChart, ShieldCheck, TrendingUp } from "lucide-react"

export default function FeaturesSection() {
    const features = [
        {
            icon: PieChart,
            title: "Portfolio Tracking",
            desc: "Aggregate all assets into a single, unified view.",
        },
        {
            icon: BarChart3,
            title: "Growth Analytics",
            desc: "Project future wealth based on historical consistency.",
        },
        { icon: TrendingUp, title: "Index Insights", desc: "Analyze your exposure to global market indices." },
        {
            icon: ShieldCheck,
            title: "Goal-based Savings",
            desc: "Track progress towards life-defining milestones.",
        },
    ]

    return (
        <section id="features" className="snap-section bg-white flex items-center justify-center px-6">
            <div className="max-w-6xl w-full space-y-16">
                <FadeIn>
                    <div className="max-w-2xl">
                        <h2 className="text-4xl font-semibold tracking-tight mb-4">Precision tools for the serious investor.</h2>
                        <p className="text-lg text-muted-foreground">
                            Sophisticated analytics delivered through a minimal, data-driven interface.
                        </p>
                    </div>
                </FadeIn>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((f, i) => (
                        <FadeIn key={i} delay={i * 0.1} fullWidth>
                            <Card className="p-8 border-none shadow-none bg-slate-50 rounded-3xl hover:bg-slate-100 transition-colors group h-full">
                                <f.icon className="w-8 h-8 mb-6 text-blue-600 group-hover:scale-110 transition-transform" />
                                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                            </Card>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    )
}
