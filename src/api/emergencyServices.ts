import type { EmergencyServiceProp } from "@/components/EmergencyServiceCard";
import { apiClient, type ApiEnvelope, type PageMeta } from "@/api/client";

export type EmergencyServiceList = {
  services: EmergencyServiceProp[];
  meta: PageMeta;
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

export async function fetchEmergencyServices(
  rawPage = 1,
  rawLimit = 3,
): Promise<EmergencyServiceList> {
  const res = await apiClient<ApiEnvelope<EmergencyServiceList>>(
    "/api/v1/emergency-service",
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

  const res = await apiClient<ApiEnvelope<EmergencyServiceList>>("/api/v1/emergency-service", {
    query
  });
  return res.data;
}
