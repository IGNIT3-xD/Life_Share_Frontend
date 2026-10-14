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

import { donorProfileValidation } from "../_validators/donor.validation";
import { BLOOD_GROUPS } from "@/constants/donor";
import { DonorProfileResponse } from "@/api/donors";
import { useDonorProfileCreate, useUpdateDonorProfile } from "@/hooks/useDonors";

const AVAILABILITY = [
    { value: "AVAILABLE", label: "Available" },
    { value: "ON_HOLD", label: "On Hold" },
];

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** If provided, modal runs in update mode with prefilled values */
    profile?: DonorProfileResponse | null;
};

const EMPTY = {
    blood_group: "",
    location: "",
    age: "",
    availability: "AVAILABLE",
    weightKg: "",
    height: "",
};

export function DonorProfileFormModal({ open, onOpenChange, profile }: Props) {
    const isUpdate = !!profile;
    const [serverError, setServerError] = useState<string | null>(null);
    const { mutateAsync: createProfile, isPending: creating } = useDonorProfileCreate();
    const { mutateAsync: updateProfile, isPending: updating } = useUpdateDonorProfile();
    const isPending = creating || updating;

    const form = useForm({
        defaultValues: EMPTY,
        validators: { onChange: donorProfileValidation },
        onSubmit: async ({ value }) => {
            setServerError(null);
            const payload = {
                blood_group: value.blood_group,
                location: value.location,
                age: Number(value.age),
                availability: value.availability,
                weightKg: Number(value.weightKg),
                height: Number(value.height),
            };
            try {
                if (isUpdate) {
                    await updateProfile(payload);
                    toast.success("Donor profile updated");
                } else {
                    await createProfile(payload);
                    toast.success("Donor profile created");
                }
                form.reset();
                onOpenChange(false);
            } catch (err: any) {
                setServerError(err?.data?.message || "Something went wrong");
            }
        },
    });

    // Prefill form when opening in update mode
    useEffect(() => {
        if (!open) return;
        if (profile) {
            form.reset({
                blood_group: profile.blood_group ?? "",
                location: profile.location ?? "",
                age: String(profile.age ?? ""),
                availability: profile.availability ?? "AVAILABLE",
                weightKg: String(profile.weightKg ?? ""),
                height: String(profile.height ?? ""),
            });
        } else {
            form.reset(EMPTY);
        }
    }, [open, profile?.id]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md font-graphik">
                <DialogHeader>
                    <DialogTitle className="font-semibold text-lg">
                        {isUpdate ? "Update Donor Profile" : "Create Donor Profile"}
                    </DialogTitle>
                    <DialogDescription>
                        {isUpdate
                            ? "Update your donor information. Fields you don't change stay the same."
                            : "Fill in your details to register as a blood donor."}
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
                    <FieldGroup className="max-h-[55vh] overflow-y-auto pr-1">
                        {/* Blood Group */}
                        <form.Field name="blood_group">
                            {(field) => (
                                <Field>
                                    <Label>Blood Group</Label>
                                    <Select
                                        value={field.state.value}
                                        onValueChange={(v) => field.handleChange(v)}
                                    >
                                        <SelectTrigger>
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
                                                .map((e: any) => (typeof e === "string" ? e : e?.message))
                                                .join(", ")}
                                        </p>
                                    )}
                                </Field>
                            )}
                        </form.Field>

                        {/* Location */}
                        <form.Field name="location">
                            {(field) => (
                                <Field>
                                    <Label>Location</Label>
                                    <Input
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="e.g. Dhaka, Bangladesh"
                                    />
                                    {field.state.meta.errors.length > 0 && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {field.state.meta.errors
                                                .map((e: any) => (typeof e === "string" ? e : e?.message))
                                                .join(", ")}
                                        </p>
                                    )}
                                </Field>
                            )}
                        </form.Field>

                        <div className="grid grid-cols-2 gap-3">
                            {/* Age */}
                            <form.Field name="age">
                                {(field) => (
                                    <Field>
                                        <Label>Age</Label>
                                        <Input
                                            type="number"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="24"
                                        />
                                        {field.state.meta.errors.length > 0 && (
                                            <p className="text-xs text-red-500 mt-1">
                                                {field.state.meta.errors
                                                    .map((e: any) => (typeof e === "string" ? e : e?.message))
                                                    .join(", ")}
                                            </p>
                                        )}
                                    </Field>
                                )}
                            </form.Field>

                            {/* Availability */}
                            <form.Field name="availability">
                                {(field) => (
                                    <Field>
                                        <Label>Availability</Label>
                                        <Select
                                            value={field.state.value}
                                            onValueChange={(v) => field.handleChange(v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {AVAILABILITY.map((a) => (
                                                    <SelectItem key={a.value} value={a.value}>
                                                        {a.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {field.state.meta.errors.length > 0 && (
                                            <p className="text-xs text-red-500 mt-1">
                                                {field.state.meta.errors
                                                    .map((e: any) => (typeof e === "string" ? e : e?.message))
                                                    .join(", ")}
                                            </p>
                                        )}
                                    </Field>
                                )}
                            </form.Field>

                            {/* Weight */}
                            <form.Field name="weightKg">
                                {(field) => (
                                    <Field>
                                        <Label>Weight (kg)</Label>
                                        <Input
                                            type="number"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="75"
                                        />
                                        {field.state.meta.errors.length > 0 && (
                                            <p className="text-xs text-red-500 mt-1">
                                                {field.state.meta.errors
                                                    .map((e: any) => (typeof e === "string" ? e : e?.message))
                                                    .join(", ")}
                                            </p>
                                        )}
                                    </Field>
                                )}
                            </form.Field>

                            {/* Height */}
                            <form.Field name="height">
                                {(field) => (
                                    <Field>
                                        <Label>Height (cm)</Label>
                                        <Input
                                            type="number"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="165"
                                        />
                                        {field.state.meta.errors.length > 0 && (
                                            <p className="text-xs text-red-500 mt-1">
                                                {field.state.meta.errors
                                                    .map((e: any) => (typeof e === "string" ? e : e?.message))
                                                    .join(", ")}
                                            </p>
                                        )}
                                    </Field>
                                )}
                            </form.Field>
                        </div>
                    </FieldGroup>

                    <DialogFooter className="mt-6">
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
                                    className="btn-main bg-[#B15A36]"
                                >
                                    {isPending
                                        ? isUpdate
                                            ? "Updating..."
                                            : "Creating..."
                                        : isUpdate
                                            ? "Update Profile"
                                            : "Create Profile"}
                                </Button>
                            )}
                        </form.Subscribe>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}