"use client";

import { useState } from "react";
import { Droplet, SlidersHorizontal, Activity, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAllBloodRequesterAdmin } from "@/hooks/useRequester";
import { PaginationControls } from "@/components/PaginationControls";
import { SearchInput } from "@/components/SearchInput";
import { FilterSelect } from "@/components/FilterSelect";
import { BLOOD_GROUPS } from "@/constants/donor";
import { URGENCY_OPTIONS } from "@/constants/requester";
import type { RequesterProp } from "@/components/RequesterCard";
import { AdminRequestersTable } from "../_components/AdminRequestersTable";
import { AdminRequesterDetailsModal } from "../_components/AdminRequesterDetailsModal";
import { DeleteRequesterDialog, UpdateRequesterStatusDialog } from "../_components/RequesterActionDialogs";

const STATUS_OPTIONS = [
    { value: "VERIFIED", label: "Verified" },
    { value: "PENDING", label: "Pending" },
    { value: "REJECTED", label: "Rejected" },
];

const SORT_OPTIONS = [
    { value: "desc", label: "Newest First" },
    { value: "asc", label: "Oldest First" },
];

const LIMIT = 10;

export default function AdminBloodRequestsPage() {
    const [search, setSearch] = useState("");
    const [bloodGroup, setBloodGroup] = useState("");
    const [urgency, setUrgency] = useState("");
    const [status, setStatus] = useState("");
    const [sortBy, setSortBy] = useState<"asc" | "desc">("desc");
    const [page, setPage] = useState(1);

    const [viewRequest, setViewRequest] = useState<RequesterProp | null>(null);
    const [statusRequest, setStatusRequest] = useState<RequesterProp | null>(null);
    const [deleteRequest, setDeleteRequest] = useState<RequesterProp | null>(null);

    const { data, isPending, error, refetch, isFetching } = useAllBloodRequesterAdmin({
        search: search || undefined,
        blood_group: bloodGroup || undefined,
        urgency: urgency || undefined,
        verificationStatus: status || undefined,
        sortBy,
        rawPage: page,
        rawLimit: LIMIT,
    });

    const requests = data?.requester ?? [];
    const meta = data?.meta;

    const resetFilters = () => {
        setSearch(""); setBloodGroup(""); setUrgency(""); setStatus(""); setSortBy("desc"); setPage(1);
    };

    const hasActiveFilters = !!search || !!bloodGroup || !!urgency || !!status || sortBy !== "desc";

    return (
        <div className="space-y-6 pt-16">
            {/* Header */}
            <div>
                <h1 className="text-primary">
                    Manage <span className="text-[#B15A36]">Requests</span>
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Review, verify, and manage all blood requests.
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 md:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by patient name or location..." />
                    </div>
                    {hasActiveFilters && (
                        <Button variant="ghost" onClick={resetFilters} className="text-red-500 hover:text-red-600 hover:bg-red-50 h-11 shrink-0">Reset Filters</Button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <FilterSelect value={bloodGroup} onChange={(v) => { setBloodGroup(v); setPage(1); }} options={BLOOD_GROUPS} placeholder="Blood Group" icon={<Droplet className="w-4 h-4" />} />
                    <FilterSelect value={urgency} onChange={(v) => { setUrgency(v); setPage(1); }} options={URGENCY_OPTIONS} placeholder="Urgency" icon={<Activity className="w-4 h-4" />} />
                    <FilterSelect value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={STATUS_OPTIONS} placeholder="Verification" icon={<ShieldCheck className="w-4 h-4" />} />
                    <FilterSelect value={sortBy} onChange={(v) => { setSortBy((v || "desc") as "asc" | "desc"); setPage(1); }} options={SORT_OPTIONS} placeholder="Sort By" icon={<SlidersHorizontal className="w-4 h-4" />} />
                </div>
            </div>

            {/* States */}
            {isPending && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}
                </div>
            )}

            {error && (
                <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                    <p className="text-sm text-slate-500 mb-4">Could not load requests.</p>
                    <Button onClick={() => refetch()} className="btn-main bg-[#B15A36]">Retry</Button>
                </div>
            )}

            {!isPending && !error && requests.length === 0 && (
                <div className="text-center py-20 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                        <Droplet className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No requests found</h3>
                    <p className="mt-1 text-sm text-slate-500">Try adjusting your filters.</p>
                </div>
            )}

            {!isPending && !error && requests.length > 0 && (
                <div className={isFetching ? "opacity-60 transition-opacity" : "opacity-100"}>
                    <AdminRequestersTable
                        requests={requests}
                        onView={setViewRequest}
                        onUpdateStatus={setStatusRequest}
                        onDelete={setDeleteRequest}
                    />
                </div>
            )}

            {meta && meta.totalPages > 1 && (
                <PaginationControls currentPage={page} totalPages={meta.totalPages} onPageChange={setPage} />
            )}

            {/* --- Modals --- */}
            <AdminRequesterDetailsModal
                open={!!viewRequest}
                onOpenChange={(o) => !o && setViewRequest(null)}
                requestId={viewRequest?.id ?? null}
            />

            <UpdateRequesterStatusDialog
                open={!!statusRequest}
                onOpenChange={(o) => !o && setStatusRequest(null)}
                requestId={statusRequest?.id ?? null}
                currentStatus={statusRequest?.verificationStatus}
                patientName={statusRequest?.patientName}
            />

            <DeleteRequesterDialog
                open={!!deleteRequest}
                onOpenChange={(o) => !o && setDeleteRequest(null)}
                requestId={deleteRequest?.id ?? null}
                patientName={deleteRequest?.patientName}
            />
        </div>
    );
}