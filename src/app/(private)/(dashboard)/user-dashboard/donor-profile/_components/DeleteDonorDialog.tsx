"use client";

import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteDonorProfile } from "@/hooks/useDonors";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** The donor profile ID to delete */
    profileId: string | null;
    /** Optional: show the donor's name for a personalized message */
    donorName?: string;
};

export function DeleteDonorDialog({
    open,
    onOpenChange,
    profileId,
    donorName,
}: Props) {
    const { mutateAsync: deleteProfile, isPending } = useDeleteDonorProfile();

    const handleConfirm = async () => {
        if (!profileId) return;

        try {
            await deleteProfile(profileId);
            toast.success("Donor profile deleted", {
                description: "Your donor profile has been removed.",
            });
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
                    <AlertDialogTitle>
                        Delete {donorName ? `${donorName}'s` : "your"} donor profile?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently remove the donor profile from our registry.
                        Your user account remains intact. You can always create a new
                        donor profile later.
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