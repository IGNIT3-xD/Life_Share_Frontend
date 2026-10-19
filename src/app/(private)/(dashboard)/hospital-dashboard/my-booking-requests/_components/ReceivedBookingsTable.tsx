"use client";

import { Eye, MoreHorizontal, CheckCircle2, XCircle, Flag } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { EmergencyServiceBookingProp } from "@/api/booking";

const formatDateTime = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleString("en-US", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const formatPrice = (amount: number | string) => {
    const n = Number(amount);
    return isNaN(n) ? "—" : `৳${n.toLocaleString("en-BD")}`;
};

const capitalize = (s: string) => s?.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) || "—";

const statusStyles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    ACCEPTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    COMPLETED: "bg-blue-50 text-blue-700 border-blue-200",
    CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
};

const paymentStyles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
    FAILED: "bg-red-50 text-red-700 border-red-200",
};

type Props = {
    bookings: EmergencyServiceBookingProp[];
    onView: (b: EmergencyServiceBookingProp) => void;
    onAction: (b: EmergencyServiceBookingProp, action: "ACCEPTED" | "COMPLETED" | "CANCELLED") => void;
};

export function ReceivedBookingsTable({ bookings, onView, onAction }: Props) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-100 hover:bg-transparent">
                            <TableHead className="text-slate-400 font-medium text-xs pl-6">Patient</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">Location</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">Scheduled</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">Amount</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">Status</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">Payment</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs text-right pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.map((b) => {
                            const isPending = b.booking_status === "PENDING";
                            const isAccepted = b.booking_status === "ACCEPTED" || b.booking_status === 'CONFIRMED';
                            const isFinished = ["COMPLETED", "CANCELLED"].includes(b.booking_status);

                            return (
                                <TableRow key={b.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-900 text-sm">{b.patient_name}</span>
                                            <span className="text-xs text-slate-400 font-mono">#{b.id.slice(0, 8).toUpperCase()}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-45">
                                        <span className="text-sm text-slate-600 truncate block" title={b.emergency_location}>{b.emergency_location}</span>
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-600">{formatDateTime(b.scheduled_at)}</TableCell>
                                    <TableCell className="text-sm font-bold text-slate-900">{formatPrice(b.payment_amount)}</TableCell>
                                    <TableCell>
                                        <span className={cn("inline-flex items-center text-[10px] font-semibold tracking-wider px-2 py-1 rounded-full border", statusStyles[b.booking_status] || "bg-slate-100")}>
                                            {capitalize(b.booking_status)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn("inline-flex items-center text-[10px] font-semibold tracking-wider px-2 py-1 rounded-full border", paymentStyles[b.payment_status] || "bg-slate-100")}>
                                            {capitalize(b.payment_status)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* Quick Actions for Pending */}
                                            {isPending && (
                                                <>
                                                    <button onClick={() => onAction(b, "ACCEPTED")} className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 text-xs font-semibold transition-colors">
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                                                    </button>
                                                    <button onClick={() => onAction(b, "CANCELLED")} className="hidden sm:inline-flex items-center gap-1 rounded-full bg-red-50 text-red-700 hover:bg-red-100 px-3 py-1.5 text-xs font-semibold transition-colors">
                                                        <XCircle className="w-3.5 h-3.5" /> Reject
                                                    </button>
                                                </>
                                            )}

                                            <DropdownMenu modal={false}>
                                                <DropdownMenuTrigger asChild>
                                                    <button type="button" className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 font-graphik">
                                                    <DropdownMenuItem onClick={() => onView(b)} className="cursor-pointer">
                                                        <Eye className="w-4 h-4" /> View Details
                                                    </DropdownMenuItem>

                                                    {isAccepted && (
                                                        <DropdownMenuItem onClick={() => onAction(b, "COMPLETED")} className="text-blue-600 focus:text-blue-600 focus:bg-blue-50 cursor-pointer">
                                                            <Flag className="w-4 h-4" /> Mark as Completed
                                                        </DropdownMenuItem>
                                                    )}

                                                    {isAccepted && (
                                                        <DropdownMenuItem onClick={() => onAction(b, "CANCELLED")} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                                                            <XCircle className="w-4 h-4" /> Cancel Booking
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}