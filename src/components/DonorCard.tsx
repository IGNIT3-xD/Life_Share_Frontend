"use client";

import {
  Mail,
  MapPin,
  Droplet,
  ShieldCheck,
  User,
  Clock,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export type DonorProps = {
  id: string;
  email: string;
  blood_group: string;
  location: string;
  age: number;
  availability: string;
  weightKg: string;
  height: string;
  donorStatus: string;
  totalDonations: number;
  lastDonationDate: string | null;
  created_at: string;
  updated_at: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    gender: string;
    profile_pic: string | null;
    profile_pic_public_id: string | null;
    auth_provider: string;
    email_verified: boolean;
    is_active: boolean;
    is_blocked: boolean;
    created_at: string;
    updated_at: string;
    role: string;
  };
};

// Utility to format blood group (e.g., A_POS -> A+)
const formatBloodGroup = (group: string) => {
  if (!group) return "N/A";
  return group.replace("_POS", "+").replace("_NEG", "-");
};

// Utility to format strings (e.g., ON_HOLD -> On Hold)
const formatString = (str: string) => {
  if (!str) return "N/A";
  return str
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export function DonorCard({ data }: { data: DonorProps }) {
  const {
    user,
    blood_group,
    location,
    availability,
    donorStatus,
    age,
    totalDonations,
  } = data;
  const formattedBloodGroup = formatBloodGroup(blood_group);

  return (
    <div className="relative w-full max-w-sm mx-auto font-graphik transition-all duration-300">
      <Link
        href={`donors/${data.id}`}
        className="relative flex flex-col bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:border hover:border-[#b15b3672] hover:shadow-md transition-all duration-300"
      >
        <div className="absolute inset-0 bg-linear-to-br from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Top Section: Avatar, Name, Blood Group */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Profile Picture with Fallback */}
            <div className="relative w-16 h-16 rounded-full p-0.5 bg-linear-to-br from-gray-200 to-gray-300">
              <div className="w-full h-full rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border-2 border-white">
                {user?.profile_pic ? (
                  <Image
                    src={user.profile_pic}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    height={16}
                    width={16}
                  />
                ) : (
                  // Avatar Fallback
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <User className="w-8 h-8" />
                  </div>
                )}
              </div>
              {/* Verified Tick Overlay */}
              {donorStatus === "VERIFIED" && (
                <div className="absolute bottom-0 right-0 bg-emerald-500 rounded-full p-1 border-2 border-white">
                  <ShieldCheck className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                {user?.name}
              </h3>
              <span className="text-sm text-gray-700 font-medium capitalize flex items-center gap-1 mt-1">
                <User className="w-3 h-3" /> {formatString(user?.gender)}
              </span>
            </div>
          </div>

          {/* Blood Group Badge */}
          <div className="flex flex-col items-center justify-center bg-red-50 border border-red-100 rounded-2xl px-4 py-2 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <Droplet
              className="w-4 h-4 text-red-500 mb-1"
              fill="currentColor"
            />
            <span className="text-2xl font-black text-red-600 leading-none tracking-tighter">
              {formattedBloodGroup}
            </span>
          </div>
        </div>

        {/* Middle Section: Key Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col gap-1 p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-xs text-gray-600 font-medium uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Location
            </span>
            <span className="text-sm text-gray-700 font-semibold truncate">
              {location}
            </span>
          </div>

          <div className="flex flex-col gap-1 p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3 h-3" /> Availability
            </span>
            <span
              className={cn(
                "text-sm font-semibold",
                availability === "AVAILABLE"
                  ? "text-emerald-600"
                  : "text-amber-600",
              )}
            >
              {formatString(availability)}
            </span>
          </div>
        </div>

        {/* Bottom Section: Contact & Stats */}
        <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
            <Mail className="w-4 h-4 text-gray-600" />
            <span className="truncate">{user?.email || data.email}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600 font-medium">
              <Clock className="w-4 h-4 text-gray-600" />
              <span>{age} years old</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Donations:</span>
              <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full text-xs">
                {totalDonations} times
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
