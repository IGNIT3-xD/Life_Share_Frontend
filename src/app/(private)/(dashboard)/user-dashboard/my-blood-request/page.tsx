"use client";

import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMyBloodRequest } from "@/hooks/useRequester";
import { MyRequestsTable } from "../_components/MyRequestsTable";
import { PostRequestModal } from "../_components/PostRequestModal";
import { useState } from "react";
import { MyRequestsFilters, TableFilters } from "../_components/MyRequestFilters";

const INITIAL_FILTERS: TableFilters = {
    search: "",
    blood_group: "",
    urgency: "",
    verificationStatus: "",
    sortBy: "desc",
};

export default function MyBloodRequestsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState<TableFilters>(INITIAL_FILTERS);
    const [page, setPage] = useState(1);
    const limit = 10;

    // ✅ Send EVERY filter to the API, not just search/blood/urgency
    const { data, isPending, isFetching, error, refetch } = useMyBloodRequest({
        search: filter.search || undefined,
        blood_group: filter.blood_group || undefined,
        urgency: filter.urgency || undefined,
        verificationStatus: filter.verificationStatus || undefined,
        sortBy: filter.sortBy,
        rawPage: page,
        rawLimit: limit,
    });

    const requests = data?.requester ?? [];
    const meta = data?.meta;

    const handleFilterChange = (updates: Partial<TableFilters>) => {
        setFilter((prev: any) => ({ ...prev, ...updates }));
        setPage(1);
    };

    const resetFilters = () => {
        setFilter(INITIAL_FILTERS);
        setPage(1);
    };

    const hasActiveFilters =
        !!filter.search ||
        !!filter.blood_group ||
        !!filter.urgency ||
        !!filter.verificationStatus ||
        filter.sortBy !== "desc";

    return (
        <div className="space-y-6 pt-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-primary">
                        My Blood <span className="text-[#B15A36]">Requests</span>
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage all your blood requests, track status, and update details.
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="btn-main bg-[#B15A36]">
                    <Plus className="w-4 h-4 mr-1.5" />
                    New Request
                </Button>
            </div>

            <PostRequestModal open={isModalOpen} onOpenChange={setIsModalOpen} />

            {/* Filters — outside the table, always rendered */}
            <MyRequestsFilters
                filters={filter}
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
                        Could not load your requests. Please try again.
                    </p>
                    <Button onClick={() => refetch()} className="btn-main bg-[#B15A36]">
                        Retry
                    </Button>
                </div>
            )}

            {/* Empty */}
            {!isPending && !error && requests.length === 0 && (
                <div className="text-center py-20 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No blood requests found</h3>
                    <p className="mt-1 text-sm text-slate-500">
                        {hasActiveFilters
                            ? "Try adjusting your filters or reset them to see all requests."
                            : "Create your first blood request to get started."}
                    </p>
                    {hasActiveFilters && (
                        <Button onClick={resetFilters} variant="outline" className="mt-6">
                            Clear All Filters
                        </Button>
                    )}
                </div>
            )}

            {/* Table */}
            {!isPending && !error && requests.length > 0 && (
                <div className={isFetching ? "opacity-60 transition-opacity" : "opacity-100"}>
                    <MyRequestsTable
                        requests={requests}
                        onDeleteClick={(id) => console.log("Delete:", id)}
                    />
                </div>
            )}
        </div>
    );
}