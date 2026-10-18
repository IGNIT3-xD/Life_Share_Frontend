"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useEditHospitalProfile } from "@/hooks/useHospital";
import type { HospitalProfileResponse, UpdateProfilePayload } from "@/api/hospital";

const editSchema = z.object({
    hospital_name: z.string().min(2, "Name is required"),
    hospital_phone: z.string(),
    hospital_address: z.string(),
    license_number: z.string().min(3, "License required"),
    description: z.string().min(10, "Description required"),
});

type Props = { open: boolean; onOpenChange: (open: boolean) => void; profile: HospitalProfileResponse; };

export function EditHospitalModal({ open, onOpenChange, profile }: Props) {
    const [serverError, setServerError] = useState<string | null>(null);
    const { mutateAsync: editProfile, isPending } = useEditHospitalProfile();

    const original = {
        hospital_name: profile.user.name,
        hospital_phone: profile.user.phone || "",
        hospital_address: profile.user.address || "",
        license_number: profile.license_number,
        description: profile.description,
    };

    const form = useForm({
        defaultValues: original,
        validators: { onChange: editSchema },
        onSubmit: async ({ value }) => {
            setServerError(null);
            const payload: UpdateProfilePayload = {};

            if (value.hospital_name !== original.hospital_name) payload.hospital_name = value.hospital_name;
            if (value.hospital_phone !== original.hospital_phone) payload.hospital_phone = value.hospital_phone;
            if (value.hospital_address !== original.hospital_address) payload.hospital_address = value.hospital_address;
            if (value.license_number !== original.license_number) payload.license_number = value.license_number;
            if (value.description !== original.description) payload.description = value.description;

            if (Object.keys(payload).length === 0) {
                toast.info("No changes to update");
                return;
            }

            try {
                await editProfile(payload);
                toast.success("Profile updated successfully!");
                onOpenChange(false);
            } catch (err: any) {
                setServerError(err?.data?.message || "Failed to update profile.");
            }
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md font-graphik max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                        <Pencil className="w-6 h-6 text-blue-600" />
                    </div>
                    <DialogTitle className="font-semibold text-lg">Edit Hospital Profile</DialogTitle>
                    <DialogDescription>Only the fields you change will be updated.</DialogDescription>
                    {serverError && <div className="mt-3 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">{serverError}</div>}
                </DialogHeader>

                <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
                    <FieldGroup className="py-4">
                        <form.Field name="hospital_name">
                            {(field) => (
                                <Field>
                                    <Label>Hospital Name</Label>
                                    <Input value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
                                    {field.state.meta.errors.length > 0 && <p className="text-xs text-red-500 mt-1">{field.state.meta.errors.map((e: any) => e.message).join(", ")}</p>}
                                </Field>
                            )}
                        </form.Field>
                        <form.Field name="license_number">
                            {(field) => (
                                <Field>
                                    <Label>License Number</Label>
                                    <Input value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
                                    {field.state.meta.errors.length > 0 && <p className="text-xs text-red-500 mt-1">{field.state.meta.errors.map((e: any) => e.message).join(", ")}</p>}
                                </Field>
                            )}
                        </form.Field>
                        <form.Field name="hospital_phone">
                            {(field) => (
                                <Field>
                                    <Label>Phone</Label>
                                    <Input value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
                                </Field>
                            )}
                        </form.Field>
                        <form.Field name="hospital_address">
                            {(field) => (
                                <Field>
                                    <Label>Address</Label>
                                    <Input value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
                                </Field>
                            )}
                        </form.Field>
                        <form.Field name="description">
                            {(field) => (
                                <Field>
                                    <Label>Description</Label>
                                    <Textarea rows={3} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
                                    {field.state.meta.errors.length > 0 && <p className="text-xs text-red-500 mt-1">{field.state.meta.errors.map((e: any) => e.message).join(", ")}</p>}
                                </Field>
                            )}
                        </form.Field>
                    </FieldGroup>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Cancel</Button>
                        <Button type="submit" disabled={isPending} className="btn-main bg-[#B15A36]">
                            {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</> : "Update Profile"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}