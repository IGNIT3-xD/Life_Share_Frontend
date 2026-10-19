"use client";

import { useState } from "react";
import { Droplet, HeartPulse, SlidersHorizontal, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFetchReceivedDonations } from "@/hooks/useDonation";
import { ReceivedDonationsTable } from "./_components/ReceivedDonationsTable";
import { DonationDetailsModal } from "./_components/DonationDetailsModal";
import { DonationStatusDialog } from "./_components/DonationStatusDialog";
import { PaginationControls } from "@/components/PaginationControls";
import { SearchInput } from "@/components/SearchInput";
import { FilterSelect } from "@/components/FilterSelect";
import { BLOOD_GROUPS } from "@/constants/donor";
import { URGENCY_OPTIONS } from "@/constants/requester";
import type { DonationRequestProp } from "@/api/donation";

const DONATION_STATUS_OPTIONS = [
    { value: "PENDING", label: "Pending" },
    { value: "ACCEPTED", label: "Accepted" },
    { value: "SCHEDULED", label: "Scheduled" },
    { value: "COMPLETED", label: "Completed" },
    { value: "DONOR_CANCELLED", label: "Cancelled" },
];

const SORT_OPTIONS = [
    { value: "desc", label: "Newest First" },
    { value: "asc", label: "Oldest First" },
];

const LIMIT = 10;

export default function ReceivedDonationsPage() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [urgency, setUrgency] = useState("");
    const [bloodGroup, setBloodGroup] = useState("");
    const [sortBy, setSortBy] = useState<"asc" | "desc">("desc");
    const [page, setPage] = useState(1);

    const [viewRequest, setViewRequest] = useState<DonationRequestProp | null>(null);
    const [actionRequest, setActionRequest] = useState<DonationRequestProp | null>(null);
    const [actionType, setActionType] = useState<"ACCEPTED" | "SCHEDULED" | "COMPLETED" | "DONOR_CANCELLED" | null>(null);

    const { data, isPending, error, refetch, isFetching } = useFetchReceivedDonations({
        search: search || undefined,
        donationStatus: status || undefined,
        urgency: urgency || undefined,
        blood_group: bloodGroup || undefined,
        sortBy,
        rawPage: page,
        rawLimit: LIMIT,
    });

    const donations = data?.donation ?? [];
    const meta = data?.meta;

    const resetFilters = () => {
        setSearch("");
        setStatus("");
        setUrgency("");
        setBloodGroup("");
        setSortBy("desc");
        setPage(1);
    };

    const hasActiveFilters = !!search || !!status || !!urgency || !!bloodGroup || sortBy !== "desc";

    return (
        <div className="space-y-6 pt-16">
            {/* Header */}
            <div>
                <h1 className="text-primary">
                    Received <span className="text-[#B15A36]">Requests</span>
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Manage donation requests sent to you by patients.
                </p>
            </div>

            {/* Filters Bar */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 md:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by patient name..." />
                    </div>
                    {hasActiveFilters && (
                        <Button variant="ghost" onClick={resetFilters} className="text-red-500 hover:text-red-600 hover:bg-red-50 h-11 shrink-0">
                            Reset Filters
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <FilterSelect value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={DONATION_STATUS_OPTIONS} placeholder="Status" />
                    <FilterSelect value={urgency} onChange={(v) => { setUrgency(v); setPage(1); }} options={URGENCY_OPTIONS} placeholder="Urgency" icon={<Activity className="w-4 h-4" />} />
                    <FilterSelect value={bloodGroup} onChange={(v) => { setBloodGroup(v); setPage(1); }} options={BLOOD_GROUPS} placeholder="Blood Group" icon={<Droplet className="w-4 h-4" />} />
                    <FilterSelect value={sortBy} onChange={(v) => { setSortBy((v || "desc") as "asc" | "desc"); setPage(1); }} options={SORT_OPTIONS} placeholder="Sort By" icon={<SlidersHorizontal className="w-4 h-4" />} />
                </div>
            </div>

            {/* Loading / Error / Empty / Table */}
            {isPending && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}
                </div>
            )}

            {error && (
                <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                    <p className="text-sm text-slate-500 mb-4">Could not load donation requests.</p>
                    <Button onClick={() => refetch()} className="btn-main bg-[#B15A36]">Retry</Button>
                </div>
            )}

            {!isPending && !error && donations.length === 0 && (
                <div className="text-center py-20 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                        <HeartPulse className="w-6 h-6 text-red-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No requests found</h3>
                    <p className="mt-1 text-sm text-slate-500">
                        {hasActiveFilters ? "Try adjusting your filters." : "You haven't received any donation requests yet."}
                    </p>
                </div>
            )}

            {!isPending && !error && donations.length > 0 && (
                <div className={isFetching ? "opacity-60 transition-opacity" : "opacity-100"}>
                    <ReceivedDonationsTable
                        donations={donations}
                        onView={setViewRequest}
                        onAction={(req, action) => { setActionRequest(req); setActionType(action); }}
                    />
                </div>
            )}

            {meta && meta.totalPages > 1 && (
                <PaginationControls currentPage={page} totalPages={meta.totalPages} onPageChange={setPage} />
            )}

            {/* Modals */}
            <DonationDetailsModal
                open={!!viewRequest}
                onOpenChange={(o) => !o && setViewRequest(null)}
                requestId={viewRequest?.id ?? null}
            />

            <DonationStatusDialog
                open={!!actionType}
                onOpenChange={(o) => !o && setActionType(null)}
                requestId={actionRequest?.id ?? null}
                patientName={actionRequest?.requester.patientName}
                action={actionType}
            />
        </div>
    );
}