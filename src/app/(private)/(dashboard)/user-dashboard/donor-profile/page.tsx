"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMyDonorProfile } from "@/hooks/useDonors";
import { DonorProfileView } from "./_components/DonorProfileView";
import { DeleteDonorDialog } from "./_components/DeleteDonorDialog";
import { DonorProfileFormModal } from "./_components/DonorProfileFormModal";

export default function DonorProfilePage() {
    const { data: profile, isPending, error, refetch } = useMyDonorProfile();

    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-primary">
                    Donor <span className="text-[#B15A36]">Profile</span>
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Manage your donor information and availability.
                </p>
            </div>

            {/* Loading */}
            {isPending && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
                    <p className="text-sm text-slate-500 mb-4">
                        Could not load your donor profile. Please try again.
                    </p>
                    <Button onClick={() => refetch()} className="btn-main bg-[#B15A36]">
                        Retry
                    </Button>
                </div>
            )}

            {/* No Profile — Fallback */}
            {!isPending && !error && !profile && (
                <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center max-w-2xl mx-auto">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                        <Heart className="w-7 h-7 text-red-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                        No donor profile found
                    </h3>
                    <p className="mt-1.5 text-sm text-slate-500 max-w-md mx-auto">
                        You haven't registered as a blood donor yet. Create your donor
                        profile to start saving lives.
                    </p>
                    <Button
                        onClick={() => setFormOpen(true)}
                        className="btn-main bg-[#B15A36] mt-6"
                    >
                        <Heart className="w-4 h-4 mr-1.5" />
                        Create Donor Profile
                    </Button>
                </div>
            )}

            {/* Profile View */}
            {!isPending && !error && profile && (
                <DonorProfileView
                    profile={profile}
                    onEdit={() => setFormOpen(true)}
                    onDelete={() => setDeleteOpen(true)}
                />
            )}

            <DonorProfileFormModal
                open={formOpen}
                onOpenChange={setFormOpen}
                profile={profile}
            />

            <DeleteDonorDialog open={deleteOpen} onOpenChange={setDeleteOpen} profileId={profile?.id ?? null} />
        </div>
    );
}