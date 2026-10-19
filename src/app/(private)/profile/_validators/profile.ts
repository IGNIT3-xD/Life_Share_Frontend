import { z } from "zod";

export const Gender = {
    MALE: "MALE",
    FEMALE: "FEMALE",
    OTHER: "OTHER",
} as const;

export const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(255),
    phone: z.string(),
    address: z.string(),
    gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER], {
        message: "Please select a gender",
    }),
});