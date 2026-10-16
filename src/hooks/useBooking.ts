import { type BookingVariable, createBooking, fetchMyBookings, ServiceFilters, UpdateBookingPayload, updateMyBooking } from "@/api/booking";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCreateBooking() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (variables: BookingVariable) => createBooking(variables),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my_bookings"] });
        }
    })
}

export function useFetchAllBookings(filter: ServiceFilters = {}) {
    return useQuery({
        queryKey: ['my_bookings', JSON.stringify(filter)],
        queryFn: () => fetchMyBookings(filter),
        placeholderData: (prev) => prev
    })
}

export function useUpdateBooking() {
    const qc = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateBookingPayload }) => updateMyBooking(id, payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["my_bookings"] }),
    });
}