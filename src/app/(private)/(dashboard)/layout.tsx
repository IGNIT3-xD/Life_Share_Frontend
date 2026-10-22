"use client";

import { useMe } from "@/hooks/useAuth";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { usePathname } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Loader2 } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data, isPending } = useMe();
    const pathname = usePathname();

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
                <Loader2 className="w-8 h-8 animate-spin text-[#B15A36]" />
            </div>
        );
    }

    if (!data) return null;

    // Generate a simple page title based on the URL for the breadcrumb
    const pageTitle = pathname.split("/").pop()?.replace(/-/g, " ") || "Dashboard";
    const capitalizedTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);

    return (
        <DashboardProvider user={data}>
            <SidebarProvider>
                <AppSidebar role={data.role} />
                <SidebarInset className="bg-[#F8F9FA] font-graphik">

                    {/* Top Header with Trigger and Breadcrumbs */}
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1 text-slate-500 hover:text-slate-900" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href={`/${data.role.toLowerCase()}-dashboard`}>
                                            {data.role.charAt(0) + data.role.slice(1).toLowerCase()} Dashboard
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    {pageTitle !== "Dashboard" && (
                                        <>
                                            <BreadcrumbSeparator className="hidden md:block" />
                                            <BreadcrumbItem>
                                                <BreadcrumbPage className="capitalize">{capitalizedTitle}</BreadcrumbPage>
                                            </BreadcrumbItem>
                                        </>
                                    )}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>

                    {/* Main Content Area */}
                    <main className="flex-1 p-4 md:p-6 lg:p-6">
                        {children}
                    </main>

                </SidebarInset>
            </SidebarProvider>
        </DashboardProvider>
    );
}