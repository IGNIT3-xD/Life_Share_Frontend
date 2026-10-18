"use client";

import { useDashboard } from "@/contexts/DashboardContext";

const Page = () => {
    const { user } = useDashboard();
    const firstName = user.name.split(" ")[0];

    return (
        <div className="pt-16">
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-medium text-slate-900 tracking-tight">
                        Welcome Back, <span className="text-[#B15A36]">{firstName}</span>
                    </h1>
                </div>
            </header>
        </div>
    );
};

export default Page;