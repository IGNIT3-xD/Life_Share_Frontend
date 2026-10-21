"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useUpdatePaymentStatus } from "@/hooks/usePayment";
import type { Payment } from "@/api/payment";

type Props = { open: boolean; onOpenChange: (open: boolean) => void; payment: Payment | null; };

export function RefundPaymentDialog({ open, onOpenChange, payment }: Props) {
    const [status, setStatus] = useState<"REFUNDED_PENDING" | "REFUNDED">("REFUNDED_PENDING");
    const { mutateAsync: updateStatus, isPending } = useUpdatePaymentStatus();

    useEffect(() => {
        if (payment) {
            // If it's already pending, default to pending, otherwise default to REFUNDED
            setStatus((payment.payment_status as any) === "REFUNDED_PENDING" ? "REFUNDED_PENDING" : "REFUNDED");
        }
    }, [payment]);

    const handleConfirm = async () => {
        if (!payment) return;
        try {
            await updateStatus({ id: payment.id, payload: { payment_status: status } });
            toast.success("Refund status updated", {
                description: `Transaction marked as ${status.replace("_", " ")}.`,
            });
            onOpenChange(false);
        } catch (err: any) {
            toast.error("Failed to update status", { description: err?.data?.message });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm font-graphik">
                <DialogHeader>
                    <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-2">
                        <RotateCcw className="w-6 h-6 text-amber-600" />
                    </div>
                    <DialogTitle>Update Refund Status</DialogTitle>
                    <DialogDescription>
                        Transaction <strong className="text-slate-900">{payment?.bkash_trx_id || payment?.merchant_invoice_number}</strong> for <strong>৳{Number(payment?.payment_amount).toLocaleString("en-BD")}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-3">
                    <Label>Select Refund Status</Label>
                    <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="REFUNDED_PENDING">Refund Pending (Admin Review)</SelectItem>
                            <SelectItem value="REFUNDED">Refunded (Completed)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Cancel</Button>
                    <Button onClick={handleConfirm} disabled={isPending} className="bg-[#B15A36] hover:bg-[#9a4e2e] text-white">
                        {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Update Status"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}