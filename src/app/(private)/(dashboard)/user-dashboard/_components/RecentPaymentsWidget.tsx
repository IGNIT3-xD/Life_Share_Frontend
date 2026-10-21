"use client";

import Link from "next/link";
import { ArrowRight, CreditCard, Loader2 } from "lucide-react";
import { useFetchMyPayments } from "@/hooks/usePayment";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const formatPrice = (amount: string) => `৳${Number(amount).toLocaleString("en-BD")}`;
const capitalize = (s: string) => s?.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) || "—";

const statusStyles: Record<string, string> = {
    PAID: "bg-emerald-50 text-emerald-700",
    PENDING: "bg-amber-50 text-amber-700",
    FAILED: "bg-red-50 text-red-700",
    REFUNDED_PENDING: "bg-orange-50 text-orange-700",
    REFUNDED: "bg-blue-50 text-blue-700",
};

export function RecentPaymentsWidget({ dashboardBasePath }: { dashboardBasePath: string }) {
    const { data, isPending } = useFetchMyPayments({ rawLimit: 2, rawPage: 1 });
    const payments = data?.payment ?? [];

    return (
        <Card className="shadow-sm flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-base font-semibold">Recent Payments</CardTitle>
                    <CardDescription>Your latest transactions</CardDescription>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-[#B15A36] hover:text-[#9a4e2e] hover:bg-orange-50 -mr-2">
                    <Link href={`${dashboardBasePath}/my-payments`}>
                        View All <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent className="flex-1">
                {isPending ? (
                    <div className="flex justify-center items-center h-full py-10">
                        <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                    </div>
                ) : payments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-2">
                            <CreditCard className="w-5 h-5 text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-500">No payments yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4 mt-2">
                        {payments.map((p) => (
                            <div key={p.id} className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-900">
                                        {p.bkash_trx_id || p.merchant_invoice_number || "Transaction"}
                                    </span>
                                    <span className="text-xs text-slate-500">{p.payment_gateway}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-bold text-slate-900">{formatPrice(p.payment_amount)}</span>
                                    <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-md mt-1", statusStyles[p.payment_status])}>
                                        {capitalize(p.payment_status)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}