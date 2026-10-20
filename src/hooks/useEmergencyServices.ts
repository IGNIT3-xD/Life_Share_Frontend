import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type CreateAndUpdateServicePayload,
  createEmergencyService,
  deleteMyEmergencyService,
  fetchAllEmergencyServices,
  fetchEmergencyServiceDetails,
  fetchEmergencyServices,
  fetchMyEmergencyServices,
  updateMyEmergencyService,
  type ServiceFilter,
  fetchAllEmergencyServicesAdmin,
  type UpdateServiceStatus,
  updateServciceStatus,
  deleteServciceAdmin,
} from "@/api/emergencyServices";

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
    placeholderData: (prev) => prev,
  });
}

export function useEmergencyServiceDetails(id: string) {
  return useQuery({
    queryKey: ["emergency-service-details", id],
    queryFn: () => fetchEmergencyServiceDetails(id),
  });
}useUpdateEmergencyServiceStatus

export function useCreateEmergencyService() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      file,
    }: {
      payload: CreateAndUpdateServicePayload;
      file?: File;
    }) => createEmergencyService(payload, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["emergency-services"] });
    },
  });
}

export function useFetchMyEmergencyServices(filters: ServiceFilter = {}) {
  return useQuery({
    queryKey: ["emergency-services", JSON.stringify(filters)],
    queryFn: () => fetchMyEmergencyServices(filters),
    placeholderData: (prev) => prev,
  });
}

export function useUpdateMyEmergencyService() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
      file,
    }: {
      id: string;
      payload: CreateAndUpdateServicePayload;
      file?: File;
    }) => updateMyEmergencyService(id, payload, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["emergency-services"] });
    },
  });
}

export function useDeleteMyEmergencyService() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMyEmergencyService(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["emergency-services"] });
    },
  });
}

// Admin controlled
export function useFetchAllEmergencyServicesAdmin(filters: ServiceFilter = {}) {
  return useQuery({
    queryKey: ["emergency-services-admin", JSON.stringify(filters)],
    queryFn: () => fetchAllEmergencyServicesAdmin(filters),
    placeholderData: (prev) => prev,
  });
}

export function useUpdateEmergencyServiceStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateServiceStatus;
    }) => updateServciceStatus(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["emergency-services-admin"] });
    },
  });
}

export function useDeleteEmergencyService() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteServciceAdmin(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["emergency-services-admin"] });
    },
  });
}
