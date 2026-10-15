export const ServiceStatus = {
    IN_PROGRESS: 'IN_PROGRESS',
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE'
} as const

export const ServiceCategory = {
    VETERINARY: 'VETERINARY',
    EMERGENCY_AMBULANCE: 'EMERGENCY_AMBULANCE',
    BLOOD_BANK: 'BLOOD_BANK',
    LAB_TEST: 'LAB_TEST',
    PHARMACY: 'PHARMACY',
    OTHER: 'OTHER'
} as const

export const SERVICE_CATEGORY_OPTIONS = [
    { value: "EMERGENCY_AMBULANCE", label: "Emergency Ambulance" },
    { value: "BLOOD_BANK", label: "Blood Bank" },
    { value: "LAB_TEST", label: "Lab Test" },
    { value: "PHARMACY", label: "Pharmacy" },
    { value: "VETERINARY", label: "Veterinary" },
    { value: "OTHER", label: "Other" },
] as const;

export const SERVICE_STATUS_OPTIONS = [
    { value: "ACTIVE", label: "Active" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "INACTIVE", label: "Inactive" },
] as const;

export const SERVICE_SORT_OPTIONS = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
] as const;