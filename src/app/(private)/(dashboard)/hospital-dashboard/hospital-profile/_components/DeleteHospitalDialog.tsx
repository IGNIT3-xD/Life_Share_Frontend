"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDeleteHospitalProfile } from "@/hooks/useHospital";

type Props = { open: boolean; onOpenChange: (open: boolean) => void; profileId: string; hospitalName: string; };

export function DeleteHospitalDialog({ open, onOpenChange, profileId, hospitalName }: Props) {
    const { mutateAsync: deleteProfile, isPending } = useDeleteHospitalProfile();

    const handleConfirm = async () => {
        try {
            await deleteProfile(profileId);
            toast.success("Hospital profile deleted successfully");
            onOpenChange(false);
        } catch (err: any) {
            toast.error("Failed to delete", { description: err?.data?.message || "Please try again." });
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="font-graphik sm:max-w-md">
                <AlertDialogHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 mb-4">
                        <Trash2 className="h-5 w-5 text-red-600" />
                    </div>
                    <AlertDialogTitle>Delete Hospital Profile?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the hospital profile for <strong className="text-slate-900">{hospitalName}</strong>. Any active services or bookings may be affected. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={(e) => { e.preventDefault(); handleConfirm(); }} disabled={isPending} className="bg-red-600 hover:bg-red-700 text-white">
                        {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</> : "Yes, delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}