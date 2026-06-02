"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    CalendarDays,
    ChevronDown,
    History,
    Home,
    LogOut,
    Menu,
    PawPrint,
    UserCircle,
    X,
} from "lucide-react";
import { clearAuthSession } from "@/lib/authService";

const menus = [
    {
        label: "Home",
        href: "/customer",
        icon: Home,
    },
    {
        label: "Pet",
        href: "/customer/pet",
        icon: PawPrint,
    },
    {
        label: "Booking",
        href: "/customer/booking",
        icon: CalendarDays,
    },
    {
        label: "History",
        href: "/customer/history",
        icon: History,
    },
    {
        label: "Profile",
        href: "/customer/profile",
        icon: UserCircle,
    },
];

export default function CustomerNavbar() {
    const pathname = usePathname();
    const router = useRouter();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [username, setUsername] = useState("Customer");

    useEffect(() => {
        const savedUser = localStorage.getItem("meilody_user");

        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                setUsername(user.username || "Customer");
            } catch {
                setUsername("Customer");
            }
        }
    }, []);

    const handleLogout = () => {
        clearAuthSession();
        router.push("/auth/login");
    };

    return (
        <header className="sticky top-0 z-50 border-b border-[#A7E8B0]/40 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
                <Link href="/customer" className="flex items-center gap-3">
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#F0FEF1]">
                        <PawPrint className="h-7 w-7 text-[#013B09]" />
                        <span className="absolute bottom-2 right-2 h-2.5 w-2.5 rounded-full bg-[#F96302]" />
                    </div>

                    <span className="text-xl font-bold text-[#013B09]">
                        MeiLody <span className="text-[#F96302]">Paws</span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-8 lg:flex">
                    {menus.map((menu) => {
                        const Icon = menu.icon;

                        const active =
                            menu.href === "/customer"
                                ? pathname === "/customer"
                                : pathname.startsWith(menu.href);

                        return (
                            <Link
                                key={menu.href}
                                href={menu.href}
                                className={`relative flex items-center gap-2 text-sm font-semibold transition ${active
                                        ? "text-[#013B09]"
                                        : "text-gray-500 hover:text-[#013B09]"
                                    }`}
                            >
                                <Icon size={18} />
                                {menu.label}

                                {active && (
                                    <span className="absolute -bottom-6 left-0 h-1 w-full rounded-full bg-[#013B09]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="relative hidden lg:block">
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-3 rounded-full bg-[#F0FEF1] px-3 py-2"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#013B09] text-sm font-bold text-white">
                            {username.charAt(0).toUpperCase()}
                        </div>

                        <span className="text-sm font-semibold text-[#013B09]">
                            {username}
                        </span>

                        <ChevronDown size={16} />
                    </button>

                    {profileOpen && (
                        <div className="absolute right-0 mt-3 w-44 rounded-2xl bg-white p-2 shadow-xl">
                            <Link
                                href="/customer/profile"
                                className="block rounded-xl px-4 py-2 text-sm text-gray-600 hover:bg-[#F0FEF1]"
                            >
                                Profile
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-2 rounded-xl px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="rounded-xl bg-[#F0FEF1] p-2 text-[#013B09] lg:hidden"
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {mobileOpen && (
                <div className="border-t border-[#A7E8B0]/40 bg-white px-5 py-4 lg:hidden">
                    <div className="space-y-2">
                        {menus.map((menu) => {
                            const Icon = menu.icon;

                            const active =
                                menu.href === "/customer"
                                    ? pathname === "/customer"
                                    : pathname.startsWith(menu.href);

                            return (
                                <Link
                                    key={menu.href}
                                    href={menu.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${active
                                            ? "bg-[#F0FEF1] text-[#013B09]"
                                            : "text-gray-600"
                                        }`}
                                >
                                    <Icon size={18} />
                                    {menu.label}
                                </Link>
                            );
                        })}

                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}