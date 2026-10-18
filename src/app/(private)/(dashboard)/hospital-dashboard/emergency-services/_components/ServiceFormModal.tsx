"use client";

import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X, Edit, Plus } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

import { useCreateEmergencyService, useUpdateMyEmergencyService } from "@/hooks/useEmergencyServices";
import { CreateAndUpdateServicePayload, Service } from "@/api/emergencyServices";
import { SERVICE_CATEGORY_OPTIONS } from "@/constants/emergency_service";

const serviceSchema = z.object({
    service_name: z.string().min(3, "Name is required"),
    service_category: z.string().min(1, "Category is required"),
    description: z.string().min(10, "Description is required"),
    price: z.string().min(1, "Price is required"),
    availability: z.string().min(1, "Availability is required"),
});

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    service: Service | null; // null = Create mode, Service = Edit mode
};

export function ServiceFormModal({ open, onOpenChange, service }: Props) {
    const isEdit = !!service;
    const [serverError, setServerError] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const { mutateAsync: createService, isPending: isCreating } = useCreateEmergencyService();
    const { mutateAsync: updateService, isPending: isUpdating } = useUpdateMyEmergencyService();
    const isPending = isCreating || isUpdating;

    const original = {
        service_name: service?.service_name ?? "",
        service_category: service?.service_category ?? "",
        description: service?.description ?? "",
        price: service?.price ?? "",
        availability: service?.availability ?? "",
    };

    const form = useForm({
        defaultValues: original,
        validators: { onChange: serviceSchema },
        onSubmit: async ({ value }) => {
            setServerError(null);
            try {
                const payload: CreateAndUpdateServicePayload = {
                    service_name: value.service_name,
                    service_category: value.service_category,
                    description: value.description,
                    price: Number(value.price),
                    availability: value.availability,
                };

                if (isEdit) {
                    await updateService({ id: service.id, payload, file: imageFile || undefined });
                    toast.success("Service updated successfully");
                } else {
                    await createService({ payload, file: imageFile || undefined });
                    toast.success("Service created successfully");
                }
                form.reset();
                setImageFile(null);
                onOpenChange(false);
            } catch (err: any) {
                setServerError(err?.data?.message || "Something went wrong.");
            }
        },
    });

    // Reset form when modal opens
    useEffect(() => {
        if (open) {
            form.reset(original);
            setImageFile(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, service?.id]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg font-graphik max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-2">
                        {isEdit ? <Edit className="w-6 h-6 text-red-500" /> : <Plus className="w-6 h-6 text-red-500" />}
                    </div>
                    <DialogTitle className="font-semibold text-lg">{isEdit ? "Edit Service" : "Create Service"}</DialogTitle>
                    <DialogDescription>{isEdit ? "Update your service details." : "Add a new emergency service to your hospital."}</DialogDescription>
                    {serverError && <div className="mt-3 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">{serverError}</div>}
                </DialogHeader>

                <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
                    <FieldGroup className="py-4">
                        {/* Image Upload */}
                        <Field>
                            <Label>Service Image</Label>
                            <div className="flex items-center gap-4 mt-1">
                                <div className="relative w-14 h-14 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
                                    {imageFile ? (
                                        <>
                                            <Image src={URL.createObjectURL(imageFile)} alt="Preview" fill className="object-cover" />
                                            <button type="button" onClick={() => setImageFile(null)} className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center">
                                                <X className="w-4 h-4 text-white" />
                                            </button>
                                        </>
                                    ) : service?.service_image ? (
                                        <Image src={service.service_image} alt="Current" fill className="object-cover" />
                                    ) : (
                                        <Upload className="w-5 h-5 text-slate-400" />
                                    )}
                                </div>
                                <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="cursor-pointer text-xs h-9 file:bg-orange-50 file:text-[#B15A36] file:border-0 file:rounded-full file:px-3" />
                            </div>
                        </Field>

                        <form.Field name="service_name">
                            {(field) => (
                                <Field>
                                    <Label>Service Name</Label>
                                    <Input value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} placeholder="e.g. 24/7 Ambulance" />
                                    {field.state.meta.errors.length > 0 && <p className="text-xs text-red-500 mt-1">{field.state.meta.errors.map((e: any) => e.message).join(", ")}</p>}
                                </Field>
                            )}
                        </form.Field>

                        <div className="grid grid-cols-2 gap-4">
                            <form.Field name="service_category">
                                {(field) => (
                                    <Field>
                                        <Label>Category</Label>
                                        <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                            <SelectContent>
                                                {SERVICE_CATEGORY_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        {field.state.meta.errors.length > 0 && <p className="text-xs text-red-500 mt-1">{field.state.meta.errors.map((e: any) => e.message).join(", ")}</p>}
                                    </Field>
                                )}
                            </form.Field>
                            <form.Field name="price">
                                {(field) => (
                                    <Field>
                                        <Label>Price (BDT)</Label>
                                        <Input type="number" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} placeholder="3000" />
                                        {field.state.meta.errors.length > 0 && <p className="text-xs text-red-500 mt-1">{field.state.meta.errors.map((e: any) => e.message).join(", ")}</p>}
                                    </Field>
                                )}
                            </form.Field>
                        </div>

                        <form.Field name="availability">
                            {(field) => (
                                <Field>
                                    <Label>Availability</Label>
                                    <Input value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} placeholder="e.g. 24/7 or 9AM-5PM" />
                                    {field.state.meta.errors.length > 0 && <p className="text-xs text-red-500 mt-1">{field.state.meta.errors.map((e: any) => e.message).join(", ")}</p>}
                                </Field>
                            )}
                        </form.Field>

                        <form.Field name="description">
                            {(field) => (
                                <Field>
                                    <Label>Description</Label>
                                    <Textarea rows={3} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} placeholder="Describe the service..." />
                                    {field.state.meta.errors.length > 0 && <p className="text-xs text-red-500 mt-1">{field.state.meta.errors.map((e: any) => e.message).join(", ")}</p>}
                                </Field>
                            )}
                        </form.Field>
                    </FieldGroup>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Cancel</Button>
                        <Button type="submit" disabled={isPending} className="btn-main bg-[#B15A36]">
                            {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : (isEdit ? "Update Service" : "Create Service")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}