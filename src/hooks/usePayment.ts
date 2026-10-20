import { createPayment, fetchAllPayments, fetchPaymentDetails, type PaymentFilters } from "@/api/payment";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useCreatePayment() {
    return useMutation({
        mutationFn: (id: string) => createPayment(id)
    })
}

// Admin controlled
export function useFetchAllPayments(filters: PaymentFilters = {}) {
    return useQuery({
        queryKey: ["all_payments_admin", JSON.stringify(filters)],
        queryFn: () => fetchAllPayments(filters),
        placeholderData: (prev) => prev,
    });
}

export function usePaymentDetails(id: string | null) {
    return useQuery({
        queryKey: ["payment_details", id],
        queryFn: () => fetchPaymentDetails(id!),
        enabled: !!id,
    });
}