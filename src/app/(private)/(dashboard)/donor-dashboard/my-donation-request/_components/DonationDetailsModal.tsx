"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Droplet, MapPin, User, FileText, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDonationRequestDetails } from "@/hooks/useDonation";

const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleString("en-US", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const formatBloodGroup = (g: string) => g?.replace("_POS", "+").replace("_NEG", "-") || "N/A";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    requestId: string | null;
};

export function DonationDetailsModal({ open, onOpenChange, requestId }: Props) {
    const { data, isPending, error } = useDonationRequestDetails(requestId);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg font-graphik max-h-[92vh] overflow-y-auto p-0">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
                    <DialogTitle className="font-semibold text-lg">Donation Request Details</DialogTitle>
                    <DialogDescription>#{requestId?.slice(0, 8).toUpperCase()}</DialogDescription>
                </DialogHeader>

                {isPending && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                    </div>
                )}

                {error && !isPending && (
                    <div className="px-6 py-16 text-center text-sm text-slate-500">
                        Could not load request details.
                    </div>
                )}

                {data && (
                    <div className="p-6 space-y-5">
                        {/* Urgency Banner */}
                        <div className={cn(
                            "p-4 rounded-xl border flex items-start gap-3",
                            data.requester.urgency === "EMERGENCY" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
                        )}>
                            <AlertCircle className={cn("w-5 h-5 shrink-0", data.requester.urgency === "EMERGENCY" ? "text-red-600" : "text-amber-600")} />
                            <div>
                                <p className={cn("text-sm font-bold", data.requester.urgency === "EMERGENCY" ? "text-red-900" : "text-amber-900")}>
                                    {data.requester.urgency} Request
                                </p>
                                <p className={cn("text-xs mt-0.5", data.requester.urgency === "EMERGENCY" ? "text-red-700" : "text-amber-700")}>
                                    Needed by {formatDate(data.requester.expires_at)}
                                </p>
                            </div>
                        </div>

                        {/* Requester Info */}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Requester Information</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                                    <User className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{data.requester.patientName}</p>
                                    <p className="text-xs text-slate-500">Patient</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-200">
                                <div className="flex items-center gap-2 text-xs text-slate-600"><MapPin className="w-3.5 h-3.5" /> {data.requester.exact_location}</div>
                                {data.requester.note && (
                                    <div className="flex items-start gap-2 text-xs text-slate-600 mt-1">
                                        <FileText className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                        <span className="italic">"{data.requester.note}"</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Blood Requirement */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-white border border-slate-100 rounded-xl flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                                    <Droplet className="w-5 h-5 text-red-500" fill="currentColor" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Blood Group</p>
                                    <p className="text-sm font-black text-slate-900">{formatBloodGroup(data.requester.blood_group)}</p>
                                </div>
                            </div>
                            <div className="p-3 bg-white border border-slate-100 rounded-xl">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Units Required</p>
                                <p className="text-lg font-black text-slate-900">{data.requester.unit_required} <span className="text-xs font-medium text-slate-500">units</span></p>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}