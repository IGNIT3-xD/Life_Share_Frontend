"use client";

import { useState, useEffect } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Activity, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Service } from "@/api/emergencyServices";
import { useDeleteEmergencyService, useUpdateEmergencyServiceStatus } from "@/hooks/useEmergencyServices";

// --- 1. Update Status Dialog ---
type StatusProps = { open: boolean; onOpenChange: (open: boolean) => void; service: Service | null; };

export function UpdateServiceStatusDialog({ open, onOpenChange, service }: StatusProps) {
    const [status, setStatus] = useState<"ACTIVE" | "IN_PROGRESS" | "INACTIVE">("ACTIVE");
    const { mutateAsync: updateStatus, isPending } = useUpdateEmergencyServiceStatus();

    useEffect(() => {
        if (service) setStatus(service.service_status as any);
    }, [service]);

    const handleConfirm = async () => {
        if (!service) return;
        try {
            await updateStatus({ id: service.id, payload: { service_status: status } });
            toast.success("Service status updated");
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
                        <Activity className="w-6 h-6 text-blue-600" />
                    </div>
                    <DialogTitle>Update Service Status</DialogTitle>
                    <DialogDescription>Change status for <strong>{service?.service_name}</strong>.</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-3">
                    <Label>Select Status</Label>
                    <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ACTIVE">Active (Live)</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="INACTIVE">Inactive (Hidden)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Cancel</Button>
                    <Button onClick={handleConfirm} disabled={isPending || status === service?.service_status} className="bg-[#B15A36] hover:bg-[#9a4e2e] text-white">
                        {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Update Status"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// --- 2. Delete Dialog ---
type DeleteProps = { open: boolean; onOpenChange: (open: boolean) => void; service: Service | null; };

export function DeleteServiceAdminDialog({ open, onOpenChange, service }: DeleteProps) {
    const { mutateAsync: deleteService, isPending } = useDeleteEmergencyService();

    const handleConfirm = async () => {
        if (!service) return;
        try {
            await deleteService(service.id);
            toast.success("Service deleted permanently");
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
                    <AlertDialogTitle>Delete Service?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete <strong className="text-slate-900">{service?.service_name}</strong>. Any future bookings for this service will not be possible. This action cannot be undone.
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