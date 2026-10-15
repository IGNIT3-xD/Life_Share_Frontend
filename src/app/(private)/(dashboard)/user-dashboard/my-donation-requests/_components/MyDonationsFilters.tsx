"use client";

import {
    Droplet, RotateCcw, SlidersHorizontal, Activity,
} from "lucide-react";
import { SearchInput } from "@/components/SearchInput";
import { FilterSelect } from "@/components/FilterSelect";
import { BLOOD_GROUPS } from "@/constants/donor";
import { DONATION_STATUS_OPTIONS, SORT_OPTIONS } from "@/constants/donation";
import { cn } from "@/lib/utils";

export type DonationTableFilters = {
    search: string;
    blood_group: string;
    donationStatus: string;
    sortBy: "asc" | "desc";
};

type Props = {
    filters: DonationTableFilters;
    onFilterChange: (updates: Partial<DonationTableFilters>) => void;
    onResetFilters: () => void;
    hasActiveFilters: boolean;
    totalCount?: number;
};

export function MyDonationsFilters({
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
                        My Donation Requests
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                        Track requests sent to donors.
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

            {/* Filters grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <SearchInput
                    value={filters.search}
                    onChange={(v) => onFilterChange({ search: v })}
                    placeholder="Search by patient name or location..."
                    className="lg:col-span-2"
                />

                <FilterSelect
                    value={filters.donationStatus}
                    onChange={(v) => onFilterChange({ donationStatus: v })}
                    options={DONATION_STATUS_OPTIONS}
                    placeholder="Status"
                    icon={<Activity className="w-4 h-4" />}
                />

                <FilterSelect
                    value={filters.blood_group}
                    onChange={(v) => onFilterChange({ blood_group: v })}
                    options={BLOOD_GROUPS}
                    placeholder="Blood Group"
                    icon={<Droplet className="w-4 h-4" />}
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