"use client";

import { MapPin, Clock, Heart, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Link from "next/link";

export type RequesterProp = {
  id: string;
  patientName: string;
  blood_group: string;
  unit_required: number;
  exact_location: string;
  expires_at: string;
  urgency: string;
  verificationStatus: string;
  request_status: string;
  note?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

const formatBloodGroup = (group: string) => {
  if (!group) return "N/A";
  return group.replace("_POS", "+").replace("_NEG", "-");
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(date);
};

export function RequesterCard({ data }: { data: RequesterProp }) {
  const {
    id,
    patientName,
    blood_group,
    exact_location,
    expires_at,
    request_status,
    unit_required,
    urgency,
    verificationStatus,
    note,
  } = data;

  const formattedBloodGroup = formatBloodGroup(blood_group);
  const isCompleted = request_status === "COMPLETED";
  const isEmergency = urgency === "EMERGENCY";

  return (
    <div className="relative w-full max-w-md mx-auto font-graphik transition-all duration-300">
      {/* Main Card Container */}
      <div className="relative flex flex-col bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:border hover:border-[#b15b3672]">
        {/* Top Section: Blood Group, Name, Urgency */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Blood Group Box */}
            <div
              className={cn(
                "flex items-center justify-center w-14 h-14 rounded-2xl text-white shadow-sm shrink-0",
                isEmergency ? "bg-red-500" : "bg-gray-800",
              )}
            >
              <span className="text-xl font-bold tracking-tight">
                {formattedBloodGroup}
              </span>
            </div>

            {/* Name and Status */}
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 leading-tight">
                {patientName}
              </h3>

              <div className="flex items-center gap-2 mt-1.5">
                {/* Verification Status */}
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
                  <ShieldCheck className="w-3 h-3" />
                  {verificationStatus}
                </span>

                {/* Request Status */}
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                    isCompleted
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-amber-50 text-amber-700 border-amber-200",
                  )}
                >
                  {request_status}
                </span>
              </div>
            </div>
          </div>

          {/* Urgency Badge */}
          <div
            className={cn(
              "px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border",
              isEmergency
                ? "bg-red-50 text-red-600 border-red-200"
                : "bg-amber-50 text-amber-600 border-amber-200",
            )}
          >
            {urgency}
          </div>
        </div>

        {/* Units Required Section */}
        <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500 font-medium">
              Blood Units Required
            </span>
            <span className="text-sm font-bold text-gray-900">
              {unit_required} Units
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                isCompleted ? "bg-emerald-500" : "bg-red-500",
              )}
              style={{ width: isCompleted ? "100%" : "0%" }}
            />
          </div>

          <div className="flex justify-between text-xs text-gray-500 font-medium">
            <span>
              {isCompleted
                ? `${unit_required} of ${unit_required} Units Fulfilled`
                : `0 of ${unit_required} Units Fulfilled`}
            </span>
            <span>
              {isCompleted
                ? "0 Unit(s) Pending"
                : `${unit_required} Unit(s) Pending`}
            </span>
          </div>
        </div>

        {/* Exact Location */}
        <div className="flex items-start gap-3 bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
          <MapPin className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">
              Exact Hospital Location
            </span>
            <span className="text-sm font-medium text-gray-900 mt-0.5">
              {exact_location}
            </span>
          </div>
        </div>

        {/* Expiry Section */}
        <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">
                Expires At
              </span>
              <span className="text-sm font-medium text-gray-900 mt-0.5">
                {formatDate(expires_at)}
              </span>
            </div>
          </div>
          {!isCompleted && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
              Active Window
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
