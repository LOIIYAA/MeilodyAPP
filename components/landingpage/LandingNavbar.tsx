"use client";

import Link from "next/link";

export default function LandingNavbar() {
    return (
        <nav className="w-full fixed top-0 left-0 z-50 bg-white shadow">
            <div className="max-w-7xl mx-auto flex items-center justify-between p-6">
                <div className="text-xl font-bold text-[#013B09]">
                    MeiLody Paws
                </div>

                <ul className="flex gap-6 items-center">
                    <li>
                        <Link
                            href="/"
                            className="hover:text-[#F96302] transition"
                        >
                            Home
                        </Link>
                    </li>

                    <li>
                        <Link
                            href="/#service"
                            className="hover:text-[#F96302] transition"
                        >
                            Service
                        </Link>
                    </li>

                    <li>
                        <Link
                            href="/team"
                            className="hover:text-[#F96302] transition"
                        >
                            Team
                        </Link>
                    </li>

                    <li>
                        <Link
                            href="/about"
                            className="hover:text-[#F96302] transition"
                        >
                            About
                        </Link>
                    </li>
                </ul>

                <Link
                    href="/auth/login"
                    className="px-4 py-2 bg-[#F96302] text-white rounded-lg hover:bg-orange-600 transition"
                >
                    Booking Sekarang
                </Link>
            </div>
        </nav>
    );
}