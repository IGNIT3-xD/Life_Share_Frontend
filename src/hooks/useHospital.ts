import { createHospitalProfile, CreateProfilePayload, deleteHospitalProfile, editHospitalProfile, fetchMyHospitalProfile, UpdateProfilePayload } from "@/api/hospital";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCreateHospitalProfile() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (payload: CreateProfilePayload) => createHospitalProfile(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["my_hospital_profile"] })
        }
    })
}

export function useFetchHospitalProfile() {
    return useQuery({
        queryKey: ["my_hospital_profile"],
        queryFn: fetchMyHospitalProfile
    })
}

export function useEditHospitalProfile() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (payload: UpdateProfilePayload) => editHospitalProfile(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["my_hospital_profile"] })
        }
    })
}

export function useDeleteHospitalProfile() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteHospitalProfile(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["my_hospital_profile"] })
        }
    })
}