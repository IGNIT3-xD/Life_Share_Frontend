import { cookies } from "next/headers";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { fetchMe, type MeUser } from "@/api/auth";

const getInitialUser = async (): Promise<MeUser | null> => {
    try {
        const cookieStore = await cookies();
        return await fetchMe(cookieStore.toString());
    } catch {
        return null;
    }
};

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const initialUser = await getInitialUser();

    return (
        <div className="">
            <Navbar initialUser={initialUser} />
            <div className="flex-1">{children}</div>
            <Footer />
        </div>
    );
}
