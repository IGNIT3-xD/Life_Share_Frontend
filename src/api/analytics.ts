import { apiClient, type ApiEnvelope } from "./client";

export type AdminDashboardStats = {
    totalUsers: number;
    totalBlockedUsers: number;
    totalRevenue: string;
    totalRefunded: string;
    donors: {
        total: number;
        verified: number;
        inProgress: number;
        notEligible: number;
    };
    requesters: {
        total: number;
        pending: number;
        verified: number;
        rejected: number;
    };
    hospitals: {
        total: number;
        inProgress: number;
        verified: number;
    };
    emergencyServices: {
        active: number;
        inProgress: number;
        inactive: number;
    };
};

export type MonthlyRevenue = {
    month: string;
    year: number;
    revenue: number;
    transactions: number;
};

export type RevenueData = {
    totalRevenue: number;
    totalTransactions: number;
    thisMonth: MonthlyRevenue;
    lastMonth: MonthlyRevenue;
    monthly: MonthlyRevenue[];
};

export type UserDashboardStats = {
    payments: {
        totalPaid: number;
        totalTransactions: number;
    };
    bloodRequests: {
        total: number;
        pending: number;
        inProgress: number;
        completed: number;
        cancelled: number;
    };
    donations: {
        received: number;
        completed: number;
    };
    bookings: {
        total: number;
        pending: number;
        accepted: number;
        confirmed: number;
        cancelled: number;
    };
};

const prefix = "api/v1/analytics";

export async function fetchAllAdminAnalytics() {
    const res = await apiClient<ApiEnvelope<AdminDashboardStats>>(`${prefix}`);
    return res.data;
}

export async function fetchAdminRevenueMetrics() {
    const res = await apiClient<ApiEnvelope<RevenueData>>(`${prefix}/revenue-metrics`);
    return res.data;
}

export async function fetchAllUserAnalytics() {
    const res = await apiClient<ApiEnvelope<UserDashboardStats>>(`${prefix}/me`);
    return res.data;
}