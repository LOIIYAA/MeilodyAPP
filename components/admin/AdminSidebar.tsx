"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    CalendarDays,
    LayoutDashboard,
    LogOut,
    PawPrint,
    Scissors,
    UserCircle,
    Users,
    X,
} from "lucide-react";
import { clearAuthSession } from "@/lib/authService";

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const mainMenus = [
    {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        label: "Grooming Package",
        href: "/admin/package",
        icon: Scissors,
    },
    {
        label: "Booking Management",
        href: "/admin/booking",
        icon: CalendarDays,
    },
];

const accountMenus = [
    {
        label: "Customer",
        href: "/admin/customer",
        icon: Users,
    },
    {
        label: "Profile Admin",
        href: "/admin/profile",
        icon: UserCircle,
    },
];

export default function AdminSidebar({
    isOpen,
    onClose,
}: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const isActive = (href: string) => {
        if (href === "/admin") {
            return pathname === "/admin";
        }

        return pathname.startsWith(href);
    };

    const handleNavigate = () => {
        if (typeof window !== "undefined" && window.innerWidth < 1024) {
            onClose();
        }
    };

    const handleLogout = () => {
        clearAuthSession();
        router.push("/auth/login");
    };

    return (
        <>
            {/* Overlay Mobile */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
                    isOpen
                        ? "opacity-100"
                        : "pointer-events-none opacity-0"
                }`}
            />

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-[#013B09] text-white shadow-2xl transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
                    <Link
                        href="/admin"
                        onClick={handleNavigate}
                        className="flex items-center gap-3"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#A7E8B0] text-[#013B09]">
                            <PawPrint size={27} />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold leading-none">
                                MeiLody
                            </h1>
                            <p className="mt-1 text-xs text-white/60">
                                Admin Panel
                            </p>
                        </div>
                    </Link>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl bg-white/10 p-2 text-white transition hover:bg-white/20"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Menu */}
                <div className="flex-1 overflow-y-auto px-5 py-6">
                    <div>
                        <p className="px-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                            Main Menu
                        </p>

                        <ul className="mt-4 space-y-2">
                            {mainMenus.map((menu) => {
                                const Icon = menu.icon;
                                const active = isActive(menu.href);

                                return (
                                    <li key={menu.href}>
                                        <Link
                                            href={menu.href}
                                            onClick={handleNavigate}
                                            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                                                active
                                                    ? "bg-[#A7E8B0] text-[#013B09]"
                                                    : "text-white/75 hover:bg-white/10 hover:text-white"
                                            }`}
                                        >
                                            <Icon size={19} />
                                            <span>{menu.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="mt-8">
                        <p className="px-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                            Account
                        </p>

                        <ul className="mt-4 space-y-2">
                            {accountMenus.map((menu) => {
                                const Icon = menu.icon;
                                const active = isActive(menu.href);

                                return (
                                    <li key={menu.href}>
                                        <Link
                                            href={menu.href}
                                            onClick={handleNavigate}
                                            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                                                active
                                                    ? "bg-[#A7E8B0] text-[#013B09]"
                                                    : "text-white/75 hover:bg-white/10 hover:text-white"
                                            }`}
                                        >
                                            <Icon size={19} />
                                            <span>{menu.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-white/10 p-5">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}