"use client";

import { useForm } from "@tanstack/react-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { useForgetPassword } from "@/hooks/useAuth";
import { forgetPasswordSchema } from "../../login/_validators/auth.validation";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import loginAnimation from "../../../../../public/Waiting.json"

type Props = {
    onSuccess: (email: string) => void;
};

export function ForgetPasswordForm({ className, onSuccess, ...props }: React.ComponentProps<"div"> & Props) {
    const { mutateAsync: forgetPassword, isPending } = useForgetPassword();

    const form = useForm({
        defaultValues: { email: "" },
        validators: { onChange: forgetPasswordSchema },
        onSubmit: async ({ value }) => {
            try {
                await forgetPassword(value.email);
                toast.success("OTP sent!", {
                    description: "Please check your email for the reset code.",
                });
                onSuccess(value.email);
            } catch (err: any) {
                toast.error("Failed to send OTP", {
                    description: err?.data?.message || "Please check the email and try again.",
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
                        <FieldGroup className="gap-5">
                            <div className="flex flex-col items-center gap-2 text-center mb-2">
                                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-2">
                                    <Mail className="w-6 h-6 text-[#B15A36]" />
                                </div>
                                <h1 className="text-2xl md:text-3xl lg:text-4xl text-primary">
                                    Forgot Password?
                                </h1>
                                <p className="text-balance text-muted-foreground text-sm">
                                    Enter your email address and we'll send you a code to reset your password.
                                </p>
                            </div>

                            <form.Field name="email">
                                {(field) => (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                                        <Input
                                            id={field.name}
                                            type="email"
                                            placeholder="m@example.com"
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

                            <Field>
                                <form.Subscribe selector={(s) => [s.canSubmit]}>
                                    {([canSubmit]) => (
                                        <Button
                                            type="submit"
                                            disabled={!canSubmit || isPending}
                                            className="btn-main bg-[#B15A36] w-full h-10"
                                        >
                                            {isPending ? (
                                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                                            ) : (
                                                "Send Reset Code"
                                            )}
                                        </Button>
                                    )}
                                </form.Subscribe>
                            </Field>

                            <FieldDescription className="text-center mt-2">
                                Remember your password? <Link href="/login" className="hover:underline">Log in</Link>
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