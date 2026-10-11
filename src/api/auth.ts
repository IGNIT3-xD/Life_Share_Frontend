import { apiClient, type ApiEnvelope } from "./client"

export type AuthUser = {
    token: {
        accessToken: string;
        refresh: string;
    };
};

const prefix = '/api/v1/auth'

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