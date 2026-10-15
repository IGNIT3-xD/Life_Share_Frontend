import { useQuery } from "@tanstack/react-query";
import { fetchAllEmergencyServices, fetchEmergencyServices, ServiceFilter } from "@/api/emergencyServices";

export function useEmergencyServices(rawPage = 1, rawLimit = 3) {
  return useQuery({
    queryKey: ["emergency-services", rawPage, rawLimit],
    queryFn: () => fetchEmergencyServices(rawPage, rawLimit),
  });
}

export function useAllEmergencyServices(filters: ServiceFilter = {}) {
  return useQuery({
    queryKey: ["emergency-services", JSON.stringify(filters)],
    queryFn: () => fetchAllEmergencyServices(filters),
    placeholderData: (prev) => prev
  });
}