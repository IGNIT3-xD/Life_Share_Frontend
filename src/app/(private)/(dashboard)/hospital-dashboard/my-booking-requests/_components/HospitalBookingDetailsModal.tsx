"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, CreditCard, Heart, Loader2, Mail, MapPin, Phone, User, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookingRequestDetails } from "@/hooks/useBooking";

const formatDateTime = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleString("en-US", {
        day: "numeric", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
};

const formatPrice = (n: number | string) => {
    const num = Number(n);
    return isNaN(num) ? "—" : `৳${num.toLocaleString("en-BD")}`;
};

const capitalize = (s: string) =>
    s?.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) || "—";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bookingId: string | null;
};

export function HospitalBookingDetailsModal({ open, onOpenChange, bookingId }: Props) {
    const { data, isPending, error } = useBookingRequestDetails(bookingId);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl font-graphik max-h-[92vh] overflow-hidden flex flex-col p-0">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
                    <DialogTitle className="font-semibold text-lg">Booking Details</DialogTitle>
                    <DialogDescription>
                        {bookingId ? `#${bookingId.slice(0, 8).toUpperCase()}` : "Loading..."}
                    </DialogDescription>
                </DialogHeader>

                {isPending && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                    </div>
                )}

                {error && !isPending && (
                    <div className="px-6 py-16 text-center">
                        <p className="text-sm text-slate-500">Could not load booking details. Please try again.</p>
                    </div>
                )}

                {data && (
                    <div className="overflow-y-auto flex-1">
                        <div className="space-y-5 p-6">

                            {/* Service Hero */}
                            <div className="relative rounded-2xl overflow-hidden bg-linear-to-br from-red-500 to-red-700 text-white p-5">
                                {data.emergencyService.service_image && (
                                    <>
                                        <Image src={data.emergencyService.service_image} alt="Service" fill className="object-cover opacity-20" />
                                        <div className="absolute inset-0 bg-linear-to-r from-red-600/95 to-red-500/60" />
                                    </>
                                )}
                                <div className="relative flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                                        <Heart className="w-6 h-6 text-white" fill="currentColor" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                                            {data.emergencyService.service_name}
                                        </p>
                                        <p className="text-2xl font-black tracking-tight">{formatPrice(data.payment_amount)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Status Pills */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl border bg-amber-50 text-amber-700 border-amber-200">
                                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">Booking Status</p>
                                    <p className="text-sm font-bold mt-0.5">{capitalize(data.booking_status)}</p>
                                </div>
                                <div className="p-3 rounded-xl border bg-slate-50 text-slate-700 border-slate-200">
                                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">Payment Status</p>
                                    <p className="text-sm font-bold mt-0.5">{capitalize(data.payment_status)}</p>
                                </div>
                            </div>

                            {/* Patient / Requester Info */}
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Requester Information</p>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0 flex items-center justify-center">
                                        {data.user.profile_pic ? (
                                            <Image src={data.user.profile_pic} alt={data.user.name} fill className="object-cover" />
                                        ) : (
                                            <User className="w-5 h-5 text-slate-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{data.user.name}</p>
                                        <p className="text-xs text-slate-500">{data.user.email}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                                    <div className="flex items-center gap-2 text-xs text-slate-600"><Phone className="w-3.5 h-3.5" /> {data.user.phone || "N/A"}</div>
                                    <div className="flex items-center gap-2 text-xs text-slate-600"><MapPin className="w-3.5 h-3.5" /> {data.user.address || "N/A"}</div>
                                </div>
                            </div>

                            {/* Emergency Details */}
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Patient Details</p>
                                <p className="text-sm font-semibold text-slate-900">{data.patient_name} ({data.patient_number})</p>
                                <p className="text-sm text-slate-600 mt-2 whitespace-pre-line">{data.description}</p>
                            </div>

                            {/* Schedule Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="p-3 bg-white border border-slate-100 rounded-xl">
                                    <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Scheduled</span>
                                    </div>
                                    <p className="text-xs text-slate-900 font-medium">{formatDateTime(data.scheduled_at)}</p>
                                </div>
                                <div className="p-3 bg-white border border-slate-100 rounded-xl">
                                    <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                                        <CreditCard className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Payment Via</span>
                                    </div>
                                    <p className="text-xs text-slate-900 font-medium">{data.payment_via}</p>
                                </div>
                            </div>

                            {/* Location Note */}
                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                                <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">Emergency Location</p>
                                <p className="text-sm text-amber-900 font-medium">{data.emergency_location}</p>
                            </div>

                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}