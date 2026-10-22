import { AuthGuard } from "@/components/guards/AuthGuard";

export default function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <div className="flex-1">
                <AuthGuard>{children}</AuthGuard>
            </div>
        </div>
    );
}
