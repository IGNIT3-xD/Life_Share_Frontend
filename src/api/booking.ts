import { apiClient, ApiEnvelope, PageMeta } from "./client";

const prefix = '/api/v1/emergency-service-booking'

export type BookingDataPayload = {
    patient_name: string;
    patient_number: string;
    payment_via: string;
    emergency_location: string;
    description: string;
    scheduled_at: string;
    note?: string;
}

export type UpdateBookingPayload = {
    patient_name?: string;
    patient_number?: string;
    emergency_location?: string;
    description?: string;
    scheduled_at?: string;
    note?: string;
};

export type BookingVariable = {
    id: string;
    payload: BookingDataPayload
}

export type EmergencyServiceBookingProp = {
    id: string;
    booking_status: "PENDING" | "CONFIRMED" | "ACCEPTED" | "CANCELLED" | "COMPLETED" | "FAILED";
    payment_status: "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "CANCELLED" | "REFUNDED_PENDING";
    payment_amount: Number;
    payment_via: string;
    emergency_location: string;
    description: string;
    patient_name: string;
    patient_number: string;
    note?: string | null;
    scheduled_at: string;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
    user_id: string;
    hospital_id: string;
    emergencyService_id: string;
};

export type fetchBookingsResponse = {
    bookings: EmergencyServiceBookingProp[];
    meta: PageMeta;
}

export type ServiceFilters = {
    search?: string;
    booking_status?: string;
    payment_status?: string;
    payment_via?: string;
    sortBy?: "asc" | "desc";
    limit?: number;
    page?: number;
}

export async function createBooking(variables: BookingVariable) {
    const { id, payload } = variables

    const res = await apiClient(`${prefix}/booking-request/${id}`, {
        method: 'POST',
        body: payload
    });
    return res.data
}

export async function fetchMyBookings(filters: ServiceFilters = {}) {
    const { search, booking_status, payment_via, payment_status, sortBy = 'desc', page = 1, limit = 10 } = filters

    const query: Record<string, string | number> = {
        sortBy, page, limit
    }

    if (search) query.search = search
    if (booking_status) query.booking_status = booking_status
    if (payment_status) query.payment_status = payment_status
    if (payment_via) query.payment_via = payment_via

    const res = await apiClient<ApiEnvelope<fetchBookingsResponse>>(`${prefix}/my-booking-request`, {
        query
    });
    return res.data
}

export async function updateMyBooking(id: string, payload: UpdateBookingPayload) {
    const res = await apiClient(`${prefix}/update-booking-request/${id}`, {
        method: 'PATCH',
        body: payload
    });
    return res.data
}