"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CheckCircle2, Loader2, XCircle, Flag } from "lucide-react";
import { toast } from "sonner";
import { useUpdateBookingStatus } from "@/hooks/useBooking";
import type { EmergencyServiceBookingProp } from "@/api/booking";
import { cn } from "@/lib/utils";

type ActionType = "ACCEPTED" | "COMPLETED" | "CANCELLED";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: EmergencyServiceBookingProp | null;
    action: ActionType | null;
};

const actionConfig = {
    ACCEPTED: {
        title: "Accept Booking?",
        desc: "You are confirming that you can fulfill this emergency service request.",
        btnText: "Yes, Accept",
        btnClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
        iconBg: "bg-emerald-50",
    },
    COMPLETED: {
        title: "Mark as Completed?",
        desc: "This will mark the service as successfully delivered. This action cannot be undone.",
        btnText: "Yes, Complete",
        btnClass: "bg-blue-600 hover:bg-blue-700 text-white",
        icon: <Flag className="h-5 w-5 text-blue-600" />,
        iconBg: "bg-blue-50",
    },
    CANCELLED: {
        title: "Cancel Booking?",
        desc: "Are you sure you want to cancel this request? The user will be notified immediately.",
        btnText: "Yes, Cancel",
        btnClass: "bg-red-600 hover:bg-red-700 text-white",
        icon: <XCircle className="h-5 w-5 text-red-600" />,
        iconBg: "bg-red-50",
    },
};

export function BookingStatusDialog({ open, onOpenChange, booking, action }: Props) {
    const { mutateAsync: updateStatus, isPending } = useUpdateBookingStatus();

    if (!action) return null;
    const config = actionConfig[action];

    const handleConfirm = async () => {
        if (!booking) return;
        try {
            await updateStatus({ id: booking.id, payload: { booking_status: action } });
            toast.success(`Booking ${action.toLowerCase()} successfully`);
            onOpenChange(false);
        } catch (err: any) {
            toast.error("Failed to update", { description: err?.data?.message || "Please try again." });
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="font-graphik sm:max-w-md">
                <AlertDialogHeader>
                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-full mb-4", config.iconBg)}>
                        {config.icon}
                    </div>
                    <AlertDialogTitle>{config.title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {config.desc}
                        {booking && (
                            <span className="block mt-2 font-medium text-slate-700">
                                Patient: {booking.patient_name}
                            </span>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Go Back</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => { e.preventDefault(); handleConfirm(); }}
                        disabled={isPending}
                        className={config.btnClass}
                    >
                        {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : config.btnText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}