"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Building2, Clock, Tag, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Service } from "@/api/emergencyServices";

const formatPrice = (price: string) => {
  const n = Number(price);
  return isNaN(n) ? "—" : `৳${n.toLocaleString("en-BD")}`;
};

const capitalize = (s: string) =>
  s
    ?.replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase()) || "—";

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
  INACTIVE: "bg-slate-100 text-slate-600 border-slate-200",
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
};

export function AdminServiceDetailsModal({
  open,
  onOpenChange,
  service,
}: Props) {
  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md font-graphik p-0 overflow-hidden gap-0">
        {/* Service Image Hero */}
        <div className="relative w-full h-48 bg-slate-100">
          {service.service_image ? (
            <Image
              src={service.service_image}
              alt={service.service_name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              No Image
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute bottom-4 left-4 right-4">
            <span
              className={cn(
                "inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mb-2",
                statusStyles[service.service_status] || "bg-slate-100",
              )}
            >
              {capitalize(service.service_status)}
            </span>
            <h2 className="text-xl font-bold text-white leading-tight truncate">
              {service.service_name}
            </h2>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
              <Tag className="w-4 h-4 text-red-500" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Price
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {formatPrice(service.price)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
              <Clock className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Avail.
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {service.availability}
                </p>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-500">Category:</span>
            <span className="text-slate-900 font-medium">
              {capitalize(service.service_category)}
            </span>
          </div>

          {/* Description */}
          <div className="pt-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Description
            </p>
            <p className="text-sm text-slate-600 line-clamp-4 leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Hospital Info (if available) */}
          {service.hospital?.user && (
            <div className="pt-3 border-t border-slate-100 mt-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Provided By
              </p>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold text-slate-900">
                  {service.hospital.user.name}
                </span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
