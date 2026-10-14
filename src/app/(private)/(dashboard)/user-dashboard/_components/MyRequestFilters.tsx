"use client";

import {
    Droplet, RotateCcw, ShieldCheck, SlidersHorizontal, Zap,
} from "lucide-react";
import { SearchInput } from "@/components/SearchInput";
import { FilterSelect } from "@/components/FilterSelect";
import { BLOOD_GROUPS } from "@/constants/donor";
import { URGENCY_OPTIONS, VERIFICATION_STATUS_OPTIONS } from "@/constants/requester";
import { cn } from "@/lib/utils";

export type TableFilters = {
    search: string;
    blood_group: string;
    urgency: string;
    verificationStatus: string;
    sortBy: "asc" | "desc";
};

const SORT_OPTIONS = [
    { value: "desc", label: "Newest First" },
    { value: "asc", label: "Oldest First" },
] as const;

type Props = {
    filters: TableFilters;
    onFilterChange: (updates: Partial<TableFilters>) => void;
    onResetFilters: () => void;
    hasActiveFilters: boolean;
    totalCount?: number;
};

export function MyRequestsFilters({
    filters,
    onFilterChange,
    onResetFilters,
    hasActiveFilters,
    totalCount,
}: Props) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5 space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                        My Blood Requests
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                        Search, filter, and manage your requests.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {hasActiveFilters && (
                        <p className="text-xs text-slate-500">
                            <span className="font-semibold text-slate-900">
                                {totalCount ?? 0}
                            </span>{" "}
                            {(totalCount ?? 0) !== 1 ? "requests" : "request"} found
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={onResetFilters}
                        disabled={!hasActiveFilters}
                        className={cn(
                            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
                            hasActiveFilters
                                ? "text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700"
                                : "text-slate-400 bg-slate-50 cursor-not-allowed"
                        )}
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset Filters
                    </button>
                </div>
            </div>

            {/* Filter grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <SearchInput
                    value={filters.search}
                    onChange={(v) => onFilterChange({ search: v })}
                    placeholder="Search by name, email, or location..."
                    className="lg:col-span-2"
                />

                <FilterSelect
                    value={filters.blood_group}
                    onChange={(v) => onFilterChange({ blood_group: v })}
                    options={BLOOD_GROUPS}
                    placeholder="Blood Group"
                    icon={<Droplet className="w-4 h-4" />}
                />

                <FilterSelect
                    value={filters.urgency}
                    onChange={(v) => onFilterChange({ urgency: v })}
                    options={URGENCY_OPTIONS}
                    placeholder="Urgency"
                    icon={<Zap className="w-4 h-4" />}
                />

                <FilterSelect
                    value={filters.verificationStatus}
                    onChange={(v) => onFilterChange({ verificationStatus: v })}
                    options={VERIFICATION_STATUS_OPTIONS}
                    placeholder="Verification"
                    icon={<ShieldCheck className="w-4 h-4" />}
                />
            </div>

            {/* Sort row */}
            <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    Sort:
                </span>
                <FilterSelect
                    value={filters.sortBy}
                    onChange={(v) =>
                        onFilterChange({ sortBy: (v || "desc") as "asc" | "desc" })
                    }
                    options={SORT_OPTIONS}
                    placeholder="Sort by date"
                    className="w-full sm:w-48"
                />
            </div>
        </div>
    );
}