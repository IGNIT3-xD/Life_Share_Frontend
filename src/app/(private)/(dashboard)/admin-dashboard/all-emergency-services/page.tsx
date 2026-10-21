"use client";

import { useState } from "react";
import { Ambulance, SlidersHorizontal, Activity, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/PaginationControls";
import { SearchInput } from "@/components/SearchInput";
import { FilterSelect } from "@/components/FilterSelect";
import type { Service } from "@/api/emergencyServices";
import { useFetchAllEmergencyServicesAdmin } from "@/hooks/useEmergencyServices";
import { SERVICE_CATEGORY_OPTIONS, SERVICE_STATUS_OPTIONS } from "@/constants/emergency_service";
import { AdminServicesTable } from "../_components/AdminServicesTable";
import { AdminServiceDetailsModal } from "../_components/AdminServiceDetailsModal";
import { DeleteServiceAdminDialog, UpdateServiceStatusDialog } from "../_components/ServiceActionDialogs";

// Combined Sort Options
const SORT_OPTIONS = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["value"];
const LIMIT = 10;

export default function AdminEmergencyServicesPage() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("");
    const [sort, setSort] = useState<SortKey>("newest");
    const [page, setPage] = useState(1);

    const [viewService, setViewService] = useState<Service | null>(null);
    const [statusService, setStatusService] = useState<Service | null>(null);
    const [deleteService, setDeleteService] = useState<Service | null>(null);

    // Map UI sort to backend params
    const getSortParams = (sortKey: SortKey) => {
        switch (sortKey) {
            case "oldest": return { sortBy: "asc" as const };
            case "price_asc": return { sortByPrice: "asc" as const };
            case "price_desc": return { sortByPrice: "desc" as const };
            default: return { sortBy: "desc" as const };
        }
    };

    const { data, isPending, error, refetch, isFetching } = useFetchAllEmergencyServicesAdmin({
        search: search || undefined,
        service_category: category || undefined,
        service_status: status || undefined,
        ...getSortParams(sort),
        rawPage: page,
        rawLimit: LIMIT,
    });

    const services = data?.services ?? [];
    const meta = data?.meta;

    const resetFilters = () => {
        setSearch(""); setCategory(""); setStatus(""); setSort("newest"); setPage(1);
    };

    const hasActiveFilters = !!search || !!category || !!status || sort !== "newest";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-primary">
                    Manage <span className="text-[#B15A36]">Services</span>
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Review, manage, and moderate all emergency services across hospitals.
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 md:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by service name..." />
                    </div>
                    {hasActiveFilters && (
                        <Button variant="ghost" onClick={resetFilters} className="text-red-500 hover:text-red-600 hover:bg-red-50 h-11 shrink-0">Reset Filters</Button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <FilterSelect value={category} onChange={(v) => { setCategory(v); setPage(1); }} options={SERVICE_CATEGORY_OPTIONS} placeholder="Category" icon={<Ambulance className="w-4 h-4" />} />
                    <FilterSelect value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={SERVICE_STATUS_OPTIONS} placeholder="Status" icon={<Activity className="w-4 h-4" />} />
                    <FilterSelect value={sort} onChange={(v) => { setSort((v || "newest") as SortKey); setPage(1); }} options={SORT_OPTIONS} placeholder="Sort By" icon={<SlidersHorizontal className="w-4 h-4" />} />
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
                    <p className="text-sm text-slate-500 mb-4">Could not load services.</p>
                    <Button onClick={() => refetch()} className="btn-main bg-[#B15A36]">Retry</Button>
                </div>
            )}

            {!isPending && !error && services.length === 0 && (
                <div className="text-center py-20 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                        <Droplet className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No services found</h3>
                    <p className="mt-1 text-sm text-slate-500">Try adjusting your filters.</p>
                </div>
            )}

            {!isPending && !error && services.length > 0 && (
                <div className={isFetching ? "opacity-60 transition-opacity" : "opacity-100"}>
                    <AdminServicesTable
                        services={services}
                        onView={setViewService}
                        onUpdateStatus={setStatusService}
                        onDelete={setDeleteService}
                    />
                </div>
            )}

            {meta && meta.totalPages > 1 && (
                <PaginationControls currentPage={page} totalPages={meta.totalPages} onPageChange={setPage} />
            )}

            {/* --- Modals --- */}
            <AdminServiceDetailsModal
                open={!!viewService}
                onOpenChange={(o) => !o && setViewService(null)}
                service={viewService}
            />

            <UpdateServiceStatusDialog
                open={!!statusService}
                onOpenChange={(o) => !o && setStatusService(null)}
                service={statusService}
            />

            <DeleteServiceAdminDialog
                open={!!deleteService}
                onOpenChange={(o) => !o && setDeleteService(null)}
                service={deleteService}
            />
        </div>
    );
}