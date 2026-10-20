"use client";

import Image from "next/image";
import {
    Activity,
    Calendar,
    CheckCircle2,
    Clock,
    Droplet,
    Heart,
    Mail,
    MapPin,
    Phone,
    Ruler,
    Scale,
    ShieldCheck,
    User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DonorDetailsResponse } from "@/api/donors";

// ---- Helpers ----
const formatBloodGroup = (group: string) =>
    group?.replace("_POS", "+").replace("_NEG", "-") || "N/A";

const formatString = (str: string) =>
    str
        ?.replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase()) || "N/A";

const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

// ---- Props ----
type DonorDetailsViewProps = {
    donor: DonorDetailsResponse;
    onRequestDonation: () => void;
};

// ---- Component ----
export function DonorDetailsView({
    donor,
    onRequestDonation,
}: DonorDetailsViewProps) {
    const { user } = donor;
    const initial = user.name?.charAt(0).toUpperCase() || "?";
    const isVerified = donor.donorStatus === "VERIFIED";
    const isAvailable = donor.availability === "AVAILABLE";
    const canContact = isAvailable && isVerified;

    return (
        <div className="space-y-6">
            {/* ============ HERO CARD ============ */}
            <div className="relative bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                {/* Decorative gradient banner */}
                <div className="h-32 bg-linear-to-br from-red-500 via-rose-500 to-red-600 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)]" />
                </div>

                <div className="px-6 md:px-8 pb-6 md:pb-8">
                    {/* Avatar + Name (avatar overlaps the banner) */}
                    <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 -mt-14 mb-6">
                        <div className="relative w-28 h-28 rounded-full p-1 bg-white shadow-md shrink-0">
                            <div className="w-full h-full rounded-full overflow-hidden bg-red-500 flex items-center justify-center">
                                {user.profile_pic ? (
                                    <Image
                                        src={user.profile_pic}
                                        alt={user.name}
                                        width={112}
                                        height={112}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-white text-4xl font-bold">
                                        {initial}
                                    </span>
                                )}
                            </div>
                            {isVerified && (
                                <div className="absolute bottom-2 right-2 bg-emerald-500 rounded-full p-1.5 border-[3px] border-white shadow-sm">
                                    <ShieldCheck className="w-4 h-4 text-white" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0 pb-1">
                            <div className="flex flex-wrap items-center gap-2 mt-16">
                                <h1 className="z-10 text-2xl md:text-3xl font-bold text-slate-900 tracking-tight truncate">
                                    {user.name}
                                </h1>
                                {isVerified && (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-2">
                                <span className="inline-flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5" />
                                    {formatString(user.gender)}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    {donor.age} years old
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {donor.location}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        <span
                            className={cn(
                                "inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border",
                                isVerified
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                            )}
                        >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {formatString(donor.donorStatus)}
                        </span>

                        <span
                            className={cn(
                                "inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border",
                                isAvailable
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                            )}
                        >
                            <span
                                className={cn(
                                    "w-1.5 h-1.5 rounded-full",
                                    isAvailable ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                                )}
                            />
                            {formatString(donor.availability)}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            onClick={onRequestDonation}
                            disabled={!canContact}
                            className={cn(
                                "h-11 gap-2 font-semibold flex-1 sm:flex-none",
                                canContact
                                    ? "btn-main bg-[#B15A36] hover:bg-[#9a4e2e]"
                                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                            )}
                        >
                            <Heart className="w-4 h-4" fill="currentColor" />
                            {canContact ? "Request Blood Donation" : "Currently Unavailable"}
                        </Button>

                        {user.phone && canContact && (
                            <Button
                                asChild
                                variant="outline"
                                className="h-11 gap-2 border-slate-200 flex-1 sm:flex-none"
                            >
                                <a href={`tel:${user.phone}`}>
                                    <Phone className="w-4 h-4" />
                                    Call {user.phone}
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* ============ STATS GRID ============ */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    icon={
                        <Droplet className="w-5 h-5 text-red-500" fill="currentColor" />
                    }
                    bgClass="bg-red-50 border-red-100"
                    value={formatBloodGroup(donor.blood_group)}
                    label="Blood Group"
                    valueClass="text-red-600"
                />
                <StatCard
                    icon={
                        <Heart
                            className="w-5 h-5 text-emerald-500"
                            fill="currentColor"
                        />
                    }
                    bgClass="bg-emerald-50 border-emerald-100"
                    value={String(donor.totalDonations)}
                    label="Total Donations"
                />
                <StatCard
                    icon={<Scale className="w-5 h-5 text-blue-500" />}
                    bgClass="bg-blue-50 border-blue-100"
                    value={`${donor.weightKg} kg`}
                    label="Weight"
                />
                <StatCard
                    icon={<Ruler className="w-5 h-5 text-purple-500" />}
                    bgClass="bg-purple-50 border-purple-100"
                    value={`${donor.height} cm`}
                    label="Height"
                />
            </div>

            {/* ============ INFO CARDS ============ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                            Contact Information
                        </h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                        <InfoRow
                            icon={<Mail className="w-4 h-4" />}
                            label="Email"
                            value={donor.email}
                        />
                        <InfoRow
                            icon={<Phone className="w-4 h-4" />}
                            label="Phone"
                            value={user.phone || "Hidden"}
                            muted={!user.phone}
                        />
                    </div>
                </div>

                {/* Donation History */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                            Donation History
                        </h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                        <InfoRow
                            icon={<Heart className="w-4 h-4" />}
                            label="Total Donations"
                            value={`${donor.totalDonations} ${donor.totalDonations === 1 ? "time" : "times"
                                }`}
                        />
                        <InfoRow
                            icon={<Calendar className="w-4 h-4" />}
                            label="Last Donated"
                            value={formatDate(donor?.lastDonationDate)}
                            muted={!donor.lastDonationDate}
                        />
                    </div>
                </div>
            </div>

            {/* ============ AVAILABILITY NOTE ============ */}
            <div
                className={cn(
                    "rounded-2xl border p-5 flex items-start gap-3",
                    isAvailable
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-amber-50 border-amber-200"
                )}
            >
                <Activity
                    className={cn(
                        "w-5 h-5 mt-0.5 shrink-0",
                        isAvailable ? "text-emerald-600" : "text-amber-600"
                    )}
                />
                <div>
                    <h4
                        className={cn(
                            "text-sm font-bold",
                            isAvailable ? "text-emerald-900" : "text-amber-900"
                        )}
                    >
                        {isAvailable ? "Currently Available" : "Currently On Hold"}
                    </h4>
                    <p
                        className={cn(
                            "text-sm mt-0.5",
                            isAvailable ? "text-emerald-700" : "text-amber-700"
                        )}
                    >
                        {isAvailable
                            ? "This donor is actively accepting requests. You can send a donation request below."
                            : "This donor has temporarily paused donations. They may become available again soon."}
                    </p>
                </div>
            </div>
        </div>
    );
}

// ---- Sub-components ----

function StatCard({
    icon,
    bgClass,
    value,
    label,
    valueClass,
}: {
    icon: React.ReactNode;
    bgClass: string;
    value: string;
    label: string;
    valueClass?: string;
}) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm">
            <div
                className={cn(
                    "w-10 h-10 rounded-xl border flex items-center justify-center mb-3",
                    bgClass
                )}
            >
                {icon}
            </div>
            <p className={cn("text-2xl font-bold text-slate-900", valueClass)}>
                {value}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{label}</p>
        </div>
    );
}

function InfoRow({
    icon,
    label,
    value,
    muted,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    muted?: boolean;
}) {
    return (
        <div className="flex items-start gap-3 px-6 py-4">
            <div className="text-slate-400 mt-0.5 shrink-0">{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {label}
                </p>
                <p
                    className={cn(
                        "text-sm mt-0.5 wrap-break-word",
                        muted ? "text-slate-400 italic" : "text-slate-900 font-medium"
                    )}
                >
                    {value}
                </p>
            </div>
        </div>
    );
}