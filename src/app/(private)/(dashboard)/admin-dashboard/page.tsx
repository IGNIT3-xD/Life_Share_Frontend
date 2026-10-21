"use client";

import { useAdminAnalytics, useAdminRevenueMetrics } from "@/hooks/useAnalytics";
import { RevenueChart } from "./_components/RevenueChart";
import { AdminQuickStats } from "./_components/AdminQuickStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, TrendingUp, ShieldAlert, DollarSign } from "lucide-react";
import { useMe } from "@/hooks/useAuth";
import { RecentPaymentsWidget } from "../user-dashboard/_components/RecentPaymentsWidget";

const formatCurrency = (value: number | string) => {
    const num = Number(value);
    return `৳${num.toLocaleString("en-BD")}`;
};

export default function AdminDashboardPage() {
    const { data: me } = useMe();
    const { data: analytics, isPending: statsLoading } = useAdminAnalytics();
    const { data: revenue, isPending: revenueLoading } = useAdminRevenueMetrics();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-primary">
                    Welcome Back, <span className="text-[#B15A36]">{me?.name?.split(" ")[0] || "Admin"}</span>
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Here is what's happening across the Life Share platform today.
                </p>
            </div>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Revenue Card */}
                <Card className="bg-linear-to-br from-[#B15A36] to-red-400 text-white border-0 shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-white/90">Total Revenue</CardTitle>
                        <DollarSign className="w-4 h-4 text-white/80" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {revenueLoading ? "..." : formatCurrency(revenue?.totalRevenue || 0)}
                        </div>
                        <p className="text-xs text-white/80 mt-1 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {revenue?.totalTransactions || 0} total transactions
                        </p>
                    </CardContent>
                </Card>

                {/* Users Card */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Users</CardTitle>
                        <Users className="w-4 h-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">
                            {statsLoading ? "..." : analytics?.totalUsers || 0}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            {analytics?.totalBlockedUsers || 0} blocked accounts
                        </p>
                    </CardContent>
                </Card>

                {/* Pending Approvals Card */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Pending Approvals</CardTitle>
                        <ShieldAlert className="w-4 h-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">
                            {statsLoading ? "..." : (analytics?.donors.inProgress || 0) + (analytics?.hospitals.inProgress || 0)}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Donors & Hospitals awaiting review
                        </p>
                    </CardContent>
                </Card>

                {/* Refunds Card */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Refunded</CardTitle>
                        <CreditCard className="w-4 h-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">
                            {statsLoading ? "..." : formatCurrency(analytics?.totalRefunded || 0)}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Processed back to users
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Grid: Chart + Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Revenue Chart (takes 2 columns) */}
                <div className="lg:col-span-2">
                    <RevenueChart />
                </div>

                {/* Quick Stats Breakdown */}
                <div className="lg:col-span-1">
                    {statsLoading ? (
                        <div className="h-112.5 bg-slate-100 rounded-xl animate-pulse" />
                    ) : analytics ? (
                        <AdminQuickStats stats={analytics} />
                    ) : null}
                </div>
            </div>

            <RecentPaymentsWidget dashboardBasePath="/user-dashboard" />
        </div>
    );
}