"use client";

import { Eye, MoreHorizontal, Heart } from "lucide-react";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { DonationRequest } from "@/api/donation";

// ---- Helpers ----
const formatBloodGroup = (g: string) =>
    g?.replace("_POS", "+").replace("_NEG", "-") || "N/A";

const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const capitalize = (s: string) =>
    s
        ?.replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase()) || "—";

const donationStatusStyles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    SCHEDULED: "bg-blue-50 text-blue-700 border-blue-200",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
    EXPIRED: "bg-red-50 text-red-700 border-red-200",
};

// ---- Component ----
type Props = {
    donations: DonationRequest[];
    onViewDetails: (donation: DonationRequest) => void;
};

export function MyDonationsTable({ donations, onViewDetails }: Props) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-100 hover:bg-transparent">
                            <TableHead className="text-slate-400 font-medium text-xs pl-6">
                                Donor
                            </TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">
                                Patient
                            </TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">
                                Blood
                            </TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">
                                Scheduled
                            </TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">
                                Status
                            </TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">
                                Location
                            </TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs text-right pr-6">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {donations.map((d) => {
                            const donorInitial =
                                d.donor.email?.charAt(0).toUpperCase() || "?";

                            return (
                                <TableRow
                                    key={d.id}
                                    className="border-slate-50 hover:bg-slate-50/50 transition-colors"
                                >
                                    {/* Donor */}
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-red-500 flex items-center justify-center shrink-0">
                                                <span className="text-white text-sm font-bold">
                                                    {donorInitial}
                                                </span>
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-semibold text-slate-900 text-sm truncate max-w-35">
                                                    {d.donor.email.split("@")[0]}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    {d.donor.location}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Patient */}
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-slate-900">
                                                {d.requester.patientName}
                                            </span>
                                            <span className="text-xs text-slate-400 font-mono">
                                                #{d.requester.id.slice(0, 8).toUpperCase()}
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* Blood Group */}
                                    <TableCell>
                                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-100 rounded-lg px-2.5 py-1 text-xs font-bold">
                                            {formatBloodGroup(d.donor.blood_group)}
                                        </span>
                                    </TableCell>

                                    {/* Scheduled */}
                                    <TableCell className="text-sm text-slate-600">
                                        {formatDateTime(d.scheduled_at)}
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell>
                                        <span
                                            className={cn(
                                                "inline-flex items-center text-[10px] font-semibold tracking-wider px-2 py-1 rounded-full border",
                                                donationStatusStyles[d.donationStatus] ||
                                                "bg-slate-100 text-slate-600 border-slate-200"
                                            )}
                                        >
                                            {capitalize(d.donationStatus)}
                                        </span>
                                    </TableCell>

                                    {/* Location */}
                                    <TableCell className="max-w-50">
                                        <span
                                            className="text-sm text-slate-600 truncate block"
                                            title={d.requester.exact_location}
                                        >
                                            {d.requester.exact_location}
                                        </span>
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell className="text-right pr-6">
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
                                                        onClick={() => onViewDetails(d)}
                                                        type="button"
                                                        className="cursor-pointer"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View Details
                                                    </button>
                                                </DropdownMenuItem>

                                                {d.donor.id && (
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={`/donors/${d.donor.id}`}
                                                            className="cursor-pointer"
                                                        >
                                                            <Heart className="w-4 h-4" />
                                                            View Donor
                                                        </Link>
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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