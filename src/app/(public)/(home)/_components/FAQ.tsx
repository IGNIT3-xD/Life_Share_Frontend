"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageCircleQuestion, ArrowRight, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const faqs = [
    {
        question: "Who is eligible to donate blood?",
        answer:
            "Generally, you must be at least 18 years old, weigh at least 50kg, and be in good general health. You should not have donated blood in the last 3 months. We recommend consulting with a healthcare professional or checking the eligibility guidelines on our platform before booking a donation.",
    },
    {
        question: "How do I request blood in an emergency?",
        answer:
            "In an emergency, you can use our 'Blood Requests' page to create an urgent post. Select the blood group, number of units required, and the hospital location. Verified donors in your area will be notified immediately. You can also use our 'Find Donors' feature to directly contact nearby donors.",
    },
    {
        question: "Is my personal information secure?",
        answer:
            "Absolutely. We take your privacy seriously. Your personal contact details (like phone number and exact address) are never shared publicly. They are only visible to the person who has made a specific blood request, and only after you accept their request.",
    },
    {
        question: "How does the hospital verification work?",
        answer:
            "To ensure the highest level of safety, hospitals must undergo a verification process. Once a hospital registers and submits their medical license number, our admin team reviews the application. Only verified hospitals can list emergency services and accept bookings on Life Share.",
    },
    {
        question: "Are there any costs involved for donors?",
        answer:
            "No. Life Share is a community-driven platform built to save lives. Donating blood is completely free. However, some emergency services provided by our partner hospitals (like ambulances or specialized medical transport) may have associated fees, which are clearly listed before you book.",
    },
    {
        question: "Can I track my donation history?",
        answer:
            "Yes! Once you create a donor profile, you get access to a personalized dashboard. You can track your total lifetime donations, view your upcoming scheduled donations, and see your current availability status.",
    },
];

export function FaqSection() {
    const [openItems, setOpenItems] = useState<string[]>([]);

    return (
        <section className="relative w-full container-main my-10 lg:my-16 font-graphik overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl text-[#B15A36] mb-6">
                        <MessageCircleQuestion className="w-6 h-6" />
                    </div>
                    <h2 className="text-primary">
                        Frequently Asked <span className="text-[#B15A36]">Questions</span>
                    </h2>
                    <p className="mt-3 text-slate-500 text-sm md:text-base">
                        Everything you need to know about donating blood, requesting help, and using Life Share.
                    </p>
                </div>

                {/* Accordion */}
                <Accordion
                    type="multiple"
                    className="w-full space-y-4"
                    value={openItems}
                    onValueChange={setOpenItems}
                >
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className={`
                group bg-white border border-slate-200 rounded-2xl px-6 
                transition-all duration-300 ease-in-out
                data-[state=open]:border-[#B15A36]/30 
                data-[state=open]:shadow-[0_8px_30px_rgba(177,90,54,0.08)]
                hover:border-slate-300
              `}
                        >
                            <AccordionTrigger className="py-5 text-left text-[15px] md:text-base font-semibold text-slate-800 hover:text-[#B15A36] hover:no-underline transition-colors data-[state=open]:text-[#B15A36]">
                                {faq.question}
                                {/* Custom Plus/Minus Icon */}
                                <div className="ml-4 shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-slate-50 text-slate-400 group-hover:bg-orange-50 group-hover:text-[#B15A36] transition-colors data-[state=open]:bg-orange-50 data-[state=open]:text-[#B15A36]">
                                    <Plus className="w-4 h-4 block group-data-[state=open]:hidden" />
                                    <Minus className="w-4 h-4 hidden group-data-[state=open]:block" />
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-5 text-sm md:text-[15px] text-slate-500 leading-relaxed">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

                {/* Bottom CTA */}
                <div className="mt-12 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#B15A36]/10 blur-2xl rounded-full pointer-events-none" />

                    <h3 className="text-lg font-bold text-slate-900">
                        Still have questions?
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
                        Can't find the answer you're looking for? Our support team is always ready to help you out.
                    </p>
                    <Button
                        asChild
                        className="mt-6 btn-main bg-[#B15A36] hover:bg-[#9a4e2e]"
                    >
                        <Link href="/contact">
                            Contact Support <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </div>

            </div>
        </section>
    );
}