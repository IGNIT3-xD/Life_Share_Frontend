"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ForgetPasswordForm } from "./_components/ForgetPasswordForm";
import { ResetPasswordForm } from "./_components/ResetPasswordForm";

type Step = "email" | "reset" | "success";

export default function ForgetPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");

    return (
        <div className="w-full pb-10 max-w-5xl mx-auto font-graphik">
            {/* STEP 1: ENTER EMAIL */}
            {step === "email" && (
                <ForgetPasswordForm
                    onSuccess={(submittedEmail) => {
                        setEmail(submittedEmail);
                        setStep("reset");
                    }}
                />
            )}

            {/* STEP 2: ENTER OTP & NEW PASSWORD */}
            {step === "reset" && (
                <ResetPasswordForm
                    email={email}
                    onSuccess={() => setStep("success")}
                    onBack={() => setStep("email")}
                />
            )}

            {/* STEP 3: SUCCESS */}
            {step === "success" && (
                <div className="max-w-md mx-auto mt-10 p-8 bg-white border border-slate-200 rounded-3xl shadow-sm text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Password Reset!</h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Your password has been successfully updated. You can now log in with your new password.
                    </p>
                    <Button
                        onClick={() => router.push("/login")}
                        className="mt-8 w-full h-11 bg-[#B15A36] hover:bg-[#9a4e2e] text-white font-semibold"
                    >
                        Back to Login
                    </Button>
                </div>
            )}
        </div>
    );
}