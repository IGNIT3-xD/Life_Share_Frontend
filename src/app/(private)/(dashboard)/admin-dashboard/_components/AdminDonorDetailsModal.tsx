"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Droplet, Heart, Scale, MapPin, Phone, Calendar, User, ShieldCheck, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DonorProps } from "@/components/DonorCard";

const formatBloodGroup = (g: string) => g?.replace("_POS", "+").replace("_NEG", "-") || "N/A";

const formatDate = (d: string | null) => {
    if (!d) return "Never";
    return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
};

const capitalize = (s: string) => s?.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) || "—";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    donor: DonorProps | null;
};

export function AdminDonorDetailsModal({ open, onOpenChange, donor }: Props) {
    if (!donor) return null;

    const initial = donor.user?.name?.charAt(0).toUpperCase() || "?";
    const isVerified = donor.donorStatus === "VERIFIED";
    const isAvailable = donor.availability === "AVAILABLE";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md font-graphik p-0 overflow-hidden">
                {/* Header */}
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100 bg-slate-50/50">
                    <DialogTitle className="font-semibold text-lg">Donor Profile</DialogTitle>
                    <DialogDescription>Review donor details and history.</DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    {/* Profile Row */}
                    <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-full bg-[#B15A36] flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                            {donor.user?.profile_pic ? (
                                <Image src={donor.user.profile_pic} alt={donor.user.name} fill className="object-cover" />
                            ) : (
                                <span className="text-white text-2xl font-bold">{initial}</span>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-bold text-slate-900 truncate">{donor.user?.name}</h3>
                            <p className="text-sm text-slate-500 truncate">{donor.user?.email}</p>

                            {/* Status Badges */}
                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                <span className={cn(
                                    "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                                    isVerified ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                                )}>
                                    <ShieldCheck className="w-3 h-3" /> {capitalize(donor.donorStatus)}
                                </span>
                                <span className={cn(
                                    "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                                    isAvailable ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-100 text-slate-600 border-slate-200"
                                )}>
                                    <Activity className="w-3 h-3" /> {capitalize(donor.availability)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-2">
                        <div className="bg-slate-50 rounded-xl p-3 flex flex-col items-center justify-center text-center border border-slate-100">
                            <Droplet className="w-4 h-4 text-red-500 mb-1" fill="currentColor" />
                            <span className="text-sm font-bold text-slate-900">{formatBloodGroup(donor.blood_group)}</span>
                            <span className="text-[10px] text-slate-500">Blood</span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 flex flex-col items-center justify-center text-center border border-slate-100">
                            <Heart className="w-4 h-4 text-emerald-500 mb-1" fill="currentColor" />
                            <span className="text-sm font-bold text-slate-900">{donor.totalDonations}</span>
                            <span className="text-[10px] text-slate-500">Donations</span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 flex flex-col items-center justify-center text-center border border-slate-100">
                            <User className="w-4 h-4 text-blue-500 mb-1" />
                            <span className="text-sm font-bold text-slate-900">{donor.age} yr</span>
                            <span className="text-[10px] text-slate-500">Age</span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 flex flex-col items-center justify-center text-center border border-slate-100">
                            <Scale className="w-4 h-4 text-purple-500 mb-1" />
                            <span className="text-sm font-bold text-slate-900">{donor.weightKg} kg</span>
                            <span className="text-[10px] text-slate-500">Weight</span>
                        </div>
                    </div>

                    {/* Contact & Location Details */}
                    <div className="space-y-3">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contact & Location</h4>
                        <div className="space-y-2.5">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-700">{donor.location || "Not provided"}</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-700">{donor.user?.phone || "Not provided"}</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-700">Last donated: <strong className="font-semibold">{formatDate(donor.lastDonationDate)}</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}