import { apiClient, type PageMeta, type ApiEnvelope } from "./client"

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

export async function fetchForgetPassword(email: string) {
    const res = await apiClient<ApiEnvelope<RegisterResponse>>(`${prefix}/forget-password`, {
        method: "POST",
        body: { email },
    });
    return res.data;
}

export type ResetPasswordPayload = {
    email: string;
    otp: string;
    newPassword: string;
};

export async function fetchResetPassword(payload: ResetPasswordPayload) {
    const res = await apiClient<ApiEnvelope<RegisterResponse>>(`${prefix}/reset-password`, {
        method: "POST",
        body: payload,
    });
    return res.data;
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

export type UpdateProfilePayload = {
    name?: string;
    phone?: string;
    address?: string;
    gender?: string;
}

export type UserData = {
    id: string;
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    gender: "MALE" | "FEMALE" | "OTHERS";
    profile_pic: string | null;
    profile_pic_public_id: string | null;
    role: string;
    auth_provider: string;
    email_verified: boolean;
    is_active: boolean;
    is_blocked: boolean;
    created_at: string;
    updated_at: string;
}

export type Userlist = {
    user: UserData[];
    meta: PageMeta
}

export const updateMyProfile = async (payload: UpdateProfilePayload, profilePic?: File) => {
    const formData = new FormData

    Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined)
            formData.append(key, value)
    })

    if (profilePic) {
        formData.append("profile_pic", profilePic);
    }

    const res = await apiClient<ApiEnvelope<MeUser>>("api/v1/user/update-profile", {
        method: "PATCH",
        body: formData
    });

    return res.data;
}

export const logout = async () => {
    const res = await apiClient<ApiEnvelope<{ success: boolean }>>("/api/v1/auth/logout", {
        method: "POST",
        body: {}
    });
    return res.data
}

// Admin controlled
export type UserFilters = {
    search?: string;
    role?: "ADMIN" | "SUPER_ADMIN" | "HOSPITAL" | "USER" | "DONOR";
    gender?: "MALE" | "FEMALE" | "OTHERS";
    is_active?: boolean;
    sortBy?: "asc" | "desc";
    rawPage?: number;
    rawLimit?: number;
}

export const fetchAllUsersAdmin = async (filters: UserFilters) => {
    const { search, gender, is_active, role, sortBy = 'desc', rawLimit = 10, rawPage = 1 } = filters

    const query: Record<string, string | number | boolean> = {
        sortBy, rawPage, rawLimit
    }

    if (search) query.search = search
    if (gender) query.gender = gender
    if (role) query.role = role
    if (is_active !== undefined) query.is_active = is_active;

    const res = await apiClient<ApiEnvelope<Userlist>>("/api/v1/user/all-users", { query });
    return res.data
};

export type UpdatUserStatus = {
    is_active?: boolean;
    is_blocked?: boolean;
};

export const updateUserStatus = async (id: string, payload: UpdatUserStatus) => {
    const res = await apiClient<ApiEnvelope<UserData>>(`/api/v1/user/${id}`, {
        method: "PUT",
        body: payload
    });
    return res.data
};