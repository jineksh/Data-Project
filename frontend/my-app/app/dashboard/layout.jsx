"use client";

import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSideBar } from "./AppSideBar.jsx";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({ children }) {
    return (
        <SidebarProvider className="bg-[#0F172A] text-slate-100 font-sans min-h-screen">
            {/* 1. Collapsible Sidebar */}
            <AppSideBar />

            {/* 2. Main Inset Area */}
            <SidebarInset className="bg-[#0F172A] flex flex-col flex-1">
                {/* Top Header Bar */}
                <header className="flex h-14 shrink-0 items-center gap-2 border-b border-slate-800 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-[#0F172A]/80 backdrop-blur sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800" />
                        <Separator orientation="vertical" className="mr-2 h-4 bg-slate-800" />
                        <span className="text-xs font-mono text-slate-400">
                            Dashboard / Console
                        </span>
                    </div>
                </header>

                {/* Page Dynamic Content */}
                <main className="flex-1 p-6 md:p-8">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}