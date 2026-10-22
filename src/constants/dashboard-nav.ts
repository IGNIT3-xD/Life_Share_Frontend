import { LayoutGrid, Users, FileText, FileSearchCorner, BookCheck, Siren, ListChecks, ClipboardList, HeartPulse, UserGroup, Hospital, Ambulance, Wallet, Landmark } from "lucide-react";

export type NavItem = {
    name: string;
    href: string;
    icon: React.ElementType;
};

export const getDashboardUrl = (role?: string) => {
    switch (role) {
        case "ADMIN": return "/admin-dashboard";
        case "HOSPITAL": return "/hospital-dashboard";
        case "DONOR": return "/donor-dashboard";
        case "USER": return "/user-dashboard";
        default: return "/user-dashboard";
    }
};

export const dashboardNavConfig: Record<string, NavItem[]> = {
    USER: [
        { name: "Overview", href: "/user-dashboard", icon: LayoutGrid },
        { name: "My Blood Requests", href: "/user-dashboard/my-blood-request", icon: FileText },
        { name: "My Donation Requests", href: "/user-dashboard/my-donation-requests", icon: FileSearchCorner },
        { name: "My Bookings", href: "/user-dashboard/my-bookings", icon: BookCheck },
        { name: "Donor Profile", href: "/user-dashboard/donor-profile", icon: Users },
        { name: "Donation Request Received", href: "/donor-dashboard/my-donation-request", icon: ClipboardList },
        { name: "My Payments", href: "/user-dashboard/my-payments", icon: Wallet },
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
        { name: "Donation Request Received", href: "/donor-dashboard/my-donation-request", icon: ClipboardList },
        { name: "My Blood Requests", href: "/user-dashboard/my-blood-request", icon: FileText },
        { name: "My Donation Requests", href: "/user-dashboard/my-donation-requests", icon: FileSearchCorner },
        { name: "My Bookings", href: "/user-dashboard/my-bookings", icon: BookCheck },
        { name: "My Payments", href: "/user-dashboard/my-payments", icon: Wallet },
    ],
    ADMIN: [
        { name: "Overview", href: "/admin-dashboard", icon: LayoutGrid },
        { name: "All Payments", href: "/admin-dashboard/all-payments", icon: Wallet },
        { name: "Manage Users", href: "/admin-dashboard/all-users", icon: Users },
        { name: "Manage Donors", href: "/admin-dashboard/all-donors", icon: HeartPulse },
        { name: "Manage Blood Requests", href: "/admin-dashboard/all-requesters", icon: UserGroup },
        { name: "Manage Hospitals", href: "/admin-dashboard/all-hospitals", icon: Hospital },
        { name: "Manage Emergency Services", href: "/admin-dashboard/all-emergency-services", icon: Ambulance },
        { name: "My Payments", href: "/user-dashboard/my-payments", icon: Landmark },
        { name: "My Blood Requests", href: "/user-dashboard/my-blood-request", icon: FileText },
        { name: "My Donation Requests", href: "/user-dashboard/my-donation-requests", icon: FileSearchCorner },
        { name: "My Donor Profile", href: "/user-dashboard/donor-profile", icon: Users },
        { name: "Donation Request Received", href: "/donor-dashboard/my-donation-request", icon: ClipboardList },
        { name: "My Bookings", href: "/user-dashboard/my-bookings", icon: BookCheck },
    ],
};