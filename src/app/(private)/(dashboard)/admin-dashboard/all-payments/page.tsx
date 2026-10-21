"use client";

import { useState } from "react";
import { CreditCard, SlidersHorizontal, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFetchAllPayments } from "@/hooks/usePayment";
import { PaginationControls } from "@/components/PaginationControls";
import { SearchInput } from "@/components/SearchInput";
import { FilterSelect } from "@/components/FilterSelect";
import type { Payment } from "@/api/payment";
import { AdminPaymentsTable } from "../_components/AdminPaymentsTable";
import { PaymentDetailsModal } from "../_components/PaymentDetailsModal";

const STATUS_OPTIONS = [
    { value: "PAID", label: "Paid" },
    { value: "PENDING", label: "Pending" },
    { value: "FAILED", label: "Failed" },
    { value: "REFUNDED", label: "Refunded" },
];

const GATEWAY_OPTIONS = [
    { value: "BKASH", label: "bKash" },
    { value: "NAGAD", label: "Nagad" },
    { value: "STRIPE", label: "Stripe" },
];

const SORT_OPTIONS = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "amount_high", label: "Amount: High to Low" },
    { value: "amount_low", label: "Amount: Low to High" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["value"];
const LIMIT = 10;

export default function AdminPaymentsPage() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [gateway, setGateway] = useState("");
    const [sort, setSort] = useState<SortKey>("newest");
    const [page, setPage] = useState(1);

    const [viewPayment, setViewPayment] = useState<Payment | null>(null);

    // Combine sort logic
    const getSortParams = (sortKey: SortKey) => {
        switch (sortKey) {
            case "oldest": return { sortBy: "asc" as const };
            case "amount_high": return { sortByAmount: "desc" as const };
            case "amount_low": return { sortByAmount: "asc" as const };
            default: return { sortBy: "desc" as const };
        }
    };

    const { data, isPending, error, refetch, isFetching } = useFetchAllPayments({
        search: search || undefined,
        payment_status: status || undefined,
        payment_gateway: gateway || undefined,
        ...getSortParams(sort),
        rawPage: page,
        rawLimit: LIMIT,
    });

    const payments = data?.payment ?? [];
    const meta = data?.meta;

    const resetFilters = () => {
        setSearch(""); setStatus(""); setGateway(""); setSort("newest"); setPage(1);
    };

    const hasActiveFilters = !!search || !!status || !!gateway || sort !== "newest";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-primary">
                    Manage <span className="text-[#B15A36]">Payments</span>
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Review transaction history, statuses, and revenue.
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 md:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by TrxID, Invoice, or Email..." />
                    </div>
                    {hasActiveFilters && (
                        <Button variant="ghost" onClick={resetFilters} className="text-red-500 hover:text-red-600 hover:bg-red-50 h-11 shrink-0">Reset Filters</Button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <FilterSelect value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={STATUS_OPTIONS} placeholder="Status" icon={<CreditCard className="w-4 h-4" />} />
                    <FilterSelect value={gateway} onChange={(v) => { setGateway(v); setPage(1); }} options={GATEWAY_OPTIONS} placeholder="Gateway" icon={<Wallet className="w-4 h-4" />} />
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
                    <p className="text-sm text-slate-500 mb-4">Could not load payments.</p>
                    <Button onClick={() => refetch()} className="btn-main bg-[#B15A36]">Retry</Button>
                </div>
            )}

            {!isPending && !error && payments.length === 0 && (
                <div className="text-center py-20 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No payments found</h3>
                    <p className="mt-1 text-sm text-slate-500">Try adjusting your filters.</p>
                </div>
            )}

            {!isPending && !error && payments.length > 0 && (
                <div className={isFetching ? "opacity-60 transition-opacity" : "opacity-100"}>
                    <AdminPaymentsTable
                        payments={payments}
                        onView={setViewPayment}
                    />
                </div>
            )}

            {meta && meta.totalPages > 1 && (
                <PaginationControls currentPage={page} totalPages={meta.totalPages} onPageChange={setPage} />
            )}

            {/* --- Modal --- */}
            <PaymentDetailsModal
                open={!!viewPayment}
                onOpenChange={(o) => !o && setViewPayment(null)}
                paymentId={viewPayment?.id ?? null}
            />
        </div>
    );
}