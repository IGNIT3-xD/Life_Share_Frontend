import { LayoutGrid, Users, FileText, Settings, HeartPulse, ShieldAlert } from "lucide-react";

export type NavItem = {
    name: string;
    href: string;
    icon: React.ElementType;
};

export const dashboardNavConfig: Record<string, NavItem[]> = {
    USER: [
        { name: "Overview", href: "/user-dashboard", icon: LayoutGrid },
        { name: "My Blood Requests", href: "/user-dashboard/my-blood-request", icon: FileText },
        { name: "Profile", href: "/user-dashboard/profile", icon: Users },
    ],
    DONOR: [
        { name: "Overview", href: "/donor-dashboard", icon: LayoutGrid },
        { name: "My Donations", href: "/donor-dashboard/donations", icon: HeartPulse },
        { name: "Availability", href: "/donor-dashboard/availability", icon: Settings },
    ],
    ADMIN: [
        { name: "Overview", href: "/admin-dashboard", icon: LayoutGrid },
        { name: "Manage Users", href: "/admin-dashboard/users", icon: Users },
        { name: "Blood Requests", href: "/admin-dashboard/requests", icon: ShieldAlert },
        { name: "Settings", href: "/admin-dashboard/settings", icon: Settings },
    ],
};