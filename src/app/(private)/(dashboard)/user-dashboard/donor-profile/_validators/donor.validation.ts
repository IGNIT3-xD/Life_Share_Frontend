import { z } from "zod";
import { BloodGroup } from "@/constants/requester"; // or donor

export const donorProfileValidation = z.object({
    blood_group: z.enum(BloodGroup, { message: "Select a blood group" }),
    location: z
        .string()
        .min(2, "Location must be at least 2 characters")
        .max(255, "Location is too long"),
    age: z
        .string()
        .min(1, "Age is required")
        .refine((v) => !isNaN(Number(v)), "Must be a number")
        .refine((v) => Number(v) >= 18, "Must be at least 18")
        .refine((v) => Number(v) <= 100, "Enter a valid age"),
    availability: z.enum(["AVAILABLE", "ON_HOLD"], { message: "Select availability" }),
    weightKg: z
        .string()
        .min(1, "Weight is required")
        .refine((v) => !isNaN(Number(v)), "Must be a number")
        .refine((v) => Number(v) >= 45, "Weight must be at least 45kg")
        .refine((v) => Number(v) <= 200, "Enter a valid weight"),
    height: z
        .string()
        .min(1, "Height is required")
        .refine((v) => !isNaN(Number(v)), "Must be a number")
        .refine((v) => Number(v) >= 100, "Height must be at least 100cm")
        .refine((v) => Number(v) <= 250, "Enter a valid height"),
});