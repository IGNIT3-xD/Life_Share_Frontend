"use client";

import { useEffect, useState } from "react";
import {
    Dialog, DialogClose, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { Calendar, Loader2, MapPin, Pencil, Phone, User } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useUpdateBooking } from "@/hooks/useBooking";
import type { EmergencyServiceBookingProp } from "@/api/booking";

// ---- Validation ----
const editValidation = z.object({
    patient_name: z.string().min(2, "At least 2 characters").max(100),
    patient_number: z
        .string()
        .min(6, "Too short")
        .max(20, "Too long")
        .regex(/^[+\d\s\-()]+$/, "Invalid phone number"),
    emergency_location: z.string().min(5, "At least 5 characters").max(255),
    description: z.string().min(10, "At least 10 characters").max(1000),
    scheduled_at: z
        .string()
        .min(1, "Required")
        .refine((v) => !isNaN(new Date(v).getTime()), "Invalid date"),
    note: z.string().max(500).or(z.literal("")),
});

const toDatetimeLocal = (iso: string) => {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
        d.getHours()
    )}:${pad(d.getMinutes())}`;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: EmergencyServiceBookingProp | null;
};

export function EditBookingModal({ open, onOpenChange, booking }: Props) {
    const [serverError, setServerError] = useState<string | null>(null);
    const { mutateAsync: update, isPending } = useUpdateBooking();

    // Build the "original" normalized shape once per open
    const original = booking
        ? {
            patient_name: booking.patient_name ?? "",
            patient_number: booking.patient_number ?? "",
            emergency_location: booking.emergency_location ?? "",
            description: booking.description ?? "",
            scheduled_at: toDatetimeLocal(booking.scheduled_at),
            note: booking.note ?? "",
        }
        : {
            patient_name: "",
            patient_number: "",
            emergency_location: "",
            description: "",
            scheduled_at: "",
            note: "",
        };

    const form = useForm({
        defaultValues: original,
        validators: { onChange: editValidation },
        onSubmit: async ({ value }) => {
            if (!booking) return;
            setServerError(null);

            // Diff — only send what changed
            const payload: Record<string, string | undefined> = {};
            if (value.patient_name !== original.patient_name)
                payload.patient_name = value.patient_name.trim();
            if (value.patient_number !== original.patient_number)
                payload.patient_number = value.patient_number.trim();
            if (value.emergency_location !== original.emergency_location)
                payload.emergency_location = value.emergency_location.trim();
            if (value.description !== original.description)
                payload.description = value.description.trim();
            if (value.scheduled_at !== original.scheduled_at)
                payload.scheduled_at = new Date(value.scheduled_at).toISOString();
            if ((value.note ?? "") !== (original.note ?? ""))
                payload.note = value.note?.trim() || undefined;

            if (Object.keys(payload).length === 0) {
                toast.info("No changes to update");
                return;
            }

            try {
                await update({ id: booking.id, payload });
                onOpenChange(false);
                toast.success("Booking updated");
            } catch (err: any) {
                setServerError(err?.data?.message || "Failed to update.");
            }
        },
    });

    // Refill on open with a fresh booking
    useEffect(() => {
        if (open && booking) {
            form.reset({
                patient_name: booking.patient_name ?? "",
                patient_number: booking.patient_number ?? "",
                emergency_location: booking.emergency_location ?? "",
                description: booking.description ?? "",
                scheduled_at: toDatetimeLocal(booking.scheduled_at),
                note: booking.note ?? "",
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, booking?.id]);

    if (!booking) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg font-graphik max-h-[92vh] overflow-hidden flex flex-col p-0">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                        <Pencil className="w-6 h-6 text-blue-600" />
                    </div>
                    <DialogTitle className="font-semibold text-lg">Edit Booking</DialogTitle>
                    <DialogDescription>
                        Only the fields you change will be updated.
                    </DialogDescription>
                    {serverError && (
                        <div className="mt-3 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md text-center">
                            {serverError}
                        </div>
                    )}
                </DialogHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                    className="flex-1 flex flex-col min-h-0"
                >
                    <FieldGroup className="px-6 py-5 overflow-y-auto flex-1">
                        {/* Patient Name */}
                        <form.Field name="patient_name">
                            {(field) => (
                                <Field>
                                    <Label className="flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5 text-slate-400" />
                                        Patient Name
                                    </Label>
                                    <Input
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    <FieldError errors={field.state.meta.errors} />
                                </Field>
                            )}
                        </form.Field>

                        {/* Phone */}
                        <form.Field name="patient_number">
                            {(field) => (
                                <Field>
                                    <Label className="flex items-center gap-1.5">
                                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                                        Contact Number
                                    </Label>
                                    <Input
                                        type="tel"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    <FieldError errors={field.state.meta.errors} />
                                </Field>
                            )}
                        </form.Field>

                        {/* Location */}
                        <form.Field name="emergency_location">
                            {(field) => (
                                <Field>
                                    <Label className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                        Emergency Location
                                    </Label>
                                    <Input
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    <FieldError errors={field.state.meta.errors} />
                                </Field>
                            )}
                        </form.Field>

                        {/* Description */}
                        <form.Field name="description">
                            {(field) => (
                                <Field>
                                    <Label>Description</Label>
                                    <Textarea
                                        rows={3}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    <FieldError errors={field.state.meta.errors} />
                                </Field>
                            )}
                        </form.Field>

                        {/* Scheduled */}
                        <form.Field name="scheduled_at">
                            {(field) => (
                                <Field>
                                    <Label className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                        Scheduled Date & Time
                                    </Label>
                                    <Input
                                        type="datetime-local"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    <FieldError errors={field.state.meta.errors} />
                                </Field>
                            )}
                        </form.Field>

                        {/* Note */}
                        <form.Field name="note">
                            {(field) => (
                                <Field>
                                    <Label>
                                        Note <span className="text-slate-400 font-normal">(optional)</span>
                                    </Label>
                                    <Textarea
                                        rows={2}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    <FieldError errors={field.state.meta.errors} />
                                </Field>
                            )}
                        </form.Field>
                    </FieldGroup>

                    <DialogFooter className="px-6 py-4 border-t border-slate-100 shrink-0 bg-slate-50/50">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isPending}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <form.Subscribe selector={(s) => [s.canSubmit]}>
                            {([canSubmit]) => (
                                <Button
                                    type="submit"
                                    disabled={!canSubmit || isPending}
                                    className="btn-main bg-[#B15A36] hover:bg-[#9a4e2e]"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Booking"
                                    )}
                                </Button>
                            )}
                        </form.Subscribe>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function FieldError({ errors }: { errors: unknown[] }) {
    if (!errors.length) return null;
    const message = errors
        .map((e) => (typeof e === "string" ? e : (e as any)?.message))
        .filter(Boolean)
        .join(", ");
    if (!message) return null;
    return <p className="text-xs text-red-500 mt-1">{message}</p>;
}