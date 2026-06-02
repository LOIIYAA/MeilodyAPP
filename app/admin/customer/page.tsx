"use client";

import { useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    PawPrint,
    Search,
    UserRound,
    Users,
} from "lucide-react";

import {
    AdminCustomer,
    formatAdminDate,
    getAdminCustomers,
} from "@/lib/admin_service";

export default function AdminCustomerPage() {
    const [customers, setCustomers] = useState<AdminCustomer[]>([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminCustomers();
            setCustomers(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal memuat data customer."
            );
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = useMemo(() => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) return customers;

        return customers.filter((customer) => {
            return (
                customer.id.toString().includes(keyword) ||
                customer.username.toLowerCase().includes(keyword) ||
                customer.email.toLowerCase().includes(keyword) ||
                customer.role.toLowerCase().includes(keyword)
            );
        });
    }, [customers, search]);

    const totalPets = useMemo(() => {
        return customers.reduce((total, customer) => {
            return total + (customer.pets?.length ?? 0);
        }, 0);
    }, [customers]);

    const totalBookings = useMemo(() => {
        return customers.reduce((total, customer) => {
            return total + (customer.bookings?.length ?? 0);
        }, 0);
    }, [customers]);

    return (
        <section className="space-y-8">
            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* HERO */}
            <div className="relative overflow-hidden rounded-3xl bg-[#013B09] p-8 text-white shadow-sm md:p-10">
                <Users className="absolute right-10 top-8 h-24 w-24 rotate-12 text-white/10" />
                <PawPrint className="absolute bottom-6 right-44 h-14 w-14 -rotate-12 text-white/10" />

                <div className="relative z-10">
                    <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-[#A7E8B0]">
                        Customer Management
                    </p>

                    <h1 className="text-3xl font-bold md:text-5xl">
                        Data Customer
                    </h1>

                    <p className="mt-4 max-w-2xl text-white/75">
                        Lihat semua akun customer yang terdaftar di MeiLody Paws.
                        Halaman ini bersifat read-only untuk monitoring admin.
                    </p>
                </div>
            </div>

            {/* SUMMARY */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <SummaryCard
                    title="Total Customer"
                    value={customers.length}
                    icon={<Users size={26} />}
                />

                <SummaryCard
                    title="Total Pet"
                    value={totalPets}
                    icon={<PawPrint size={26} />}
                />

                <SummaryCard
                    title="Total Booking"
                    value={totalBookings}
                    icon={<CalendarDays size={26} />}
                />
            </div>

            {/* SEARCH */}
            <div className="rounded-3xl border border-[#A7E8B0]/40 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-[#013B09]">
                            Daftar Customer
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Cari berdasarkan ID, username, email, atau role.
                        </p>
                    </div>

                    <div className="relative w-full md:max-w-sm">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Cari customer..."
                            className="h-12 w-full rounded-2xl border border-[#A7E8B0]/50 bg-[#F0FEF1] pl-11 pr-4 text-sm text-[#013B09] outline-none transition focus:border-[#013B09]"
                        />
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div className="rounded-3xl border border-[#A7E8B0]/40 bg-white p-6 shadow-sm">
                {loading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-16 animate-pulse rounded-2xl bg-[#F0FEF1]"
                            />
                        ))}
                    </div>
                ) : filteredCustomers.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-[#A7E8B0] bg-[#F0FEF1] p-10 text-center">
                        <Users className="mx-auto h-14 w-14 text-[#013B09]" />

                        <h3 className="mt-4 text-xl font-bold text-[#013B09]">
                            Customer tidak ditemukan
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            Coba gunakan keyword lain.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-212.5 border-separate border-spacing-y-3">
                            <thead>
                                <tr className="text-left text-sm text-gray-500">
                                    <th className="px-4 py-2">Customer</th>
                                    <th className="px-4 py-2">Email</th>
                                    <th className="px-4 py-2">Role</th>
                                    <th className="px-4 py-2">Total Pet</th>
                                    <th className="px-4 py-2">Total Booking</th>
                                    <th className="px-4 py-2">Bergabung</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredCustomers.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        className="bg-[#F0FEF1] text-sm"
                                    >
                                        <td className="rounded-l-2xl px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#013B09]">
                                                    <UserRound size={22} />
                                                </div>

                                                <div>
                                                    <p className="font-bold text-[#013B09]">
                                                        {customer.username}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        ID #{customer.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 text-gray-600">
                                            {customer.email}
                                        </td>

                                        <td className="px-4 py-4">
                                            <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                                {customer.role}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 font-semibold text-[#013B09]">
                                            {customer.pets?.length ?? 0}
                                        </td>

                                        <td className="px-4 py-4 font-semibold text-[#013B09]">
                                            {customer.bookings?.length ?? 0}
                                        </td>

                                        <td className="rounded-r-2xl px-4 py-4 text-gray-600">
                                            {formatAdminDate(
                                                customer.createdAt
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}

function SummaryCard({
    title,
    value,
    icon,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-3xl border border-[#A7E8B0]/40 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <h3 className="mt-2 text-4xl font-bold text-[#013B09]">
                        {value}
                    </h3>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0FEF1] text-[#013B09]">
                    {icon}
                </div>
            </div>
        </div>
    );
}
