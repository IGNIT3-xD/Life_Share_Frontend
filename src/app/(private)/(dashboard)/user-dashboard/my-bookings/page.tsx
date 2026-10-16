"use client";

import { useState } from "react";
import { CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFetchAllBookings } from "@/hooks/useBooking";
import {
    BookingsFilters,
    type BookingTableFilters,
} from "./_components/BookingsFilters";
import { BookingsTable } from "./_components/BookingsTable";
import { EditBookingModal } from "./_components/EditBookingModal";
import { PaginationControls } from "@/components/PaginationControls";
import type { EmergencyServiceBookingProp } from "@/api/booking";
import { BookingDetailsModal } from "./_components/BookingDetailsModal";

const INITIAL_FILTERS: BookingTableFilters = {
    search: "",
    booking_status: "",
    payment_status: "",
    payment_via: "",
    sortBy: "desc",
};

const LIMIT = 10;

export default function MyBookingsPage() {
    const [filters, setFilters] = useState<BookingTableFilters>(INITIAL_FILTERS);
    const [page, setPage] = useState(1);

    // Modal state
    const [viewBooking, setViewBooking] = useState<EmergencyServiceBookingProp | null>(null);
    const [editBooking, setEditBooking] = useState<EmergencyServiceBookingProp | null>(null);
    const [cancelBooking, setCancelBooking] = useState<EmergencyServiceBookingProp | null>(null);
    const [deleteBooking, setDeleteBooking] = useState<EmergencyServiceBookingProp | null>(null);

    const { data, isPending, isFetching, error, refetch } = useFetchAllBookings({
        search: filters.search || undefined,
        booking_status: filters.booking_status || undefined,
        payment_status: filters.payment_status || undefined,
        payment_via: filters.payment_via || undefined,
        sortBy: filters.sortBy,
        page,
        limit: LIMIT,
    });

    const bookings = data?.bookings ?? []
    const meta = data?.meta;

    const handleFilterChange = (updates: Partial<BookingTableFilters>) => {
        setFilters((prev) => ({ ...prev, ...updates }));
        setPage(1);
    };

    const resetFilters = () => {
        setFilters(INITIAL_FILTERS);
        setPage(1);
    };

    const hasActiveFilters =
        !!filters.search ||
        !!filters.booking_status ||
        !!filters.payment_status ||
        !!filters.payment_via ||
        filters.sortBy !== "desc";

    return (
        <div className="space-y-6 pt-16">
            {/* Header */}
            <div>
                <h1 className="text-primary">
                    My <span className="text-[#B15A36]">Bookings</span>
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Track and manage all your emergency service bookings.
                </p>
            </div>

            {/* Filters */}
            <BookingsFilters
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
                        Could not load your bookings. Please try again.
                    </p>
                    <Button onClick={() => refetch()} className="btn-main bg-[#B15A36]">
                        Retry
                    </Button>
                </div>
            )}

            {/* Empty */}
            {!isPending && !error && bookings.length === 0 && (
                <div className="text-center py-20 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                        <CalendarCheck className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No bookings found</h3>
                    <p className="mt-1 text-sm text-slate-500">
                        {hasActiveFilters
                            ? "Try adjusting your filters or reset them to see all bookings."
                            : "You haven't booked any emergency services yet."}
                    </p>
                    {hasActiveFilters && (
                        <Button onClick={resetFilters} variant="outline" className="mt-6">
                            Clear All Filters
                        </Button>
                    )}
                </div>
            )}

            {/* Table */}
            {!isPending && !error && bookings.length > 0 && (
                <div className={isFetching ? "opacity-60 transition-opacity" : "opacity-100"}>
                    <BookingsTable
                        bookings={bookings}
                        onViewDetails={setViewBooking}
                        onEdit={setEditBooking}
                        onCancel={setCancelBooking}
                        onDelete={setDeleteBooking}
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
            <BookingDetailsModal
                open={!!viewBooking}
                onOpenChange={(o) => !o && setViewBooking(null)}
                bookingId={viewBooking?.id ?? null}
            />

            <EditBookingModal
                open={!!editBooking}
                onOpenChange={(o) => !o && setEditBooking(null)}
                booking={editBooking}
            />

            {/* <CancelBookingDialog
                open={!!cancelBooking}
                onOpenChange={(o) => !o && setCancelBooking(null)}
                booking={cancelBooking}
            />
            <DeleteBookingDialog
                open={!!deleteBooking}
                onOpenChange={(o) => !o && setDeleteBooking(null)}
                booking={deleteBooking}
            /> */}
        </div>
    );
}