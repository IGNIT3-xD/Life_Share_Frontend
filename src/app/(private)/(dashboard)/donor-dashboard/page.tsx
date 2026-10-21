"use client";

import { useDonorAnalytics } from "@/hooks/useAnalytics";
import { useMe } from "@/hooks/useAuth";
import {
    HeartHandshake, Droplet, CalendarCheck,
    Clock, CheckCircle2, XCircle, CalendarClock, ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function DonorDashboardPage() {
    const { data: me } = useMe();
    const { data: stats, isPending, error } = useDonorAnalytics();

    if (isPending) {
        return (
            <div className="space-y-8 max-w-7xl mx-auto">
                <div className="h-10 w-64 bg-slate-200 rounded-md animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-32 bg-slate-200 rounded-xl animate-pulse" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
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

    return (
        <div className="space-y-6 pt-16">
            {/* Header */}
            <div>
                <h1 className="text-primary">
                    Welcome Back, <span className="text-[#B15A36]">{me?.name?.split(" ")[0] || "Donor"}</span>
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Thank you for saving lives. Here is an overview of your impact and activity.
                </p>
            </div>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Lifetime Donations (Highlight) */}
                <Card className="bg-linear-to-br from-[#B15A36] to-red-400 text-white border-0 shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-white/90">Lifetime Donations</CardTitle>
                        <HeartHandshake className="w-4 h-4 text-white/80" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">
                            {stats.donations.totalDonations}
                        </div>
                        <p className="text-xs text-white/80 mt-1">
                            You are an active hero in our community
                        </p>
                    </CardContent>
                </Card>

                {/* Received Requests */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Requests Received</CardTitle>
                        <Droplet className="w-4 h-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-slate-900">
                            {stats.donations.totalReceived}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            {stats.donations.pending} pending your response
                        </p>
                    </CardContent>
                </Card>

                {/* Service Bookings */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Your Bookings</CardTitle>
                        <CalendarCheck className="w-4 h-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-slate-900">
                            {stats.bookings.total}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            {stats.bookings.confirmed + stats.bookings.accepted} active services
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. Donation Requests Breakdown */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <HeartHandshake className="w-4 h-4 text-red-500" /> Donation Requests
                        </CardTitle>
                        <CardDescription>Status of incoming donation requests</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <StatusBar label="Pending" value={stats.donations.pending} total={stats.donations.totalReceived} color="bg-amber-500" icon={<Clock className="w-4 h-4" />} />
                        <StatusBar label="Scheduled" value={stats.donations.scheduled} total={stats.donations.totalReceived} color="bg-blue-500" icon={<CalendarClock className="w-4 h-4" />} />
                        <StatusBar label="Accepted" value={stats.donations.accepted} total={stats.donations.totalReceived} color="bg-emerald-500" icon={<CheckCircle2 className="w-4 h-4" />} />
                        <StatusBar label="Cancelled / Rejected" value={stats.donations.donorCancelled + stats.donations.rejected} total={stats.donations.totalReceived} color="bg-slate-400" icon={<XCircle className="w-4 h-4" />} />
                    </CardContent>
                </Card>

                {/* 2. My Blood Requests Breakdown */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Droplet className="w-4 h-4 text-red-500" /> My Blood Requests
                        </CardTitle>
                        <CardDescription>Status of blood requests you made</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <StatusBar label="Pending" value={stats.bloodRequests.pending} total={stats.bloodRequests.total} color="bg-amber-500" icon={<Clock className="w-4 h-4" />} />
                        <StatusBar label="In Progress" value={stats.bloodRequests.inProgress} total={stats.bloodRequests.total} color="bg-blue-500" icon={<ArrowUpRight className="w-4 h-4" />} />
                        <StatusBar label="Completed" value={stats.bloodRequests.completed} total={stats.bloodRequests.total} color="bg-emerald-500" icon={<CheckCircle2 className="w-4 h-4" />} />
                        <StatusBar label="Cancelled" value={stats.bloodRequests.cancelled} total={stats.bloodRequests.total} color="bg-slate-400" icon={<XCircle className="w-4 h-4" />} />
                    </CardContent>
                </Card>

                {/* 3. Service Bookings Breakdown */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <CalendarCheck className="w-4 h-4 text-blue-500" /> Service Bookings
                        </CardTitle>
                        <CardDescription>Status of emergency services booked</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <StatusBar label="Pending" value={stats.bookings.pending} total={stats.bookings.total} color="bg-amber-500" icon={<Clock className="w-4 h-4" />} />
                        <StatusBar label="Accepted / Confirmed" value={stats.bookings.accepted + stats.bookings.confirmed} total={stats.bookings.total} color="bg-blue-500" icon={<CheckCircle2 className="w-4 h-4" />} />
                        <StatusBar label="Cancelled" value={stats.bookings.cancelled} total={stats.bookings.total} color="bg-slate-400" icon={<XCircle className="w-4 h-4" />} />
                    </CardContent>
                </Card>

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