import { createPayment, fetchAllPayments, fetchHospitalPayments, fetchPaymentDetails, type UpdatePaymentStatus, updatePaymentStatus, type PaymentFilters } from "@/api/payment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export function useFetchAllHospitalPayments(filters: PaymentFilters = {}) {
    return useQuery({
        queryKey: ["all_payments_hospital", JSON.stringify(filters)],
        queryFn: () => fetchHospitalPayments(filters),
        placeholderData: (prev) => prev,
    });
}

export function useUpdatePaymentStatus() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({ id, payload }: { id: string, payload: UpdatePaymentStatus }) => updatePaymentStatus(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['all_payments_hospital'] })
        }
    })
}