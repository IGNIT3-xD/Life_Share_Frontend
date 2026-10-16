"use client";

import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCreatePayment } from "@/hooks/usePayment";
import type { EmergencyServiceBookingProp } from "@/api/booking";

type Props = {
    booking: EmergencyServiceBookingProp;
    className?: string;
};

/**
 * A payment button that:
 *  1. Creates a payment session via the backend
 *  2. Redirects the user to the returned bKash gateway URL
 */

export function PayNowButton({ booking, className }: Props) {
    const { mutateAsync: pay, isPending } = useCreatePayment();

    const handlePay = async () => {
        try {
            const paymentUrl = await pay(booking.id);
            if (!paymentUrl) {
                toast.error("Payment link unavailable", {
                    description: "The payment gateway didn't return a URL. Please try again.",
                });
                return;
            }
            window.location.href = paymentUrl;
        } catch (err: any) {
            toast.error("Payment failed", {
                description: err?.data?.message || "Something went wrong. Please try again.",
            });
        }
    };

    return (
        <button
            type="button"
            onClick={handlePay}
            disabled={isPending ||
                booking.booking_status === 'PENDING' ||
                booking.booking_status === 'COMPLETED' ||
                booking.payment_status === 'REFUNDED' ||
                booking.payment_status === 'REFUNDED_PENDING' ||
                booking.payment_status === 'CANCELLED' ||
                booking.payment_status === 'PAID'
            }
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
                className
            )}
        >
            {isPending ? (
                <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Processing...
                </>
            ) : (
                <>
                    <CreditCard className="w-3.5 h-3.5" />
                    Pay Now
                </>
            )}
        </button>
    );
}