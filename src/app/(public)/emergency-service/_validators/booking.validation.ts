import { PAYMENT_METHODS } from "@/constants/booking";
import { z } from "zod";

// Extract the union of allowed values for Zod
const paymentValues = PAYMENT_METHODS.map((p) => p.value) as [string, ...string[]];

export const bookingValidation = z.object({
    patient_name: z
        .string()
        .min(2, "Patient name must be at least 2 characters")
        .max(100, "Patient name is too long"),
    patient_number: z
        .string()
        .min(6, "Phone number is too short")
        .max(20, "Phone number is too long")
        .regex(/^[+\d\s\-()]+$/, "Enter a valid phone number"),
    payment_via: z.enum(paymentValues, {
        message: "Please select a payment method",
    }),
    emergency_location: z
        .string()
        .min(5, "Location must be at least 5 characters")
        .max(255, "Location is too long"),
    description: z
        .string()
        .min(10, "Please describe the emergency (at least 10 characters)")
        .max(1000, "Description is too long"),
    scheduled_at: z
        .string()
        .min(1, "Please pick a date and time")
        .refine((v) => !isNaN(new Date(v).getTime()), "Invalid date")
        .refine(
            (v) => new Date(v).getTime() > Date.now() + 15 * 60 * 1000,
            "Schedule must be at least 15 minutes from now"
        ),
    note: z
        .string()
        .max(500, "Note is too long")
        .or(z.literal("")),
});