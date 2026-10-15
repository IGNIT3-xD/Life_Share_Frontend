"use client";

import { useState } from "react";
import { Droplet, MapPin, SlidersHorizontal, RotateCcw } from "lucide-react";
import { DonorCard } from "@/components/DonorCard";
import { useAllDonors } from "@/hooks/useDonors";
import { BLOOD_GROUPS, AVAILABILITY_OPTIONS, SORT_OPTIONS } from "@/constants/donor";
import { SearchInput } from "@/components/SearchInput";
import { FilterSelect } from "@/components/FilterSelect";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/PaginationControls";

export const CardSkeleton = () => (
  <div className="mx-auto w-full max-w-sm animate-pulse rounded-3xl border border-gray-200 bg-white p-6">
    <div className="mb-6 flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-gray-200" />
        <div className="flex flex-col gap-2">
          <div className="h-5 w-32 rounded bg-gray-200" />
          <div className="h-4 w-20 rounded bg-gray-100" />
        </div>
      </div>
      <div className="h-7 w-20 rounded-full bg-gray-100" />
    </div>
    <div className="mb-6 grid grid-cols-2 gap-4">
      <div className="h-16 rounded-2xl bg-gray-100" />
      <div className="h-16 rounded-2xl bg-gray-100" />
    </div>
    <div className="h-10 rounded-full bg-gray-100" />
  </div>
);

const AllDonors = () => {
  // ---- Filter state ----
  const [search, setSearch] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [availability, setAvailability] = useState("");
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const limit = 9;

  // ---- Data fetching ----
  const { data, isPending, isFetching, error, refetch } = useAllDonors({
    search: search || undefined,
    blood_group: bloodGroup || undefined,
    availability: availability || undefined,
    location: location || undefined,
    sortBy,
    rawPage: page,
    rawLimit: limit,
  });

  const donors = data?.donors ?? [];
  const meta = data?.meta;

  // Reset pagination when filters change
  const updateFilter = <T,>(setter: (v: T) => void) => (value: T) => {
    setter(value); // Save the new filter
    setPage(1); // ALWAYS go back to page 1

    // If you are on Page 3, and you suddenly filter for "B+", there might only be 1 page of results. This helper ensures you instantly snap back to Page 1 whenever you change a filter.
  };

  // Explicitly convert a value to a boolean.
  const hasActiveFilters = !!search || !!bloodGroup || !!availability || !!location;

  const resetFilters = () => {
    setSearch("");
    setBloodGroup("");
    setAvailability("");
    setLocation("");
    setSortBy("desc");
    setPage(1);
  };

  return (
    <section className="container-main pt-24 pb-10 font-graphik">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-primary">
          Find a <span className="text-[#B15A36]">Donor</span>.
        </h1>
        <p className="mt-3 text-sm md:text-base text-gray-500 max-w-xl mx-auto">
          Search verified donors in your area. Filter by blood group, availability, and location to find the right match.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 shadow-sm mb-10">
        {/* Search Row */}
        <div className="mb-4">
          <SearchInput
            value={search}
            onChange={updateFilter(setSearch)}
            placeholder="Search by name, email, or location..."
          />
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <FilterSelect
            value={bloodGroup}
            onChange={updateFilter(setBloodGroup)}
            options={BLOOD_GROUPS}
            placeholder="Blood Group"
            icon={<Droplet className="w-4 h-4" />}
          />
          <FilterSelect
            value={availability}
            onChange={updateFilter(setAvailability)}
            options={AVAILABILITY_OPTIONS}
            placeholder="Availability"
            icon={<SlidersHorizontal className="w-4 h-4" />}
          />
          <FilterSelect
            value={location}
            onChange={updateFilter(setLocation)}
            options={[
              { value: "Dhaka", label: "Dhaka" },
              { value: "Chittagong", label: "Chittagong" },
              { value: "Sylhet", label: "Sylhet" },
              { value: "Rajshahi", label: "Rajshahi" },
              { value: "Khulna", label: "Khulna" },
            ]}
            placeholder="Location"
            icon={<MapPin className="w-4 h-4" />}
          />
          <FilterSelect
            value={sortBy}
            onChange={(v) => {
              if (v === 'asc' || v === 'desc') {
                updateFilter(setSortBy)(v)
              }
            }}
            options={SORT_OPTIONS}
            placeholder="Sort By"
          />
        </div>

        {/* Active Filters Bar */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              <span className="font-semibold text-gray-900">
                {meta?.total ?? 0}
              </span>{" "}
              donor{(meta?.total ?? 0) !== 1 ? "s" : ""} found
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

      {/* Loading State */}
      {isPending && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-16">
          <p className="text-sm text-gray-500 mb-4">
            Could not load donors. Please try again.
          </p>
          <Button
            onClick={() => refetch()}
            className="bg-[#B15A36] btn-main"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isPending && !error && donors.length === 0 && (
        <div className="text-center py-20 border border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Droplet className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No donors found</h3>
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

      {/* Donors Grid */}
      {!isPending && !error && donors.length > 0 && (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-200 ${isFetching ? "opacity-60" : "opacity-100"}`}>
          {donors.map((donor) => (
            <DonorCard key={donor.id} data={donor} />
          ))}
        </div>
      )}

      {meta && (
        <PaginationControls
          currentPage={page}
          totalPages={meta.totalPages}
          onPageChange={setPage}
        />
      )}
    </section>
  );
};

export default AllDonors;