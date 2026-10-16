"use client";

import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useCancelBooking, useDeleteBooking } from "@/hooks/useBooking";
import type { EmergencyServiceBookingProp } from "@/api/booking";

// Cancel Booking Dialog
type CancelProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: EmergencyServiceBookingProp | null;
};

export function CancelBookingDialog({ open, onOpenChange, booking }: CancelProps) {
    const { mutateAsync: cancel, isPending } = useCancelBooking();

    const handleConfirm = async () => {
        if (!booking) return;
        try {
            await cancel(booking.id);
            toast.success("Booking cancelled", {
                description: "The provider has been notified. Refunds may take 3-5 days.",
            });
            onOpenChange(false);
        } catch (err: any) {
            toast.error("Failed to cancel", {
                description: err?.data?.message || "Please try again.",
            });
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="font-graphik sm:max-w-md">
                <AlertDialogHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 mb-4">
                        <XCircle className="h-5 w-5 text-amber-600" />
                    </div>
                    <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {booking ? (
                            <>
                                This will cancel the booking for{" "}
                                <strong className="text-slate-900">{booking.patient_name}</strong>.
                                Depending on your payment method, refunds may take 3-5 business days.
                            </>
                        ) : (
                            "This will cancel the booking. Refunds may take 3-5 business days."
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Keep Booking</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleConfirm();
                        }}
                        disabled={isPending}
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Cancelling...
                            </>
                        ) : (
                            "Yes, cancel"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// Delete Booking Dialog
type DeleteProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: EmergencyServiceBookingProp | null;
};

export function DeleteBookingDialog({ open, onOpenChange, booking }: DeleteProps) {
    const { mutateAsync: remove, isPending } = useDeleteBooking();

    const handleConfirm = async () => {
        if (!booking) return;
        try {
            await remove(booking.id);
            toast.success("Booking deleted");
            onOpenChange(false);
        } catch (err: any) {
            toast.error("Failed to delete", {
                description: err?.data?.message || "Please try again.",
            });
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="font-graphik sm:max-w-md">
                <AlertDialogHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 mb-4">
                        <Trash2 className="h-5 w-5 text-red-600" />
                    </div>
                    <AlertDialogTitle>Delete this booking?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {booking ? (
                            <>
                                This will permanently remove the booking for{" "}
                                <strong className="text-slate-900">{booking.patient_name}</strong>{" "}
                                from your history. This action cannot be undone.
                            </>
                        ) : (
                            "This will permanently remove the booking from your history. This action cannot be undone."
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleConfirm();
                        }}
                        disabled={isPending}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Yes, delete"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}