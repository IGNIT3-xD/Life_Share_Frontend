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
import { Textarea } from "@/components/ui/textarea";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useForm } from "@tanstack/react-form";
import { updateRequestValidation } from "../_validators/user.validation";
import { useUpdateBloodRequest } from "@/hooks/useRequester";
import { BLOOD_GROUPS } from "@/constants/donor";
import { URGENCY_OPTIONS, RequestStatus } from "@/constants/requester";
import type { RequesterProp } from "@/components/RequesterCard";
import type { UpdateBloodRequestPayload } from "@/api/requester";
import { toast } from "sonner";

type UpdateRequestModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    request: RequesterProp | null;
};

// Convert ISO string → "YYYY-MM-DDTHH:mm"
const toDatetimeLocalValue = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

// Build a diff payload — only fields that actually changed
const buildPatchPayload = (
    value: {
        patientName: string;
        blood_group: string;
        unit_required: string;
        exact_location: string;
        expires_at: string;
        urgency: string;
        note: string;
        request_status: string;
    },
    original: RequesterProp
): UpdateBloodRequestPayload => {
    const payload: UpdateBloodRequestPayload = {};

    if (value.patientName !== original.patientName) {
        payload.patientName = value.patientName;
    }

    if (value.blood_group !== original.blood_group) {
        payload.blood_group = value.blood_group;
    }

    if (Number(value.unit_required) !== original.unit_required) {
        payload.unit_required = Number(value.unit_required);
    }

    if (value.exact_location !== original.exact_location) {
        payload.exact_location = value.exact_location;
    }

    // Compare timestamps (both converted to ms)
    const originalExpiry = new Date(original.expires_at).getTime();
    const newExpiry = new Date(value.expires_at).getTime();
    if (originalExpiry !== newExpiry) {
        payload.expires_at = new Date(value.expires_at).toISOString();
    }

    if (value.urgency !== original.urgency) {
        payload.urgency = value.urgency;
    }

    // Only send note if it actually changed (handle "" vs undefined)
    const originalNote = original.note ?? "";
    if (value.note.trim() !== originalNote.trim()) {
        payload.note = value.note.trim() || undefined;
    }

    // Status is only sent if it's changed from the original
    if (value.request_status !== original.request_status) {
        payload.request_status = value.request_status;
    }

    return payload;
};

