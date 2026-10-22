import Link from "next/link";
import Image from 'next/image'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <Link href="/" className="max-w-5xl mx-auto font-graphik py-10 flex items-center gap-3 shrink-0">
                <Image
                    src={"/logo-inv.svg"}
                    alt={"Logo"}
                    width={120}
                    height={120}
                    className="object-cover"
                />
            </Link>
            <div className="flex-1">{children}</div>
        </div>
    );
}
