"use client";

import { useState, useEffect } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useUpdateHospitalProfileStatus, useDeleteHospitalProfileAdmin } from "@/hooks/useHospital";
import type { HospitalProfileResponse } from "@/api/hospital";

// --- 1. Update Status Dialog ---
type StatusProps = { open: boolean; onOpenChange: (open: boolean) => void; hospital: HospitalProfileResponse | null; };

export function UpdateHospitalStatusDialog({ open, onOpenChange, hospital }: StatusProps) {
    const [status, setStatus] = useState<"VERIFIED" | "IN_PROGRESS" | "NOT_ELIGIBLE">("VERIFIED");
    const { mutateAsync: updateStatus, isPending } = useUpdateHospitalProfileStatus();

    useEffect(() => {
        if (hospital) setStatus(hospital.hospital_status as any);
    }, [hospital, open]);

    const handleConfirm = async () => {
        if (!hospital) return;
        try {
            await updateStatus({ id: hospital.id, payload: { hospital_status: status } });
            toast.success("Hospital status updated");
            onOpenChange(false);
        } catch (err: any) {
            toast.error("Failed to update", { description: err?.data?.message });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm font-graphik">
                <DialogHeader>
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                        <ShieldCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <DialogTitle>Verify Hospital</DialogTitle>
                    <DialogDescription>Update the verification status for <strong>{hospital?.user.name}</strong>.</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-3">
                    <Label>Select Status</Label>
                    <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="VERIFIED">Verified (Approve)</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress (Review)</SelectItem>
                            <SelectItem value="NOT_ELIGIBLE">Not Eligible (Reject)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Cancel</Button>
                    <Button onClick={handleConfirm} disabled={isPending || status === hospital?.hospital_status} className="bg-[#B15A36] hover:bg-[#9a4e2e] text-white">
                        {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Update Status"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// --- 2. Delete Dialog ---
type DeleteProps = { open: boolean; onOpenChange: (open: boolean) => void; hospital: HospitalProfileResponse | null; };

export function DeleteHospitalAdminDialog({ open, onOpenChange, hospital }: DeleteProps) {
    const { mutateAsync: deleteHospital, isPending } = useDeleteHospitalProfileAdmin();

    const handleConfirm = async () => {
        if (!hospital) return;
        try {
            await deleteHospital(hospital.id);
            toast.success("Hospital profile deleted permanently");
            onOpenChange(false);
        } catch (err: any) {
            toast.error("Failed to delete", { description: err?.data?.message });
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
                        This will permanently delete the profile for <strong className="text-slate-900">{hospital?.user.name}</strong> and remove them from the platform. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={(e) => { e.preventDefault(); handleConfirm(); }} disabled={isPending} className="bg-red-600 hover:bg-red-700 text-white">
                        {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</> : "Yes, Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}