"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useVerifyEmail } from "@/hooks/useAuth";

const otpSchema = z.object({
    otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

type Props = {
    email: string;
    onSuccess: () => void;
    onBack: () => void;
};

export function VerifyOtpForm({ email, onSuccess, onBack }: Props) {
    const { mutateAsync: verify, isPending } = useVerifyEmail();

    const form = useForm({
        defaultValues: { otp: "" },
        validators: { onChange: otpSchema },
        onSubmit: async ({ value }) => {
            try {
                await verify({ email, otp: value.otp });
                toast.success("Email verified successfully!");
                onSuccess();
            } catch (err: any) {
                toast.error("Verification failed", {
                    description: err?.data?.message || "Invalid or expired OTP.",
                });
            }
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <FieldGroup className="space-y-6">
                <form.Field name="otp">
                    {(field) => (
                        <Field>
                            <FieldLabel htmlFor={field.name} className="text-center block text-sm text-slate-600">
                                Enter the 6-digit code
                            </FieldLabel>
                            <Input
                                id={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="• • • • • •"
                                maxLength={6}
                                className="text-center text-2xl tracking-[0.5em] font-mono h-14"
                            />
                            {field.state.meta.errors.length > 0 && (
                                <p className="text-xs text-red-500 mt-1 text-center">
                                    {field.state.meta.errors.map((e: any) => e?.message).join(", ")}
                                </p>
                            )}
                        </Field>
                    )}
                </form.Field>

                <div className="flex flex-col gap-3">
                    <form.Subscribe selector={(s) => [s.canSubmit]}>
                        {([canSubmit]) => (
                            <Button
                                type="submit"
                                disabled={!canSubmit || isPending}
                                className="w-full h-11 bg-[#B15A36] hover:bg-[#9a4e2e] text-white font-semibold"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify Email"
                                )}
                            </Button>
                        )}
                    </form.Subscribe>

                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onBack}
                        className="w-full text-slate-500 hover:text-slate-900"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to register
                    </Button>
                </div>
            </FieldGroup>
        </form>
    );
}