import type { DonorProps } from "@/components/DonorCard";
import { apiClient, type ApiEnvelope, type PageMeta } from "@/api/client";

export type DonorList = {
  donors: DonorProps[];
  meta: PageMeta;
};

export type DonorFilters = {
  search?: string;
  blood_group?: string;
  availability?: string;
  location?: string;
  sortBy?: "asc" | "desc";
  rawPage?: number;
  rawLimit?: number;
};

export type DonorProfileResponse = {
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
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    gender: string;
    profile_pic?: string;
    profile_pic_public_id?: string;
    role: string;
    auth_provider: string;
    email_verified: boolean;
    is_active: boolean;
    is_blocked: boolean;
    created_at: string;
    updated_at: string;
  };
}

export type DonorDetailsResponse = {
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
  lastDonationDate: string;
  created_at: string;
  updated_at: string;
  userId: string;
  user: {
    name: string;
    gender: string;
    phone: string;
    profile_pic: string;
  };
};

export type DonorProfileCreatePayload = {
  age: number,
  blood_group: string,
  location: string,
  height: number,
  weightKg: number,
  availability: string
};

const prefix = "/api/v1/donor";

export async function fetchDonors(rawPage = 1, rawLimit = 3): Promise<DonorList> {
  const res = await apiClient<ApiEnvelope<DonorList>>(`${prefix}`, {
    query: { rawPage, rawLimit },
  });
  return res.data;
}

export const fetchAllDOnors = async (filters: DonorFilters = {}) => {
  const { search, availability, blood_group, location, rawLimit = 9, rawPage = 1, sortBy = 'desc' } = filters

  const query: Record<string, string | number> = {
    rawPage, rawLimit, sortBy
  }

  if (search) query.search = search
  if (availability) query.availability = availability
  if (blood_group) query.blood_group = blood_group
  if (location) query.location = location

  const res = await apiClient<ApiEnvelope<DonorList>>(`${prefix}`, { query });
  return res.data;
}

export const createDonorProfile = async (payload: DonorProfileCreatePayload) => {
  const res = await apiClient<ApiEnvelope<DonorProfileResponse>>(`${prefix}/create-donor-profile`, {
    method: 'POST',
    body: payload
  });
  return res.data
}

export const fetchMyDonorProfile = async () => {
  try {
    const res = await apiClient<ApiEnvelope<DonorProfileResponse>>(
      `${prefix}/my-donor-profile`
    );
    return res.data;
  } catch (error: any) {
    // 404 means the donor hasn't created a profile yet — treat as null
    if (error?.response?.status === 404 || error?.status === 404) return null;
    throw error;
  }
}

export const deleteMyDonorProfile = async (id: string) => {
  const res = await apiClient(`${prefix}/donor-profile/${id}`, {
    method: "DELETE"
  });
  return res.data;
};

export const updateMyDonorProfile = async (payload: Partial<DonorProfileCreatePayload>) => {
  const res = await apiClient<ApiEnvelope<DonorProfileResponse>>(
    `${prefix}/donor-profile`,
    { method: "PATCH", body: payload }
  );
  return res.data;
};

export const fetchDonorDetails = async (id: string) => {
  const res = await apiClient<ApiEnvelope<DonorDetailsResponse>>(`${prefix}/donor-profile/${id}`);
  return res.data
}