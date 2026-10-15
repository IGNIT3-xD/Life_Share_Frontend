import { myDonationRequests, type DonationFilter } from "@/api/donation"
import { useQuery } from "@tanstack/react-query"

export function useMyDonationRequest(filters: DonationFilter) {
    return useQuery({
        queryKey: ['my_donation_request', JSON.stringify(filters)],
        queryFn: () => myDonationRequests(filters),
        placeholderData: (prev) => prev
    })
}