"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, User, Hospital, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

import { useRegister } from "@/hooks/useAuth";
import { DemoCredentials } from "@/app/(auth)/_components/DemoCredentials";
import type { DemoAccount } from "@/app/(auth)/_components/DemoCredentials";
import { registerSchema, Gender, Role } from "@/app/(auth)/login/_validators/auth.validation";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import loginAnimation from "../../../../../public/Waiting.json"

type GenderValue = (typeof Gender)[keyof typeof Gender];
type RoleValue = (typeof Role)[keyof typeof Role];

const DEFAULT_VALUES: {
    name: string;
    email: string;
    password: string;
    gender: GenderValue;
    role: RoleValue;
    phone: string;
    address: string;
} = {
    name: "",
    email: "",
    password: "",
    gender: Gender.MALE,
    role: Role.USER,
    phone: "",
    address: "",
};

type Props = {
    onSuccess: (email: string) => void;
    demoAccounts: DemoAccount[];
};

export function RegisterForm({
    className,
    onSuccess,
    demoAccounts,
    ...props
}: React.ComponentProps<"div"> & Props) {
    const [activeTab, setActiveTab] = useState<"individual" | "hospital">("individual");
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const { mutateAsync: register, isPending } = useRegister();

    const form = useForm({
        defaultValues: DEFAULT_VALUES,
        validators: { onChange: registerSchema },
        onSubmit: async ({ value }) => {
            try {
                const finalRole = activeTab === "hospital" ? Role.HOSPITAL : value.role;
                await register({
                    payload: { ...value, role: finalRole },
                    file: profilePic || undefined,
                });
                toast.success("OTP sent to your email!");
                onSuccess(value.email);
            } catch (err: any) {
                toast.error("Registration failed", {
                    description: err?.data?.message || "Please check your details and try again.",
                });
            }
        },
    });

    const handleTabChange = (tab: string) => {
        const isHospital = tab === "hospital";
        setActiveTab(isHospital ? "hospital" : "individual");
        form.reset({
            ...DEFAULT_VALUES,
            role: isHospital ? Role.HOSPITAL : Role.USER,
        });
        setProfilePic(null);
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form
                        className="p-6 md:p-8"
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                    >
                        <FieldGroup className="gap-4">

                            {/* Single Header */}
                            <div className="flex flex-col items-center gap-2 text-center mb-2">
                                <h1 className="text-2xl md:text-3xl lg:text-4xl text-primary">
                                    Create an account
                                </h1>
                                <p className="text-balance text-muted-foreground text-sm">
                                    Join Life Share to save lives.
                                </p>
                            </div>

                            {/* Tabs for User vs Hospital */}
                            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                                <TabsList className="grid w-full grid-cols-2 h-10 rounded-lg bg-slate-100 p-1 mb-4">
                                    <TabsTrigger value="individual" className="rounded-md gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm">
                                        <User className="w-3.5 h-3.5" />
                                        User / Donor
                                    </TabsTrigger>
                                    <TabsTrigger value="hospital" className="rounded-md gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm">
                                        <Hospital className="w-3.5 h-3.5" />
                                        Hospital
                                    </TabsTrigger>
                                </TabsList>

                                {/* Name & Email */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <form.Field name="name">
                                        {(field) => (
                                            <Field>
                                                <FieldLabel htmlFor={field.name}>
                                                    {activeTab === "hospital" ? "Hospital Name" : "Full Name"}
                                                </FieldLabel>
                                                <Input
                                                    id={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    placeholder={activeTab === "hospital" ? "Dhaka Medical" : "John Doe"}
                                                />
                                                <FieldError errors={field.state.meta.errors} />
                                            </Field>
                                        )}
                                    </form.Field>

                                    <form.Field name="email">
                                        {(field) => (
                                            <Field>
                                                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                                <Input
                                                    id={field.name}
                                                    type="email"
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    placeholder="m@example.com"
                                                />
                                                <FieldError errors={field.state.meta.errors} />
                                            </Field>
                                        )}
                                    </form.Field>
                                </div>

                                {/* Password & Gender */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <form.Field name="password">
                                        {(field) => (
                                            <Field>
                                                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                                <Input
                                                    id={field.name}
                                                    type="password"
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    placeholder="*****"
                                                />
                                                <FieldError errors={field.state.meta.errors} />
                                            </Field>
                                        )}
                                    </form.Field>

                                    <form.Field name="gender">
                                        {(field) => (
                                            <Field>
                                                <FieldLabel>Gender</FieldLabel>
                                                <Select
                                                    value={field.state.value}
                                                    onValueChange={(v) => field.handleChange(v as GenderValue)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value={Gender.MALE}>Male</SelectItem>
                                                        <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                                                        <SelectItem value={Gender.OTHERS}>Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FieldError errors={field.state.meta.errors} />
                                            </Field>
                                        )}
                                    </form.Field>
                                </div>

                                {/* Conditional: Role for Individual */}
                                {activeTab === "individual" && (
                                    <form.Field name="role">
                                        {(field) => (
                                            <Field className="mb-4">
                                                <FieldLabel>Register as</FieldLabel>
                                                <Select
                                                    value={field.state.value}
                                                    onValueChange={(v) => field.handleChange(v as RoleValue)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value={Role.USER}>User (Request Blood)</SelectItem>
                                                        <SelectItem value={Role.DONOR}>Donor (Donate Blood)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FieldError errors={field.state.meta.errors} />
                                            </Field>
                                        )}
                                    </form.Field>
                                )}

                                {/* Conditional: Phone & Address for Hospital */}
                                {activeTab === "hospital" && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-blue-50/50 border border-blue-100 mb-4">
                                        <form.Field name="phone">
                                            {(field) => (
                                                <Field>
                                                    <FieldLabel className="text-blue-900">Phone *</FieldLabel>
                                                    <Input
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        placeholder="018XXXXXXXX"
                                                    />
                                                    <FieldError errors={field.state.meta.errors} />
                                                </Field>
                                            )}
                                        </form.Field>
                                        <form.Field name="address">
                                            {(field) => (
                                                <Field>
                                                    <FieldLabel className="text-blue-900">Address *</FieldLabel>
                                                    <Input
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        placeholder="Dhaka, Bangladesh"
                                                    />
                                                    <FieldError errors={field.state.meta.errors} />
                                                </Field>
                                            )}
                                        </form.Field>
                                    </div>
                                )}

                                {/* Profile Pic (Moved below fields to save top space) */}
                                <Field className="mb-6">
                                    <FieldLabel className="text-sm">Profile Picture (Optional)</FieldLabel>
                                    <div className="flex items-center gap-4 mt-1">
                                        <div className="relative w-12 h-12 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
                                            {profilePic ? (
                                                <>
                                                    <Image src={URL.createObjectURL(profilePic)} alt="Preview" fill className="object-cover" />
                                                    <button type="button" onClick={() => setProfilePic(null)} className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                                                        <X className="w-4 h-4 text-white" />
                                                    </button>
                                                </>
                                            ) : (
                                                <Upload className="w-4 h-4 text-slate-400" />
                                            )}
                                        </div>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) setProfilePic(file);
                                            }}
                                            className="cursor-pointer file:text-[#B15A36] file:font-semibold file:bg-orange-50 file:border-0 file:rounded-full file:px-3 file:py-1 text-xs h-9"
                                        />
                                    </div>
                                </Field>

                                {/* Submit Button */}
                                <Field>
                                    <form.Subscribe selector={(s) => [s.canSubmit]}>
                                        {([canSubmit]) => (
                                            <Button
                                                type="submit"
                                                disabled={!canSubmit || isPending}
                                                className="btn-main bg-[#B15A36] w-full"
                                            >
                                                {isPending ? "Creating account..." : "Register"}
                                            </Button>
                                        )}
                                    </form.Subscribe>
                                </Field>
                            </Tabs>

                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Or continue with
                            </FieldSeparator>

                            <Field className="max-w-3xs mx-auto w-full">
                                <Button variant="outline" type="button" className="border border-blue-300 w-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" />
                                    </svg>
                                    <span className="sr-only">Register with Google</span>
                                </Button>
                            </Field>

                            <DemoCredentials demoAccounts={demoAccounts} />

                            <FieldDescription className="text-center">
                                Already have an account? <Link href="/login">Log in</Link>
                            </FieldDescription>

                        </FieldGroup>
                    </form>

                    <div className="relative hidden bg-[#F8F9FA] md:flex items-center justify-center p-8 overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-tr from-orange-50/50 to-transparent pointer-events-none" />

                        <DotLottieReact
                            data={loginAnimation}
                            loop
                            autoplay
                            className="w-full max-w-md relative z-10"
                        />
                    </div>
                </CardContent>
            </Card>

            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our <Link href="/terms" className="underline">Terms of Service</Link>{" "}
                and <Link href="/privacy" className="underline">Privacy Policy</Link>.
            </FieldDescription>
        </div>
    );
}

function FieldError({ errors }: { errors: unknown[] }) {
    if (!errors.length) return null;
    const message = errors.map((e) => (typeof e === "string" ? e : (e as any)?.message)).filter(Boolean).join(", ");
    if (!message) return null;
    return <p className="text-xs text-red-500 mt-1">{message}</p>;
}