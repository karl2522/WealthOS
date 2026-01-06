"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Bell, LayoutDashboard, Lightbulb, PieChart, Settings, TrendingUp, Wallet } from "lucide-react"
import { LogoutDialog } from "./logout-dialog"

import { PortfolioSwitcher } from "./portfolio-switcher"

const navItems = [
    { icon: LayoutDashboard, label: "Overview", active: true },
    { icon: PieChart, label: "Allocation" },
    { icon: Wallet, label: "Holdings" },
    { icon: TrendingUp, label: "Performance" },
    { icon: Lightbulb, label: "Insights" },
]

const accountItems = [
    { icon: Bell, label: "Notifications" },
    { icon: Settings, label: "Settings" },
]

export function DashboardSidebar() {
    return (
        <Sidebar variant="inset">
            <SidebarHeader className="h-16 border-b px-4 flex flex-row items-center">
                <PortfolioSwitcher />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton asChild isActive={item.active}>
                                        <a href="#" className="flex items-center gap-3">
                                            <item.icon className="size-4" />
                                            <span>{item.label}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Account</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {accountItems.map((item) => (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton asChild>
                                        <a href="#" className="flex items-center gap-3">
                                            <item.icon className="size-4" />
                                            <span>{item.label}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4 border-t">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <LogoutDialog />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
