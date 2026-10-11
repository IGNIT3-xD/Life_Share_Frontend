import { type BloodRequestPayload, fetchBloodRequesters, fetchMyBloodRequest, postBloodRequest } from "@/api/requester";
import { useQuery, useMutation } from "@tanstack/react-query";

export function useBloodRequester(rawPage = 1, rawLimit = 3) {
  return useQuery({
    queryKey: ["blood_requester", rawPage, rawLimit],
    queryFn: () => fetchBloodRequesters(rawPage, rawLimit),
  });
}

export const usePostBloodRequest = () => {
  return useMutation({
    mutationFn: (payload: BloodRequestPayload) => postBloodRequest(payload)
  })
}

export const useMyBloodRequest = (rawPage = 1, rawLimit = 10) => {
  return useQuery({
    queryKey: ['my_blood_request', rawPage, rawLimit],
    queryFn: () => fetchMyBloodRequest(rawPage, rawLimit)
  })
}