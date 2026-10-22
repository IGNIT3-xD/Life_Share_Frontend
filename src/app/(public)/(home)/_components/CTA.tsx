"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CircleQuestionMark } from "lucide-react";
import Link from "next/link";

export const CalToAction = () => {
  return (
    <section className="w-full border-t my-10 lg:my-16 pt-8">
      <div className="container-main">
        {/* Main CTA Card */}
        <div className="relative flex flex-col items-center overflow-hidden rounded-xl border border-white/12 px-6 py-20 text-center sm:px-16 sm:py-24 bg-black">
          {/* Subtle architectural structural line at the top */}
          <div className="absolute left-0 top-0 h-px w-full bg-white/15" />

          <h2 className="font-financier italic font-light max-w-2xl text-balance text-4xl tracking-tighter text-white sm:text-5xl md:text-6xl">
            Start <span className="text-[#B15A36]">donate</span> today.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-balance font-graphik text-base leading-relaxed text-neutral-400 sm:text-lg">
            Deploy your infrastructure in seconds. No complex configuration, no
            credit card required. Just raw performance out of the box.
          </p>

          <div className="mt-10 flex w-full max-w-md flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
            <Button asChild className="btn-main bg-[#B15A36]">
              <Link href={"/donate-blood"}>
                Donate Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button variant={"secondary"} asChild className="btn-sec">
              <Link href={"/request-blood"}>
                Need blood
                <CircleQuestionMark />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
