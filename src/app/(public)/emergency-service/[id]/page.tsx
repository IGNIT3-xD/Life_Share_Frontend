"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEmergencyServiceDetails } from "@/hooks/useEmergencyServices";
import { ServiceDetailsView } from "../_components/ServiceDetailsView";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default function EmergencyServiceDetailsPage({ params }: PageProps) {
    const { id } = use(params);
    const { data: service, isPending, error, refetch } =
        useEmergencyServiceDetails(id);

    const [bookingOpen, setBookingOpen] = useState(false);

    return (
        <div className="bg-[#F8F9FA] font-graphik">
            <div className="container-main pt-24 pb-10">
                {/* Back link */}
                <Link
                    href="/emergency-service"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to services
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
                            <PackageOpen className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">
                            Service not found
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            This service may have been removed or the link is invalid.
                        </p>
                        <div className="mt-6 flex items-center justify-center gap-3">
                            <Button onClick={() => refetch()} variant="outline">
                                Try again
                            </Button>
                            <Button asChild className="btn-main bg-[#B15A36]">
                                <Link href="/emergency-services">Browse services</Link>
                            </Button>
                        </div>
                    </div>
                )}

                {/* Service Details */}
                {service && (
                    <>
                        <ServiceDetailsView
                            service={service}
                            onBookNow={() => setBookingOpen(true)}
                        />

                        {/* <BookServiceModal
                            open={bookingOpen}
                            onOpenChange={setBookingOpen}
                            serviceId={service.id}
                            serviceName={service.service_name}
                            price={service.price}
                        /> */}
                    </>
                )}
            </div>
        </div>
    );
}