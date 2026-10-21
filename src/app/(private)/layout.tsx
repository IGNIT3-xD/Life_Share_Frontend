export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <div className="flex-1">{children}</div>
        </div>
    );
}