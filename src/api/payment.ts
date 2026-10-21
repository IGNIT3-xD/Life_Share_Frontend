import { apiClient, type PageMeta, type ApiEnvelope } from "./client"

const prefix = "/api/v1/payment"

export type Payment = {
    id: string;
    payment_status: string;
    payment_amount: string;
    currency: string;
    payment_gateway: string;
    merchant_invoice_number: string;
    payer_reference: string;
    bkash_payment_id: string;
    bkash_trx_id: string;
    paid_at: string | null;
    gatewayResponse: any;
    refund_amount: string | null;
    refund_trx_id: string | null;
    refund_reason: string | null;
    refunded_at: string | null;
    updated_at: string;
    created_at: string;
    emergencyService_id: string;
    user_id: string;
}

export type PaymentList = {
    payment: Payment[];
    meta: PageMeta
}

export type PaymentDetails = Payment & {
    emergencyService: {
        id: string;
        service_name: string;
        service_category: string;
        service_image: string;
    };
    user: {
        id: string;
        name: string;
        email: string;
        phone: string;
        profile_pic: string | null;
    };
};

export async function createPayment(id: string) {
    const res = await apiClient<ApiEnvelope<string>>(`${prefix}/${id}`, {
        method: "POST"
    });
    return res.data
}

// Admin controlled
export interface PaymentFilters {
    search?: string;
    payment_status?: string;
    payment_gateway?: string;
    sortBy?: "asc" | "desc";
    sortByAmount?: "asc" | "desc";
    rawLimit?: number;
    rawPage?: number;
}

export async function fetchAllPayments(filters: PaymentFilters = {}) {
    const { search, payment_gateway, payment_status, sortByAmount, sortBy = 'desc', rawLimit = 10, rawPage = 1 } = filters

    const query: Record<string, string | number> = {
        rawPage, rawLimit
    }

    if (search) query.search = search
    if (payment_gateway) query.payment_gateway = payment_gateway
    if (payment_status) query.payment_status = payment_status

    if (sortByAmount) {
        query.sortByAmount = sortByAmount;
    } else {
        query.sortBy = sortBy;
    }

    const res = await apiClient<ApiEnvelope<PaymentList>>("/api/v1/payment", { query });
    return res.data
}

export async function fetchPaymentDetails(id: string) {
    const res = await apiClient<ApiEnvelope<PaymentDetails>>(`/api/v1/payment/${id}`);
    return res.data
}

export async function fetchHospitalPayments(filters: PaymentFilters = {}) {
    const { search, payment_gateway, payment_status, sortBy = 'desc', rawLimit = 10, rawPage = 1 } = filters

    const query: Record<string, string | number> = {
        rawPage, rawLimit, sortBy
    }

    if (search) query.search = search
    if (payment_gateway) query.payment_gateway = payment_gateway
    if (payment_status) query.payment_status = payment_status

    const res = await apiClient<ApiEnvelope<PaymentList>>("/api/v1/payment/hospital-payments", { query });
    return res.data
}

export type UpdatePaymentStatus = {
    payment_status: "REFUNDED_PENDING" | "REFUNDED"
}

export async function updatePaymentStatus(id: string, payload: UpdatePaymentStatus) {
    const res = await apiClient(`/api/v1/payment/hospital-payments/${id}`, {
        method: "PUT",
        body: payload
    });
    return res.data
}

export async function fetchMyPayments(filters: PaymentFilters = {}) {
    const { search, payment_gateway, payment_status, sortBy = 'desc', rawLimit = 10, rawPage = 1 } = filters

    const query: Record<string, string | number> = {
        rawPage, rawLimit, sortBy
    }

    if (search) query.search = search
    if (payment_gateway) query.payment_gateway = payment_gateway
    if (payment_status) query.payment_status = payment_status

    const res = await apiClient<ApiEnvelope<PaymentList>>("/api/v1/payment/my-payments", { query });
    return res.data
}