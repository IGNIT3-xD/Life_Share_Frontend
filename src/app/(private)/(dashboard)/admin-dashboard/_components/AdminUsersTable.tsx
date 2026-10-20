"use client";

import Image from "next/image";
import { MoreHorizontal, Eye, Pencil } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { UserData } from "@/api/auth";

const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
const capitalize = (s: string) => s?.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) || "—";

const roleStyles: Record<string, string> = {
    ADMIN: "bg-purple-50 text-purple-700 border-purple-200",
    SUPER_ADMIN: "bg-indigo-50 text-indigo-700 border-indigo-200",
    HOSPITAL: "bg-blue-50 text-blue-700 border-blue-200",
    DONOR: "bg-red-50 text-red-700 border-red-200",
    USER: "bg-slate-100 text-slate-700 border-slate-200",
};

type Props = {
    users: UserData[];
    onView: (u: UserData) => void;
    onUpdateStatus: (u: UserData) => void;
};

export function AdminUsersTable({ users, onView, onUpdateStatus }: Props) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-100 hover:bg-transparent">
                            <TableHead className="text-slate-400 font-medium text-xs pl-6">User</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">Role</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">Gender</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">Joined</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs">Status</TableHead>
                            <TableHead className="text-slate-400 font-medium text-xs text-right pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((u) => {
                            const initial = u.name?.charAt(0).toUpperCase() || "?";
                            return (
                                <TableRow key={u.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                                                {u.profile_pic ? (
                                                    <Image src={u.profile_pic} alt={u.name} fill className="object-cover" />
                                                ) : (
                                                    <span className="text-slate-500 text-xs font-bold">{initial}</span>
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-semibold text-slate-900 text-sm truncate">{u.name}</span>
                                                <span className="text-xs text-slate-400 truncate max-w-37.5">{u.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn("inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border", roleStyles[u.role] || "bg-slate-100")}>
                                            {capitalize(u.role)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-600">{capitalize(u.gender)}</TableCell>
                                    <TableCell className="text-sm text-slate-600">{formatDate(u.created_at)}</TableCell>
                                    <TableCell>
                                        <span className={cn(
                                            "inline-flex items-center text-[10px] font-semibold tracking-wider px-2 py-1 rounded-full border",
                                            u.is_blocked ? "bg-red-50 text-red-700 border-red-200" :
                                                u.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                    "bg-slate-100 text-slate-600 border-slate-200"
                                        )}>
                                            {u.is_blocked ? "Blocked" : u.is_active ? "Active" : "Inactive"}
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
                                                <DropdownMenuItem onClick={() => onView(u)} className="cursor-pointer">
                                                    <Eye className="w-4 h-4" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onUpdateStatus(u)} className="cursor-pointer">
                                                    <Pencil className="w-4 h-4" /> Update Status
                                                </DropdownMenuItem>
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