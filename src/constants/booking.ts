export const PAYMENT_METHODS = [
    { value: "BKASH", label: "bKash" }
] as const;

export const BOOKING_DESCRIPTION_MAX = 1000;
export const BOOKING_NOTE_MAX = 500;

export const BOOKING_STATUS = [
    { value: "PENDING", label: "Pending" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "ACCEPTED", label: "Accepted" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "COMPLETED", label: "Completed" },
    { value: "FAILED", label: "Failed" },
] as const;

export const PAYMENT_STATUS = [
    { value: "PENDING", label: "Pending" },
    { value: "PAID", label: "Paid" },
    { value: "FAILED", label: "Failed" },
    { value: "REFUNDED", label: "Refunded" },
    { value: "REFUNDED_PENDING", label: "Refund Pending" },
    { value: "CANCELLED", label: "Cancelled" },
] as const;

export const PAYMENT_VIA_OPTIONS = PAYMENT_METHODS;

export const BOOKING_SORT_OPTIONS = [
    { value: "desc", label: "Newest First" },
    { value: "asc", label: "Oldest First" },
] as const;
