import { AuthGuard } from "@/components/guards/AuthGuard";

const ALLOWED_ROLES = ["ADMIN"];

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AuthGuard roles={ALLOWED_ROLES}>{children}</AuthGuard>;
}
