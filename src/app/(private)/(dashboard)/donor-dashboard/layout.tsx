import { AuthGuard } from "@/components/guards/AuthGuard";

const ALLOWED_ROLES: string[] = ["USER", "DONOR", "ADMIN"];

export default function DonorDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AuthGuard roles={ALLOWED_ROLES}>{children}</AuthGuard>;
}
