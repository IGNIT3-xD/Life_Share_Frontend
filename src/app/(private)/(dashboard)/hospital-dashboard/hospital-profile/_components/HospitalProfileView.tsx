"use client";

import { Building2, CheckCircle2, Mail, MapPin, Pencil, Phone, ShieldCheck, Trash2, FileBadge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HospitalProfileResponse } from "@/api/hospital";

type Props = {
    profile: HospitalProfileResponse;
    onEdit: () => void;
    onDelete: () => void;
};

export function HospitalProfileView({ profile, onEdit, onDelete }: Props) {
    const isVerified = profile.hospital_status === "VERIFIED";

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="h-24 bg-linear-to-br from-blue-600 to-indigo-700 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)]" />
                </div>

                <div className="px-6 md:px-8 pb-6">
                    <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 -mt-12 mb-6">
                        <div className="relative w-24 h-24 rounded-2xl p-1 bg-white shadow-md shrink-0">
                            <div className="w-full h-full rounded-xl bg-blue-100 flex items-center justify-center">
                                <Building2 className="w-10 h-10 text-blue-600" />
                            </div>
                            {isVerified && (
                                <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-1.5 border-2 border-white">
                                    <ShieldCheck className="w-4 h-4 text-white" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0 pb-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-2xl font-bold text-slate-900 truncate mt-10 pt-5">
                                    {profile.user.name}
                                </h2>
                                {isVerified && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 mt-2">
                                <span className="flex items-center gap-1.5">
                                    <FileBadge className="w-4 h-4" /> License: {profile.license_number}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Mail className="w-4 h-4" /> {profile.user.email}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button onClick={onEdit} variant="outline" className="gap-1.5 h-9">
                                <Pencil className="w-4 h-4" /> Edit
                            </Button>
                            <Button onClick={onDelete} variant="outline" className="gap-1.5 h-9 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                                <Trash2 className="w-4 h-4" /> Delete
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                        <span className={cn(
                            "inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border",
                            isVerified ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                        )}>
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {profile.hospital_status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                        Contact & Location
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Phone</p>
                                <p className="text-sm text-slate-900">{profile.user.phone || "Not provided"}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Address</p>
                                <p className="text-sm text-slate-900">{profile.user.address || "Not provided"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                        About Hospital
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                        {profile.description || "No description provided."}
                    </p>
                </div>
            </div>
        </div>
    );
}