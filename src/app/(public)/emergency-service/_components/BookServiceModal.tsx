"use client";

import { useState } from "react";
import {
    Dialog, DialogClose, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useForm } from "@tanstack/react-form";
import {
    AlertCircle, Calendar, CreditCard, Heart, Loader2, MapPin, Phone, User,
} from "lucide-react";
import { toast } from "sonner";

import { bookingValidation } from "../_validators/booking.validation";
import { useCreateBooking } from "@/hooks/useBooking";
import { PAYMENT_METHODS } from "@/constants/booking";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    serviceId: string;
    serviceName: string;
    price: string;
};

const toDatetimeLocal = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatPrice = (price: string) => {
    const n = Number(price);
    return isNaN(n) ? "—" : `৳${n.toLocaleString("en-BD")}`;
};

const DEFAULT_VALUES = {
    patient_name: "",
    patient_number: "",
    payment_via: "",
    emergency_location: "",
    description: "",
    scheduled_at: "",
    note: "",
};

export function BookServiceModal({
    open,
    onOpenChange,
    serviceId,
    serviceName,
    price,
}: Props) {
    const [serverError, setServerError] = useState<string | null>(null);
    const { mutateAsync: book, isPending } = useCreateBooking();

    const minValue = toDatetimeLocal(new Date(Date.now() + 15 * 60 * 1000));

    const form = useForm({
        defaultValues: DEFAULT_VALUES,
        validators: { onChange: bookingValidation },
        onSubmit: async ({ value }) => {
            setServerError(null);
            try {
                await book({
                    id: serviceId,
                    payload: {
                        patient_name: value.patient_name.trim(),
                        patient_number: value.patient_number.trim(),
                        payment_via: value.payment_via,
                        emergency_location: value.emergency_location.trim(),
                        description: value.description.trim(),
                        scheduled_at: new Date(value.scheduled_at).toISOString(),
                        note: value.note?.trim() || undefined,
                    },
                });

                form.reset();
                onOpenChange(false);
                toast.success("Booking confirmed", {
                    description: `Your request for "${serviceName}" has been submitted.`,
                });
            } catch (err: any) {
                setServerError(
                    err?.data?.message || "Failed to book. Please try again."
                );
            }
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg font-graphik max-h-[92vh] overflow-hidden flex flex-col p-0">
                {/* Header */}
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-2">
                        <Heart className="w-6 h-6 text-red-500" fill="currentColor" />
                    </div>
                    <DialogTitle className="font-semibold text-lg">
                        Book {serviceName}
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the patient details. The provider will contact you to
                        confirm the booking.
                    </DialogDescription>
                    {serverError && (
                        <div className="mt-3 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md text-center flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>{serverError}</span>
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
                    {/* Scrollable body */}
                    <FieldGroup className="px-6 py-5 overflow-y-auto flex-1">
                        {/* ---------- SECTION: Patient Info ---------- */}
                        <SectionTitle>Patient Information</SectionTitle>

                        <form.Field name="patient_name">
                            {(field) => (
                                <Field>
                                    <FieldLabel htmlFor={field.name} className="flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5 text-slate-400" />
                                        Patient Name
                                    </FieldLabel>
                                    <Input
                                        id={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="e.g. Al Hasan"
                                    />
                                    <FieldError errors={field.state.meta.errors} />
                                </Field>
                            )}
                        </form.Field>

                        <form.Field name="patient_number">
                            {(field) => (
                                <Field>
                                    <FieldLabel htmlFor={field.name} className="flex items-center gap-1.5">
                                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                                        Contact Number
                                    </FieldLabel>
                                    <Input
                                        id={field.name}
                                        type="tel"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="+8801234567890"
                                    />
                                    <FieldError errors={field.state.meta.errors} />
                                </Field>
                            )}
                        </form.Field>

                        <form.Field name="emergency_location">
                            {(field) => (
                                <Field>
                                    <FieldLabel htmlFor={field.name} className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                        Emergency Location
                                    </FieldLabel>
                                    <Input
                                        id={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="e.g. BSMMCH, Room 402, 18F, Dhaka"
                                    />
                                    <FieldError errors={field.state.meta.errors} />
                                </Field>
                            )}
                        </form.Field>

                        {/* ---------- SECTION: Emergency Details ---------- */}
                        <SectionTitle>Emergency Details</SectionTitle>

                        <form.Field name="description">
                            {(field) => (
                                <Field>
                                    <FieldLabel htmlFor={field.name}>
                                        Description
                                    </FieldLabel>
                                    <Textarea
                                        id={field.name}
                                        rows={3}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="Briefly describe the emergency situation..."
                                    />
                                    <FieldError errors={field.state.meta.errors} />
                                </Field>
                            )}
                        </form.Field>

                        {/* ---------- SECTION: Schedule & Payment ---------- */}
                        <SectionTitle>Schedule & Payment</SectionTitle>

                        <form.Field name="scheduled_at">
                            {(field) => (
                                <Field>
                                    <FieldLabel htmlFor={field.name} className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                        Scheduled Date & Time
                                    </FieldLabel>
                                    <Input
                                        id={field.name}
                                        type="datetime-local"
                                        min={minValue}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    <FieldError errors={field.state.meta.errors} />
                                </Field>
                            )}
                        </form.Field>

                        <form.Field name="payment_via">
                            {(field) => (
                                <Field>
                                    <FieldLabel htmlFor={field.name} className="flex items-center gap-1.5">
                                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                                        Payment Method
                                    </FieldLabel>
                                    <Select
                                        value={field.state.value}
                                        onValueChange={(v) => field.handleChange(v)}
                                    >
                                        <SelectTrigger id={field.name}>
                                            <SelectValue placeholder="Select payment method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PAYMENT_METHODS.map((p) => (
                                                <SelectItem key={p.value} value={p.value}>
                                                    {p.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldError errors={field.state.meta.errors} />
                                </Field>
                            )}
                        </form.Field>

                        {/* ---------- SECTION: Optional Note ---------- */}
                        <form.Field name="note">
                            {(field) => (
                                <Field>
                                    <FieldLabel htmlFor={field.name}>
                                        Note{" "}
                                        <span className="text-slate-400 font-normal">
                                            (optional)
                                        </span>
                                    </FieldLabel>
                                    <Textarea
                                        id={field.name}
                                        rows={2}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="Any special instructions..."
                                    />
                                    <FieldError errors={field.state.meta.errors} />
                                </Field>
                            )}
                        </form.Field>
                    </FieldGroup>

                    {/* Sticky footer */}
                    <DialogFooter className="px-6 py-4 border-t border-slate-100 shrink-0 bg-slate-50/50">
                        <div className="flex-1 hidden sm:block">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Total
                            </p>
                            <p className="text-lg font-black text-slate-900">
                                {formatPrice(price)}
                            </p>
                        </div>

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
                                            Booking...
                                        </>
                                    ) : (
                                        <>
                                            <Heart className="w-4 h-4 mr-1.5" fill="currentColor" />
                                            Confirm Booking
                                        </>
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

// ---- Helpers ----

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2 first:pt-0">
            {children}
        </p>
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