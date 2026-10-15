export const DONATION_STATUS_OPTIONS = [
    { value: "PENDING", label: "Pending" },
    { value: "SCHEDULED", label: "Scheduled" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "EXPIRED", label: "Expired" },
] as const;

export const SORT_OPTIONS = [
    { value: "desc", label: "Newest First" },
    { value: "asc", label: "Oldest First" },
] as const;