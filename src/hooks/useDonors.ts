import { useMutation, useQuery } from "@tanstack/react-query";
import { createDonorProfile, type DonorFilters, type DonorProfileCreatePayload, fetchAllDOnors, fetchDonors, fetchMyDonorProfile } from "@/api/donors";

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
  return useMutation({
    mutationFn: (payload: DonorProfileCreatePayload) => createDonorProfile(payload)
  })
}

export const useMyDonorProfile = () => {
  return useQuery({
    queryKey: ["my_donor_profile"],
    queryFn: fetchMyDonorProfile,
    retry: false
  })
}