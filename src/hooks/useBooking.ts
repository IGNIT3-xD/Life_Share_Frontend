import { type BookingVariable, cancelMyBooking, createBooking, deleteMyBooking, fetchBookingRequestDetails, fetchMyBookingRequest, fetchMyBookings, myBookingDetails, type ServiceFilters, type UpdateBookingPayload, updateBookingRequest, UpdateBookingStatusPayload, updateMyBooking } from "@/api/booking";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCreateBooking() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (variables: BookingVariable) => createBooking(variables),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my_bookings"] });
        }
    })
};

export function useFetchAllBookings(filter: ServiceFilters = {}) {
    return useQuery({
        queryKey: ['my_bookings', JSON.stringify(filter)],
        queryFn: () => fetchMyBookings(filter),
        placeholderData: (prev) => prev
    })
};

export function useUpdateBooking() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateBookingPayload }) => updateMyBooking(id, payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["my_bookings"] }),
    });
};

export function useBookingDetails(id: string | null) {
    return useQuery({
        queryKey: ["my_booking_details", id],
        queryFn: () => myBookingDetails(id!),
        enabled: !!id,
        staleTime: 60_000,
    });
};

export function useCancelBooking() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => cancelMyBooking(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["my_bookings"] });
            qc.invalidateQueries({ queryKey: ["my_booking_details"] });
        }
    })
}

export function useDeleteBooking() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteMyBooking(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["my_bookings"] });
            qc.invalidateQueries({ queryKey: ["my_booking_details"] });
        }
    })
}

export function useFetchMyBookingRequest(filters: ServiceFilters = {}) {
    return useQuery({
        queryKey: ["received_bookings", JSON.stringify(filters)],
        queryFn: () => fetchMyBookingRequest(filters),
        placeholderData: (prev) => prev,
    });
}

export function useBookingRequestDetails(id: string | null) {
    return useQuery({
        queryKey: ["received_booking_details", id],
        queryFn: () => fetchBookingRequestDetails(id!),
        enabled: !!id,
    });
}

export function useUpdateBookingStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateBookingStatusPayload }) =>
            updateBookingRequest(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["received_bookings"] });
            qc.invalidateQueries({ queryKey: ["received_booking_details"] });
        },
    });
}