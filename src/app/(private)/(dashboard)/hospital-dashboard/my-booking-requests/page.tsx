"use client";

import { useState } from "react";
import { CalendarCheck, SlidersHorizontal, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFetchMyBookingRequest } from "@/hooks/useBooking";
import { ReceivedBookingsTable } from "./_components/ReceivedBookingsTable";
import { BookingStatusDialog } from "./_components/BookingStatusDialog";
import { PaginationControls } from "@/components/PaginationControls";
import { SearchInput } from "@/components/SearchInput";
import { FilterSelect } from "@/components/FilterSelect";
import { BOOKING_STATUS, PAYMENT_STATUS, PAYMENT_VIA_OPTIONS } from "@/constants/booking";
import type { EmergencyServiceBookingProp } from "@/api/booking";

const BOOKING_SORT_OPTIONS = [
    { value: "desc", label: "Newest First" },
    { value: "asc", label: "Oldest First" },
] as const;

import { HospitalBookingDetailsModal } from "./_components/HospitalBookingDetailsModal";

const LIMIT = 10;

export default function ReceivedBookingsPage() {
    // Filter States
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [paymentVia, setPaymentVia] = useState("");
    const [sortBy, setSortBy] = useState<"asc" | "desc">("desc");
    const [page, setPage] = useState(1);

    // Modal States
    const [viewBooking, setViewBooking] = useState<EmergencyServiceBookingProp | null>(null);
    const [actionBooking, setActionBooking] = useState<EmergencyServiceBookingProp | null>(null);
    const [actionType, setActionType] = useState<"ACCEPTED" | "COMPLETED" | "CANCELLED" | null>(null);

    // Data Fetching
    const { data, isPending, error, refetch, isFetching } = useFetchMyBookingRequest({
        search: search || undefined,
        booking_status: status || undefined,
        payment_status: paymentStatus || undefined,
        payment_via: paymentVia || undefined,
        sortBy: sortBy,
        page,
        limit: LIMIT,
    });

    const bookings = data?.bookings ?? [];
    const meta = data?.meta;

    const handleAction = (b: EmergencyServiceBookingProp, action: "ACCEPTED" | "COMPLETED" | "CANCELLED") => {
        setActionBooking(b);
        setActionType(action);
    };

    const resetFilters = () => {
        setSearch("");
        setStatus("");
        setPaymentStatus("");
        setPaymentVia("");
        setSortBy("desc");
        setPage(1);
    };

    const hasActiveFilters =
        !!search || !!status || !!paymentStatus || !!paymentVia || sortBy !== "desc";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-primary">
                    Received <span className="text-[#B15A36]">Bookings</span>
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Manage incoming emergency service requests from patients.
                </p>
            </div>

            {/* Filters Bar */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 md:p-5 space-y-4">

                {/* Search Row */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <SearchInput
                            value={search}
                            onChange={(v) => { setSearch(v); setPage(1); }}
                            placeholder="Search by patient name..."
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <FilterSelect
                        value={status}
                        onChange={(v) => { setStatus(v); setPage(1); }}
                        options={BOOKING_STATUS}
                        placeholder="Booking Status"
                    />
                    <FilterSelect
                        value={paymentStatus}
                        onChange={(v) => { setPaymentStatus(v); setPage(1); }}
                        options={PAYMENT_STATUS}
                        placeholder="Payment Status"
                    />
                    <FilterSelect
                        value={paymentVia}
                        onChange={(v) => { setPaymentVia(v); setPage(1); }}
                        options={PAYMENT_VIA_OPTIONS}
                        placeholder="Payment Method"
                        icon={<Wallet className="w-4 h-4" />}
                    />
                    <FilterSelect
                        value={sortBy}
                        onChange={(v) => { setSortBy((v || "desc") as "asc" | "desc"); setPage(1); }}
                        options={BOOKING_SORT_OPTIONS}
                        placeholder="Sort By Date"
                        icon={<SlidersHorizontal className="w-4 h-4" />}
                    />
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
                    <p className="text-sm text-slate-500 mb-4">Could not load received bookings.</p>
                    <Button onClick={() => refetch()} className="btn-main bg-[#B15A36]">Retry</Button>
                </div>
            )}

            {!isPending && !error && bookings.length === 0 && (
                <div className="text-center py-20 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                        <CalendarCheck className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No bookings received</h3>
                    <p className="mt-1 text-sm text-slate-500">
                        {hasActiveFilters ? "Try adjusting your filters." : "You haven't received any booking requests yet."}
                    </p>
                </div>
            )}

            {!isPending && !error && bookings.length > 0 && (
                <div className={isFetching ? "opacity-60 transition-opacity" : "opacity-100"}>
                    <ReceivedBookingsTable
                        bookings={bookings}
                        onView={setViewBooking}
                        onAction={handleAction}
                    />
                </div>
            )}

            {meta && meta.totalPages > 1 && (
                <PaginationControls currentPage={page} totalPages={meta.totalPages} onPageChange={setPage} />
            )}

            {/* Modals */}
            <HospitalBookingDetailsModal
                open={!!viewBooking}
                onOpenChange={(o) => !o && setViewBooking(null)}
                bookingId={viewBooking?.id ?? null}
            />

            <BookingStatusDialog
                open={!!actionType}
                onOpenChange={(o) => !o && setActionType(null)}
                booking={actionBooking}
                action={actionType}
            />
        </div>
    );
}