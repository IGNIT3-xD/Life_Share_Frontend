"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardNavConfig } from "@/constants/dashboard-nav";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function MobileSidebar({ role }: { role: string }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const navItems = dashboardNavConfig[role] ?? [];

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button
                    type="button"
                    aria-label="Open menu"
                    className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </SheetTrigger>

            <SheetContent side="left" className="w-72 p-0 font-graphik">
                <SheetHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
                    <SheetTitle className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#1E8E62] rounded-lg flex items-center justify-center text-white">
                            <LayoutGrid className="w-4 h-4" />
                        </div>
                        <span className="text-base">Life Share</span>
                    </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-1 p-3">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "text-[#1E8E62] bg-[#1E8E62]/10"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto p-3 border-t border-slate-100">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
                        type="button"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}