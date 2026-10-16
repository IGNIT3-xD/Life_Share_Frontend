"use client";

import { useState } from "react";
import {
    LayoutDashboard,
    RotateCcw,
    Ambulance,
    SlidersHorizontal,
} from "lucide-react";
import { FilterSelect } from "@/components/FilterSelect";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { EmergencyServiceCard } from "@/components/EmergencyServiceCard";
import { PaginationControls } from "@/components/PaginationControls";
import { useAllEmergencyServices } from "@/hooks/useEmergencyServices";
import {
    SERVICE_CATEGORY_OPTIONS,
    SERVICE_SORT_OPTIONS,
} from "@/constants/emergency_service";
import { CardSkeleton } from "../donors/page";
import type { ServiceFilter } from "@/api/emergencyServices";

// ---- Helpers ----

// Single UI sort key → backend query params
const mapSort = (sort: any): Pick<ServiceFilter, "sortBy" | "sortByPrice"> => {
    switch (sort) {
        case "newest":
            return { sortBy: "desc" };
        case "oldest":
            return { sortBy: "asc" };
        case "price_asc":
            return { sortByPrice: "asc" };
        case "price_desc":
            return { sortByPrice: "desc" };
        default:
            return { sortBy: "desc" };
    }
};

const DEFAULT_SORT = "newest";

export default function EmergencyServicesPage() {
    const [search, setSearch] = useState("");
    const [serviceCategory, setServiceCategory] = useState("");
    const [sort, setSort] = useState(DEFAULT_SORT);
    const [page, setPage] = useState(1);
    const limit = 9;

    const sortParams = mapSort(sort);

    const { data, isPending, isFetching, error, refetch } = useAllEmergencyServices({
        search: search || undefined,
        service_category: serviceCategory || undefined,
        ...sortParams,
        rawPage: page,
        rawLimit: limit,
    });

    const services = data?.services ?? [];
    const meta = data?.meta;

    // Unified filter change handler — resets to page 1
    const handleFilterChange = (
        updates: Partial<{
            search: string;
            serviceCategory: string;
            sort: any;
        }>
    ) => {
        if (updates.search !== undefined) setSearch(updates.search);
        if (updates.serviceCategory !== undefined)
            setServiceCategory(updates.serviceCategory);
        if (updates.sort !== undefined) setSort(updates.sort);
        setPage(1);
    };

    const hasActiveFilters =
        !!search || !!serviceCategory || sort !== DEFAULT_SORT;

    const resetFilters = () => {
        setSearch("");
        setServiceCategory("");
        setSort(DEFAULT_SORT);
        setPage(1);
    };

    return (
        <section className="container-main pt-24 pb-10 font-graphik">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-primary">
                    Find Emergency{" "}
                    <span className="text-[#B15A36]">Services</span>.
                </h1>
                <p className="mt-3 text-sm md:text-base text-gray-500 max-w-xl mx-auto">
                    Search verified services in your area. Filter by category and price
                    to find the right match.
                </p>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 shadow-sm mb-10">
                {/* Search Row */}
                <div className="mb-4">
                    <SearchInput
                        value={search}
                        onChange={(v) => handleFilterChange({ search: v })}
                        placeholder="Search by service name, category etc..."
                    />
                </div>

                {/* Filter Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <FilterSelect
                        value={serviceCategory}
                        onChange={(v) => handleFilterChange({ serviceCategory: v })}
                        options={SERVICE_CATEGORY_OPTIONS}
                        placeholder="Service Category"
                        icon={<LayoutDashboard className="w-4 h-4" />}
                    />

                    <FilterSelect
                        value={sort}
                        onChange={(v) =>
                            handleFilterChange({ sort: (v || DEFAULT_SORT) })
                        }
                        options={SERVICE_SORT_OPTIONS}
                        placeholder="Sort By"
                        icon={<SlidersHorizontal className="w-4 h-4" />}
                    />
                </div>

                {/* Active Filters Bar */}
                {hasActiveFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                            <span className="font-semibold text-gray-900">
                                {meta?.total ?? 0}
                            </span>{" "}
                            {(meta?.total ?? 0) !== 1 ? "services" : "service"} found
                        </p>
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Loading */}
            {isPending && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="text-center py-16">
                    <p className="text-sm text-gray-500 mb-4">
                        Could not load services. Please try again.
                    </p>
                    <Button onClick={() => refetch()} className="bg-[#B15A36] btn-main">
                        Retry
                    </Button>
                </div>
            )}

            {/* Empty */}
            {!isPending && !error && services.length === 0 && (
                <div className="text-center py-20 border border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                        <Ambulance className="w-6 h-6 text-red-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                        No services found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Try adjusting your filters or search term.
                    </p>
                    {hasActiveFilters && (
                        <Button
                            onClick={resetFilters}
                            className="btn-main bg-[#B15A36] mt-3"
                        >
                            Clear All Filters
                        </Button>
                    )}
                </div>
            )}

            {/* Services Grid */}
            {!isPending && !error && services.length > 0 && (
                <div
                    className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-200 ${isFetching ? "opacity-60" : "opacity-100"
                        }`}
                >
                    {services.map((s) => (
                        <EmergencyServiceCard key={s.id} data={s} />
                    ))}
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
        </section>
    );
}