import { createHospitalProfile, type CreateProfilePayload, deleteHospitalProfile, deleteHospitalProfileAdmin, editHospitalProfile, fetchAllHospitalProfile, fetchMyHospitalProfile, type HospitalFilters, type UpdateHospitalProfileStatus, updateHospitalProfileStatus, type UpdateProfilePayload } from "@/api/hospital";
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

// Admin controlled
export function useFetchAllHospitalProfile(filters: HospitalFilters = {}) {
    return useQuery({
        queryKey: ["all_hospital_profiles", JSON.stringify(filters)],
        queryFn: () => fetchAllHospitalProfile(filters),
        placeholderData: (prev) => prev
    })
};

export function useUpdateHospitalProfileStatus() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({ id, payload }: { id: string, payload: UpdateHospitalProfileStatus }) =>
            updateHospitalProfileStatus(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["all_hospital_profiles"] })
        }
    })
};

export function useDeleteHospitalProfileAdmin() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) =>
            deleteHospitalProfileAdmin(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["all_hospital_profiles"] })
        }
    })
};