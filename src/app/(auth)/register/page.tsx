"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RegisterForm } from "./_components/RegisterForm";
import { VerifyOtpForm } from "./_components/VerifyOtpForm";

type Step = "register" | "verify" | "success";

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("register");
    const [registeredEmail, setRegisteredEmail] = useState("");

    // ✅ No top padding here, let the RootLayout handle spacing
    return (
        <div className="w-full pb-10 max-w-5xl mx-auto font-graphik">

            {step === "register" && (
                <RegisterForm
                    onSuccess={(email) => {
                        setRegisteredEmail(email);
                        setStep("verify");
                    }}
                />
            )}

            {step === "verify" && (
                <div className="max-w-md mx-auto mt-10 p-8 bg-white border border-slate-200 rounded-3xl shadow-sm text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                        <Mail className="w-7 h-7 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Check your email</h1>
                    <p className="mt-2 text-sm text-slate-500 mb-6">
                        We sent a code to <strong className="text-slate-900">{registeredEmail}</strong>.
                    </p>
                    <VerifyOtpForm
                        email={registeredEmail}
                        onSuccess={() => setStep("success")}
                        onBack={() => setStep("register")}
                    />
                </div>
            )}

            {step === "success" && (
                <div className="max-w-md mx-auto mt-10 p-8 bg-white border border-slate-200 rounded-3xl shadow-sm text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Account Verified!</h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Your account has been created successfully.
                    </p>
                    <Button
                        onClick={() => router.push("/user-dashboard")}
                        className="mt-8 w-full h-11 bg-[#B15A36] hover:bg-[#9a4e2e] text-white font-semibold"
                    >
                        Go to Dashboard
                    </Button>
                </div>
            )}

        </div>
    );
}