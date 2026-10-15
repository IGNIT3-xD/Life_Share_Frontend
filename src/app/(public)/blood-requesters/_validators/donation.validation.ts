import { z } from "zod";

export const donationScheduleValidation = z.object({
  scheduled_at: z
    .string()
    .min(1, "Please pick a date and time")
    .refine((v) => !Number.isNaN(new Date(v).getTime()), "Invalid date")
    .refine(
      (v) => new Date(v).getTime() > Date.now() + 60 * 60 * 1000,
      "Schedule must be at least 1 hour from now"
    ),
});