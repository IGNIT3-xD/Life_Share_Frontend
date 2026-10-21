"use client";

import { useState } from "react";
import { Building2, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFetchHospitalProfile } from "@/hooks/useHospital";
import { HospitalProfileView } from "./_components/HospitalProfileView";
import { CreateHospitalModal } from "./_components/CreateHospitalModal";
import { EditHospitalModal } from "./_components/EditHospitalModal";
import { DeleteHospitalDialog } from "./_components/DeleteHospitalDialog";

export default function HospitalProfilePage() {
    const { data: profile, isPending, error, refetch } = useFetchHospitalProfile();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-primary">
                    Hospital <span className="text-[#B15A36]">Profile</span>
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Manage your hospital's public information and verification status.
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
                        Could not load your hospital profile. Please try again.
                    </p>
                    <Button onClick={() => refetch()} className="btn-main bg-[#B15A36]">
                        Retry
                    </Button>
                </div>
            )}

            {/* Empty State (No Profile) */}
            {!isPending && !error && !profile && (
                <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center max-w-2xl mx-auto">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
                        <Building2 className="w-10 h-10 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">No Hospital Profile Found</h3>
                    <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
                        You haven't created a hospital profile yet. Create one to start offering emergency services and blood management.
                    </p>
                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="btn-main bg-[#B15A36] mt-6"
                    >
                        <Plus className="w-4 h-4 mr-1.5" />
                        Create Hospital Profile
                    </Button>
                </div>
            )}

            {/* Profile View */}
            {!isPending && !error && profile && (
                <HospitalProfileView
                    profile={profile}
                    onEdit={() => setIsEditOpen(true)}
                    onDelete={() => setIsDeleteOpen(true)}
                />
            )}

            {/* Modals */}
            <CreateHospitalModal
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
            />

            {profile && (
                <>
                    <EditHospitalModal
                        open={isEditOpen}
                        onOpenChange={setIsEditOpen}
                        profile={profile}
                    />
                    <DeleteHospitalDialog
                        open={isDeleteOpen}
                        onOpenChange={setIsDeleteOpen}
                        profileId={profile.id}
                        hospitalName={profile.user.name}
                    />
                </>
            )}
        </div>
    );
}