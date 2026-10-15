"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMyDonationRequest } from "@/hooks/useDonation";
import { MyDonationsTable } from "./_components/MyDonationsTable";
import {
    MyDonationsFilters,
    type DonationTableFilters,
} from "./_components/MyDonationsFilters";
import { DonationDetailsModal } from "./_components/DonationDetailsModal";
import { PaginationControls } from "@/components/PaginationControls";
import type { DonationRequest } from "@/api/donation";

const INITIAL_FILTERS: DonationTableFilters = {
    search: "",
    blood_group: "",
    donationStatus: "",
    sortBy: "desc",
};

const LIMIT = 9;

export default function MyDonationRequestsPage() {
    const [filters, setFilters] = useState<DonationTableFilters>(INITIAL_FILTERS);
    const [page, setPage] = useState(1);
    const [selectedDonation, setSelectedDonation] =
        useState<DonationRequest | null>(null);

    const { data, isPending, isFetching, error, refetch } = useMyDonationRequest({
        search: filters.search || undefined,
        blood_group: filters.blood_group || undefined,
        donationStatus: filters.donationStatus || undefined,
        sortBy: filters.sortBy,
        rawPage: page,
        rawLimit: LIMIT,
    });

    const donations = data?.donationRequest ?? [];
    const meta = data?.meta;

    const handleFilterChange = (updates: Partial<DonationTableFilters>) => {
        setFilters((prev) => ({ ...prev, ...updates }));
        setPage(1);
    };

    const resetFilters = () => {
        setFilters(INITIAL_FILTERS);
        setPage(1);
    };

    const hasActiveFilters =
        !!filters.search ||
        !!filters.blood_group ||
        !!filters.donationStatus ||
        filters.sortBy !== "desc";

    return (
        <div className="space-y-6 pt-16">
            {/* Header */}
            <div>
                <h1 className="text-primary">
                    My Donation <span className="text-[#B15A36]">Requests</span>
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Track donation requests you've sent to donors.
                </p>
            </div>

            {/* Filters */}
            <MyDonationsFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={resetFilters}
                hasActiveFilters={hasActiveFilters}
                totalCount={meta?.total}
            />

            {/* Loading */}
            {isPending && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                    <p className="text-sm text-slate-500 mb-4">
                        Could not load your donation requests. Please try again.
                    </p>
                    <Button onClick={() => refetch()} className="btn-main bg-[#B15A36]">
                        Retry
                    </Button>
                </div>
            )}

            {/* Empty */}
            {!isPending && !error && donations.length === 0 && (
                <div className="text-center py-20 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-red-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                        No donation requests yet
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                        {hasActiveFilters
                            ? "Try adjusting your filters or reset them to see all requests."
                            : "Browse donors to send your first donation request."}
                    </p>
                    {hasActiveFilters && (
                        <Button onClick={resetFilters} variant="outline" className="mt-6">
                            Clear All Filters
                        </Button>
                    )}
                </div>
            )}

            {/* Table */}
            {!isPending && !error && donations.length > 0 && (
                <div
                    className={
                        isFetching ? "opacity-60 transition-opacity" : "opacity-100"
                    }
                >
                    <MyDonationsTable
                        donations={donations}
                        onViewDetails={setSelectedDonation}
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

            {/* Details Modal */}
            <DonationDetailsModal
                open={!!selectedDonation}
                onOpenChange={(open) => !open && setSelectedDonation(null)}
                donation={selectedDonation}
            />
        </div>
    );
}