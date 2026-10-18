import type { EmergencyServiceProp } from "@/components/EmergencyServiceCard";
import { apiClient, type ApiEnvelope, type PageMeta } from "@/api/client";

export type EmergencyServiceList = {
  services: EmergencyServiceProp[];
  meta: PageMeta;
};

export type ServiceDetailsResponse = {
  id: string;
  service_name: string;
  service_category: string;
  service_status: string;
  description: string;
  price: string;
  service_image: string;
  service_image_public_id: string;
  availability: string;
  hospital_id: string;
  created_at: string;
  updated_at: string;
  hospital: {
    license_number: string;
    description: string;
    hospital_status: string;
    user: {
      name: string;
      email: string;
      address: string;
      phone: string;
    };
  };
};

export type ServiceFilter = {
  search?: string;
  service_status?: string;
  service_category?: string;
  sortBy?: "asc" | "desc";
  sortByPrice?: "asc" | "desc";
  rawPage?: number;
  rawLimit?: number;
}

export type CreateAndUpdateServicePayload = {
  service_name?: string;
  service_category?: string;
  description?: string;
  price?: number;
  availability?: string;
  service_image?: string;
}

export interface Service {
  id: string;
  service_name: string;
  service_category: string;
  service_status: string;
  description: string;
  price: string;
  service_image: string;
  service_image_public_id: string;
  availability: string;
  hospital_id: string;
  created_at: string;
  updated_at: string;
  hospital?: {
    user: {
      name: string;
      email: string;
      address: string;
      phone: string;
    };
  };
}

const prefix = "/api/v1/emergency-service"

export async function fetchEmergencyServices(
  rawPage = 1,
  rawLimit = 3,
): Promise<EmergencyServiceList> {
  const res = await apiClient<ApiEnvelope<EmergencyServiceList>>(
    `${prefix}`,
    { query: { rawPage, rawLimit } },
  );
  return res.data;
}

export async function fetchAllEmergencyServices(filters: ServiceFilter = {}): Promise<EmergencyServiceList> {
  const { search, service_status, service_category, sortByPrice, sortBy, rawPage = 1, rawLimit = 10 } = filters

  const query: Record<string, string | number> = {
    rawPage, rawLimit
  }

  if (sortByPrice) {
    query.sortByPrice = sortByPrice;
  } else if (sortBy) {
    query.sortBy = sortBy;
  }

  if (search) query.search = search
  if (service_category) query.service_category = service_category
  if (service_status) query.service_status = service_status

  const res = await apiClient<ApiEnvelope<EmergencyServiceList>>(`${prefix}`, {
    query
  });
  return res.data;
}

export async function fetchEmergencyServiceDetails(id: string) {
  const res = await apiClient<ApiEnvelope<ServiceDetailsResponse>>(`${prefix}/${id}`);
  return res.data
}

const buildFormData = (payload: CreateAndUpdateServicePayload, file?: File) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null)
      formData.append(key, String(value));
  });

  if (file)
    formData.append("service_image", file);

  return formData;
};

export async function createEmergencyService(payload: CreateAndUpdateServicePayload, file?: File) {
  const res = await apiClient<ApiEnvelope<Service>>(`${prefix}/create-service`, {
    method: "POST",
    body: buildFormData(payload, file),
  });
  return res.data;
}

export async function fetchMyEmergencyServices(filters: ServiceFilter = {}) {
  const { search, service_status, service_category, sortByPrice, sortBy, rawPage = 1, rawLimit = 10 } = filters

  const query: Record<string, string | number> = {
    rawPage, rawLimit
  }

  if (sortByPrice) {
    query.sortByPrice = sortByPrice;
  } else if (sortBy) {
    query.sortBy = sortBy;
  }

  if (search) query.search = search
  if (service_category) query.service_category = service_category
  if (service_status) query.service_status = service_status

  const res = await apiClient<ApiEnvelope<EmergencyServiceList>>(`${prefix}/my-services`, {
    query
  });
  return res.data;
}

export async function updateMyEmergencyService(id: string, payload: CreateAndUpdateServicePayload, file?: File) {
  const res = await apiClient<ApiEnvelope<Service>>(`${prefix}/update-service/${id}`, {
    method: "PATCH",
    body: buildFormData(payload, file),
  });
  return res.data;
}

export async function deleteMyEmergencyService(id: string) {
  const res = await apiClient<ApiEnvelope<{ success: boolean }>>(`${prefix}/my-service/${id}`, {
    method: "DELETE"
  });
  return res.data;
}