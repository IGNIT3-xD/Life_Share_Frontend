import { apiClient, PageMeta, type ApiEnvelope } from "./client";

const prefix = "/api/v1/hospital"

export type CreateProfilePayload = {
    license_number: string;
    description: string;
}

export type UpdateProfilePayload = {
    hospital_name?: string;
    hospital_address?: string;
    hospital_phone?: string;
    license_number?: string;
    description?: string;
}

export type HospitalProfileResponse = {
    id: string;
    license_number: string;
    description: string;
    hospital_status: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    user: {
        name: string;
        email: string;
        address: string;
        phone?: string;
        email_verified?: string;
    };
}

type HospitalList = {
    hospital: HospitalProfileResponse[],
    meta: PageMeta
}

export type HospitalFilters = {
    hospital_status?: string;
    search?: string;
    sortBy?: "asc" | "desc";
    rawPage?: number;
    rawLimit?: number;
}

export type UpdateHospitalProfileStatus = {
    hospital_status: "VERIFIED" | "NOT_ELIGIBLE" | "IN_PROGRESS"
}

export async function createHospitalProfile(payload: CreateProfilePayload) {
    const res = await apiClient<ApiEnvelope<HospitalProfileResponse>>(`${prefix}/create-hospital-profile`, {
        method: "POST",
        body: payload
    });
    return res.data
};

export async function fetchMyHospitalProfile() {
    try {
        const res = await apiClient<ApiEnvelope<HospitalProfileResponse>>(
            `${prefix}/my-hospital-profile`
        );
        return res.data;
    } catch (error: any) {
        // If the backend returns a 404, it means the profile doesn't exist yet.
        // We return null so the UI can show the "Create Profile" state instead of an error.
        if (
            error?.response?.status === 404 ||
            error?.status === 404 ||
            error?.statusCode === 404
        ) {
            return null;
        }

        // For any other error (e.g., 500 Server Error, Network failure), we still throw
        throw error;
    }
}

export async function editHospitalProfile(payload: UpdateProfilePayload) {
    const res = await apiClient<ApiEnvelope<HospitalProfileResponse>>(`${prefix}/update-hospital-profile`, {
        method: "PATCH",
        body: payload
    });
    return res.data
};

export async function deleteHospitalProfile(id: string) {
    const res = await apiClient<ApiEnvelope<{ success: boolean }>>(`${prefix}/hospital-profile/${id}`, {
        method: "DELETE",
    });
    return res.data
};

// Admin controlled
export const fetchAllHospitalProfile = async (filters: HospitalFilters = {}) => {
    const { search, hospital_status, sortBy = 'desc', rawPage = 1, rawLimit = 10 } = filters

    const query: Record<string, string | number> = {
        sortBy, rawPage, rawLimit
    }

    if (search) query.search = search
    if (hospital_status) query.hospital_status = hospital_status

    const res = await apiClient<ApiEnvelope<HospitalList>>("api/v1/hospital/all-hospital-profile", { query });
    return res.data
};

export async function updateHospitalProfileStatus(id: string, payload: UpdateHospitalProfileStatus) {
    const res = await apiClient<ApiEnvelope<HospitalProfileResponse>>(`${prefix}/hospital-profile/${id}`, {
        method: "PUT",
        body: payload
    });
    return res.data
};

export async function deleteHospitalProfileAdmin(id: string) {
    const res = await apiClient<ApiEnvelope<{ success: boolean }>>(`${prefix}/hospital-profile/${id}`, {
        method: "DELETE"
    });
    return res.data
};