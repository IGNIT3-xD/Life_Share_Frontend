"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
    ArrowLeft,
    CheckCircle2,
    Home,
    ListChecks,
    Loader2,
    RefreshCw,
    XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ---- Inner component uses useSearchParams, must be wrapped in Suspense ----
function PaymentResultContent() {
    const searchParams = useSearchParams();
    const qc = useQueryClient();
    const status = searchParams.get("status") ?? "failure"; // fallback to failure

    const isSuccess = status === "success";
    const isCancelled = status === "cancel" || status === "cancelled";

    // Refresh bookings cache so the updated payment_status appears
    useEffect(() => {
        qc.invalidateQueries({ queryKey: ["my_bookings"] });
        qc.invalidateQueries({ queryKey: ["my_booking_details"] });
    }, [qc]);

    const config = isSuccess
        ? {
            title: "Payment Successful",
            subtitle:
                "Your payment has been confirmed. The service provider has been notified and will reach out shortly.",
            icon: <CheckCircle2 className="w-10 h-10 text-emerald-600" />,
            iconBg: "bg-emerald-50 border-emerald-100",
            accent: "text-emerald-600",
            badge: "Success",
            badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        }
        : isCancelled
            ? {
                title: "Payment Cancelled",
                subtitle:
                    "You cancelled the payment before it was completed. No amount has been charged.",
                icon: <XCircle className="w-10 h-10 text-amber-600" />,
                iconBg: "bg-amber-50 border-amber-100",
                accent: "text-amber-600",
                badge: "Cancelled",
                badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
            }
            : {
                title: "Payment Failed",
                subtitle:
                    "We couldn't complete your payment. No amount has been charged. You can try again from your bookings page.",
                icon: <XCircle className="w-10 h-10 text-red-600" />,
                iconBg: "bg-red-50 border-red-100",
                accent: "text-red-600",
                badge: "Failed",
                badgeBg: "bg-red-50 text-red-700 border-red-200",
            };

    return (
        <div className="min-h-dvh bg-[#F8F9FA] font-graphik flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-lg">
                {/* Card */}
                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                    {/* Top accent strip */}
                    <div
                        className={cn(
                            "h-1.5 w-full",
                            isSuccess
                                ? "bg-linear-to-r from-emerald-400 to-emerald-600"
                                : isCancelled
                                    ? "bg-linear-to-r from-amber-400 to-amber-600"
                                    : "bg-linear-to-r from-red-400 to-red-600"
                        )}
                    />

                    <div className="p-8 md:p-10 text-center">
                        {/* Status Badge */}
                        <div className="flex justify-center mb-6">
                            <span
                                className={cn(
                                    "inline-flex items-center text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border",
                                    config.badgeBg
                                )}
                            >
                                {config.badge}
                            </span>
                        </div>

                        {/* Icon */}
                        <div
                            className={cn(
                                "w-20 h-20 mx-auto mb-6 rounded-full border-2 flex items-center justify-center",
                                config.iconBg
                            )}
                        >
                            {config.icon}
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                            {config.title}
                        </h1>

                        {/* Subtitle */}
                        <p className="mt-3 text-sm md:text-base text-slate-500 leading-relaxed max-w-md mx-auto">
                            {config.subtitle}
                        </p>

                        {/* Divider */}
                        <div className="my-8 border-t border-dashed border-slate-200" />

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                            <Button
                                asChild
                                variant="outline"
                                className="h-11 gap-2 border-slate-200"
                            >
                                <Link href="/">
                                    <Home className="w-4 h-4" />
                                    Back to Home
                                </Link>
                            </Button>

                            {isSuccess ? (
                                <Button
                                    asChild
                                    className="h-11 gap-2 bg-[#B15A36] hover:bg-[#9a4e2e] text-white"
                                >
                                    <Link href="/user-dashboard/my-bookings">
                                        <ListChecks className="w-4 h-4" />
                                        View My Bookings
                                    </Link>
                                </Button>
                            ) : (
                                <Button
                                    asChild
                                    className="h-11 gap-2 bg-[#B15A36] hover:bg-[#9a4e2e] text-white"
                                >
                                    <Link href="/user-dashboard/my-bookings">
                                        <RefreshCw className="w-4 h-4" />
                                        Try Again
                                    </Link>
                                </Button>
                            )}
                        </div>

                        {/* Help text */}
                        <p className="mt-6 text-xs text-slate-400">
                            Need help? Contact our support team at{" "}
                            <a
                                href="mailto:support@lifeshare.com"
                                className="text-slate-600 font-medium hover:underline"
                            >
                                support@lifeshare.com
                            </a>
                        </p>
                    </div>
                </div>

                {/* Back link */}
                <div className="flex justify-center mt-6">
                    <Link
                        href="/emergency-services"
                        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Browse emergency services
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function PaymentResultPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-dvh bg-[#F8F9FA] flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </div>
            }
        >
            <PaymentResultContent />
        </Suspense>
    );
}