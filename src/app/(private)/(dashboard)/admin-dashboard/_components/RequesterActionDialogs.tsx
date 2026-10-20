"use client";

import { useState, useEffect } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useUpdateBloodRequesterStatus, useDeleteBloodRequesterRequest } from "@/hooks/useRequester";

// --- 1. Update Status Dialog ---
type StatusProps = { open: boolean; onOpenChange: (open: boolean) => void; requestId: string | null; currentStatus?: string; patientName?: string; };

export function UpdateRequesterStatusDialog({ open, onOpenChange, requestId, currentStatus, patientName }: StatusProps) {
    const [status, setStatus] = useState<"PENDING" | "VERIFIED" | "REJECTED">("PENDING");
    const { mutateAsync: updateStatus, isPending } = useUpdateBloodRequesterStatus();

    useEffect(() => {
        if (currentStatus) setStatus(currentStatus as any);
    }, [currentStatus]);

    const handleConfirm = async () => {
        if (!requestId) return;
        try {
            await updateStatus({ id: requestId, payload: { verificationStatus: status } });
            toast.success("Request status updated successfully");
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
                    <DialogTitle>Verify Request</DialogTitle>
                    <DialogDescription>Update the verification status for <strong>{patientName}</strong>.</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-3">
                    <Label>Select Status</Label>
                    <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="VERIFIED">Verified (Approve)</SelectItem>
                            <SelectItem value="PENDING">Pending (Under Review)</SelectItem>
                            <SelectItem value="REJECTED">Rejected (Deny)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Cancel</Button>
                    <Button onClick={handleConfirm} disabled={isPending || status === currentStatus} className="bg-[#B15A36] hover:bg-[#9a4e2e] text-white">
                        {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Update Status"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// --- 2. Delete Dialog ---
type DeleteProps = { open: boolean; onOpenChange: (open: boolean) => void; requestId: string | null; patientName?: string; };

export function DeleteRequesterDialog({ open, onOpenChange, requestId, patientName }: DeleteProps) {
    const { mutateAsync: deleteRequest, isPending } = useDeleteBloodRequesterRequest();

    const handleConfirm = async () => {
        if (!requestId) return;
        try {
            await deleteRequest(requestId);
            toast.success("Request deleted permanently");
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
                    <AlertDialogTitle>Delete this request?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You are about to permanently delete the blood request for <strong className="text-slate-900">{patientName}</strong>. This action cannot be undone.
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