"use client";

import { useState } from "react";
import { Loader2, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMe } from "@/hooks/useAuth";
import { UserProfileView } from "./_components/UserProfileView";
import { EditProfileModal } from "./_components/EditProfileModal";

export default function ProfilePage() {
    const { data: profile, isPending, error, refetch } = useMe();
    const [isEditOpen, setIsEditOpen] = useState(false);

    return (
        <div className="container-main pt-24 pb-10 font-graphik">
            <div>
                <h1 className="text-primary">
                    My <span className="text-[#B15A36]">Profile</span>
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Manage your personal information and account settings.
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
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                        <UserX className="w-6 h-6 text-red-500" />
                    </div>
                    <p className="text-sm text-slate-500 mb-4">Could not load your profile.</p>
                    <Button onClick={() => refetch()} className="btn-main bg-[#B15A36]">Retry</Button>
                </div>
            )}

            {/* Profile View */}
            {profile && (
                <>
                    <UserProfileView profile={profile} onEdit={() => setIsEditOpen(true)} />
                    <EditProfileModal
                        open={isEditOpen}
                        onOpenChange={setIsEditOpen}
                        profile={profile}
                    />
                </>
            )}
        </div>
    );
}