"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CheckCircle2, Loader2, XCircle, CalendarClock, Flag } from "lucide-react";
import { toast } from "sonner";
import { useUpdateDonationStatus } from "@/hooks/useDonation";
import { cn } from "@/lib/utils";

type ActionType = "ACCEPTED" | "SCHEDULED" | "COMPLETED" | "DONOR_CANCELLED";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    requestId: string | null;
    patientName?: string;
    action: ActionType | null;
};

const actionConfig = {
    ACCEPTED: {
        title: "Accept Donation Request?",
        desc: "You are confirming that you are willing to donate blood for this patient.",
        btnText: "Yes, Accept",
        btnClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
        iconBg: "bg-emerald-50",
    },
    SCHEDULED: {
        title: "Mark as Scheduled?",
        desc: "Confirm that you have communicated with the patient and scheduled a time to donate.",
        btnText: "Confirm Schedule",
        btnClass: "bg-blue-600 hover:bg-blue-700 text-white",
        icon: <CalendarClock className="h-5 w-5 text-blue-600" />,
        iconBg: "bg-blue-50",
    },
    COMPLETED: {
        title: "Mark as Completed?",
        desc: "Confirm that you have successfully donated blood. This will update your total donation count.",
        btnText: "Yes, Completed",
        btnClass: "bg-indigo-600 hover:bg-indigo-700 text-white",
        icon: <Flag className="h-5 w-5 text-indigo-600" />,
        iconBg: "bg-indigo-50",
    },
    DONOR_CANCELLED: {
        title: "Cancel Donation?",
        desc: "Are you sure you want to cancel this donation request? The patient will be notified and will need to find another donor.",
        btnText: "Yes, Cancel",
        btnClass: "bg-red-600 hover:bg-red-700 text-white",
        icon: <XCircle className="h-5 w-5 text-red-600" />,
        iconBg: "bg-red-50",
    },
};

export function DonationStatusDialog({ open, onOpenChange, requestId, patientName, action }: Props) {
    const { mutateAsync: updateStatus, isPending } = useUpdateDonationStatus();

    if (!action) return null;
    const config = actionConfig[action];

    const handleConfirm = async () => {
        if (!requestId) return;
        try {
            await updateStatus({ id: requestId, payload: { donationStatus: action } });
            toast.success("Status updated successfully");
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
                        {patientName && <span className="block mt-2 font-medium text-slate-700">Patient: {patientName}</span>}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Go Back</AlertDialogCancel>
                    <AlertDialogAction onClick={(e) => { e.preventDefault(); handleConfirm(); }} disabled={isPending} className={config.btnClass}>
                        {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : config.btnText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}