"use client";

import { ReactNode, useEffect, useState } from "react";
import { Menu } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const handleInitialSize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        handleInitialSize();

        window.addEventListener("resize", handleInitialSize);

        return () => {
            window.removeEventListener("resize", handleInitialSize);
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#F0FEF1] text-[#013B09]">
            {/* Tombol buka sidebar */}
            <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className={`fixed left-5 top-5 z-60 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#013B09] shadow-md transition hover:bg-[#A7E8B0] ${
                    sidebarOpen ? "lg:hidden" : ""
                }`}
            >
                <Menu size={24} />
            </button>

            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <main
                className={`min-h-screen transition-all duration-300 ${
                    sidebarOpen ? "lg:pl-72" : "lg:pl-0"
                }`}
            >
                <div className="px-5 pb-8 pt-24 md:px-8 lg:pt-8">
                    {children}
                </div>
            </main>
        </div>
    );
}