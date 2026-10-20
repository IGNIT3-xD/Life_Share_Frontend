"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle2, XCircle, Clock, User, Receipt, Hash, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePaymentDetails } from "@/hooks/usePayment";

const formatPrice = (amount: string, currency: string) => {
    const n = Number(amount);
    return Number.isNaN(n) ? "—" : `৳${n.toLocaleString("en-BD")}`;
};

const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleString("en-US", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const capitalize = (s: string) => s?.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) || "—";

const statusConfig: Record<string, { color: string, icon: React.ReactNode }> = {
    PAID: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <CheckCircle2 className="w-4 h-4" /> },
    PENDING: { color: "bg-amber-50 text-amber-700 border-amber-200", icon: <Clock className="w-4 h-4" /> },
    FAILED: { color: "bg-red-50 text-red-700 border-red-200", icon: <XCircle className="w-4 h-4" /> },
    REFUNDED: { color: "bg-blue-50 text-blue-700 border-blue-200", icon: <Receipt className="w-4 h-4" /> },
};

type Props = { open: boolean; onOpenChange: (open: boolean) => void; paymentId: string | null; };

export function PaymentDetailsModal({ open, onOpenChange, paymentId }: Props) {
    const { data, isPending, error } = usePaymentDetails(paymentId);

    const config = data ? statusConfig[data.payment_status] || statusConfig.PENDING : statusConfig.PENDING;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md font-graphik p-0 overflow-hidden">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100 bg-slate-50/50">
                    <DialogTitle className="font-semibold text-lg">Payment Details</DialogTitle>
                    <DialogDescription>Transaction ID #{paymentId}</DialogDescription>
                </DialogHeader>

                {isPending && <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>}
                {error && <div className="p-6 text-center text-sm text-slate-500">Could not load payment details.</div>}

                {data && (
                    <div className="p-6 space-y-5">
                        {/* Amount & Status Header */}
                        <div className="flex flex-col items-center justify-center p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Amount Paid</p>
                            <p className="text-3xl font-black text-slate-900 tracking-tight">{formatPrice(data.payment_amount, data.currency)}</p>

                            <span className={cn("mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border", config.color)}>
                                {config.icon} {capitalize(data.payment_status)}
                            </span>
                        </div>

                        {/* Service Info */}
                        {data.emergencyService && (
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Service Purchased</p>
                                <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white">
                                    <div className="relative w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                                        {data.emergencyService.service_image ? (
                                            <Image src={data.emergencyService.service_image}
                                                alt="Service"
                                                fill
                                                className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">N/A</div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{data.emergencyService.service_name}</p>
                                        <p className="text-xs text-slate-500">{capitalize(data.emergencyService.service_category)}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payer Info */}
                        {data.user && (
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payer Information</p>
                                <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white">
                                    <div className="relative w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                                        {data.user.profile_pic ? (
                                            <Image src={data.user.profile_pic} alt="User" fill className="object-cover" />
                                        ) : (
                                            <User className="w-5 h-5 text-slate-400" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-slate-900 truncate">{data.user.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{data.user.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Transaction Details Grid */}
                        <div className="pt-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Transaction Info</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="p-2 bg-slate-50 rounded-lg">
                                    <span className="text-slate-400 block mb-0.5">Gateway</span>
                                    <span className="font-semibold text-slate-800">{capitalize(data.payment_gateway)}</span>
                                </div>
                                <div className="p-2 bg-slate-50 rounded-lg">
                                    <span className="text-slate-400 block mb-0.5">Date</span>
                                    <span className="font-semibold text-slate-800">{formatDate(data.paid_at || data.created_at)}</span>
                                </div>
                                {data.bkash_trx_id && (
                                    <div className="p-2 bg-slate-50 rounded-lg col-span-2">
                                        <span className="text-slate-400 block mb-0.5 items-center gap-1"><Hash className="w-3 h-3" /> bKash TrxID</span>
                                        <span className="font-mono font-semibold text-slate-800">{data.bkash_trx_id}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}