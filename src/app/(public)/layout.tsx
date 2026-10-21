import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="">
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
        </div>
    );
}
