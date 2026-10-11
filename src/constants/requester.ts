export const BloodGroup = {
    A_POS: 'A_POS',
    A_NEG: 'A_NEG',
    B_POS: 'B_POS',
    B_NEG: 'B_NEG',
    AB_POS: 'AB_POS',
    AB_NEG: 'AB_NEG',
    O_POS: 'O_POS',
    O_NEG: 'O_NEG'
} as const

export const RequestUrgency = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    EMERGENCY: 'EMERGENCY',
    CRITICAL: 'CRITICAL'
} as const

export const RequestStatus = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
} as const

export const URGENCY_OPTIONS = [
    { value: "EMERGENCY", label: "Emergency" },
    { value: "HIGH", label: "High" },
    { value: "MEDIUM", label: "Medium" },
    { value: "LOW", label: "Low" },
] as const;

export const REQUEST_STATUS_OPTIONS = [
    { value: "PENDING", label: "Pending" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
] as const;

export const VERIFICATION_STATUS_OPTIONS = [
    { value: "VERIFIED", label: "Verified" },
    { value: "PENDING", label: "Pending" },
    { value: "REJECTED", label: "Rejected" },
] as const;

export const REQUEST_SORT_OPTIONS = [
    { value: "desc", label: "Newest First" },
    { value: "asc", label: "Oldest First" },
] as const;