"use client";

import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Droplet, MapPin, Calendar, Clock, Heart, Activity } from "lucide-react";
import type { DonationRequest } from "@/api/donation";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    donation: DonationRequest | null;
};

const formatBloodGroup = (g: string) =>
    g?.replace("_POS", "+").replace("_NEG", "-") || "N/A";

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

const capitalize = (s: string) =>
    s?.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) || "—";

export function DonationDetailsModal({ open, onOpenChange, donation }: Props) {
    if (!donation) return null;

    const { donor, requester } = donation;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg font-graphik max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-semibold text-lg">
                        Donation Request Details
                    </DialogTitle>
                    <DialogDescription>
                        Request #{donation.id.slice(0, 8).toUpperCase()}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-2">
                    {/* Status */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Status
                        </span>
                        <span className="inline-flex items-center text-xs font-semibold tracking-wider px-3 py-1 rounded-full border bg-white">
                            {capitalize(donation.donationStatus)}
                        </span>
                    </div>

                    {/* Donor Card */}
                    <div className="p-4 bg-red-50/50 border border-red-100 rounded-xl">
                        <p className="text-[11px] font-bold text-red-600 uppercase tracking-wider mb-2">
                            Donor
                        </p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                                <Droplet className="w-4 h-4 text-red-500" fill="currentColor" />
                                <span className="font-bold text-slate-900">
                                    {formatBloodGroup(donor.blood_group)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                <span className="truncate">{donor.location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Requester / Patient Card */}
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Patient
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                            {requester.patientName}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span className="truncate">{requester.exact_location}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm">
                            <div className="flex items-center gap-2">
                                <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
                                <span className="text-slate-700">
                                    {requester.unit_required} units needed
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-amber-500" />
                                <span className="text-slate-700">
                                    {capitalize(requester.urgency)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Schedule */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-white border border-slate-100 rounded-xl">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Scheduled
                                </span>
                            </div>
                            <p className="text-xs text-slate-900 font-medium">
                                {formatDateTime(donation.scheduled_at)}
                            </p>
                        </div>

                        <div className="p-3 bg-white border border-slate-100 rounded-xl">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Donated At
                                </span>
                            </div>
                            <p className="text-xs text-slate-900 font-medium">
                                {formatDateTime(donation.donated_at)}
                            </p>
                        </div>
                    </div>

                    {/* Note */}
                    {requester.note && (
                        <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">
                                Requester Note
                            </p>
                            <p className="text-xs text-amber-800 italic">
                                "{requester.note}"
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}