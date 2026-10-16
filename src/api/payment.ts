import { apiClient, type ApiEnvelope } from "./client"

const prefix = "/api/v1/payment"

export async function createPayment(id: string) {
    const res = await apiClient<ApiEnvelope<string>>(`${prefix}/${id}`, {
        method: "POST"
    });
    return res.data
}