import { createPayment } from "@/api/payment";
import { useMutation } from "@tanstack/react-query";

export function useCreatePayment() {
    return useMutation({
        mutationFn: (id: string) => createPayment(id)
    })
}