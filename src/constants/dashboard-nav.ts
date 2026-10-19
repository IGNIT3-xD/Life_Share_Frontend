import { LayoutGrid, Users, FileText, Settings, ShieldAlert, FileSearchCorner, BookCheck, Siren, ListChecks, ClipboardList } from "lucide-react";

export type NavItem = {
    name: string;
    href: string;
    icon: React.ElementType;
};

export const dashboardNavConfig: Record<string, NavItem[]> = {
    USER: [
        { name: "Overview", href: "/user-dashboard", icon: LayoutGrid },
        { name: "My Blood Requests", href: "/user-dashboard/my-blood-request", icon: FileText },
        { name: "My Donation Requests", href: "/user-dashboard/my-donation-requests", icon: FileSearchCorner },
        { name: "My Bookings", href: "/user-dashboard/my-bookings", icon: BookCheck },
        { name: "Donor Profile", href: "/user-dashboard/donor-profile", icon: Users },
    ],
    HOSPITAL: [
        { name: "Overview", href: "/hospital-dashboard", icon: LayoutGrid },
        { name: "Hospital Profile", href: "/hospital-dashboard/hospital-profile", icon: Users },
        { name: "Emergency Services", href: "/hospital-dashboard/emergency-services", icon: Siren },
        { name: "Booking Requests", href: "/hospital-dashboard/my-booking-requests", icon: ListChecks },
        { name: "My Bookings", href: "/user-dashboard/my-bookings", icon: BookCheck },
    ],
    DONOR: [
        { name: "Overview", href: "/donor-dashboard", icon: LayoutGrid },
        { name: "My Donor Profile", href: "/user-dashboard/donor-profile", icon: Users },
        { name: "Donation Request", href: "/donor-dashboard/my-donation-request", icon: ClipboardList },
    ],
    ADMIN: [
        { name: "Overview", href: "/admin-dashboard", icon: LayoutGrid },
        { name: "Manage Users", href: "/admin-dashboard/users", icon: Users },
        { name: "Blood Requests", href: "/admin-dashboard/requests", icon: ShieldAlert },
        { name: "Settings", href: "/admin-dashboard/settings", icon: Settings },
    ],
};