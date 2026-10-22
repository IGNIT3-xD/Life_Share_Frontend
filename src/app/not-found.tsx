"use client";

import Link from "next/link";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";

import animationData from "../../public/Error 404.json";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="relative min-h-screen bg-[#F8F9FA] flex items-center justify-center overflow-hidden font-graphik">

            {/* Background Watermark Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] md:text-[35rem] font-black text-slate-200/40 select-none pointer-events-none z-0">
                404
            </div>

            <div className="relative z-10 max-w-4xl w-full mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-12">

                {/* Left Side: Text & Actions */}
                <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center justify-center md:justify-start gap-2 text-[#B15A36] font-semibold tracking-wider uppercase text-sm mb-4">
                        <SearchX className="w-5 h-5" />
                        Error 404
                    </div>

                    <h1 className="text-primary">
                        Page not found.
                    </h1>

                    <p className="text-lg text-slate-500 mb-10 max-w-md mx-auto md:mx-0 leading-relaxed">
                        Oops! The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                        <Button
                            onClick={() => router.back()}
                            variant="outline"
                            className="w-full sm:w-auto h-12 px-6 rounded-full border-slate-200 text-slate-700 hover:bg-slate-100"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Go Back
                        </Button>

                        <Button asChild className="w-full sm:w-auto h-12 px-6 rounded-full bg-[#B15A36] hover:bg-[#9a4e2e] text-white">
                            <Link href="/">
                                <Home className="w-4 h-4 mr-2" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Right Side: Lottie Animation */}
                <div className="flex-1 relative flex items-center justify-center">
                    {/* Subtle Glow behind animation */}
                    <div className="absolute inset-0 bg-linear-to-tr from-[#B15A36]/10 to-transparent blur-[80px] rounded-full scale-110 pointer-events-none" />

                    <DotLottieReact
                        data={animationData}
                        loop
                        autoplay
                        className="w-full max-w-140 relative z-10 drop-shadow-2xl"
                    />
                </div>

            </div>
        </div>
    );
}