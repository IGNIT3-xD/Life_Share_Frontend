"use client";

import Image from "next/image";
import { MoreHorizontal, Pencil, Trash2, Clock } from "lucide-react";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Service } from "@/api/emergencyServices";

const formatPrice = (price: string) => {
    const n = Number(price);
    return isNaN(n) ? "—" : `৳${n.toLocaleString("en-BD")}`;
};

const statusStyles: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
    INACTIVE: "bg-slate-100 text-slate-600 border-slate-200",
};

type Props = {
    services: Service[];
    onEdit: (service: Service) => void;
    onDelete: (service: Service) => void;
};

export function HospitalServicesTable({ services, onEdit, onDelete }: Props) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-100 hover:bg-transparent">
                            <TableHead className="text-slate-400 font-medium text-xs pl-6">Service</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">Category</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">Price</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">Availability</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">Status</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs text-right pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.map((s) => (
                            <TableRow key={s.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                                <TableCell className="pl-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                                            {s.service_image ? (
                                                <Image src={s.service_image} alt={s.service_name} fill sizes="48px" className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300 text-[10px]">N/A</div>
                                            )}
                                        </div>
                                        <div className="flex flex-col min-w-0 max-w-50">
                                            <span className="font-semibold text-slate-900 text-sm truncate">{s.service_name}</span>
                                            <span className="text-xs text-slate-400 truncate">{s.description}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-100 rounded-full px-2.5 py-1">
                                        {s.service_category.replace(/_/g, " ")}
                                    </span>
                                </TableCell>
                                <TableCell className="text-sm font-bold text-slate-900">{formatPrice(s.price)}</TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {s.availability}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className={cn(
                                        "inline-flex items-center text-[10px] font-semibold tracking-wider px-2 py-1 rounded-full border",
                                        statusStyles[s.service_status] || "bg-slate-100 text-slate-600 border-slate-200"
                                    )}>
                                        {s.service_status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <DropdownMenu modal={false}>
                                        <DropdownMenuTrigger asChild>
                                            <button type="button" className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-44 font-graphik">
                                            <DropdownMenuItem asChild>
                                                <button onClick={() => onEdit(s)} type="button" className="cursor-pointer">
                                                    <Pencil className="w-4 h-4" /> Edit Service
                                                </button>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onDelete(s)} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                                                <Trash2 className="w-4 h-4" /> Delete Service
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