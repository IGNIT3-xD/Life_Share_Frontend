"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import type { DonorProps } from "@/components/DonorCard";
import { useUpdateDonorProfileStatus } from "@/hooks/useDonors";

type Status = "IN_PROGRESS" | "VERIFIED" | "NOT_ELIGIBLE";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    donor: DonorProps | null;
};

export function UpdateDonorStatusDialog({ open, onOpenChange, donor }: Props) {
    const [status, setStatus] = useState<Status>("VERIFIED");
    const { mutateAsync: updateStatus, isPending } = useUpdateDonorProfileStatus();

    useEffect(() => {
        if (donor) {
            setStatus(donor.donorStatus as Status);
        }
    }, [donor]);

    const handleConfirm = async () => {
        if (!donor) return;
        try {
            await updateStatus({ id: donor.id, payload: { donorStatus: status } });
            toast.success("Donor status updated");
            onOpenChange(false);
        } catch (err: any) {
            toast.error("Failed to update", { description: err?.data?.message || "Please try again." });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm font-graphik">
                <DialogHeader>
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                        <ShieldCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <DialogTitle>Update Donor Status</DialogTitle>
                    <DialogDescription>
                        Change the verification status for <strong className="text-slate-900">{donor?.user.name}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-3">
                    <Label>Select New Status</Label>
                    <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="VERIFIED">Verified (Approved)</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress (Pending)</SelectItem>
                            <SelectItem value="NOT_ELIGIBLE">Not Eligible (Rejected)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Cancel</Button>
                    <Button onClick={handleConfirm} disabled={isPending || status === donor?.donorStatus} className="bg-[#B15A36] hover:bg-[#9a4e2e] text-white">
                        {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Update Status"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}