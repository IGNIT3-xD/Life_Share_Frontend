"use client";

import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

import { useUpdateProfile } from "@/hooks/useAuth";
import { profileSchema, Gender } from "../_validators/profile";
import type { MeUser, UpdateProfilePayload } from "@/api/auth";

type GenderValue = (typeof Gender)[keyof typeof Gender];

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    profile: MeUser;
};

export function EditProfileModal({ open, onOpenChange, profile }: Props) {
    const [serverError, setServerError] = useState<string | null>(null);
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

    const original = {
        name: profile.name,
        phone: profile.phone || "",
        address: profile.address || "",
        gender: profile.gender as GenderValue,
    };

    const form = useForm({
        defaultValues: original,
        validators: { onChange: profileSchema },
        onSubmit: async ({ value }) => {
            setServerError(null);

            const payload: UpdateProfilePayload = {};
            if (value.name !== original.name) payload.name = value.name;
            if (value.phone !== original.phone) payload.phone = value.phone;
            if (value.address !== original.address) payload.address = value.address;
            if (value.gender !== original.gender) payload.gender = value.gender;

            // If nothing changed and no new file, just close
            if (Object.keys(payload).length === 0 && !profilePic) {
                toast.info("No changes to update");
                onOpenChange(false);
                return;
            }

            try {
                await updateProfile({ payload, file: profilePic || undefined });
                toast.success("Profile updated successfully");
                onOpenChange(false);
            } catch (err: any) {
                setServerError(err?.data?.message || "Failed to update profile.");
            }
        },
    });

    // Reset form when opening
    useEffect(() => {
        if (open) {
            form.reset(original);
            setProfilePic(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, profile.id]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md font-graphik max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-semibold text-lg">Edit Profile</DialogTitle>
                    <DialogDescription>Update your personal information and profile picture.</DialogDescription>
                    {serverError && <div className="mt-3 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">{serverError}</div>}
                </DialogHeader>

                <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
                    <FieldGroup className="py-4">

                        {/* Profile Picture Upload */}
                        <Field>
                            <Label>Profile Picture</Label>
                            <div className="flex items-center gap-4 mt-1">
                                <div className="relative w-14 h-14 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
                                    {profilePic ? (
                                        <>
                                            <Image src={URL.createObjectURL(profilePic)} alt="Preview" fill className="object-cover" />
                                            <button type="button" onClick={() => setProfilePic(null)} className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center">
                                                <X className="w-4 h-4 text-white" />
                                            </button>
                                        </>
                                    ) : profile.profile_pic ? (
                                        <Image src={profile.profile_pic} alt="Current" fill className="object-cover" />
                                    ) : (
                                        <Upload className="w-5 h-5 text-slate-400" />
                                    )}
                                </div>
                                <Input type="file" accept="image/*" onChange={(e) => setProfilePic(e.target.files?.[0] || null)} className="cursor-pointer text-xs h-9 file:bg-orange-50 file:text-[#B15A36] file:border-0 file:rounded-full file:px-3" />
                            </div>
                        </Field>

                        {/* Name */}
                        <form.Field name="name">
                            {(field) => (
                                <Field>
                                    <Label>Full Name</Label>
                                    <Input value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
                                    {field.state.meta.errors.length > 0 && <p className="text-xs text-red-500 mt-1">{field.state.meta.errors.map((e: any) => e.message).join(", ")}</p>}
                                </Field>
                            )}
                        </form.Field>

                        {/* Phone */}
                        <form.Field name="phone">
                            {(field) => (
                                <Field>
                                    <Label>Phone Number</Label>
                                    <Input value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} placeholder="e.g. 018XXXXXXXX" />
                                </Field>
                            )}
                        </form.Field>

                        {/* Address */}
                        <form.Field name="address">
                            {(field) => (
                                <Field>
                                    <Label>Address</Label>
                                    <Input value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} placeholder="e.g. Dhaka, Bangladesh" />
                                </Field>
                            )}
                        </form.Field>

                        {/* Gender */}
                        <form.Field name="gender">
                            {(field) => (
                                <Field>
                                    <Label>Gender</Label>
                                    <Select value={field.state.value} onValueChange={(v) => field.handleChange(v as GenderValue)}>
                                        <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={Gender.MALE}>Male</SelectItem>
                                            <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                                            <SelectItem value={Gender.OTHER}>Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {field.state.meta.errors.length > 0 && <p className="text-xs text-red-500 mt-1">{field.state.meta.errors.map((e: any) => e.message).join(", ")}</p>}
                                </Field>
                            )}
                        </form.Field>

                    </FieldGroup>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Cancel</Button>
                        <Button type="submit" disabled={isPending} className="btn-main bg-[#B15A36]">
                            {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}