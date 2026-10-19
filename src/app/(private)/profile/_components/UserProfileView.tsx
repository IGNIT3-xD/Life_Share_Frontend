"use client";

import Image from "next/image";
import { Mail, MapPin, Phone, User, Pencil, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MeUser } from "@/api/auth";

type Props = {
    profile: MeUser;
    onEdit: () => void;
};

export function UserProfileView({ profile, onEdit }: Props) {
    const initial = profile.name?.charAt(0).toUpperCase() || "?";
    const isVerified = profile.email_verified;

    return (
        <div className="space-y-6 pt-10">
            {/* Header Card */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="h-24 bg-linear-to-br from-[#fae7de] to-black/10 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)]" />
                </div>

                <div className="px-6 md:px-8 pb-6">
                    <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 -mt-12 mb-6">
                        {/* Avatar */}
                        <div className="relative w-24 h-24 rounded-full p-1 bg-white shadow-md shrink-0">
                            <div className="w-full h-full rounded-full bg-[#B15A36] flex items-center justify-center overflow-hidden">
                                {profile.profile_pic ? (
                                    <Image
                                        src={profile.profile_pic}
                                        alt={profile.name}
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-white text-4xl font-bold">{initial}</span>
                                )}
                            </div>
                            {isVerified && (
                                <div className="absolute bottom-1 right-1 bg-emerald-500 rounded-full p-1.5 border-2 border-white">
                                    <ShieldCheck className="w-4 h-4 text-white" />
                                </div>
                            )}
                        </div>

                        {/* Name & Role */}
                        <div className="flex-1 min-w-0 pb-0 mt-5 pt-10">
                            <h2 className="text-2xl font-bold text-slate-900 truncate">
                                {profile.name}
                            </h2>
                            <p className="text-sm text-slate-500 capitalize">
                                {profile.role.toLowerCase()} Account
                            </p>
                        </div>

                        {/* Edit Button */}
                        <Button onClick={onEdit} variant="outline" className="gap-1.5 h-9">
                            <Pencil className="w-4 h-4" /> Edit Profile
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {isVerified ? "Verified Account" : "Unverified"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                        Personal Information
                    </h3>
                </div>
                <div className="divide-y divide-slate-100">
                    <InfoRow icon={<Mail className="w-4 h-4" />} label="Email Address" value={profile.email} />
                    <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone Number" value={profile.phone || "Not provided"} muted={!profile.phone} />
                    <InfoRow icon={<MapPin className="w-4 h-4" />} label="Address" value={profile.address || "Not provided"} muted={!profile.address} />
                    <InfoRow icon={<User className="w-4 h-4" />} label="Gender" value={profile.gender.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())} />
                </div>
            </div>
        </div>
    );
}

function InfoRow({ icon, label, value, muted }: { icon: React.ReactNode; label: string; value: string; muted?: boolean }) {
    return (
        <div className="flex items-start gap-3 px-6 py-4">
            <div className="text-slate-400 mt-0.5 shrink-0">{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
                <p className={`text-sm mt-0.5 wrap-break-word ${muted ? "text-slate-400 italic" : "text-slate-900 font-medium"}`}>
                    {value}
                </p>
            </div>
        </div>
    );
}