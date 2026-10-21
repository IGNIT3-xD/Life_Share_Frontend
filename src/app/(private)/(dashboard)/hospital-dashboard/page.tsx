"use client";

import { useHospitalAnalytics } from "@/hooks/useAnalytics";
import { useMe } from "@/hooks/useAuth";
import {
    CreditCard, CalendarCheck, Stethoscope,
    Clock, CheckCircle2, XCircle, ArrowUpRight, RotateCcw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const formatCurrency = (value: number) => {
    return `৳${value.toLocaleString("en-BD")}`;
};

export default function HospitalDashboardPage() {
    const { data: me } = useMe();
    const { data: stats, isPending, error } = useHospitalAnalytics();

    if (isPending) {
        return (
            <div className="space-y-8 max-w-7xl mx-auto">
                <div className="h-10 w-64 bg-slate-200 rounded-md animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-32 bg-slate-200 rounded-xl animate-pulse" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="h-80 bg-slate-200 rounded-xl animate-pulse" />
                    ))}
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

    // Calculate active bookings (anything not completed or cancelled)
    const activeBookings = stats.bookings.pending + stats.bookings.accepted + stats.bookings.confirmed;

    return (
        <div className="space-y-8 pt-16">
            {/* Header */}
            <div>
                <h1 className="text-primary">
                    Welcome Back, <span className="text-[#B15A36]">{me?.name?.split(" ")[0] || "Hospital"}</span>
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Here is an overview of your hospital's revenue and service activity.
                </p>
            </div>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Total Revenue (Highlight) */}
                <Card className="bg-linear-to-br from-[#B15A36] to-red-400 text-white border-0 shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-white/90">Total Revenue</CardTitle>
                        <CreditCard className="w-4 h-4 text-white/80" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {formatCurrency(stats.revenue.totalRevenue)}
                        </div>
                        <p className="text-xs text-white/80 mt-1">
                            From {stats.revenue.totalTransactions} successful transactions
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
                            {stats.bookings.totalReceived}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            {activeBookings} currently active
                        </p>
                    </CardContent>
                </Card>

                {/* Services */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Services Offered</CardTitle>
                        <Stethoscope className="w-4 h-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">
                            {stats.services.total}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            {stats.services.active} active & accepting bookings
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 1. Booking Breakdown */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <CalendarCheck className="w-4 h-4 text-blue-500" /> Booking Breakdown
                        </CardTitle>
                        <CardDescription>Status of incoming service requests</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <StatusBar label="Pending" value={stats.bookings.pending} total={stats.bookings.totalReceived} color="bg-amber-500" icon={<Clock className="w-4 h-4" />} />
                        <StatusBar label="Accepted / Confirmed" value={stats.bookings.accepted + stats.bookings.confirmed} total={stats.bookings.totalReceived} color="bg-blue-500" icon={<ArrowUpRight className="w-4 h-4" />} />
                        <StatusBar label="Completed" value={stats.bookings.completed} total={stats.bookings.totalReceived} color="bg-emerald-500" icon={<CheckCircle2 className="w-4 h-4" />} />
                        <StatusBar label="Cancelled" value={stats.bookings.cancelled} total={stats.bookings.totalReceived} color="bg-slate-400" icon={<XCircle className="w-4 h-4" />} />
                    </CardContent>
                </Card>

                {/* 2. Service & Refund Breakdown */}
                <div className="space-y-6">
                    {/* Service Status */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Stethoscope className="w-4 h-4 text-emerald-500" /> Service Status
                            </CardTitle>
                            <CardDescription>Availability of your listed services</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <StatusBar label="Active" value={stats.services.active} total={stats.services.total} color="bg-emerald-500" icon={<CheckCircle2 className="w-4 h-4" />} />
                            <StatusBar label="In Progress" value={stats.services.inProgress} total={stats.services.total} color="bg-amber-500" icon={<Clock className="w-4 h-4" />} />
                            <StatusBar label="Inactive" value={stats.services.inactive} total={stats.services.total} color="bg-slate-400" icon={<XCircle className="w-4 h-4" />} />
                        </CardContent>
                    </Card>

                    {/* Refund Info */}
                    <Card className="shadow-sm border-red-100 bg-red-50/30">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                    <RotateCcw className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Total Refunded</p>
                                    <p className="text-xs text-slate-500">{stats.revenue.refundedTransactions} transactions refunded</p>
                                </div>
                            </div>
                            <p className="text-lg font-bold text-red-600">
                                {formatCurrency(stats.revenue.totalRefunded)}
                            </p>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}

// --- Helper Component for Progress Bars ---

function StatusBar({ label, value, total, color, icon }: { label: string, value: number, total: number, color: string, icon: React.ReactNode }) {
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