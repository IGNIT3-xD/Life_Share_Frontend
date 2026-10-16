"use client";

import { Activity, CreditCard, RotateCcw, SlidersHorizontal, Wallet } from "lucide-react";
import { SearchInput } from "@/components/SearchInput";
import { FilterSelect } from "@/components/FilterSelect";
import {
    BOOKING_STATUS, PAYMENT_STATUS, PAYMENT_VIA_OPTIONS, BOOKING_SORT_OPTIONS,
} from "@/constants/booking";
import { cn } from "@/lib/utils";

export type BookingTableFilters = {
    search: string;
    booking_status: string;
    payment_status: string;
    payment_via: string;
    sortBy: "asc" | "desc";
};

type Props = {
    filters: BookingTableFilters;
    onFilterChange: (updates: Partial<BookingTableFilters>) => void;
    onResetFilters: () => void;
    hasActiveFilters: boolean;
    totalCount?: number;
};

export function BookingsFilters({
    filters, onFilterChange, onResetFilters, hasActiveFilters, totalCount,
}: Props) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5 space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">My Bookings</h3>
                    <p className="mt-1 text-xs text-slate-500">
                        Track and manage your emergency service bookings.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {hasActiveFilters && (
                        <p className="text-xs text-slate-500">
                            <span className="font-semibold text-slate-900">{totalCount ?? 0}</span>{" "}
                            {(totalCount ?? 0) !== 1 ? "bookings" : "booking"} found
                        </p>
                    )}
                    <button
                        type="button"
                        onClick={onResetFilters}
                        disabled={!hasActiveFilters}
                        className={cn(
                            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
                            hasActiveFilters
                                ? "text-red-600 bg-red-50 hover:bg-red-100"
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
                    placeholder="Search by patient or location..."
                    className="lg:col-span-2"
                />
                <FilterSelect
                    value={filters.booking_status}
                    onChange={(v) => onFilterChange({ booking_status: v })}
                    options={BOOKING_STATUS}
                    placeholder="Booking Status"
                    icon={<Activity className="w-4 h-4" />}
                />
                <FilterSelect
                    value={filters.payment_status}
                    onChange={(v) => onFilterChange({ payment_status: v })}
                    options={PAYMENT_STATUS}
                    placeholder="Payment Status"
                    icon={<CreditCard className="w-4 h-4" />}
                />
                <FilterSelect
                    value={filters.payment_via}
                    onChange={(v) => onFilterChange({ payment_via: v })}
                    options={PAYMENT_VIA_OPTIONS}
                    placeholder="Payment Method"
                    icon={<Wallet className="w-4 h-4" />}
                />
                <FilterSelect
                    value={filters.sortBy}
                    onChange={(v) => onFilterChange({ sortBy: (v || "desc") as "asc" | "desc" })}
                    options={BOOKING_SORT_OPTIONS}
                    placeholder="Sort by date"
                    icon={<SlidersHorizontal className="w-4 h-4" />}
                    className="lg:col-span-3"
                />
            </div>
        </div>
    );
}