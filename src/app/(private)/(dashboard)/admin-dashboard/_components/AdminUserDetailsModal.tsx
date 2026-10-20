"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { User, Phone, MapPin, Calendar, ShieldCheck, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserData } from "@/api/auth";

const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
const capitalize = (s: string) => s?.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) || "—";

const roleStyles: Record<string, string> = {
    ADMIN: "bg-purple-50 text-purple-700 border-purple-200",
    SUPER_ADMIN: "bg-indigo-50 text-indigo-700 border-indigo-200",
    HOSPITAL: "bg-blue-50 text-blue-700 border-blue-200",
    DONOR: "bg-red-50 text-red-700 border-red-200",
    USER: "bg-slate-100 text-slate-700 border-slate-200",
};

type Props = { open: boolean; onOpenChange: (open: boolean) => void; user: UserData | null; };

export function AdminUserDetailsModal({ open, onOpenChange, user }: Props) {
    if (!user) return null;

    const initial = user.name?.charAt(0).toUpperCase() || "?";
    const isBlocked = user.is_blocked;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md font-graphik p-0 overflow-hidden">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100 bg-slate-50/50">
                    <DialogTitle className="font-semibold text-lg">User Profile</DialogTitle>
                    <DialogDescription>Review user account details and status.</DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                            {user.profile_pic ? (
                                <Image src={user.profile_pic} alt={user.name} fill className="object-cover" />
                            ) : (
                                <span className="text-slate-500 text-2xl font-bold">{initial}</span>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-bold text-slate-900 truncate">{user.name}</h3>
                            <p className="text-sm text-slate-500 truncate">{user.email}</p>

                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                <span className={cn("inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border", roleStyles[user.role] || "bg-slate-100")}>
                                    {capitalize(user.role)}
                                </span>
                                <span className={cn(
                                    "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                                    isBlocked ? "bg-red-50 text-red-700 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                )}>
                                    {isBlocked ? <ShieldAlert className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                                    {isBlocked ? "Blocked" : "Active"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Details */}
                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex items-start gap-3">
                            <Phone className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                            <span className="text-sm text-slate-700">{user.phone || "No phone number"}</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                            <span className="text-sm text-slate-700">{user.address || "No address provided"}</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <User className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                            <span className="text-sm text-slate-700">{capitalize(user.gender)}</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                            <span className="text-sm text-slate-700">Joined {formatDate(user.created_at)}</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}