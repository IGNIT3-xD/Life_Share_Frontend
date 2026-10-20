"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Building2, Mail, MapPin, Phone, ShieldCheck, FileBadge } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HospitalProfileResponse } from "@/api/hospital";

const capitalize = (s: string) => s?.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) || "—";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    hospital: HospitalProfileResponse | null;
};

export function AdminHospitalDetailsModal({ open, onOpenChange, hospital }: Props) {
    if (!hospital) return null;

    const isVerified = hospital.hospital_status === "VERIFIED";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md font-graphik p-0 overflow-hidden">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100 bg-slate-50/50">
                    <DialogTitle className="font-semibold text-lg">Hospital Profile</DialogTitle>
                    <DialogDescription>Review hospital details and verification info.</DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    {/* Header Info */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                            <Building2 className="w-7 h-7 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-bold text-slate-900 truncate">{hospital.user.name}</h3>
                            <p className="text-sm text-slate-500 truncate">{hospital.user.email}</p>
                            <div className="mt-1.5">
                                <span className={cn(
                                    "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                                    isVerified ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                        hospital.hospital_status === "IN_PROGRESS" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                            "bg-red-50 text-red-700 border-red-200"
                                )}>
                                    <ShieldCheck className="w-3 h-3" /> {capitalize(hospital.hospital_status)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-3">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contact & Location</h4>
                        <div className="space-y-2.5">
                            <div className="flex items-start gap-3">
                                <FileBadge className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-700">License: <strong className="font-semibold">{hospital.license_number}</strong></span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-700">{hospital.user.phone || "Not provided"}</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-700">{hospital.user.address || "Not provided"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">About Hospital</h4>
                        <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                            {hospital.description || "No description provided."}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}