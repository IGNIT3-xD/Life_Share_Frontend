"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Droplet, MapPin, Calendar, User, Phone, Mail, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAllBloodRequesterDetailsAdmin } from "@/hooks/useRequester";

const formatBloodGroup = (g: string) => g?.replace("_POS", "+").replace("_NEG", "-") || "N/A";
const formatDate = (d: string) => new Date(d).toLocaleString("en-US", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    requestId: string | null;
};

export function AdminRequesterDetailsModal({ open, onOpenChange, requestId }: Props) {
    const { data, isPending, error } = useAllBloodRequesterDetailsAdmin(requestId);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md font-graphik p-0 overflow-hidden max-h-[90vh] flex flex-col">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
                    <DialogTitle className="font-semibold text-lg">Request Details</DialogTitle>
                    <DialogDescription>#{requestId?.slice(0, 8).toUpperCase()}</DialogDescription>
                </DialogHeader>

                {isPending && <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>}
                {error && <div className="p-6 text-center text-sm text-slate-500">Could not load details.</div>}

                {data && (
                    <div className="p-6 space-y-6 overflow-y-auto">
                        {/* Requester Profile */}
                        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="relative w-12 h-12 rounded-full bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                                {data.user.profile_pic ? (
                                    <Image src={data.user.profile_pic} alt={data.user.name} fill className="object-cover" />
                                ) : (
                                    <User className="w-6 h-6 text-slate-400" />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-slate-900 truncate">{data.user.name}</p>
                                <p className="text-xs text-slate-500 truncate">{data.user.email}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                                        data.verificationStatus === "VERIFIED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                            data.verificationStatus === "PENDING" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                "bg-red-50 text-red-700 border-red-200"
                                    )}>
                                        {data.verificationStatus}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-slate-100 text-slate-600 border-slate-200">
                                        {data.request_status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Patient & Blood Info */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-white border border-slate-100 rounded-xl flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                                        <Droplet className="w-4 h-4 text-red-500" fill="currentColor" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Blood</p>
                                        <p className="text-sm font-black text-slate-900">{formatBloodGroup(data.blood_group)}</p>
                                    </div>
                                </div>
                                <div className="p-3 bg-white border border-slate-100 rounded-xl">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Units</p>
                                    <p className="text-sm font-black text-slate-900">{data.unit_required} bags</p>
                                </div>
                            </div>

                            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Patient Name</p>
                                    <p className="text-sm font-semibold text-slate-900">{data.patientName}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                                    <p className="text-sm text-slate-700 flex items-start gap-1.5"><MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {data.exact_location}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Expires At</p>
                                    <p className="text-sm text-slate-700 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 shrink-0" /> {formatDate(data.expires_at)}</p>
                                </div>
                            </div>

                            {data.note && (
                                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                                    <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">Requester Note</p>
                                    <p className="text-xs text-amber-900 italic">"{data.note}"</p>
                                </div>
                            )}

                            <div className="pt-2 border-t border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Contact Requester</p>
                                <div className="flex flex-col gap-1.5">
                                    <p className="text-xs text-slate-600 flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {data.user.phone || "N/A"}</p>
                                    <p className="text-xs text-slate-600 flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {data.user.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}