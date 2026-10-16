"use client";

import Image from "next/image";
import {
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    FileBadge,
    Mail,
    MapPin,
    Phone,
    Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ServiceDetailsResponse } from "@/api/emergencyServices";

// ---- Helpers ----
const formatPrice = (price: string) => {
    const n = Number(price);
    if (Number.isNaN(n)) return "—";
    return `৳${n.toLocaleString("en-BD")}`;
};

const formatLabel = (s: string) =>
    s?.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) ||
    "—";

const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

type Props = {
    service: ServiceDetailsResponse;
    onBookNow: () => void;
};

export function ServiceDetailsView({ service, onBookNow }: Props) {
    const isActive = service.service_status === "ACTIVE";
    const { hospital } = service;

    return (
        <div className="space-y-6">
            {/* Hero */}
            <div className="relative w-full aspect-video md:aspect-21/9 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                {service.service_image ? (
                    <Image
                        src={service.service_image}
                        alt={service.service_name}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                        No image available
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                {/* Status badge */}
                <span
                    className={cn(
                        "absolute top-5 right-5 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border backdrop-blur-md",
                        isActive
                            ? "bg-emerald-500/90 text-white border-emerald-400/50"
                            : "bg-slate-700/80 text-white border-slate-600"
                    )}
                >
                    <span
                        className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            isActive ? "bg-white animate-pulse" : "bg-slate-300"
                        )}
                    />
                    {formatLabel(service.service_status)}
                </span>

                {/* Category badge */}
                <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-red-600 border border-white/50">
                    {formatLabel(service.service_category)}
                </span>

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight drop-shadow-md">
                        {service.service_name}
                    </h1>
                </div>
            </div>

            {/* ============ QUICK STATS ============ */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatBox
                    icon={<Tag className="w-5 h-5 text-red-500" />}
                    label="Price"
                    value={formatPrice(service.price)}
                    bgClass="bg-red-50 border-red-100"
                    valueClass="text-red-600"
                />
                <StatBox
                    icon={<Clock className="w-5 h-5 text-emerald-500" />}
                    label="Availability"
                    value={service.availability}
                    bgClass="bg-emerald-50 border-emerald-100"
                />
                <StatBox
                    icon={<Calendar className="w-5 h-5 text-blue-500" />}
                    label="Listed On"
                    value={formatDate(service.created_at)}
                    bgClass="bg-blue-50 border-blue-100"
                />
            </div>

            {/* ============ DESCRIPTION + BOOK CTA ============ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Description (2 cols) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                            About This Service
                        </h2>
                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                            {service.description}
                        </p>
                    </div>

                    {/* Hospital Info */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-slate-400" />
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                                Provided By
                            </h2>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <p className="text-lg font-bold text-slate-900">
                                    {hospital?.user?.name || "Hospital"}
                                </p>
                                {hospital?.description && (
                                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                                        {hospital.description}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                {hospital?.user?.phone && (
                                    <InfoLine
                                        icon={<Phone className="w-4 h-4" />}
                                        value={hospital.user.phone}
                                    />
                                )}
                                {hospital?.user?.email && (
                                    <InfoLine
                                        icon={<Mail className="w-4 h-4" />}
                                        value={hospital.user.email}
                                    />
                                )}
                                {hospital?.user?.address && (
                                    <InfoLine
                                        icon={<MapPin className="w-4 h-4" />}
                                        value={hospital.user.address}
                                    />
                                )}
                                {hospital?.license_number && (
                                    <InfoLine
                                        icon={<FileBadge className="w-4 h-4" />}
                                        value={`License: ${hospital.license_number}`}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Card (1 col) */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 lg:sticky lg:top-24">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Service Fee
                        </p>
                        <p className="text-4xl font-black text-slate-900 tracking-tight mt-1">
                            {formatPrice(service.price)}
                        </p>

                        <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                            <Clock className="w-3.5 h-3.5" />
                            {service.availability}
                        </div>

                        <div className="border-t border-dashed border-slate-200 my-6" />

                        <Button
                            onClick={onBookNow}
                            disabled={!isActive}
                            className={cn(
                                "w-full h-12 text-base font-bold gap-2",
                                isActive
                                    ? "btn-main bg-[#B15A36] hover:bg-[#9a4e2e]"
                                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                            )}
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            {isActive ? "Book Now" : "Unavailable"}
                        </Button>

                        <p className="text-[11px] text-slate-400 text-center mt-3 leading-relaxed">
                            {isActive
                                ? "You'll pick a date and time on the next step."
                                : "This service is not currently accepting bookings."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ---- Sub-components ----

function StatBox({
    icon,
    label,
    value,
    bgClass,
    valueClass,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    bgClass: string;
    valueClass?: string;
}) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
            <div
                className={cn(
                    "w-11 h-11 rounded-xl border flex items-center justify-center shrink-0",
                    bgClass
                )}
            >
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {label}
                </p>
                <p
                    className={cn(
                        "text-sm font-bold text-slate-900 mt-0.5 truncate",
                        valueClass
                    )}
                >
                    {value}
                </p>
            </div>
        </div>
    );
}

function InfoLine({
    icon,
    value,
}: {
    icon: React.ReactNode;
    value: string;
}) {
    return (
        <div className="flex items-start gap-2 text-sm">
            <span className="text-slate-400 mt-0.5 shrink-0">{icon}</span>
            <span className="text-slate-700 wrap-break-word min-w-0">{value}</span>
        </div>
    );
}