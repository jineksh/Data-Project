"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    ShieldCheck,
    LayoutDashboard,
    Database,
    Code2,
    Activity,
    Settings,
    ChevronRight
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
    SidebarRail,
} from "@/components/ui/sidebar";

const navItems = [
    {
        title: "Overview",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Discovered Datasets",
        url: "/dashboard/datasets",
        icon: Database,
    },
    {
        title: "Validation Rules",
        url: "/dashboard/rules",
        icon: Code2,
    },
    {
        title: "Audit History",
        url: "/dashboard/history",
        icon: Activity,
    },
];

export function AppSideBar() {
    const pathname = usePathname();

    return (
        <Sidebar collapsible="icon" className="border-r border-slate-800 bg-[#0F172A]">
            {/* Sidebar Header / Brand Logo */}
            <SidebarHeader className="border-b border-slate-800 p-4">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                        <span className="truncate font-bold text-slate-100 font-sans">DataGuard</span>
                        <span className="truncate text-[10px] text-slate-400 font-mono">PySpark Engine v1.0</span>
                    </div>
                </Link>
            </SidebarHeader>

            {/* Main Navigation Group */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] font-mono text-slate-500 uppercase tracking-wider group-data-[collapsible=icon]:hidden">
                        Platform
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => {
                                const isActive = pathname === item.url;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.title}
                                            className={`hover:bg-slate-800 hover:text-slate-100 transition-colors ${isActive
                                                ? "bg-emerald-500/10 text-emerald-400 font-medium border-r-2 border-emerald-400"
                                                : "text-slate-400"
                                                }`}
                                        >
                                            <Link href={item.url} className="flex items-center gap-2.5">
                                                <item.icon className={`h-4 w-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                                                <span className="text-xs font-sans group-data-[collapsible=icon]:hidden">{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer / System Health */}
            <SidebarFooter className="border-t border-slate-800 p-3">
                <div className="flex items-center gap-2 text-xs text-slate-400 group-data-[collapsible=icon]:hidden">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-[11px]">Spark Cluster: Ready</span>
                </div>
            </SidebarFooter>

            {/* Collapse Rail Trigger */}
            <SidebarRail />
        </Sidebar>
    );
}