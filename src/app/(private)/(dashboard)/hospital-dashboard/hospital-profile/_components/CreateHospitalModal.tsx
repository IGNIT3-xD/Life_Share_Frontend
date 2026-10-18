"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Building2 } from "lucide-react";
import { toast } from "sonner";
import { useCreateHospitalProfile } from "@/hooks/useHospital";

const createSchema = z.object({
    license_number: z.string().min(3, "License number is required"),
    description: z.string().min(10, "Please provide a brief description"),
});

type Props = { open: boolean; onOpenChange: (open: boolean) => void; };

export function CreateHospitalModal({ open, onOpenChange }: Props) {
    const [serverError, setServerError] = useState<string | null>(null);
    const { mutateAsync: createProfile, isPending } = useCreateHospitalProfile();

    const form = useForm({
        defaultValues: { license_number: "", description: "" },
        validators: { onChange: createSchema },
        onSubmit: async ({ value }) => {
            setServerError(null);

            try {
                await createProfile({
                    license_number: value.license_number,
                    description: value.description,
                });
                
                toast.success("Hospital profile created successfully!");
                form.reset();
                onOpenChange(false);
            } catch (err: any) {
                setServerError(err?.data?.message || "Failed to create profile.");
            }
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md font-graphik">
                <DialogHeader>
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                        <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <DialogTitle className="font-semibold text-lg">Create Hospital Profile</DialogTitle>
                    <DialogDescription>
                        Provide your official hospital details. An admin will review your application.
                    </DialogDescription>
                    {serverError && <div className="mt-3 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">{serverError}</div>}
                </DialogHeader>

                <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
                    <FieldGroup className="py-4">
                        <form.Field name="license_number">
                            {(field) => (
                                <Field>
                                    <Label>License Number</Label>
                                    <Input
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="e.g. DTM260907"
                                    />
                                    {field.state.meta.errors.length > 0 && <p className="text-xs text-red-500 mt-1">{field.state.meta.errors.map((e: any) => e.message).join(", ")}</p>}
                                </Field>
                            )}
                        </form.Field>
                        <form.Field name="description">
                            {(field) => (
                                <Field>
                                    <Label>Description</Label>
                                    <Textarea
                                        rows={4}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="Tell us about your hospital..."
                                    />
                                    {field.state.meta.errors.length > 0 && <p className="text-xs text-red-500 mt-1">{field.state.meta.errors.map((e: any) => e.message).join(", ")}</p>}
                                </Field>
                            )}
                        </form.Field>
                    </FieldGroup>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Cancel</Button>
                        <Button type="submit" disabled={isPending} className="btn-main bg-[#B15A36]">
                            {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</> : "Create Profile"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}