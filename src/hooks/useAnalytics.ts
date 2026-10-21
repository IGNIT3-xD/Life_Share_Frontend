import { fetchAdminRevenueMetrics, fetchAllAdminAnalytics, fetchAllUserAnalytics } from "@/api/analytics"
import { useQuery } from "@tanstack/react-query"

export const useAdminAnalytics = () => {
    return useQuery({
        queryKey: ["admin_dashboard_analytics"],
        queryFn: fetchAllAdminAnalytics
    })
}

export const useAdminRevenueMetrics = () => {
    return useQuery({
        queryKey: ["admin_dashboard_analytics_revenue_chart"],
        queryFn: fetchAdminRevenueMetrics
    })
}

export const useUserAnalytics = () => {
    return useQuery({
        queryKey: ["user_dashboard_analytics"],
        queryFn: fetchAllUserAnalytics
    })
}
