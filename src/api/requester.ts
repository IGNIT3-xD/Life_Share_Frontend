import type { RequesterProp } from "@/components/RequesterCard";
import { apiClient, type PageMeta, type ApiEnvelope } from "./client";

export type BloodRequesterList = {
  requester: RequesterProp[];
  meta: PageMeta;
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

export type BloodRequestPayload = {
  patientName: string;
  blood_group: string;
  unit_required: number;
  exact_location: string;
  expires_at: string;
  urgency: string;
  note?: string;
}

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

export const postBloodRequest = async (payload: BloodRequestPayload) => {
  const res = await apiClient<ApiEnvelope<BloodRequestResponse>>(`${prefix}/blood-request`, {
    method: 'POST',
    body: payload
  });
  return res.data
}

export const fetchMyBloodRequest = async (rawPage = 1, rawLimit = 10) => {
  const res = await apiClient<ApiEnvelope<BloodRequesterList>>(`${prefix}/my-blood-request`, {
    query: { rawPage, rawLimit }
  });
  return res.data
}