"use client";

import { Droplet, Mail, MapPin, Phone, Heart, Scale, Ruler, Calendar, ShieldCheck, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from 'next/image'
import type { DonorProfileResponse } from "@/api/donors";


const formatBloodGroup = (g: string) =>
    g?.replace("_POS", "+").replace("_NEG", "-") || "N/A";

const formatDate = (d: string | null) => {
    if (!d) return "Never";
    return new Date(d).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const capitalize = (s: string) =>
    s?.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) ?? "";

type Props = {
    profile: DonorProfileResponse;
    onEdit: () => void;
    onDelete: () => void;
};

export function DonorProfileView({ profile, onEdit, onDelete }: Props) {
    const { user } = profile;
    const initial = user.name?.charAt(0).toUpperCase() || "?";
    const isVerified = profile.donorStatus === "VERIFIED";
    const isAvailable = profile.availability === "AVAILABLE";

    return (
        <div className="space-y-6 max-w-7xl">
            {/* ---- Profile Header ---- */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Avatar */}
                    <div className="relative w-24 h-24 rounded-full p-0.75 bg-linear-to-br from-red-500 via-rose-400 to-red-500 shrink-0">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white">
                            {user.profile_pic ? (
                                <Image
                                    src={user.profile_pic}
                                    alt={user.name}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-red-500 text-white flex items-center justify-center text-3xl font-bold">
                                    {initial}
                                </div>
                            )}
                        </div>
                        {isVerified && (
                            <div className="absolute bottom-1 right-1 bg-emerald-500 rounded-full p-1.5 border-2 border-white">
                                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                            </div>
                        )}
                    </div>

                    {/* Name + meta */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight truncate">
                            {user.name}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            {capitalize(user.gender)} · {profile.age} years old
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mt-3">
                            <span className={cn(
                                "inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border",
                                isVerified
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                            )}>
                                <ShieldCheck className="w-3 h-3" />
                                {capitalize(profile.donorStatus)}
                            </span>

                            <span className={cn(
                                "inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border",
                                isAvailable
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                            )}>
                                <span className={cn(
                                    "w-1.5 h-1.5 rounded-full",
                                    isAvailable ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                                )} />
                                {capitalize(profile.availability)}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:self-start">
                        <Button
                            onClick={onEdit}
                            variant="outline"
                            className="gap-1.5"
                        >
                            <Pencil className="w-4 h-4" />
                            Update
                        </Button>
                        <Button
                            onClick={onDelete}
                            variant="outline"
                            className="gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </Button>
                    </div>
                </div>
            </div>

            {/* ---- Stats Grid ---- */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Blood Group */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center mb-3">
                        <Droplet className="w-5 h-5 text-red-500" fill="currentColor" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">
                        {formatBloodGroup(profile.blood_group)}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Blood Group</p>
                </div>

                {/* Total Donations */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-3">
                        <Heart className="w-5 h-5 text-emerald-500" fill="currentColor" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{profile.totalDonations}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Donations</p>
                </div>

                {/* Weight */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-3">
                        <Scale className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{profile.weightKg} kg</p>
                    <p className="text-xs text-slate-500 mt-0.5">Weight</p>
                </div>

                {/* Height */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-3">
                        <Ruler className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{profile.height} cm</p>
                    <p className="text-xs text-slate-500 mt-0.5">Height</p>
                </div>
            </div>

            {/* ---- Contact & Location ---- */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-900">Contact Information</h3>
                </div>
                <div className="divide-y divide-slate-100">
                    <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={user.email} />
                    <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={user.phone || "Not provided"} />
                    <InfoRow icon={<MapPin className="w-4 h-4" />} label="Address" value={user.address || "Not provided"} />
                    <InfoRow icon={<MapPin className="w-4 h-4" />} label="Donor Location" value={profile.location} />
                    <InfoRow
                        icon={<Calendar className="w-4 h-4" />}
                        label="Last Donation"
                        value={formatDate(profile.lastDonationDate)}
                    />
                </div>
            </div>
        </div>
    );
}

function InfoRow({
    icon, label, value,
}: {
    icon: React.ReactNode; label: string; value: string;
}) {
    return (
        <div className="flex items-start gap-3 px-6 py-4">
            <div className="text-slate-400 mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {label}
                </p>
                <p className="text-sm text-slate-900 mt-0.5 wrap-break-word">{value}</p>
            </div>
        </div>
    );
}