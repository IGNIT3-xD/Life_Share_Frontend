"use client";

import { useState } from "react";
import { Users, SlidersHorizontal, ShieldCheck, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/PaginationControls";
import { SearchInput } from "@/components/SearchInput";
import { FilterSelect } from "@/components/FilterSelect";
import type { UserData } from "@/api/auth";
import { useFetchAllUsers } from "@/hooks/useAuth";
import { AdminUsersTable } from "../_components/AdminUsersTable";
import { AdminUserDetailsModal } from "../_components/AdminUserDetailsModal";
import { UpdateUserStatusDialog } from "../_components/UpdateUserStatusDialog";

const ROLE_OPTIONS = [
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "HOSPITAL", label: "Hospital" },
  { value: "DONOR", label: "Donor" },
  { value: "USER", label: "User" },
];

const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHERS", label: "Others" },
];

const STATUS_OPTIONS = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const SORT_OPTIONS = [
  { value: "desc", label: "Newest First" },
  { value: "asc", label: "Oldest First" },
];

const LIMIT = 8;

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const [viewUser, setViewUser] = useState<UserData | null>(null);
  const [statusUser, setStatusUser] = useState<UserData | null>(null);

  // Map the string "true"/"false" from the dropdown to actual booleans for the API
  const isActiveFilter = status === "true" ? true : status === "false" ? false : undefined;

  const { data, isPending, error, refetch, isFetching } = useFetchAllUsers({
    search: search || undefined,
    role: (role as any) || undefined,
    gender: (gender as any) || undefined,
    is_active: isActiveFilter,
    sortBy,
    rawPage: page,
    rawLimit: LIMIT,
  });

  const users = data?.user ?? [];
  const meta = data?.meta;

  const resetFilters = () => {
    setSearch(""); setRole(""); setGender(""); setStatus(""); setSortBy("desc"); setPage(1);
  };

  const hasActiveFilters = !!search || !!role || !!gender || !!status || sortBy !== "desc";

  return (
    <div className="space-y-6 pt-16">
      {/* Header */}
      <div>
        <h1 className="text-primary">
          Manage <span className="text-[#B15A36]">Users</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          View all registered accounts and manage their platform access.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 md:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by name or email..." />
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={resetFilters} className="text-red-500 hover:text-red-600 hover:bg-red-50 h-11 shrink-0">Reset Filters</Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <FilterSelect value={role} onChange={(v) => { setRole(v); setPage(1); }} options={ROLE_OPTIONS} placeholder="Role" icon={<UserCircle className="w-4 h-4" />} />
          <FilterSelect value={gender} onChange={(v) => { setGender(v); setPage(1); }} options={GENDER_OPTIONS} placeholder="Gender" />
          <FilterSelect value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={STATUS_OPTIONS} placeholder="Account Status" icon={<ShieldCheck className="w-4 h-4" />} />
          <FilterSelect value={sortBy} onChange={(v) => { setSortBy((v || "desc") as "asc" | "desc"); setPage(1); }} options={SORT_OPTIONS} placeholder="Sort By" icon={<SlidersHorizontal className="w-4 h-4" />} />
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
          <p className="text-sm text-slate-500 mb-4">Could not load users.</p>
          <Button onClick={() => refetch()} className="btn-main bg-[#B15A36]">Retry</Button>
        </div>
      )}

      {!isPending && !error && users.length === 0 && (
        <div className="text-center py-20 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <Users className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No users found</h3>
          <p className="mt-1 text-sm text-slate-500">Try adjusting your filters.</p>
        </div>
      )}

      {!isPending && !error && users.length > 0 && (
        <div className={isFetching ? "opacity-60 transition-opacity" : "opacity-100"}>
          <AdminUsersTable
            users={users}
            onView={setViewUser}
            onUpdateStatus={setStatusUser}
          />
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <PaginationControls currentPage={page} totalPages={meta.totalPages} onPageChange={setPage} />
      )}

      {/* --- Modals --- */}
      <AdminUserDetailsModal
        open={!!viewUser}
        onOpenChange={(o) => !o && setViewUser(null)}
        user={viewUser}
      />

      <UpdateUserStatusDialog
        open={!!statusUser}
        onOpenChange={(o) => !o && setStatusUser(null)}
        user={statusUser}
      />
    </div>
  );
}