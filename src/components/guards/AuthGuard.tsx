"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useMe } from "@/hooks/useAuth";
import { getDashboardUrl } from "@/constants/dashboard-nav";

type AuthGuardProps = {
    roles?: string[];
    children: React.ReactNode;
};

export function AuthGuard({ roles, children }: AuthGuardProps) {
    const { data, error, isPending } = useMe();
    const router = useRouter();

    useEffect(() => {
        if (isPending) return;

        if (error || !data) {
            router.replace("/login");
            return;
        }

        if (roles && !roles.includes(data.role)) {
            toast.warning("Access restricted", {
                description: "You don't have permission to view this page.",
            });
            router.replace(getDashboardUrl(data.role));
        }
    }, [isPending, error, data, roles, router]);

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
                <Loader2 className="w-8 h-8 animate-spin text-[#B15A36]" />
            </div>
        );
    }

    if (!data) return null;

    if (roles && !roles.includes(data.role)) return null;

    return <>{children}</>;
}
