"use client";

import { Eye, MoreHorizontal, Pencil, Trash2, Building2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { HospitalProfileResponse } from "@/api/hospital";

const statusStyles: Record<string, string> = {
    VERIFIED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    IN_PROGRESS: "bg-amber-50 text-amber-700 border-amber-200",
    NOT_ELIGIBLE: "bg-red-50 text-red-700 border-red-200",
};

const capitalize = (s: string) => s?.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) || "—";

type Props = {
    hospitals: HospitalProfileResponse[];
    onView: (h: HospitalProfileResponse) => void;
    onUpdateStatus: (h: HospitalProfileResponse) => void;
    onDelete: (h: HospitalProfileResponse) => void;
};

export function AdminHospitalsTable({ hospitals, onView, onUpdateStatus, onDelete }: Props) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-100 hover:bg-transparent">
                            <TableHead className="text-slate-400 font-medium text-xs pl-6">Hospital Name</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">License</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">Contact</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">Status</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs text-right pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {hospitals.map((h) => (
                            <TableRow key={h.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                                <TableCell className="pl-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                                            <Building2 className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-900 text-sm">{h.user.name}</span>
                                            <span className="text-xs text-slate-400 font-mono">#{h.id.slice(0, 8).toUpperCase()}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm font-medium text-slate-700">
                                    {h.license_number}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-slate-700">{h.user.email}</span>
                                        <span className="text-xs text-slate-400">{h.user.phone || "No phone"}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className={cn("inline-flex items-center text-[10px] font-semibold tracking-wider px-2 py-1 rounded-full border", statusStyles[h.hospital_status] || "bg-slate-100")}>
                                        {capitalize(h.hospital_status)}
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
                                            <DropdownMenuItem onClick={() => onView(h)} className="cursor-pointer">
                                                <Eye className="w-4 h-4" /> View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onUpdateStatus(h)} className="cursor-pointer">
                                                <Pencil className="w-4 h-4" /> Update Status
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => onDelete(h)} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                                                <Trash2 className="w-4 h-4" /> Delete Profile
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