import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
        </div>
    );
}