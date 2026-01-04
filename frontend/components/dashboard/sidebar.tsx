"use client"

import { LayoutDashboard, PieChart, Wallet, TrendingUp, Settings, Bell, LogOut, ShieldCheck } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from "@/components/ui/sidebar"

const navItems = [
    { icon: LayoutDashboard, label: "Overview", active: true },
    { icon: PieChart, label: "Allocation" },
    { icon: Wallet, label: "Holdings" },
    { icon: TrendingUp, label: "Performance" },
]

const accountItems = [
    { icon: Bell, label: "Notifications" },
    { icon: Settings, label: "Settings" },
]

export function DashboardSidebar() {
    return (
        <Sidebar variant="inset">
            <SidebarHeader className="h-16 border-b px-6 flex flex-row items-center gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
                    <ShieldCheck className="size-5" />
                </div>
                <span className="font-semibold text-base tracking-tight text-foreground">WealthOS</span>
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
                        <SidebarMenuButton className="text-destructive hover:text-destructive">
                            <LogOut className="size-4" />
                            <span>Log out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
