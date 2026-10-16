import { type BookingVariable, createBooking } from "@/api/booking";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateBooking() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (variables: BookingVariable) => createBooking(variables),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my_bookings"] });
        }
    })
}