"use client"

import { RequesterProp } from "@/components/RequesterCard";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

type ViewDetailsProp = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    request: RequesterProp | null
}

export function ViewDetailsModal({ open, onOpenChange, request }: ViewDetailsProp) {
    if (!request) return null;

    // console.log(request);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="font-graphik sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Request Details</DialogTitle>
                    <DialogDescription>
                        Details for request #{request.id.slice(0, 8).toUpperCase()}
                    </DialogDescription>
                </DialogHeader>

                <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
                    {/* Now you have the full request object to display */}
                    <div className="space-y-3">
                        <DetailRow label="Patient" value={request.patientName} />
                        <DetailRow label="Blood Group" value={request.blood_group} />
                        <DetailRow label="Units Required" value={String(request.unit_required)} />
                        <DetailRow label="Location" value={request.exact_location} />
                        <DetailRow label="Urgency" value={request.urgency} />
                        <DetailRow label="Status" value={request.request_status} />
                        <DetailRow
                            label="Verification"
                            value={request.verificationStatus}
                        />
                        <DetailRow
                            label="Expires At"
                            value={new Date(request.expires_at).toLocaleString()}
                        />
                        {request.note && (
                            <DetailRow label="Note" value={request.note} />
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-0.5 py-1 border-b border-slate-100 last:border-0">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                {label}
            </span>
            <span className="text-sm text-slate-900 font-medium">{value}</span>
        </div>
    );
}