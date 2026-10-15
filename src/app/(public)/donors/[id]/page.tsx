"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, UserX } from "lucide-react";
import { useDonorDetails } from "@/hooks/useDonors";
import { DonorDetailsView } from "../_components/DonorDetailsView";
import { CreateDonationRequestModal } from "../_components/CreateDonationRequestModal";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default function DonorDetailsPage({ params }: PageProps) {
    const { id } = use(params);
    const { data: donor, isPending, error, refetch } = useDonorDetails(id);

    // Modal state for sending a donation request
    const [requestModalOpen, setRequestModalOpen] = useState(false);

    return (
        <div className="bg-[#F8F9FA] font-graphik">
            <div className="container-main py-30 max-w-7xl">
                {/* Back Link */}
                <Link
                    href="/donors"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to donors
                </Link>

                {/* Loading */}
                {isPending && (
                    <div className="flex items-center justify-center py-32">
                        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center max-w-lg mx-auto">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                            <UserX className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">
                            Donor not found
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            This donor may have removed their profile or the link is invalid.
                        </p>
                        <div className="mt-6 flex items-center justify-center gap-3">
                            <Button onClick={() => refetch()} variant="outline">
                                Try again
                            </Button>
                            <Button asChild className="btn-main bg-[#B15A36]">
                                <Link href="/donors">Browse donors</Link>
                            </Button>
                        </div>
                    </div>
                )}

                {/* Donor View + Modal */}
                {donor && (
                    <>
                        <DonorDetailsView
                            donor={donor}
                            onRequestDonation={() => setRequestModalOpen(true)}
                        />

                        <CreateDonationRequestModal
                            open={requestModalOpen}
                            onOpenChange={setRequestModalOpen}
                            donorId={donor.id}
                            donorName={donor.user.name}
                        />
                    </>
                )}
            </div>
        </div>
    );
}