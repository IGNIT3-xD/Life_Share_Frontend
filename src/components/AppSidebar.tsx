"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GalleryVerticalEnd, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { dashboardNavConfig } from "@/constants/dashboard-nav";
import { useLogout } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function AppSidebar({ role, ...props }: React.ComponentProps<typeof Sidebar> & { role: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { mutateAsync: logout, isPending } = useLogout();

  const navItems = dashboardNavConfig[role] ?? [];

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        router.replace("/login");
        router.refresh();
      },
    });
  };

  return (
    <Sidebar collapsible="icon" className="font-graphik border-r border-slate-200" {...props}>

      {/* Header: Logo */}
      <SidebarHeader className="pt-4 pb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
              <Link href="/">
                {/* Clean logo mark */}
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#B15A36] text-white shadow-sm">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-1 leading-none ml-1">
                  <span className="font-semibold text-slate-900 text-[15px] tracking-tight">Life Share</span>
                  <span className="text-[11px] font-medium text-slate-500 capitalize">{role.toLowerCase()} Portal</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content: Navigation Links */}
      <SidebarContent>
        <SidebarGroup>
          {/* Optional: Add a label for visual hierarchy when expanded */}
          <SidebarGroupLabel className="text-xs font-semibold text-slate-400 mb-2">
            Menu
          </SidebarGroupLabel>

          <SidebarMenu className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.name}
                    className={cn(
                      "h-10 px-3 text-sm font-medium transition-colors duration-200 rounded-md",
                      "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                      isActive && "bg-orange-50/80 text-[#B15A36] font-semibold hover:bg-orange-50 hover:text-[#B15A36]"
                    )}
                  >
                    <Link href={item.href}>
                      <Icon className={cn(
                        "size-4",
                        isActive ? "text-[#B15A36]" : "text-slate-400"
                      )} />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: User Info & Logout */}
      <SidebarFooter className="border-t border-slate-100 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="h-10 w-full justify-start rounded-md text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
              onClick={handleLogout}
              disabled={isPending}
            >
              <LogOut className="size-4 text-slate-400" />
              <span>{isPending ? "Logging out..." : "Log out"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

    </Sidebar>
  );
}