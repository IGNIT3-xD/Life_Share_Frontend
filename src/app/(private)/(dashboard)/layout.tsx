"use client";

import { useMe } from "@/hooks/useAuth";
import { DashboardSidebar } from "./_components/DashboardSidebar";
import { MobileSidebar } from "./_components/MobileSidebar";
import { DashboardSkeleton } from "./_components/DashboarsSkleton";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data, isPending, error } = useMe();
    const router = useRouter();

    // Redirect in an effect, not during render
    useEffect(() => {
        if (error || (!isPending && !data)) {
            router.replace("/login");
        }
    }, [error, isPending, data, router]);

    if (isPending) return <DashboardSkeleton />;
    if (!data) return null;

    return (
        <DashboardProvider user={data}>
            <div className="flex min-h-screen bg-[#F8F9FA] font-graphik">
                {/* ---- Desktop Sidebar (lg and up) ---- */}
                <DashboardSidebar role={data.role} />

                {/* ---- Main Content ---- */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* ---- Mobile Top Bar (below lg) ---- */}
                    <header className="lg:hidden sticky top-16 z-40 flex items-center gap-3 bg-[#F8F9FA]/95 backdrop-blur-sm border-b border-slate-200 px-4 py-3">
                        <MobileSidebar role={data.role} />
                    </header>

                    {/* ---- Content ---- */}
                    <main className="flex-1 p-4 sm:p-6 lg:ml-24">
                        {children}
                    </main>
                </div>
            </div>
        </DashboardProvider>
    );
}