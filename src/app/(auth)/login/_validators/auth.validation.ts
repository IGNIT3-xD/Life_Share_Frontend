import z from "zod";

export const Gender = {
    MALE: "MALE",
    FEMALE: "FEMALE",
    OTHERS: "OTHERS",
} as const;

export const Role = {
    USER: "USER",
    DONOR: "DONOR",
    HOSPITAL: "HOSPITAL",
} as const;

export const registerSchema = z
    .object({
        name: z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(255, "Name is too long"),
        email: z.email("Enter a valid email address"),
        password: z
            .string()
            .min(6, "Password must be at least 6 characters")
            .max(20, "Password is too long")
            .regex(/[a-z]/, "Must contain a lowercase letter")
            .regex(/[A-Z]/, "Must contain an uppercase letter")
            .regex(/[0-9]/, "Must contain a number")
            .regex(/[^A-Za-z0-9\s]/, "Must contain a special character"),
        gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHERS], {
            message: "Please select a gender",
        }),
        role: z.enum([Role.USER, Role.DONOR, Role.HOSPITAL], {
            message: "Please select a valid role",
        }),
        phone: z.string(),
        address: z.string(),
    })
    .superRefine((data, ctx) => {
        if (data.role === Role.HOSPITAL) {
            if (!data.phone || data.phone.trim() === "") {
                ctx.addIssue({
                    code: "custom",
                    message: "Phone number is required for hospital profiles",
                    path: ["phone"],
                });
            }
            if (!data.address || data.address.trim() === "") {
                ctx.addIssue({
                    code: "custom",
                    message: "Physical address is required for hospital profiles",
                    path: ["address"],
                });
            }
        }
    });

export const loginUserValidation = z.object({
    email: z.email("Enter an email."),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters long.")
        .max(50, "Password is too long")
        .regex(/[a-z]/, "Password must contain at least 1 lower case letter.")
        .regex(/[A-Z]/, "Password must contain at least 1 upper case letter.")
        .regex(/[0-9]/, "Password must contain at least 1 number.")
        .regex(
            /[^A-Za-z0-9\s]/,
            "Password must contain at least 1 special character.",
        ),
});

export const verifyEmail = z.object({
    email: z.email(),
    otp: z.string().length(6),
});

export const forgetPassEmail = z.object({
    email: z.email(),
});

export const resetPassword = z.object({
    email: z.email("Enter an email."),
    otp: z.string().length(6),
    newPassword: z
        .string()
        .min(6, "Password must be at least 6 characters long.")
        .max(20, "Password is too long")
        .regex(/[a-z]/, "Password must contain at least 1 lower case letter.")
        .regex(/[A-Z]/, "Password must contain at least 1 upper case letter.")
        .regex(/[0-9]/, "Password must contain at least 1 number.")
        .regex(
            /[^A-Za-z0-9\s]/,
            "Password must contain at least 1 special character.",
        ),
});

export const forgetPasswordSchema = z.object({
    email: z.email("Enter a valid email address"),
});

export const resetPasswordSchema = z
    .object({
        otp: z.string().length(6, "OTP must be exactly 6 digits"),
        newPassword: z
            .string()
            .min(6, "Password must be at least 6 characters")
            .max(20, "Password is too long")
            .regex(/[a-z]/, "Must contain a lowercase letter")
            .regex(/[A-Z]/, "Must contain an uppercase letter")
            .regex(/[0-9]/, "Must contain a number")
            .regex(/[^A-Za-z0-9\s]/, "Must contain a special character"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });