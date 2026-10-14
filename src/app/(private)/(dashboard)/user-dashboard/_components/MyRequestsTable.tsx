"use client";

import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { RequesterProp } from "@/components/RequesterCard";
import { useState } from "react";
import { ViewDetailsModal } from "./ViewDetailsModal";
import { UpdateRequestModal } from "./UpdateRequestModal";

// ---- Helpers ----
const formatBloodGroup = (group: string) =>
    group?.replace("_POS", "+").replace("_NEG", "-") || "N/A";

const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const urgencyStyles: Record<string, string> = {
    EMERGENCY: "bg-red-50 text-red-700 border-red-200",
    HIGH: "bg-orange-50 text-orange-700 border-orange-200",
    MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
    LOW: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const statusStyles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
};

const verificationStyles: Record<string, string> = {
    VERIFIED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    REJECTED: "bg-red-50 text-red-700 border-red-200",
};

const capitalize = (s: string) =>
    s.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

// ---- Component ----
type Props = {
    requests: RequesterProp[];
    onDeleteClick: (id: string) => void;
};

export function MyRequestsTable({ requests, onDeleteClick }: Props) {
    const [selectedRequest, setSelectedRequest] = useState<RequesterProp | null>(null);
    const [updateRequest, setUpdateRequest] = useState<RequesterProp | null>(null);

    return (
        <>
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-100 hover:bg-transparent">
                                <TableHead className="text-slate-400 font-medium text-xs pl-6">Patient</TableHead>
                                <TableHead className="text-slate-400 font-medium text-xs">Blood</TableHead>
                                <TableHead className="text-slate-400 font-medium text-xs">Units</TableHead>
                                <TableHead className="text-slate-400 font-medium text-xs">Location</TableHead>
                                <TableHead className="text-slate-400 font-medium text-xs">Urgency</TableHead>
                                <TableHead className="text-slate-400 font-medium text-xs">Status</TableHead>
                                <TableHead className="text-slate-400 font-medium text-xs">Verification</TableHead>
                                <TableHead className="text-slate-400 font-medium text-xs">Expires</TableHead>
                                <TableHead className="text-slate-400 font-medium text-xs text-right pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.map((req) => (
                                <TableRow key={req.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-900 text-sm">
                                                {req.patientName}
                                            </span>
                                            <span className="text-xs text-slate-400 font-mono">
                                                #{req.id.slice(0, 8).toUpperCase()}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-100 rounded-lg px-2.5 py-1 text-xs font-bold">
                                            {formatBloodGroup(req.blood_group)}
                                        </span>
                                    </TableCell>

                                    <TableCell className="text-sm font-semibold text-slate-700">
                                        {req.unit_required}
                                    </TableCell>

                                    <TableCell className="max-w-50">
                                        <span className="text-sm text-slate-600 truncate block" title={req.exact_location}>
                                            {req.exact_location}
                                        </span>
                                    </TableCell>

                                    <TableCell>
                                        <span className={cn(
                                            "inline-flex items-center text-[10px] font-semibold tracking-wider px-2 py-1 rounded-full border",
                                            urgencyStyles[req.urgency] || "bg-slate-100 text-slate-600 border-slate-200"
                                        )}>
                                            {capitalize(req.urgency)}
                                        </span>
                                    </TableCell>

                                    <TableCell>
                                        <span className={cn(
                                            "inline-flex items-center text-[10px] font-semibold tracking-wider px-2 py-1 rounded-full border",
                                            statusStyles[req.request_status] || "bg-slate-100 text-slate-600 border-slate-200"
                                        )}>
                                            {capitalize(req.request_status)}
                                        </span>
                                    </TableCell>

                                    <TableCell>
                                        <span className={cn(
                                            "inline-flex items-center text-[10px] font-semibold tracking-wider px-2 py-1 rounded-full border",
                                            verificationStyles[req.verificationStatus] || "bg-slate-100 text-slate-600 border-slate-200"
                                        )}>
                                            {capitalize(req.verificationStatus)}
                                        </span>
                                    </TableCell>

                                    <TableCell className="text-sm text-slate-500">
                                        {formatDate(req.expires_at)}
                                    </TableCell>

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
                                            <DropdownMenuContent align="end" className="w-44 font-graphik">
                                                <DropdownMenuItem asChild>
                                                    <button onClick={() => setSelectedRequest(req)} type="button" className="cursor-pointer">
                                                        <Eye className="w-4 h-4" />
                                                        View Details
                                                    </button>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <button onClick={() => setUpdateRequest(req)} type="button" className="cursor-pointer">
                                                        <Pencil className="w-4 h-4" />
                                                        Edit
                                                    </button>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => onDeleteClick(req.id)}
                                                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
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

            <ViewDetailsModal
                open={!!selectedRequest}
                onOpenChange={(open) => !open && setSelectedRequest(null)}
                request={selectedRequest}
            />

            <UpdateRequestModal
                open={!!updateRequest}
                onOpenChange={(open) => !open && setUpdateRequest(null)}
                request={updateRequest}
            />
        </>
    );
}