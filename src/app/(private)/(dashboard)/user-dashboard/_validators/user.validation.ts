import { BloodGroup, RequestStatus, RequestUrgency } from "@/constants/requester";
import z from "zod";

export const bloodRequestValidate = z.object({
    patientName: z
        .string()
        .min(2, "Patient name must be at least 2 characters")
        .max(255, "Patient name is too long"),

    blood_group: z.enum(BloodGroup, {
        message: "Blood group should be valid.",
    }),

    unit_required: z
        .string()
        .min(1, "Unit is required")
        .refine((val) => !Number.isNaN(Number(val)), "Must be a number")
        .refine((val) => Number(val) >= 1, "At least 1 unit is required")
        .refine((val) => Number(val) <= 20, "Cannot exceed 20 units"),

    exact_location: z
        .string()
        .min(2, "Location must be at least 2 characters")
        .max(255, "Location is too long"),

    expires_at: z
        .string()
        .min(1, "Expiry date is required")
        .refine((val) => !Number.isNaN(new Date(val).getTime()), "Invalid expiry date")
        .refine(
            (val) => new Date(val) > new Date(),
            "Expiry date must be in the future"
        ),

    urgency: z.enum(RequestUrgency, {
        message: "Urgency should be valid.",
    }),

    note: z.string().max(1000, "Note is too long"),
});

export const updateRequestValidation = z.object({
    patientName: z
        .string()
        .min(2, "Patient name must be at least 2 characters")
        .max(255, "Patient name is too long"),


    blood_group: z.enum(BloodGroup, "Blood group should be valid."),

    unit_required: z
        .string()
        .min(1, "At least 1 unit is required")
        .refine((val) => !Number.isNaN(Number(val)), "Unit must be a number")
        .refine((val) => Number(val) >= 1, "At least 1 unit is required")
        .refine((val) => Number(val) <= 20, "Cannot exceed 20 units"),

    exact_location: z
        .string()
        .min(2, "Location must be at least 2 characters")
        .max(255, "Location is too long"),

    expires_at: z
        .string()
        .min(1, "Expiry date is required")
        .refine((val) => !Number.isNaN(new Date(val).getTime()), "Invalid expiry date")
        .refine((val) => new Date(val) > new Date(), "Expiry date must be in the future"),

    urgency: z.enum(RequestUrgency, "Urgency should be valid."),

    note: z.string().max(1000, "Note is too long"),

    request_status: z
        .enum(
            [RequestStatus.PENDING, RequestStatus.CANCELLED],
            "You can only cancel or pending the request status.",
        ),
});