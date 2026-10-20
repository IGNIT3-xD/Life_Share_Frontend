"use client";

import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { RequesterProp } from "@/components/RequesterCard";

const formatBloodGroup = (g: string) => g?.replace("_POS", "+").replace("_NEG", "-") || "N/A";
const capitalize = (s: string) => s?.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) || "—";

const urgencyStyles: Record<string, string> = {
    EMERGENCY: "bg-red-50 text-red-700 border-red-200",
    HIGH: "bg-orange-50 text-orange-700 border-orange-200",
    MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
    LOW: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const verificationStyles: Record<string, string> = {
    VERIFIED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    REJECTED: "bg-red-50 text-red-700 border-red-200",
};

type Props = {
    requests: RequesterProp[];
    onView: (r: RequesterProp) => void;
    onUpdateStatus: (r: RequesterProp) => void;
    onDelete: (r: RequesterProp) => void;
};

export function AdminRequestersTable({ requests, onView, onUpdateStatus, onDelete }: Props) {
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
                            <TableHead className="text-slate-400 font-medium text-xs">Verification</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs text-right pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((r) => (
                            <TableRow key={r.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                                <TableCell className="pl-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-900 text-sm">{r.patientName}</span>
                                        <span className="text-xs text-slate-400 font-mono">#{r.id.slice(0, 8).toUpperCase()}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-100 rounded-lg px-2.5 py-1 text-xs font-bold">
                                        {formatBloodGroup(r.blood_group)}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className={cn("inline-flex items-center text-[10px] font-semibold tracking-wider px-2 py-1 rounded-full border", urgencyStyles[r.urgency] || "bg-slate-100")}>
                                        {capitalize(r.urgency)}
                                    </span>
                                </TableCell>
                                <TableCell className="max-w-45">
                                    <span className="text-sm text-slate-600 truncate block" title={r.exact_location}>{r.exact_location}</span>
                                </TableCell>
                                <TableCell>
                                    <span className={cn("inline-flex items-center text-[10px] font-semibold tracking-wider px-2 py-1 rounded-full border", verificationStyles[r.verificationStatus] || "bg-slate-100")}>
                                        {capitalize(r.verificationStatus)}
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
                                            <DropdownMenuItem onClick={() => onView(r)} className="cursor-pointer">
                                                <Eye className="w-4 h-4" /> View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onUpdateStatus(r)} className="cursor-pointer">
                                                <Pencil className="w-4 h-4" /> Update Status
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => onDelete(r)} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                                                <Trash2 className="w-4 h-4" /> Delete Request
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