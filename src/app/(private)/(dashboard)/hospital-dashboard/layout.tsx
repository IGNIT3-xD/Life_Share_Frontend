import { AuthGuard } from "@/components/guards/AuthGuard";

const ALLOWED_ROLES = ["HOSPITAL"];

export default function HospitalDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AuthGuard roles={ALLOWED_ROLES}>{children}</AuthGuard>;
}
