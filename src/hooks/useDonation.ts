import { fetchDonationRequestDetails, fetchDonationRequestsRecevied, myDonationRequests, updateDonationStatus, type UpdateDonationStatusPayload, type DonationFilter } from "@/api/donation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function useMyDonationRequest(filters: DonationFilter) {
    return useQuery({
        queryKey: ['my_donation_request', JSON.stringify(filters)],
        queryFn: () => myDonationRequests(filters),
        placeholderData: (prev) => prev
    })
}

export function useFetchReceivedDonations(filters: DonationFilter = {}) {
    return useQuery({
        queryKey: ["received_donations", JSON.stringify(filters)],
        queryFn: () => fetchDonationRequestsRecevied(filters),
        placeholderData: (prev) => prev,
    });
}

export function useDonationRequestDetails(id: string | null) {
    return useQuery({
        queryKey: ["donation_details", id],
        queryFn: () => fetchDonationRequestDetails(id!),
        enabled: !!id,
    });
}

export function useUpdateDonationStatus() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateDonationStatusPayload }) =>
            updateDonationStatus(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["received_donations"] });
            qc.invalidateQueries({ queryKey: ["donation_details"] });
        },
    });
}