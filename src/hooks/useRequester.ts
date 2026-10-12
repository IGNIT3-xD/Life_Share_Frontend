import { type BloodRequestPayload, fetchBloodRequesters, fetchMyBloodRequest, postBloodRequest, type UpdateBloodRequestVariable, updateMyBloodRequest } from "@/api/requester";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useBloodRequester(rawPage = 1, rawLimit = 3) {
  return useQuery({
    queryKey: ["blood_requester", rawPage, rawLimit],
    queryFn: () => fetchBloodRequesters(rawPage, rawLimit),
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

export const useMyBloodRequest = (rawPage = 1, rawLimit = 10) => {
  return useQuery({
    queryKey: ['my_blood_request', rawPage, rawLimit],
    queryFn: () => fetchMyBloodRequest(rawPage, rawLimit)
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