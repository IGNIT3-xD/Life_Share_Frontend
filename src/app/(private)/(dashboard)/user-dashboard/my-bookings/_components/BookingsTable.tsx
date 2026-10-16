"use client";

import {
    Eye, MoreHorizontal, Pencil, Trash2, XCircle,
} from "lucide-react";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { EmergencyServiceBookingProp } from "@/api/booking";
import { PayNowButton } from "../../../_components/PayNowButton";

// ---- Helpers ----
const formatDateTime = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleString("en-US", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
};

const formatPrice = (amount: number | string) => {
    const n = Number(amount);
    return Number.isNaN(n) ? "—" : `৳${n.toLocaleString("en-BD")}`;
};

const capitalize = (s: string) =>
    s?.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) || "—";

const bookingStatusStyles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
    ACCEPTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
    FAILED: "bg-red-50 text-red-700 border-red-200",
};

const paymentStatusStyles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
    FAILED: "bg-red-50 text-red-700 border-red-200",
    REFUNDED: "bg-blue-50 text-blue-700 border-blue-200",
    REFUNDED_PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
};

const LOCKED_STATUSES = ["CANCELLED", "COMPLETED", "FAILED"];

type Props = {
    bookings: EmergencyServiceBookingProp[];
    onViewDetails: (b: EmergencyServiceBookingProp) => void;
    onEdit: (b: EmergencyServiceBookingProp) => void;
    onCancel: (b: EmergencyServiceBookingProp) => void;
    onDelete: (b: EmergencyServiceBookingProp) => void;
};

export function BookingsTable({
    bookings, onViewDetails, onEdit, onCancel, onDelete,
}: Props) {
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
                            <TableHead className="text-slate-400 font-medium text-xs">Booking</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">Payment</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs text-right pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.map((b) => {
                            const isLocked = LOCKED_STATUSES.includes(b.booking_status);

                            return (
                                <TableRow
                                    key={b.id}
                                    className="border-slate-50 hover:bg-slate-50/50 transition-colors"
                                >
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-900 text-sm">
                                                {b.patient_name}
                                            </span>
                                            <span className="text-xs text-slate-400 font-mono">
                                                #{b.id.slice(0, 8).toUpperCase()}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell className="max-w-45">
                                        <span className="text-sm text-slate-600 truncate block" title={b.emergency_location}>
                                            {b.emergency_location}
                                        </span>
                                    </TableCell>

                                    <TableCell className="text-sm text-slate-600">
                                        {formatDateTime(b.scheduled_at)}
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900">
                                                {formatPrice(b.payment_amount)}
                                            </span>
                                            <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                                                {b.payment_via}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <span className={cn(
                                            "inline-flex items-center text-[10px] font-semibold tracking-wider px-2 py-1 rounded-full border",
                                            bookingStatusStyles[b.booking_status] || "bg-slate-100 text-slate-600 border-slate-200"
                                        )}>
                                            {capitalize(b.booking_status)}
                                        </span>
                                    </TableCell>

                                    <TableCell>
                                        <span className={cn(
                                            "inline-flex items-center text-[10px] font-semibold tracking-wider px-2 py-1 rounded-full border",
                                            paymentStatusStyles[b.payment_status] || "bg-slate-100 text-slate-600 border-slate-200"
                                        )}>
                                            {capitalize(b.payment_status)}
                                        </span>
                                    </TableCell>

                                    <TableCell className="text-right pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <PayNowButton booking={b} />

                                            <DropdownMenu modal={false}>
                                                <DropdownMenuTrigger asChild>
                                                    <button
                                                        type="button"
                                                        className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                                                        aria-label="Actions"
                                                    >
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 font-graphik">
                                                    <DropdownMenuItem asChild>
                                                        <button
                                                            onClick={() => onViewDetails(b)}
                                                            type="button"
                                                            className="cursor-pointer"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            Details
                                                        </button>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem asChild disabled={isLocked}>
                                                        <button
                                                            onClick={() => !isLocked && onEdit(b)}
                                                            type="button"
                                                            className={cn(
                                                                "w-full",
                                                                isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                                                            )}
                                                            disabled={isLocked}
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                            Edit
                                                        </button>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        asChild
                                                        disabled={isLocked}
                                                        className="text-amber-600 focus:text-amber-700 focus:bg-amber-50"
                                                    >
                                                        <button
                                                            onClick={() => !isLocked && onCancel(b)}
                                                            type="button"
                                                            className={cn(
                                                                "w-full",
                                                                isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                                                            )}
                                                            disabled={isLocked}
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                            Cancel Booking
                                                        </button>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        onClick={() => onDelete(b)}
                                                        className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete Booking
                                                    </DropdownMenuItem>
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