export function UpdateRequestModal({
    open,
    onOpenChange,
    request,
}: UpdateRequestModalProps) {
    const [serverError, setServerError] = useState<string | null>(null);
    const { mutateAsync: updateRequest, isPending } = useUpdateBloodRequest();
    // Outside the component (or inside, doesn't matter):
    const defaultValues: {
        patientName: string;
        blood_group: string;
        unit_required: string;
        exact_location: string;
        expires_at: string;
        urgency: string;
        note: string;
        request_status: string;
    } = {
        patientName: "",
        blood_group: "",
        unit_required: "",
        exact_location: "",
        expires_at: "",
        urgency: "",
        note: "",
        request_status: RequestStatus.PENDING,
    };

    // Inside the component:
    const form = useForm({
        defaultValues,
        validators: {
            onChange: updateRequestValidation,
        },
        onSubmit: async ({ value }) => {
            if (!request) return;
            setServerError(null);

            try {
                // No more `as string` needed — value is properly typed now
                const payload = buildPatchPayload(value, request);

                if (Object.keys(payload).length === 0) {
                    toast.info("No changes to update");
                    return;
                }

                await updateRequest({ id: request.id, payload });

                form.reset();
                onOpenChange(false);
                toast.success("Blood request updated successfully", {
                    description: "Your changes have been saved.",
                });
            } catch (error: any) {
                setServerError(
                    error?.data?.message || "Failed to update. Please try again."
                );
            }
        },
    });

    // ✅ Pre-fill form whenever the selected `request` changes
    useEffect(() => {
        if (!request) return;
        form.reset({
            patientName: request.patientName ?? "",
            blood_group: request.blood_group ?? "",
            unit_required: String(request.unit_required ?? ""),
            exact_location: request.exact_location ?? "",
            expires_at: toDatetimeLocalValue(request.expires_at),
            urgency: request.urgency ?? "",
            note: request.note ?? "",
            request_status:
                request.request_status === "CANCELLED"
                    ? RequestStatus.CANCELLED
                    : RequestStatus.PENDING,
        });
    }, [request, form]);

    if (!request) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md font-graphik">
                <DialogHeader>
                    <DialogTitle className="font-semibold text-lg">
                        Update Blood Request
                    </DialogTitle>
                    <DialogDescription>
                        Only the fields you change will be updated. Leave a field alone to
                        keep its current value.
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
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                >
                    <FieldGroup className="max-h-[55vh] overflow-y-auto pr-1">
                        {/* Patient Name */}
                        <form.Field name="patientName">
                            {(field) => (
                                <Field>
                                    <Label htmlFor={field.name}>Patient Name</Label>
                                    <Input
                                        id={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    {field.state.meta.errors.length > 0 && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {field.state.meta.errors
                                                .map((err: any) =>
                                                    typeof err === "string" ? err : err?.message
                                                )
                                                .join(", ")}
                                        </p>
                                    )}
                                </Field>
                            )}
                        </form.Field>

                        {/* Blood Group */}
                        <form.Field name="blood_group">
                            {(field) => (
                                <Field>
                                    <Label htmlFor={field.name}>Blood Group</Label>
                                    <Select
                                        value={field.state.value}
                                        onValueChange={(v) => field.handleChange(v)}
                                    >
                                        <SelectTrigger id={field.name}>
                                            <SelectValue placeholder="Select blood group" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {BLOOD_GROUPS.map((bg) => (
                                                <SelectItem key={bg.value} value={bg.value}>
                                                    {bg.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {field.state.meta.errors.length > 0 && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {field.state.meta.errors
                                                .map((err: any) =>
                                                    typeof err === "string" ? err : err?.message
                                                )
                                                .join(", ")}
                                        </p>
                                    )}
                                </Field>
                            )}
                        </form.Field>

                        {/* Units Required */}
                        <form.Field name="unit_required">
                            {(field) => (
                                <Field>
                                    <Label htmlFor={field.name}>Units Required</Label>
                                    <Input
                                        id={field.name}
                                        type="number"
                                        min={1}
                                        max={20}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    {field.state.meta.errors.length > 0 && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {field.state.meta.errors
                                                .map((err: any) =>
                                                    typeof err === "string" ? err : err?.message
                                                )
                                                .join(", ")}
                                        </p>
                                    )}
                                </Field>
                            )}
                        </form.Field>

                        {/* Exact Location */}
                        <form.Field name="exact_location">
                            {(field) => (
                                <Field>
                                    <Label htmlFor={field.name}>Exact Location</Label>
                                    <Input
                                        id={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    {field.state.meta.errors.length > 0 && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {field.state.meta.errors
                                                .map((err: any) =>
                                                    typeof err === "string" ? err : err?.message
                                                )
                                                .join(", ")}
                                        </p>
                                    )}
                                </Field>
                            )}
                        </form.Field>

                        {/* Expires At */}
                        <form.Field name="expires_at">
                            {(field) => (
                                <Field>
                                    <Label htmlFor={field.name}>Expires At</Label>
                                    <Input
                                        id={field.name}
                                        type="datetime-local"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    {field.state.meta.errors.length > 0 && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {field.state.meta.errors
                                                .map((err: any) =>
                                                    typeof err === "string" ? err : err?.message
                                                )
                                                .join(", ")}
                                        </p>
                                    )}
                                </Field>
                            )}
                        </form.Field>

                        {/* Urgency */}
                        <form.Field name="urgency">
                            {(field) => (
                                <Field>
                                    <Label htmlFor={field.name}>Urgency</Label>
                                    <Select
                                        value={field.state.value}
                                        onValueChange={(v) => field.handleChange(v)}
                                    >
                                        <SelectTrigger id={field.name}>
                                            <SelectValue placeholder="Select urgency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {URGENCY_OPTIONS.map((u) => (
                                                <SelectItem key={u.value} value={u.value}>
                                                    {u.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {field.state.meta.errors.length > 0 && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {field.state.meta.errors
                                                .map((err: any) =>
                                                    typeof err === "string" ? err : err?.message
                                                )
                                                .join(", ")}
                                        </p>
                                    )}
                                </Field>
                            )}
                        </form.Field>

                        {/* Note */}
                        <form.Field name="note">
                            {(field) => (
                                <Field>
                                    <Label htmlFor={field.name}>
                                        Note{" "}
                                        <span className="text-slate-400 font-normal">
                                            (optional)
                                        </span>
                                    </Label>
                                    <Textarea
                                        id={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        rows={3}
                                    />
                                    {field.state.meta.errors.length > 0 && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {field.state.meta.errors
                                                .map((err: any) =>
                                                    typeof err === "string" ? err : err?.message
                                                )
                                                .join(", ")}
                                        </p>
                                    )}
                                </Field>
                            )}
                        </form.Field>

                        {/* Request Status (for cancellation) */}
                        <form.Field name="request_status">
                            {(field) => (
                                <Field>
                                    <Label htmlFor={field.name}>Request Status</Label>
                                    <Select
                                        value={field.state.value}
                                        onValueChange={(v) => field.handleChange(v)}
                                    >
                                        <SelectTrigger id={field.name}>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={RequestStatus.PENDING}>
                                                Pending
                                            </SelectItem>
                                            <SelectItem value={RequestStatus.CANCELLED}>
                                                Cancelled
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {field.state.meta.errors.length > 0 && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {field.state.meta.errors
                                                .map((err: any) =>
                                                    typeof err === "string" ? err : err?.message
                                                )
                                                .join(", ")}
                                        </p>
                                    )}
                                </Field>
                            )}
                        </form.Field>
                    </FieldGroup>

                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isPending}>
                                Cancel
                            </Button>
                        </DialogClose>

                        <form.Subscribe selector={(state) => [state.canSubmit]}>
                            {([canSubmit]) => (
                                <Button
                                    type="submit"
                                    disabled={!canSubmit || isPending}
                                    className="btn-main bg-[#B15A36]"
                                >
                                    {isPending ? "Updating..." : "Update Request"}
                                </Button>
                            )}
                        </form.Subscribe>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}