"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogClose, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import Link from "next/link";
import {
    AlertCircle, Calendar, ClipboardList, Heart, Loader2,
} from "lucide-react";

import { useCreateDonationRequest, useMyBloodRequest } from "@/hooks/useRequester";
import { cn } from "@/lib/utils";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    donorId: string;
    donorName: string;
};

// Format blood group: A_POS → A+
const formatBloodGroup = (g: string) =>
    g?.replace("_POS", "+").replace("_NEG", "-") || "N/A";

// Convert Date → "YYYY-MM-DDTHH:mm" for datetime-local
const toDatetimeLocal = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export function CreateDonationRequestModal({
    open,
    onOpenChange,
    donorId,
    donorName,
}: Props) {
    const [serverError, setServerError] = useState<string | null>(null);

    // ✅ Fetch only MY VERIFIED blood requests
    const { data, isPending: fetchingRequests } = useMyBloodRequest({
        verificationStatus: "VERIFIED",
        rawLimit: 100,
    });

    const myRequests = data?.requester ?? [];

    const { mutateAsync: createRequest, isPending: creating } = useCreateDonationRequest();

    // Minimum datetime = 1 hour from now
    const minValue = toDatetimeLocal(new Date(Date.now() + 60 * 60 * 1000));

    const form = useForm({
        defaultValues: {
            requester_id: "",
            scheduled_at: "",
        },
        validators: {
            // We'll do a simple inline validator here since requester_id
            // is also needed. Or use a zod schema that includes both.
            onSubmit: ({ value }) => {
                if (!value.requester_id) return "Please select a blood request";
                if (!value.scheduled_at) return "Please pick a date and time";
                const t = new Date(value.scheduled_at).getTime();
                if (Number.isNaN(t)) return "Invalid date";
                if (t <= Date.now() + 60 * 60 * 1000) {
                    return "Schedule must be at least 1 hour from now";
                }
                return undefined;
            },
        },
        onSubmit: async ({ value }) => {
            setServerError(null);
            try {
                await createRequest({
                    requester_id: value.requester_id,   // ← selected post
                    donor_id: donorId,                   // ← from URL
                    scheduled_at: new Date(value.scheduled_at).toISOString(),
                });

                form.reset();
                onOpenChange(false);
                toast.success("Donation request sent", {
                    description: `Your request to ${donorName} has been submitted.`,
                });
            } catch (err: any) {
                setServerError(
                    err?.data?.message || "Failed to send request. Please try again."
                );
            }
        },
    });

    // Auto-select if there's exactly one verified request
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
        useEffect(() => {
        if (open && myRequests.length === 1) {
            form.setFieldValue("requester_id", myRequests[0].id);
        }
    }, [open, myRequests.length, form.setFieldValue]);

    // ---- Loading state ----
    if (fetchingRequests) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-md font-graphik">
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    // ---- No verified requests ----
    if (myRequests.length === 0) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-md font-graphik">
                    <DialogHeader>
                        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-2">
                            <AlertCircle className="w-6 h-6 text-amber-600" />
                        </div>
                        <DialogTitle className="font-semibold text-lg">
                            No Verified Blood Request Found
                        </DialogTitle>
                        <DialogDescription>
                            To request a donation, you first need a <strong>verified</strong>{" "}
                            blood request. Create one and wait for admin verification before
                            reaching out to donors.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button asChild className="btn-main bg-[#B15A36]">
                            <Link href="/user-dashboard/my-blood-request">
                                <ClipboardList className="w-4 h-4 mr-1.5" />
                                Go to My Requests
                            </Link>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    // ---- Main Form ----
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md font-graphik">
                <DialogHeader>
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-2">
                        <Heart className="w-6 h-6 text-red-500" fill="currentColor" />
                    </div>
                    <DialogTitle className="font-semibold text-lg">
                        Request Blood Donation
                    </DialogTitle>
                    <DialogDescription>
                        Send a donation request to{" "}
                        <strong className="text-slate-900">{donorName}</strong>. Choose
                        which of your blood requests this donation is for.
                    </DialogDescription>
                    {serverError && (
                        <DialogDescription className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md text-center">
                            {serverError}
                        </DialogDescription>
                    )}
                </DialogHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                >
                    <FieldGroup className="py-4">
                        {/* ✅ Blood Request Selector */}
                        <form.Field name="requester_id">
                            {(field) => (
                                <Field>
                                    <Label htmlFor={field.name}>Link to Blood Request</Label>
                                    <Select
                                        value={field.state.value}
                                        onValueChange={(v) => field.handleChange(v)}
                                    >
                                        <SelectTrigger id={field.name}>
                                            <SelectValue placeholder="Select a blood request" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {myRequests.map((req) => (
                                                <SelectItem key={req.id} value={req.id}>
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={cn(
                                                                "inline-flex items-center justify-center rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                                                                "bg-red-50 text-red-600 border border-red-100"
                                                            )}
                                                        >
                                                            {formatBloodGroup(req.blood_group)}
                                                        </span>
                                                        <span className="font-medium">{req.patientName}</span>
                                                        <span className="text-xs text-slate-400 truncate max-w-30">
                                                            · {req.exact_location}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-[11px] text-slate-400 mt-1">
                                        This donation will be recorded against the selected request.
                                    </p>
                                    {field.state.meta.errors.length > 0 && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {field.state.meta.errors
                                                .map((e: any) => (typeof e === "string" ? e : e?.message))
                                                .filter(Boolean)
                                                .join(", ")}
                                        </p>
                                    )}
                                </Field>
                            )}
                        </form.Field>

                        {/* Schedule */}
                        <form.Field name="scheduled_at">
                            {(field) => (
                                <Field>
                                    <Label htmlFor={field.name} className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        Scheduled Date & Time
                                    </Label>
                                    <Input
                                        id={field.name}
                                        type="datetime-local"
                                        min={minValue}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    {field.state.meta.errors.length > 0 && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {field.state.meta.errors
                                                .map((e: any) => (typeof e === "string" ? e : e?.message))
                                                .filter(Boolean)
                                                .join(", ")}
                                        </p>
                                    )}
                                </Field>
                            )}
                        </form.Field>
                    </FieldGroup>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={creating}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <form.Subscribe selector={(s) => [s.canSubmit, s.values.requester_id, s.values.scheduled_at]}>
                            {([requesterId, scheduledAt]) => {
                                const disabled = !requesterId || !scheduledAt || creating;
                                return (
                                    <Button
                                        type="submit"
                                        disabled={disabled}
                                        className="btn-main bg-[#B15A36]"
                                    >
                                        {creating ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Heart className="w-4 h-4 mr-1.5" fill="currentColor" />
                                                Send Request
                                            </>
                                        )}
                                    </Button>
                                );
                            }}
                        </form.Subscribe>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}