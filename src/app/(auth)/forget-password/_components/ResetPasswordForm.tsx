"use client";

import { useForm } from "@tanstack/react-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ArrowLeft, KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useResetPassword } from "@/hooks/useAuth";
import { resetPasswordSchema } from "../../login/_validators/auth.validation";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import loginAnimation from "../../../../../public/Waiting.json"

type Props = {
    email: string;
    onSuccess: () => void;
    onBack: () => void;
};

export function ResetPasswordForm({ email, onSuccess, onBack, className, ...props }: React.ComponentProps<"div"> & Props) {
    const { mutateAsync: resetPassword, isPending } = useResetPassword();

    const form = useForm({
        defaultValues: {
            otp: "",
            newPassword: "",
            confirmPassword: "",
        },
        validators: { onChange: resetPasswordSchema },
        onSubmit: async ({ value }) => {
            try {
                await resetPassword({
                    email,
                    otp: value.otp,
                    newPassword: value.newPassword,
                });
                toast.success("Password reset successful!");
                onSuccess();
            } catch (err: any) {
                toast.error("Reset failed", {
                    description: err?.data?.message || "Invalid OTP or password requirements not met.",
                });
            }
        },
    });

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form
                        className="p-6 md:p-8 flex flex-col justify-center"
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                    >
                        <FieldGroup className="gap-4">
                            <div className="flex flex-col items-center gap-2 text-center mb-2">
                                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-2">
                                    <KeyRound className="w-6 h-6 text-[#B15A36]" />
                                </div>
                                <h1 className="text-2xl md:text-3xl lg:text-4xl text-primary">
                                    Set New Password
                                </h1>
                                <p className="text-balance text-muted-foreground text-sm">
                                    We sent a code to <strong className="text-slate-900">{email}</strong>.
                                </p>
                            </div>

                            <form.Field name="otp">
                                {(field) => (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>6-Digit Reset Code</FieldLabel>
                                        <Input
                                            id={field.name}
                                            maxLength={6}
                                            placeholder="• • • • • •"
                                            className="text-center text-lg tracking-[0.3em] font-mono"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                        />
                                        {field.state.meta.errors.length > 0 && (
                                            <p className="text-xs text-red-500 mt-1">
                                                {field.state.meta.errors.map((e: any) => typeof e === "string" ? e : e?.message).join(", ")}
                                            </p>
                                        )}
                                    </Field>
                                )}
                            </form.Field>

                            <form.Field name="newPassword">
                                {(field) => (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                                        <Input
                                            id={field.name}
                                            type="password"
                                            placeholder="••••••••"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                        />
                                        {field.state.meta.errors.length > 0 && (
                                            <p className="text-xs text-red-500 mt-1">
                                                {field.state.meta.errors.map((e: any) => typeof e === "string" ? e : e?.message).join(", ")}
                                            </p>
                                        )}
                                    </Field>
                                )}
                            </form.Field>

                            <form.Field name="confirmPassword">
                                {(field) => (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>Confirm New Password</FieldLabel>
                                        <Input
                                            id={field.name}
                                            type="password"
                                            placeholder="••••••••"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                        />
                                        {field.state.meta.errors.length > 0 && (
                                            <p className="text-xs text-red-500 mt-1">
                                                {field.state.meta.errors.map((e: any) => typeof e === "string" ? e : e?.message).join(", ")}
                                            </p>
                                        )}
                                    </Field>
                                )}
                            </form.Field>

                            <Field className="mt-2">
                                <form.Subscribe selector={(s) => [s.canSubmit]}>
                                    {([canSubmit]) => (
                                        <Button
                                            type="submit"
                                            disabled={!canSubmit || isPending}
                                            className="btn-main bg-[#B15A36] w-full h-10"
                                        >
                                            {isPending ? (
                                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Resetting...</>
                                            ) : (
                                                "Reset Password"
                                            )}
                                        </Button>
                                    )}
                                </form.Subscribe>
                            </Field>

                            <FieldDescription className="text-center">
                                <button type="button" onClick={onBack} className="inline-flex items-center text-sm text-muted-foreground hover:text-slate-900">
                                    <ArrowLeft className="w-4 h-4 mr-1" /> Use a different email
                                </button>
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
        </div>
    );
}