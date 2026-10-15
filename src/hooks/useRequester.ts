import { BloodRequestersFilter, type BloodRequestPayload, deleteMyBloodRequest, fetchAllBloodRequesters, fetchBloodRequesters, fetchMyBloodRequest, postBloodRequest, type RequesterFilters, type UpdateBloodRequestVariable, updateMyBloodRequest } from "@/api/requester";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useBloodRequester(rawPage = 1, rawLimit = 3) {
  return useQuery({
    queryKey: ["blood_requester", rawPage, rawLimit],
    queryFn: () => fetchBloodRequesters(rawPage, rawLimit),
  });
}

export function useAllBloodRequester(filters: BloodRequestersFilter) {
  return useQuery({
    queryKey: ["blood_requester", JSON.stringify(filters)],
    queryFn: () => fetchAllBloodRequesters(filters),
    placeholderData: (prev) => prev
  });
}

export const usePostBloodRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: BloodRequestPayload) => postBloodRequest(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blood_requester"] });
      queryClient.invalidateQueries({ queryKey: ["my_blood_request"] });
    }
  })
}

export const useMyBloodRequest = (filters: RequesterFilters = {}) => {
  return useQuery({
    queryKey: ['my_blood_request', JSON.stringify(filters)],
    queryFn: () => fetchMyBloodRequest(filters),
    placeholderData: (prev) => prev,
  })
}

export const useUpdateBloodRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: UpdateBloodRequestVariable) => updateMyBloodRequest(variables),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blood_requester"] });
      queryClient.invalidateQueries({ queryKey: ["my_blood_request"] });
    }
  })
}

export const useDeleteBloodRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteMyBloodRequest(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blood_requester"] });
      queryClient.invalidateQueries({ queryKey: ["my_blood_request"] });
    }
  })
}