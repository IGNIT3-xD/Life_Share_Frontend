"use client";

import { useState } from "react";
import { Plus, Ambulance, SlidersHorizontal, Activity, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFetchMyEmergencyServices } from "@/hooks/useEmergencyServices";
import { HospitalServicesTable } from "./_components/HospitalServicesTable";
import { ServiceFormModal } from "./_components/ServiceFormModal";
import { DeleteServiceDialog } from "./_components/DeleteServiceDialog";
import { SearchInput } from "@/components/SearchInput";
import { FilterSelect } from "@/components/FilterSelect";
import { PaginationControls } from "@/components/PaginationControls";
import { Service } from "@/api/emergencyServices";
import { SERVICE_CATEGORY_OPTIONS, SERVICE_STATUS_OPTIONS } from "@/constants/emergency_service";

const LIMIT = 10;

const SORT_OPTIONS = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export default function MyServicesPage() {
    // Filter States
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("");
    const [sort, setSort] = useState<SortKey>("newest");
    const [page, setPage] = useState(1);

    // Modal States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [deletingService, setDeletingService] = useState<Service | null>(null);

    const getSortParams = (sortKey: SortKey) => {
        switch (sortKey) {
            case "oldest": return { sortBy: "asc" as const };
            case "price_asc": return { sortByPrice: "asc" as const };
            case "price_desc": return { sortByPrice: "desc" as const };
            default: return { sortBy: "desc" as const }; // newest
        }
    };

    const { data, isPending, error, refetch, isFetching } = useFetchMyEmergencyServices({
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
        setSearch("");
        setCategory("");
        setStatus("");
        setSort("newest");
        setPage(1);
    };

    const hasActiveFilters = !!search || !!category || !!status || sort !== "newest";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-primary">
                        My <span className="text-[#B15A36]">Services</span>
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage the emergency services offered by your hospital.
                    </p>
                </div>
                <Button onClick={() => { setEditingService(null); setIsFormOpen(true); }} className="btn-main bg-[#B15A36]">
                    <Plus className="w-4 h-4 mr-1.5" /> Add New Service
                </Button>
            </div>

            {/* Filters Bar - Now with all 4 filters */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 md:p-5 space-y-4">

                {/* Row 1: Search & Reset */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <SearchInput
                            value={search}
                            onChange={(v) => { setSearch(v); setPage(1); }}
                            placeholder="Search by service name..."
                        />
                    </div>
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            onClick={resetFilters}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 h-11 px-4 shrink-0"
                        >
                            Reset Filters
                        </Button>
                    )}
                </div>

                {/* Row 2: Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <FilterSelect
                        value={category}
                        onChange={(v) => { setCategory(v); setPage(1); }}
                        options={SERVICE_CATEGORY_OPTIONS}
                        placeholder="All Categories"
                        icon={<Ambulance className="w-4 h-4" />}
                    />
                    <FilterSelect
                        value={status}
                        onChange={(v) => { setStatus(v); setPage(1); }}
                        options={SERVICE_STATUS_OPTIONS}
                        placeholder="All Statuses"
                        icon={<Activity className="w-4 h-4" />}
                    />
                    <FilterSelect
                        value={sort}
                        onChange={(v) => { setSort(v as SortKey); setPage(1); }}
                        options={SORT_OPTIONS}
                        placeholder="Sort By"
                        icon={<SlidersHorizontal className="w-4 h-4" />}
                    />
                </div>
            </div>

            {/* Loading / Error / Empty / Table */}
            {isPending && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}
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
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                        <Ambulance className="w-6 h-6 text-red-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No services found</h3>
                    <p className="mt-1 text-sm text-slate-500">
                        {hasActiveFilters
                            ? "Try adjusting your filters or search term."
                            : "You haven't added any emergency services yet."}
                    </p>
                    {hasActiveFilters ? (
                        <Button onClick={resetFilters} variant="outline" className="mt-6">Clear Filters</Button>
                    ) : (
                        <Button onClick={() => { setEditingService(null); setIsFormOpen(true); }} className="btn-main bg-[#B15A36] mt-6">
                            Create Your First Service
                        </Button>
                    )}
                </div>
            )}

            {!isPending && !error && services.length > 0 && (
                <div className={isFetching ? "opacity-60 transition-opacity" : "opacity-100"}>
                    <HospitalServicesTable
                        services={services}
                        onEdit={(s) => { setEditingService(s); setIsFormOpen(true); }}
                        onDelete={(s) => setDeletingService(s)}
                    />
                </div>
            )}

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
                <PaginationControls
                    currentPage={page}
                    totalPages={meta.totalPages}
                    onPageChange={setPage}
                />
            )}

            {/* Modals */}
            <ServiceFormModal
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                service={editingService}
            />
            <DeleteServiceDialog
                open={!!deletingService}
                onOpenChange={(o) => !o && setDeletingService(null)}
                service={deletingService}
            />
        </div>
    );
}