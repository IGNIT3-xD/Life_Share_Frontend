import { apiClient, type ApiEnvelope, type PageMeta } from "./client";

export type DonationDonor = {
    id: string;
    email: string;
    blood_group: string;
    location: string;
    age: number;
    availability: string;
    weightKg: string;
    height: string;
    donorStatus: string;
    totalDonations: number;
    lastDonationDate: string | null;
    created_at: string;
    updated_at: string;
    userId: string;
};

export type DonationRequester = {
    id: string;
    patientName: string;
    blood_group: string;
    unit_required: number;
    exact_location: string;
    expires_at: string;
    urgency: string;
    verificationStatus: string;
    request_status: string;
    note: string | null;
    user_id: string;
    created_at: string;
    updated_at: string;
};

export type DonationRequest = {
    id: string;
    requester_id: string;
    donor_id: string;
    donationStatus: string;
    scheduled_at: string;
    donated_at: string | null;
    created_at: string;
    updated_at: string;
    donor: DonationDonor;
    requester: DonationRequester;
};

export type DonationList = {
    donationRequest: DonationRequest[];
    meta: PageMeta;
};

export type DonationRequestProp = {
    id: string;
    requester_id: string;
    donor_id: string;
    donationStatus: string;
    scheduled_at: string;
    donated_at: string | null;
    created_at: string;
    updated_at: string;
    donor?: {
        id: string;
        email: string;
        blood_group: string;
        location: string;
        age: number;
        availability: string;
        weightKg: string;
        height: string;
        donorStatus: string;
        totalDonations: number;
        lastDonationDate: string | null;
    };
    requester: {
        id: string;
        patientName: string;
        blood_group: string;
        unit_required: number;
        exact_location: string;
        expires_at: string;
        urgency: string;
        verificationStatus: string;
        request_status: string;
        note?: string | null;
        user_id: string;
        created_at: string;
        updated_at: string;
        user?: {
            name: string;
            email: string;
            phone: string;
            address: string;
            profile_pic?: string;
        };
    };
};

export type DonationRequestResponse = {
    donation: DonationRequestProp[];
    meta: PageMeta;
};

export type DonationFilter = {
    blood_group?: string;
    urgency?: string;
    donationStatus?: string;
    search?: string;
    sortBy?: "asc" | "desc";
    rawPage?: number;
    rawLimit?: number;
};

const prefix = "/api/v1/donation"

export const myDonationRequests = async (filters: DonationFilter = {}) => {
    const { search, donationStatus, blood_group, rawLimit = 10, rawPage = 1, sortBy = 'desc' } = filters

    const query: Record<string, string | number> = {
        sortBy, rawPage, rawLimit
    }

    if (search) query.search = search
    if (donationStatus) query.donationStatus = donationStatus
    if (blood_group) query.blood_group = blood_group

    const res = await apiClient<ApiEnvelope<DonationList>>(`${prefix}/my-requests`, { query });
    return res.data;
}

export const fetchDonationRequestsRecevied = async (filters: DonationFilter = {}) => {
    const { search, donationStatus, urgency, blood_group, rawLimit = 10, rawPage = 1, sortBy = 'desc' } = filters

    const query: Record<string, string | number> = {
        sortBy, rawPage, rawLimit
    }

    if (search) query.search = search
    if (urgency) query.urgency = urgency
    if (donationStatus) query.donationStatus = donationStatus
    if (blood_group) query.blood_group = blood_group

    const res = await apiClient<ApiEnvelope<DonationRequestResponse>>("/api/v1/donor/donation-request", { query });
    return res.data;
}

export const fetchDonationRequestDetails = async (id: string) => {
    const res = await apiClient<ApiEnvelope<DonationRequestProp>>(`/api/v1/donor/donation-request/${id}`);
    return res.data;
}

export type UpdateDonationStatusPayload = {
    donationStatus: "ACCEPTED" | "SCHEDULED" | "COMPLETED" | "DONOR_CANCELLED";
};

export const updateDonationStatus = async (id: string, payload: UpdateDonationStatusPayload) => {
    const res = await apiClient(`/api/v1/donor/donation-request/${id}`, {
        method: "PATCH",
        body: payload
    });
    return res.data
} 