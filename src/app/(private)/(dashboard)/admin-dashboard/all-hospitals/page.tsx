"use client";

import { useState } from "react";
import { Building2, SlidersHorizontal, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFetchAllHospitalProfile } from "@/hooks/useHospital";
import { PaginationControls } from "@/components/PaginationControls";
import { SearchInput } from "@/components/SearchInput";
import { FilterSelect } from "@/components/FilterSelect";
import type { HospitalProfileResponse } from "@/api/hospital";
import { AdminHospitalDetailsModal } from "../../_components/AdminHospitalDetailsModal";
import { DeleteHospitalAdminDialog, UpdateHospitalStatusDialog } from "../../_components/HospitalActionDialogs";
import { AdminHospitalsTable } from "../../_components/AdminHospitalsTable";

const STATUS_OPTIONS = [
    { value: "VERIFIED", label: "Verified" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "NOT_ELIGIBLE", label: "Not Eligible" },
];

const SORT_OPTIONS = [
    { value: "desc", label: "Newest First" },
    { value: "asc", label: "Oldest First" },
];

const LIMIT = 10;

export default function AdminHospitalsPage() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [sortBy, setSortBy] = useState<"asc" | "desc">("desc");
    const [page, setPage] = useState(1);

    const [viewHospital, setViewHospital] = useState<HospitalProfileResponse | null>(null);
    const [statusHospital, setStatusHospital] = useState<HospitalProfileResponse | null>(null);
    const [deleteHospital, setDeleteHospital] = useState<HospitalProfileResponse | null>(null);

    const { data, isPending, error, refetch, isFetching } = useFetchAllHospitalProfile({
        search: search || undefined,
        hospital_status: status || undefined,
        sortBy,
        rawPage: page,
        rawLimit: LIMIT,
    });

    const hospitals = data?.hospital ?? [];
    const meta = data?.meta;

    const resetFilters = () => {
        setSearch(""); setStatus(""); setSortBy("desc"); setPage(1);
    };

    const hasActiveFilters = !!search || !!status || sortBy !== "desc";

    return (
        <div className="space-y-6 pt-16">
            {/* Header */}
            <div>
                <h1 className="text-primary">
                    Manage <span className="text-[#B15A36]">Hospitals</span>
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Review, verify, and manage all registered hospital profiles.
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 md:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by hospital name or email..." />
                    </div>
                    {hasActiveFilters && (
                        <Button variant="ghost" onClick={resetFilters} className="text-red-500 hover:text-red-600 hover:bg-red-50 h-11 shrink-0">Reset Filters</Button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FilterSelect value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={STATUS_OPTIONS} placeholder="Verification Status" icon={<ShieldCheck className="w-4 h-4" />} />
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
                    <p className="text-sm text-slate-500 mb-4">Could not load hospitals.</p>
                    <Button onClick={() => refetch()} className="btn-main bg-[#B15A36]">Retry</Button>
                </div>
            )}

            {!isPending && !error && hospitals.length === 0 && (
                <div className="text-center py-20 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No hospitals found</h3>
                    <p className="mt-1 text-sm text-slate-500">Try adjusting your filters.</p>
                </div>
            )}

            {!isPending && !error && hospitals.length > 0 && (
                <div className={isFetching ? "opacity-60 transition-opacity" : "opacity-100"}>
                    <AdminHospitalsTable
                        hospitals={hospitals}
                        onView={setViewHospital}
                        onUpdateStatus={setStatusHospital}
                        onDelete={setDeleteHospital}
                    />
                </div>
            )}

            {meta && meta.totalPages > 1 && (
                <PaginationControls currentPage={page} totalPages={meta.totalPages} onPageChange={setPage} />
            )}

            {/* --- Modals --- */}
            <AdminHospitalDetailsModal
                open={!!viewHospital}
                onOpenChange={(o) => !o && setViewHospital(null)}
                hospital={viewHospital}
            />

            <UpdateHospitalStatusDialog
                open={!!statusHospital}
                onOpenChange={(o) => !o && setStatusHospital(null)}
                hospital={statusHospital}
            />

            <DeleteHospitalAdminDialog
                open={!!deleteHospital}
                onOpenChange={(o) => !o && setDeleteHospital(null)}
                hospital={deleteHospital}
            />
        </div>
    );
}