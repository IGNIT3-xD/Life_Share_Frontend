"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Droplet, Building2 } from "lucide-react";
import type { AdminDashboardStats } from "@/api/analytics";

export function AdminQuickStats({ stats }: { stats: AdminDashboardStats }) {
    return (
        <div className="space-y-4">
            {/* Donors */}
            <Card className="shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Droplet className="w-4 h-4 text-red-500" /> Donors
                        <span className="ml-auto text-lg">{stats.donors.total}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                    <div className="bg-emerald-50 rounded p-1.5 text-xl">
                        <p className="text-emerald-700 font-bold">{stats.donors.verified}</p>
                        <p className="text-emerald-600 text-[10px]">Verified</p>
                    </div>
                    <div className="bg-amber-50 rounded p-1.5 text-xl">
                        <p className="text-amber-700 font-bold">{stats.donors.inProgress}</p>
                        <p className="text-amber-600 text-[10px]">Pending</p>
                    </div>
                    <div className="bg-red-50 rounded p-1.5 text-xl">
                        <p className="text-red-700 font-bold">{stats.donors.notEligible}</p>
                        <p className="text-red-600 text-[10px]">Rejected</p>
                    </div>
                </CardContent>
            </Card>

            {/* Requesters */}
            <Card className="shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" /> Requesters
                        <span className="ml-auto text-lg">{stats.requesters.total}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-2 pt-2 text-center text-xl">
                    <div className="bg-emerald-50 rounded p-1.5">
                        <p className="text-emerald-700 font-bold">{stats.requesters.verified}</p>
                        <p className="text-emerald-600 text-[10px]">Verified</p>
                    </div>
                    <div className="bg-amber-50 rounded p-1.5">
                        <p className="text-amber-700 font-bold">{stats.requesters.pending}</p>
                        <p className="text-amber-600 text-[10px]">Pending</p>
                    </div>
                    <div className="bg-red-50 rounded p-1.5">
                        <p className="text-red-700 font-bold">{stats.requesters.rejected}</p>
                        <p className="text-red-600 text-[10px]">Rejected</p>
                    </div>
                </CardContent>
            </Card>

            {/* Hospitals */}
            <Card className="shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-indigo-500" /> Hospitals
                        <span className="ml-auto text-lg">{stats.hospitals.total}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2 pt-2 text-center text-xl">
                    <div className="bg-emerald-50 rounded p-1.5">
                        <p className="text-emerald-700 font-bold">{stats.hospitals.verified}</p>
                        <p className="text-emerald-600 text-[10px]">Verified</p>
                    </div>
                    <div className="bg-amber-50 rounded p-1.5">
                        <p className="text-amber-700 font-bold">{stats.hospitals.inProgress}</p>
                        <p className="text-amber-600 text-[10px]">In Progress</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}