"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDeleteBloodRequest } from "@/hooks/useRequester";

type DeleteRequestDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    requestId: string | null;
    patientName?: string;
};

export function DeleteRequestDialog({
    open,
    onOpenChange,
    requestId,
    patientName,
}: DeleteRequestDialogProps) {
    const { mutateAsync: deleteRequest, isPending } = useDeleteBloodRequest();

    const handleConfirm = async () => {
        if (!requestId) return;

        try {
            await deleteRequest(requestId);
            toast.success("Blood request deleted", {
                description: "The request has been permanently removed.",
            });
            onOpenChange(false);
        } catch (error: any) {
            toast.error("Failed to delete", {
                description:
                    error?.data?.message || "Something went wrong. Please try again.",
            });
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="font-graphik sm:max-w-md">
                <AlertDialogHeader>
                    <div className="mx-auto sm:mx-0 mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 sm:mb-0 sm:absolute sm:top-6 sm:left-6">
                        <Trash2 className="h-5 w-5 text-red-600" />
                    </div>

                    <AlertDialogTitle className="sm:pl-16">
                        Delete this blood request?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="sm:pl-16">
                        {patientName ? (
                            <>
                                You're about to permanently delete the request for{" "}
                                <span className="font-semibold text-slate-900">
                                    {patientName}
                                </span>
                                . This action cannot be undone.
                            </>
                        ) : (
                            "This action cannot be undone. The request will be permanently removed from our system."
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="sm:pl-16">
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleConfirm();
                        }}
                        disabled={isPending}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
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