import { fetchAdminRevenueMetrics, fetchAllAdminAnalytics } from "@/api/analytics"
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