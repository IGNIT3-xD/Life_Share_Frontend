import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDonorProfile, deleteDonorProfile, deleteMyDonorProfile, type DonorFilters, type DonorProfileCreatePayload, fetchAllDOnors, fetchAllDonorsAdmin, fetchDonorDetails, fetchDonors, fetchMyDonorProfile, StatusPayload, updateDonorProfileStatus, updateMyDonorProfile } from "@/api/donors";

export function useDonors(rawPage = 1, rawLimit = 3) {
  return useQuery({
    queryKey: ["donors", rawPage, rawLimit],
    queryFn: () => fetchDonors(rawPage, rawLimit),
  });
}

export const useAllDonors = (filters: DonorFilters = {}) => {
  return useQuery({
    queryKey: ["all_donors", JSON.stringify(filters)],
    queryFn: () => fetchAllDOnors(filters),
    placeholderData: (prev) => prev,
  })
}

export const useDonorProfileCreate = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: DonorProfileCreatePayload) => createDonorProfile(payload),

    onSuccess: () => qc.invalidateQueries({ queryKey: ["my_donor_profile"] }),
  })
}

export const useMyDonorProfile = () => {
  return useQuery({
    queryKey: ["my_donor_profile"],
    queryFn: fetchMyDonorProfile,
    retry: false
  })
}

export const useDeleteDonorProfile = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMyDonorProfile(id),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my_donor_profile'] })
    }
  });
};

export const useUpdateDonorProfile = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<DonorProfileCreatePayload>) => updateMyDonorProfile(payload),

    onSuccess: () => qc.invalidateQueries({ queryKey: ["my_donor_profile"] }),
  });
};

export const useDonorDetails = (id: string) => {
  return useQuery({
    queryKey: ['donor_details', id],
    queryFn: () => fetchDonorDetails(id),
    enabled: !!id,                             // ← Skip if no id
    staleTime: 1000 * 60 * 2,
  })
}

// Admin controlled
export const useAllDonorsAdmin = (filters: DonorFilters = {}) => {
  return useQuery({
    queryKey: ["all_donors_admin", JSON.stringify(filters)],
    queryFn: () => fetchAllDonorsAdmin(filters),
    placeholderData: (prev) => prev,
  })
}

export const useUpdateDonorProfileStatus = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: StatusPayload }) =>
      updateDonorProfileStatus(id, payload),

    onSuccess: () => qc.invalidateQueries({ queryKey: ["all_donors_admin"] }),
  });
};

export const useDeleteDonorProfileAdmin = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDonorProfile(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["all_donors_admin"] }),
  });
};