"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-provider"
import { LogOut } from "lucide-react"

export function LogoutDialog() {
    const { logout } = useAuth()

    const handleLogout = async () => {
        await logout()
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <SidebarMenuButton className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer">
                    <LogOut className="size-4" />
                    <span>Log out</span>
                </SidebarMenuButton>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You will be redirected to the landing page and will need to log in again to access your dashboard.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleLogout}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Log out
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
