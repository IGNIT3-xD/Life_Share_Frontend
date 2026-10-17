import { apiClient, type ApiEnvelope } from "./client"

export type AuthUser = {
    token: {
        accessToken: string;
        refresh: string;
    };
};

const prefix = '/api/v1/auth'

export type RegisterPayload = {
    name: string;
    email: string;
    password: string;
    gender: string;
    role: string;
    phone?: string;
    address?: string;
};

export type RegisterResponse = { message: string };

export type VerifyResponse = {
    user: any;
    accessToken: string;
    refreshToken: string;
};

export const fetchRegister = async (payload: RegisterPayload, profilePic?: File) => {
    const formData = new FormData();

    // Append all text fields
    Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined) formData.append(key, value);
    });

    // Append the file if it exists
    if (profilePic) {
        formData.append("profile_pic", profilePic);
    }

    const res = await apiClient<ApiEnvelope<RegisterResponse>>(`${prefix}/register`, {
        method: "POST",
        body: formData, // ofetch handles FormData automatically
    });
    return res.data;
};

export const fetchVerifyEmail = async (payload: { email: string; otp: string }) => {
    const res = await apiClient<ApiEnvelope<VerifyResponse>>(`${prefix}/verify-email`, {
        method: "POST",
        body: payload,
    });
    return res.data;
};

export const fetchLogin = async (payload: { email: string, password: string }) => {
    const res = await apiClient<ApiEnvelope<AuthUser>>(`${prefix}/login`, {
        method: 'POST',
        body: payload
    });
    return res.data
}

export type MeUser = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    gender: string;
    profile_pic: string | null;
    profile_pic_public_id: string | null;
    role: string;
    email_verified: boolean;
    is_active: boolean;
    is_blocked: boolean;
    created_at: string;
    updated_at: string;
};

export async function fetchMe(): Promise<MeUser> {
    const res = await apiClient<ApiEnvelope<MeUser>>("/api/v1/user/me");
    return res.data;
}