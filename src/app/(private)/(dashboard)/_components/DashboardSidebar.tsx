"use client";

import { LayoutGrid, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { dashboardNavConfig } from "@/constants/dashboard-nav";

export function DashboardSidebar({ role }: { role: string }) {
    const pathname = usePathname();
    const navItems = dashboardNavConfig[role] ?? [];

    return (
        <aside className="hidden lg:flex fixed left-4 top-4 bottom-4 w-16 bg-white rounded-[2rem] shadow-sm border border-slate-100 flex-col items-center py-6 z-50">
            <div className="w-10 h-10 bg-[#1E8E62] rounded-xl flex items-center justify-center text-white shadow-md mb-8">
                <LayoutGrid className="w-5 h-5" />
            </div>

            <nav className="flex flex-col gap-6 flex-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            title={item.name}
                            className={cn(
                                "p-2.5 rounded-xl transition-colors",
                                isActive
                                    ? "text-[#1E8E62] bg-[#1E8E62]/10"
                                    : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                        </Link>
                    );
                })}
            </nav>

            <div className="flex flex-col gap-4">
                <button
                    type="button"
                    className="text-slate-400 hover:text-red-500 p-2.5 rounded-xl transition-colors"
                    title="Logout"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </aside>
    );
}