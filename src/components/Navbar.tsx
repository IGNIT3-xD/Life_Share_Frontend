"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartPulse,
  LayoutDashboard,
  Menu,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import type { MeUser } from "@/api/auth";
import { useMe } from "@/hooks/useAuth";

const getInitial = (name?: string | null) =>
  name?.trim()?.charAt(0).toUpperCase() || "?";

// Slightly smaller avatar for the compact layout
function Avatar({ user, size = 32 }: { user: MeUser; size?: number }) {
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/30 bg-[#B15A36] font-semibold text-white"
      style={{ width: size, height: size, fontSize: size / 2.4 }}
    >
      {user.profile_pic ? (
        <Image
          src={user.profile_pic}
          alt={user.name}
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      ) : (
        getInitial(user.name)
      )}
    </span>
  );
}

function UserMenu({ user }: { user: MeUser }) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open user menu"
          className="rounded-full transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 md:inline-flex"
        >
          <Avatar user={user} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72 font-graphik">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3 py-1">
            <Avatar user={user} size={40} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {user.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
              <span
                className={
                  user.email_verified
                    ? "mt-1.5 inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700"
                    : "mt-1.5 inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700"
                }
              >
                <ShieldCheck className="size-3" />
                {user.email_verified ? "Verified" : "Unverified"}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/profile">
            <UserRound />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboard />
            Dashboard
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Destructure isPending from useMe
  const { data: me, isPending } = useMe();

  const navLinks = [
    { name: "Find Donors", href: "/donors" },
    { name: "Blood Requesters", href: "/blood-requesters" },
    { name: "Emergency Services", href: "/emergency-service" },
    { name: "About", href: "/about" },
  ];

  return (
    // Reduced top/inset padding for a tighter fit
    <header className="fixed top-3 inset-x-3 md:inset-x-6 lg:inset-x-10 max-w-7xl mx-auto z-50 font-graphik">
      {/* Reduced inner padding, changed to rounded-full for a pill shape */}
      <nav className="relative flex items-center justify-between px-4 py-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl text-white shadow-2xl transition-all duration-300">

        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-white/10 border border-white/20">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-lg font-medium tracking-wide hidden sm:block">Life Share</span>
        </Link>

        {/* Middle: Desktop Navigation Links */}
        {/* Reduced gap and font size slightly */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-normal text-white/80">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-white transition-colors duration-200"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* SKELETON LOADER for Auth State */}
          {isPending ? (
            <div className="hidden md:block h-8 w-20 animate-pulse rounded-full bg-white/20" />
          ) : me ? (
            <UserMenu user={me} />
          ) : (
            <Link
              href="/login"
              className="hidden md:block text-sm font-medium text-white/90 hover:text-white transition-colors"
            >
              Log in
            </Link>
          )}

          {/* Hide Donate button while pending to prevent layout shift, or keep it static */}
          {!isPending && (
            <Button size={'sm'} className="hidden md:flex btn-main bg-[#B15A36] text-sm">
              Donate Now
              <HeartPulse />
            </Button>
          )}

          <button
            type="button"
            className="lg:hidden p-1 text-white/90 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              // Changed rounded-3xl to rounded-2xl, adjusted padding
              className="absolute top-full left-0 right-0 mt-2 p-5 bg-black/95 backdrop-blur-2xl border border-white/10 rounded-2xl flex flex-col gap-2 lg:hidden shadow-2xl origin-top"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-white/80 hover:text-white py-2.5 text-base border-b border-white/5 last:border-0 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile Auth Section */}
              {isPending ? (
                <div className="flex items-center gap-3 border-b border-white/5 py-3">
                  <div className="h-8 w-8 animate-pulse rounded-full bg-white/20" />
                  <div className="flex flex-col gap-1">
                    <div className="h-3 w-24 animate-pulse rounded bg-white/20" />
                    <div className="h-3 w-32 animate-pulse rounded bg-white/10" />
                  </div>
                </div>
              ) : me ? (
                <div className="flex items-center gap-3 border-b border-white/5 py-3">
                  <Avatar user={me} size={32} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {me.name}
                    </p>
                    <p className="truncate text-xs text-white/60">{me.email}</p>
                  </div>
                </div>
              ) : null}

              {!isPending && me ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-white/80 hover:text-white py-2.5 text-base border-b border-white/5 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="text-white/80 hover:text-white py-2.5 text-base border-b border-white/5 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </>
              ) : !isPending ? (
                <Link
                  href="/login"
                  className="text-white/80 hover:text-white py-2.5 text-base border-b border-white/5 md:hidden transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log in
                </Link>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}