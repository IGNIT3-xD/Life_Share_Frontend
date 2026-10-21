"use client";

import { MoreHorizontal, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Payment } from "@/api/payment";

const formatPrice = (amount: string) => `৳${Number(amount).toLocaleString("en-BD")}`;
const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
const capitalize = (s: string) => s?.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) || "—";

const statusStyles: Record<string, string> = {
    PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    FAILED: "bg-red-50 text-red-700 border-red-200",
    REFUNDED: "bg-blue-50 text-blue-700 border-blue-200",
    REFUNDED_PENDING: "bg-orange-50 text-orange-700 border-orange-200",
};

type Props = {
    payments: Payment[];
    onView: (p: Payment) => void;
};

export function MyPaymentsTable({ payments, onView }: Props) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-100 hover:bg-transparent">
                            <TableHead className="text-slate-400 font-medium text-xs pl-6">Transaction ID</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">Date</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">Gateway</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">Amount</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">Status</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs text-right pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments.map((p) => (
                            <TableRow key={p.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                                <TableCell className="pl-6 py-4">
                                    <span className="font-semibold text-slate-900 text-sm font-mono">
                                        {p.bkash_trx_id || p.merchant_invoice_number || p.id.slice(0, 8).toUpperCase()}
                                    </span>
                                </TableCell>
                                <TableCell className="text-sm text-slate-600">
                                    {formatDate(p.paid_at || p.created_at)}
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center gap-1 bg-pink-50 text-pink-700 border border-pink-100 rounded-lg px-2.5 py-1 text-xs font-bold">
                                        {capitalize(p.payment_gateway)}
                                    </span>
                                </TableCell>
                                <TableCell className="text-sm font-bold text-slate-900">
                                    {formatPrice(p.payment_amount)}
                                </TableCell>
                                <TableCell>
                                    <span className={cn("inline-flex items-center text-[10px] font-semibold tracking-wider px-2 py-1 rounded-full border", statusStyles[p.payment_status] || "bg-slate-100")}>
                                        {capitalize(p.payment_status)}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <DropdownMenu modal={false}>
                                        <DropdownMenuTrigger asChild>
                                            <button type="button" className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 font-graphik">
                                            <DropdownMenuItem onClick={() => onView(p)} className="cursor-pointer">
                                                <Eye className="w-4 h-4" /> View Details
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}