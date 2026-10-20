import type { RequesterProp } from "@/components/RequesterCard";
import { apiClient, type PageMeta, type ApiEnvelope } from "./client";

export type BloodRequesterList = {
  requester: RequesterProp[];
  meta: PageMeta;
};

export type BloodRequestResponse = {
  id: string;
  patientName: string;
  blood_group: string;
  unit_required: number;
  exact_location: string;
  expires_at: Date;
  urgency: string;
  note?: string;
  verificationStatus: string;
  request_status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type BloodRequestersFilter = {
  urgency?: string;
  verificationStatus?: string;
  search?: string;
  blood_group?: string;
  sortBy?: "asc" | "desc";
  rawPage?: number;
  rawLimit?: number;
}

export type BloodRequestPayload = {
  patientName: string;
  blood_group: string;
  unit_required: number;
  exact_location: string;
  expires_at: string;
  urgency: string;
  note?: string;
}

export type UpdateBloodRequestPayload = {
  patientName?: string;
  blood_group?: string;
  unit_required?: number;
  exact_location?: string;
  expires_at?: string;
  urgency?: string;
  note?: string;
  request_status?: string;
}

export type UpdateBloodRequestVariable = {
  id: string;
  payload: UpdateBloodRequestPayload
}

export type CreateDonationRequestPayload = {
  requester_id: string;
  donor_id: string;
  scheduled_at: string;
}

export type BloodRequestDetails = {
  id: string;
  patientName: string;
  blood_group: string;
  unit_required: number;
  exact_location: string;
  expires_at: string;
  urgency: string;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
  request_status: "PENDING" | "COMPLETED" | "CANCELLED" | "IN_PROGRESS";
  note: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    profile_pic: string | null;
    profile_pic_public_id: string | null;
    role: string;
    auth_provider: string;
    email_verified: boolean;
    is_active: boolean;
    is_blocked: boolean;
    created_at: string;
    updated_at: string;
  };
};

const prefix = '/api/v1/user'

export async function fetchBloodRequesters(
  rawPage = 1,
  rawLimit = 3,
): Promise<BloodRequesterList> {
  const res = await apiClient<ApiEnvelope<BloodRequesterList>>(
    `${prefix}/requester`,
    {
      query: { rawPage, rawLimit },
    },
  );
  return res.data;
}

export async function fetchAllBloodRequesters(filters: BloodRequestersFilter): Promise<BloodRequesterList> {
  const { search, blood_group, urgency, sortBy = 'desc', rawPage = 1, rawLimit = 9 } = filters

  const query: Record<string, string | number> = {
    rawPage,
    rawLimit,
    sortBy
  }

  if (search) query.search = search
  if (urgency) query.urgency = urgency
  if (blood_group) query.blood_group = blood_group

  const res = await apiClient<ApiEnvelope<BloodRequesterList>>(`${prefix}/requester`, {
    query
  });
  return res.data;
}

export const postBloodRequest = async (payload: BloodRequestPayload) => {
  const res = await apiClient<ApiEnvelope<BloodRequestResponse>>(`${prefix}/blood-request`, {
    method: 'POST',
    body: payload
  });
  return res.data
}

export type RequesterFilters = {
  search?: string;
  urgency?: string;
  blood_group?: string;
  verificationStatus?: string;
  sortBy?: 'asc' | 'desc';
  rawPage?: number;
  rawLimit?: number;
}

export const fetchMyBloodRequest = async (filters: RequesterFilters = {}) => {
  const { search, urgency, blood_group, verificationStatus, sortBy = 'desc', rawPage = 1, rawLimit = 10 } = filters

  const query: Record<string, string | number> = {
    rawPage, rawLimit, sortBy
  }

  if (search) query.search = search
  if (urgency) query.urgency = urgency
  if (blood_group) query.blood_group = blood_group
  if (verificationStatus) query.verificationStatus = verificationStatus

  const res = await apiClient<ApiEnvelope<BloodRequesterList>>(`${prefix}/my-blood-request`, {
    query
  });
  return res.data
}

export const updateMyBloodRequest = async (variables: UpdateBloodRequestVariable) => {
  const { id, payload } = variables

  const res = await apiClient<ApiEnvelope<BloodRequestResponse>>(`${prefix}/update-my-request/${id}`, {
    method: "PATCH",
    body: payload
  });
  return res.data;
}

export const deleteMyBloodRequest = async (id: string) => {
  const res = await apiClient<ApiEnvelope<BloodRequestResponse>>(`${prefix}/delete-my-request/${id}`, {
    method: "DELETE",
  });
  return res.data;
}

export const createDonationRequest = async (payload: CreateDonationRequestPayload) => {
  const res = await apiClient('/api/v1/donation/request', {
    method: 'POST',
    body: payload
  });
  return res.data
}

// Admin controlled
export async function fetchAllBloodRequestersAdmin(filters: BloodRequestersFilter): Promise<BloodRequesterList> {
  const { search, verificationStatus, blood_group, urgency, sortBy = 'desc', rawPage = 1, rawLimit = 9 } = filters

  const query: Record<string, string | number> = {
    rawPage,
    rawLimit,
    sortBy
  }

  if (search) query.search = search
  if (urgency) query.urgency = urgency
  if (blood_group) query.blood_group = blood_group
  if (verificationStatus) query.verificationStatus = verificationStatus

  const res = await apiClient<ApiEnvelope<BloodRequesterList>>("/api/v1/user/all-requesters", { query });
  return res.data;
}

export const fetchRequesterDetails = async (id: string) => {
  const res = await apiClient<ApiEnvelope<BloodRequestDetails>>(`${prefix}/request/${id}`)
  return res.data
}

export type UpdateStatusPayload = {
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED"
}

export const updateRequesterStatus = async (id: string, payload: UpdateStatusPayload) => {
  const res = await apiClient<ApiEnvelope<BloodRequestDetails>>(`${prefix}/requester/${id}`, {
    method: "PUT",
    body: payload
  })
  return res.data
}

export const deleteRequesterRequest = async (id: string) => {
  const res = await apiClient<ApiEnvelope<{ success: boolean }>>(`${prefix}/delete-my-request/${id}`, {
    method: "DELETE"
  })
  return res.data
}