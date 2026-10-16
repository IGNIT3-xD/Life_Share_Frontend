import { apiClient } from "./client";

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

export type BookingVariable = {
    id: string;
    payload: BookingDataPayload
}

export async function createBooking(variables: BookingVariable) {
    const { id, payload } = variables

    const res = await apiClient(`${prefix}/booking-request/${id}`, {
        method: 'POST',
        body: payload
    });
    return res.data
}

// export async function updateBooking(variables: BookingVariable) {
//     const { id, payload } = variables

//     const res = await apiClient(`${prefix}/update-booking-request/${id}`, {
//         method: 'POST',
//         body: payload
//     });
//     return res.data
// }