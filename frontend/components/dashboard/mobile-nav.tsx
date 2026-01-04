import { LayoutDashboard, PieChart, Wallet, TrendingUp } from "lucide-react"

export function MobileNav() {
    const items = [
        { icon: LayoutDashboard, label: "Overview", active: true },
        { icon: PieChart, label: "Allocation" },
        { icon: Wallet, label: "Holdings" },
        { icon: TrendingUp, label: "Performance" },
    ]

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 px-4 pb-safe pt-2 backdrop-blur-lg md:hidden">
            <nav className="flex items-center justify-around pb-2">
                {items.map((item) => (
                    <button
                        key={item.label}
                        className={`flex flex-col items-center gap-1 p-2 ${
                            item.active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <item.icon className="size-5" />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    )
}
