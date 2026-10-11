"use client"

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
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "@tanstack/react-form"
import { bloodRequestValidate } from "../_validators/user.validation"
import { usePostBloodRequest } from "@/hooks/useRequester"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BLOOD_GROUPS } from "@/constants/donor"
import { URGENCY_OPTIONS } from "@/constants/requester"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

type PostRequestModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PostRequestModal({ open, onOpenChange }: PostRequestModalProps) {
    const { mutateAsync: createRequest, isPending } = usePostBloodRequest()
    const [serverError, setServerError] = useState<string | null>(null)

    const form = useForm({
        defaultValues: {
            patientName: "",
            blood_group: "",
            unit_required: "",
            exact_location: "",
            expires_at: "",
            urgency: "",
            note: "",
        },
        validators: {
            onChange: bloodRequestValidate
        },
        onSubmit: async ({ value }) => {
            setServerError(null)
            try {
                // console.log(value);

                const data = await createRequest({
                    patientName: value.patientName,
                    blood_group: value.blood_group,
                    unit_required: Number(value.unit_required),
                    exact_location: value.exact_location,
                    expires_at: new Date(value.expires_at).toISOString(),
                    urgency: value.urgency,
                    note: value.note.trim() || undefined,
                })

                form.reset()
                onOpenChange(false)
                toast.success("Successfully make blood request", {
                    description: "Please, wait. Your request will be reviewed by our admin."
                })
            } catch (error: any) {
                setServerError(error?.data?.message || "Invalid request. Please try again.")
            }
        }
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm font-graphik">
                <DialogHeader>
                    <DialogTitle className="font-semibold text-lg">Request for blood</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to request a blood donor. Please ensure all information is accurate.
                    </DialogDescription>
                    {
                        serverError && (
                            <DialogDescription className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md text-center">
                                {serverError}
                            </DialogDescription>
                        )
                    }
                </DialogHeader>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}>
                    <FieldGroup className="max-h-[50vh] overflow-y-auto">
                        {/* Patient Name */}
                        <form.Field name="patientName">
                            {(field) => (
                                <Field>
                                    <Label htmlFor={field.name}>Name</Label>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type="text"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="Patient Name"
                                    />
                                    {
                                        field.state.meta.errors.length > 0 && (
                                            <p className="text-xs text-red-500 mt-1">
                                                {field.state.meta.errors.map((err) => typeof err === 'string' ? err : err?.message)}
                                            </p>
                                        )
                                    }
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
                                                .map((err) => (typeof err === "string" ? err : err?.message))
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
                                        name={field.name}
                                        type="text"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="e.g. 2"
                                    />
                                    {field.state.meta.errors.length > 0 && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {field.state.meta.errors
                                                .map((err) => (typeof err === "string" ? err : err?.message))
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
                                        name={field.name}
                                        type="text"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="e.g. BSMMCH, 1no gate, 4th floor"
                                    />
                                    {field.state.meta.errors.length > 0 && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {field.state.meta.errors
                                                .map((err) => (typeof err === "string" ? err : err?.message))
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
                                        name={field.name}
                                        type="datetime-local"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    {field.state.meta.errors.length > 0 && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {field.state.meta.errors
                                                .map((err) => (typeof err === "string" ? err : err?.message))
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
                                                .map((err) => (typeof err === "string" ? err : err?.message))
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
                                        Note <span className="text-slate-400 font-normal">(optional)</span>
                                    </Label>
                                    <Textarea
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="e.g. Bike accident. Need blood urgently."
                                        rows={3}
                                    />
                                    {field.state.meta.errors.length > 0 && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {field.state.meta.errors
                                                .map((err) => (typeof err === "string" ? err : err?.message))
                                                .join(", ")}
                                        </p>
                                    )}
                                </Field>
                            )}
                        </form.Field>
                    </FieldGroup>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={isPending}>Cancel</Button>
                        </DialogClose>

                        <form.Subscribe selector={(state) => [state.canSubmit]}>
                            {([canSubmit]) => (
                                <Button
                                    type="submit"
                                    disabled={!canSubmit || isPending}
                                    className="btn-main bg-[#B15A36]"
                                >
                                    {isPending ? "Submitting..." : "Make Request"}
                                </Button>
                            )}
                        </form.Subscribe>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    )
}
