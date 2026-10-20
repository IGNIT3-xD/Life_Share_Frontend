"use client";

import Image from "next/image";
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
    Building2, Calendar, Clock, CreditCard, FileBadge, Heart,
    Loader2, Mail, MapPin, Phone, ShieldCheck, User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookingDetails } from "@/hooks/useBooking";

// ---- Helpers ----
const formatDateTime = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatPrice = (n: number | string) => {
    const num = Number(n);
    return isNaN(num) ? "—" : `৳${num.toLocaleString("en-BD")}`;
};

const capitalize = (s: string) =>
    s?.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) || "—";

const statusPill = (status: string) => {
    const map: Record<string, string> = {
        PENDING: "bg-amber-50 text-amber-700 border-amber-200",
        CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
        ACCEPTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
        COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
        CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
        FAILED: "bg-red-50 text-red-700 border-red-200",
        PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
        REFUNDED: "bg-blue-50 text-blue-700 border-blue-200",
        REFUNDED_PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    };
    return map[status] || "bg-slate-100 text-slate-600 border-slate-200";
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bookingId: string | null;
};

export function BookingDetailsModal({ open, onOpenChange, bookingId }: Props) {
    const { data, isPending, error } = useBookingDetails(bookingId);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl font-graphik max-h-[92vh] overflow-hidden flex flex-col p-0">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
                    <DialogTitle className="font-semibold text-lg">
                        Booking Details
                    </DialogTitle>
                    <DialogDescription>
                        {bookingId ? `#${bookingId.slice(0, 8).toUpperCase()}` : "Loading..."}
                    </DialogDescription>
                </DialogHeader>

                {/* Loading */}
                {isPending && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                    </div>
                )}

                {/* Error */}
                {error && !isPending && (
                    <div className="px-6 py-16 text-center">
                        <p className="text-sm text-slate-500">
                            Could not load booking details. Please try again.
                        </p>
                    </div>
                )}

                {/* Content */}
                {data && (
                    <div className="overflow-y-auto flex-1">
                        <div className="space-y-5 p-6">
                            {/* Service hero with image */}
                            <ServiceHero
                                serviceName={data.emergencyService.service_name}
                                serviceImage={data.emergencyService.service_image}
                                amount={data.payment_amount}
                            />

                            {/* Status pills */}
                            <div className="grid grid-cols-2 gap-3">
                                <StatusPill
                                    label="Booking Status"
                                    value={capitalize(data.booking_status)}
                                    className={statusPill(data.booking_status)}
                                />
                                <StatusPill
                                    label="Payment Status"
                                    value={capitalize(data.payment_status)}
                                    className={statusPill(data.payment_status)}
                                />
                            </div>

                            {/* Patient — read from TOP LEVEL now */}
                            <Section title="Patient Information" icon={<User className="w-3.5 h-3.5 text-slate-400" />}>
                                <InfoRow icon={<User className="w-4 h-4" />} value={data.patient_name} />
                                <InfoRow icon={<Phone className="w-4 h-4" />} value={data.patient_number} />
                                <InfoRow icon={<MapPin className="w-4 h-4" />} value={data.emergency_location} />
                            </Section>

                            {/* Description — from TOP LEVEL */}
                            <Section title="Emergency Description">
                                <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                                    {data.description}
                                </p>
                            </Section>

                            {/* Schedule + Payment — from TOP LEVEL */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <InfoBox
                                    icon={<Calendar className="w-3.5 h-3.5 text-slate-400" />}
                                    label="Scheduled"
                                    value={formatDateTime(data.scheduled_at)}
                                />
                                <InfoBox
                                    icon={<CreditCard className="w-3.5 h-3.5 text-slate-400" />}
                                    label="Payment"
                                    value={`${formatPrice(data.payment_amount)} · ${data.payment_via}`}
                                />
                                <InfoBox
                                    icon={<Clock className="w-3.5 h-3.5 text-slate-400" />}
                                    label="Completed"
                                    value={formatDateTime(data.completed_at)}
                                />
                            </div>

                            {/* Service Provider (hospital + user) */}
                            <Section
                                title="Service Provider"
                                icon={<Building2 className="w-3.5 h-3.5 text-slate-400" />}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                                        {data.user.profile_pic ? (
                                            <Image
                                                src={data.user.profile_pic}
                                                alt={data.user.name}
                                                fill
                                                sizes="48px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <Building2 className="w-6 h-6 text-slate-400" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-slate-900 truncate">
                                            {data.user.name}
                                        </p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                            <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wide">
                                                {capitalize(data?.hospital?.hospital_status || "--")}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {data?.hospital?.description && (
                                    <p className="text-xs text-slate-500 leading-relaxed mt-3">
                                        {data.hospital.description}
                                    </p>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 mt-3 border-t border-slate-100">
                                    {data.user.phone && (
                                        <InfoLine icon={<Phone className="w-3.5 h-3.5" />} value={data.user.phone} />
                                    )}
                                    {data.user.email && (
                                        <InfoLine icon={<Mail className="w-3.5 h-3.5" />} value={data.user.email} />
                                    )}
                                    {data.user.address && (
                                        <InfoLine icon={<MapPin className="w-3.5 h-3.5" />} value={data.user.address} />
                                    )}
                                    {data?.hospital?.license_number && (
                                        <InfoLine
                                            icon={<FileBadge className="w-3.5 h-3.5" />}
                                            value={`License: ${data?.hospital?.license_number}`}
                                        />
                                    )}
                                </div>
                            </Section>

                            {/* Note — top level */}
                            {data.note && (
                                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                                    <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">
                                        Special Note
                                    </p>
                                    <p className="text-sm text-amber-800 italic">"{data.note}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

// ---- Sub-components ----

function ServiceHero({
    serviceName,
    serviceImage,
    amount,
}: {
    serviceName: string;
    serviceImage?: string;
    amount: number | string;
}) {
    return (
        <div className="relative rounded-2xl overflow-hidden bg-linear-to-br from-red-500 via-rose-500 to-red-600 text-white">
            {/* Background image */}
            {serviceImage && (
                <>
                    <Image
                        src={serviceImage}
                        alt={serviceName}
                        fill
                        sizes="(max-width: 640px) 100vw, 576px"
                        className="object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-red-600/95 to-red-500/60" />
                </>
            )}

            {/* Decorative glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)]" />

            <div className="relative flex items-center gap-3 p-5">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                    <Heart className="w-6 h-6 text-white" fill="currentColor" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                        {serviceName}
                    </p>
                    <p className="text-2xl font-black tracking-tight">
                        {formatPrice(amount)}
                    </p>
                </div>
            </div>
        </div>
    );
}

function StatusPill({
    label, value, className,
}: { label: string; value: string; className: string }) {
    return (
        <div className={cn("p-3 rounded-xl border", className)}>
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                {label}
            </p>
            <p className="text-sm font-bold mt-0.5">{value}</p>
        </div>
    );
}

function Section({
    title, icon, children,
}: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="flex items-center gap-1.5">
                {icon}
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {title}
                </p>
            </div>
            {children}
        </div>
    );
}

function InfoRow({ icon, value }: { icon: React.ReactNode; value: string }) {
    return (
        <div className="flex items-start gap-2">
            <span className="text-slate-400 mt-0.5 shrink-0">{icon}</span>
            <span className="text-sm text-slate-800 wrap-break-word">{value}</span>
        </div>
    );
}

function InfoLine({ icon, value }: { icon: React.ReactNode; value: string }) {
    return (
        <div className="flex items-start gap-2 text-xs">
            <span className="text-slate-400 mt-0.5 shrink-0">{icon}</span>
            <span className="text-slate-600 wrap-break-word min-w-0">{value}</span>
        </div>
    );
}

function InfoBox({
    icon, label, value,
}: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="p-3 bg-white border border-slate-100 rounded-xl">
            <div className="flex items-center gap-1.5 mb-1">
                {icon}
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {label}
                </span>
            </div>
            <p className="text-xs text-slate-900 font-medium">{value}</p>
        </div>
    );
}