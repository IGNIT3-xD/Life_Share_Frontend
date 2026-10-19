"use client";

import { Eye, MoreHorizontal, CheckCircle2, XCircle, CalendarClock, Flag } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { DonationRequestProp } from "@/api/donation";

const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
const formatBloodGroup = (g: string) => g?.replace("_POS", "+").replace("_NEG", "-") || "N/A";
const capitalize = (s: string) => s?.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) || "—";

const statusStyles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    ACCEPTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    SCHEDULED: "bg-blue-50 text-blue-700 border-blue-200",
    COMPLETED: "bg-indigo-50 text-indigo-700 border-indigo-200",
    DONOR_CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

const urgencyStyles: Record<string, string> = {
    EMERGENCY: "bg-red-50 text-red-700 border-red-200",
    HIGH: "bg-orange-50 text-orange-700 border-orange-200",
    MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
    LOW: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

type Props = {
    donations: DonationRequestProp[];
    onView: (d: DonationRequestProp) => void;
    onAction: (d: DonationRequestProp, action: "ACCEPTED" | "SCHEDULED" | "COMPLETED" | "DONOR_CANCELLED") => void;
};

export function ReceivedDonationsTable({ donations, onView, onAction }: Props) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-100 hover:bg-transparent">
                            <TableHead className="text-slate-400 font-medium text-xs pl-6">Patient</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">Blood</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">Urgency</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">Location</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">Status</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs text-right pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {donations.map((d) => {
                            const isPending = d.donationStatus === "PENDING";
                            const isAccepted = d.donationStatus === "ACCEPTED";
                            const isScheduled = d.donationStatus === "SCHEDULED";

                            return (
                                <TableRow key={d.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-900 text-sm">{d.requester.patientName}</span>
                                            <span className="text-xs text-slate-400 font-mono">#{d.id.slice(0, 8).toUpperCase()}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-100 rounded-lg px-2 py-1 text-xs font-bold">
                                            {formatBloodGroup(d.requester.blood_group)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn("inline-flex items-center text-[10px] font-semibold tracking-wider px-2 py-1 rounded-full border", urgencyStyles[d.requester.urgency] || "bg-slate-100")}>
                                            {capitalize(d.requester.urgency)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="max-w-50">
                                        <span className="text-sm text-slate-600 truncate block" title={d.requester.exact_location}>{d.requester.exact_location}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn("inline-flex items-center text-[10px] font-semibold tracking-wider px-2 py-1 rounded-full border", statusStyles[d.donationStatus] || "bg-slate-100")}>
                                            {capitalize(d.donationStatus)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* Quick Actions for Pending */}
                                            {isPending && (
                                                <button type="button" onClick={() => onAction(d, "ACCEPTED")} className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 text-xs font-semibold transition-colors">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                                                </button>
                                            )}

                                            <DropdownMenu modal={false}>
                                                <DropdownMenuTrigger asChild>
                                                    <button type="button" className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-52 font-graphik">
                                                    <DropdownMenuItem onClick={() => onView(d)} className="cursor-pointer">
                                                        <Eye className="w-4 h-4" /> View Details
                                                    </DropdownMenuItem>

                                                    {isAccepted && (
                                                        <DropdownMenuItem onClick={() => onAction(d, "SCHEDULED")} className="text-blue-600 focus:text-blue-600 focus:bg-blue-50 cursor-pointer">
                                                            <CalendarClock className="w-4 h-4" /> Mark as Scheduled
                                                        </DropdownMenuItem>
                                                    )}

                                                    {(isAccepted || isScheduled) && (
                                                        <DropdownMenuItem onClick={() => onAction(d, "COMPLETED")} className="text-indigo-600 focus:text-indigo-600 focus:bg-indigo-50 cursor-pointer">
                                                            <Flag className="w-4 h-4" /> Mark as Completed
                                                        </DropdownMenuItem>
                                                    )}

                                                    {!["COMPLETED", "DONOR_CANCELLED"].includes(d.donationStatus) && (
                                                        <DropdownMenuItem onClick={() => onAction(d, "DONOR_CANCELLED")} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                                                            <XCircle className="w-4 h-4" /> Cancel Donation
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