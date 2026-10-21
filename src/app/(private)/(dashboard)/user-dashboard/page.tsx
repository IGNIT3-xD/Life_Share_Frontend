"use client";

import { useUserAnalytics } from "@/hooks/useAnalytics";
import { useMe } from "@/hooks/useAuth";
import {
    CreditCard, Droplet, HeartHandshake, CalendarCheck,
    ArrowUpRight, Clock, CheckCircle2, XCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RecentPaymentsWidget } from "./_components/RecentPaymentsWidget";

const formatCurrency = (value: number) => {
    return `৳${value.toLocaleString("en-BD")}`;
};

export default function UserDashboardPage() {
    const { data: me } = useMe();
    const { data: stats, isPending, error } = useUserAnalytics();

    if (isPending) {
        return (
            <div className="space-y-8 max-w-7xl mx-auto">
                <div className="h-10 w-64 bg-slate-200 rounded-md animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-32 bg-slate-200 rounded-xl animate-pulse" />
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-64 bg-slate-200 rounded-xl animate-pulse" />
                    <div className="h-64 bg-slate-200 rounded-xl animate-pulse" />
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-500">Could not load dashboard statistics.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-primary">
                    Welcome Back, <span className="text-[#B15A36]">{me?.name?.split(" ")[0] || "User"}</span>
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Here is an overview of your recent activity on Life Share.
                </p>
            </div>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Total Paid */}
                <Card className="bg-linear-to-br from-[#B15A36] to-red-400 text-white border-0 shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-white/90">Total Spent</CardTitle>
                        <CreditCard className="w-4 h-4 text-white/80" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {formatCurrency(stats.payments.totalPaid)}
                        </div>
                        <p className="text-xs text-white/80 mt-1">
                            Across {stats.payments.totalTransactions} transactions
                        </p>
                    </CardContent>
                </Card>

                {/* Blood Requests */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Blood Requests</CardTitle>
                        <Droplet className="w-4 h-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">
                            {stats.bloodRequests.total}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            {stats.bloodRequests.pending} pending approval
                        </p>
                    </CardContent>
                </Card>

                {/* Donations Received */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Donations Received</CardTitle>
                        <HeartHandshake className="w-4 h-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">
                            {stats.donations.received}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            {stats.donations.completed} successfully completed
                        </p>
                    </CardContent>
                </Card>

                {/* Bookings */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Bookings</CardTitle>
                        <CalendarCheck className="w-4 h-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">
                            {stats.bookings.total}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            {stats.bookings.confirmed + stats.bookings.accepted} active services
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Blood Requests Breakdown */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Droplet className="w-4 h-4 text-red-500" /> Blood Request Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <StatusBar label="Pending" value={stats.bloodRequests.pending} total={stats.bloodRequests.total} color="bg-amber-500" icon={<Clock className="w-4 h-4" />} />
                        <StatusBar label="In Progress" value={stats.bloodRequests.inProgress} total={stats.bloodRequests.total} color="bg-blue-500" icon={<ArrowUpRight className="w-4 h-4" />} />
                        <StatusBar label="Completed" value={stats.bloodRequests.completed} total={stats.bloodRequests.total} color="bg-emerald-500" icon={<CheckCircle2 className="w-4 h-4" />} />
                        <StatusBar label="Cancelled" value={stats.bloodRequests.cancelled} total={stats.bloodRequests.total} color="bg-slate-400" icon={<XCircle className="w-4 h-4" />} />
                    </CardContent>
                </Card>

                {/* Bookings Breakdown */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <CalendarCheck className="w-4 h-4 text-blue-500" /> Service Booking Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <StatusBar label="Pending" value={stats.bookings.pending} total={stats.bookings.total} color="bg-amber-500" icon={<Clock className="w-4 h-4" />} />
                        <StatusBar label="Accepted / Confirmed" value={stats.bookings.accepted + stats.bookings.confirmed} total={stats.bookings.total} color="bg-blue-500" icon={<CheckCircle2 className="w-4 h-4" />} />
                        <StatusBar label="Cancelled" value={stats.bookings.cancelled} total={stats.bookings.total} color="bg-slate-400" icon={<XCircle className="w-4 h-4" />} />
                    </CardContent>
                </Card>
            </div>

            <RecentPaymentsWidget dashboardBasePath="/user-dashboard" />
        </div>
    );
}

// --- Helper Component for Progress Bars ---

function StatusBar({ label, value, total, color, icon }: { label: string, value: number, total: number, color: string, icon: React.ReactNode }) {
    // Calculate percentage, fallback to 0 if total is 0
    const percentage = total === 0 ? 0 : (value / total) * 100;

    return (
        <div>
            <div className="flex items-center justify-between text-sm mb-1.5">
                <div className="flex items-center gap-1.5 text-slate-600">
                    {icon} {label}
                </div>
                <span className="font-semibold text-slate-900">{value}</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={cn("h-full rounded-full transition-all duration-500", color)}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}