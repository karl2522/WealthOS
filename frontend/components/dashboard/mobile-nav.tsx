import { LayoutDashboard, Lightbulb, PieChart, TrendingUp, Wallet } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function MobileNav() {
    const pathname = usePathname()

    const items = [
        { icon: LayoutDashboard, label: "Overview", href: "/dashboard", active: pathname === "/dashboard" },
        { icon: PieChart, label: "Allocation", href: "/allocations", active: pathname === "/allocations" },
        { icon: Wallet, label: "Holdings", href: "/holdings", active: pathname === "/holdings" },
        { icon: TrendingUp, label: "Performance", href: "/performance", active: pathname === "/performance" },
        { icon: Lightbulb, label: "Insights", href: "/insights", active: pathname === "/insights" },
    ]

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 px-4 pb-safe pt-2 backdrop-blur-lg md:hidden">
            <nav className="flex items-center justify-around pb-2">
                {items.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 p-2 ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <item.icon className="size-5" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
