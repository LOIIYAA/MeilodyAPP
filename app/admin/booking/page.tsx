"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    Eye,
    PawPrint,
    Search,
    Scissors,
    UserRound,
} from "lucide-react";

import {
    AdminBooking,
    formatAdminDate,
    formatAdminRupiah,
    getAdminBookings,
    getBookingStatusLabel,
    getBookingStatusStyle,
} from "@/lib/admin_service";

const STATUS_FILTERS = [
    { label: "Semua", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Paid", value: "paid" },
    { label: "Proses Grooming", value: "proses_grooming" },
    { label: "Completed", value: "completed" },
    { label: "Rejected", value: "reject" },
    { label: "Cancelled", value: "cancelled" },
];

export default function AdminBookingPage() {
    const [bookings, setBookings] = useState<AdminBooking[]>([]);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminBookings();
            setBookings(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal memuat data booking."
            );
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = useMemo(() => {
        const keyword = search.toLowerCase().trim();

        return bookings.filter((booking) => {
            // Filter by status
            if (activeFilter !== "all") {
                const bookingStatus = String(booking.status || "")
                    .toLowerCase()
                    .replace(/ /g, "_");
                const filterValue = activeFilter.toLowerCase();

                if (bookingStatus !== filterValue) return false;
            }

            // Filter by search keyword
            if (!keyword) return true;

            const ownerName =
                booking.user?.username ||
                booking.owner?.username ||
                `user ${booking.userId}`;

            const petName = booking.pet?.name || "";
            const petType = booking.pet?.type || "";
            const packageName = booking.package?.name || "";

            return (
                booking.id.toString().includes(keyword) ||
                booking.userId.toString().includes(keyword) ||
                booking.petId.toString().includes(keyword) ||
                booking.packageId.toString().includes(keyword) ||
                booking.status.toLowerCase().includes(keyword) ||
                booking.jam.toLowerCase().includes(keyword) ||
                ownerName.toLowerCase().includes(keyword) ||
                petName.toLowerCase().includes(keyword) ||
                petType.toLowerCase().includes(keyword) ||
                packageName.toLowerCase().includes(keyword)
            );
        });
    }, [bookings, search, activeFilter]);

    const summary = useMemo(() => {
        return {
            total: bookings.length,
            pending: bookings.filter((item) => item.status === "pending")
                .length,
            paid: bookings.filter((item) => item.status === "paid").length,
            proses: bookings.filter(
                (item) => item.status === "proses_grooming"
            ).length,
            completed: bookings.filter((item) => item.status === "completed")
                .length,
        };
    }, [bookings]);

    return (
        <section className="space-y-8">
            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* HERO */}
            <div className="relative overflow-hidden rounded-3xl bg-[#013B09] p-8 text-white shadow-sm md:p-10">
                <CalendarDays className="absolute right-10 top-8 h-24 w-24 rotate-12 text-white/10" />
                <PawPrint className="absolute bottom-6 right-44 h-14 w-14 -rotate-12 text-white/10" />

                <div className="relative z-10">
                    <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-[#A7E8B0]">
                        Booking Management
                    </p>

                    <h1 className="text-3xl font-bold md:text-5xl">
                        Kelola Booking Grooming
                    </h1>

                    <p className="mt-4 max-w-2xl text-white/75">
                        Pantau booking customer, cek detail pembayaran, dan
                        ubah status grooming dari dashboard admin.
                    </p>
                </div>
            </div>

            {/* SUMMARY */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
                <SummaryCard title="Total Booking" value={summary.total} />
                <SummaryCard title="Pending" value={summary.pending} />
                <SummaryCard title="Paid" value={summary.paid} />
                <SummaryCard title="On Progress" value={summary.proses} />
                <SummaryCard title="Completed" value={summary.completed} />
            </div>

            {/* SEARCH & FILTER */}
            <div className="rounded-3xl border border-[#A7E8B0]/40 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-[#013B09]">
                            Data Booking
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Cari berdasarkan ID, owner, pet, paket, jam, atau
                            status.
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
                            placeholder="Cari booking..."
                            className="h-12 w-full rounded-2xl border border-[#A7E8B0]/50 bg-[#F0FEF1] pl-11 pr-4 text-sm text-[#013B09] outline-none transition focus:border-[#013B09]"
                        />
                    </div>
                </div>

                {/* FILTER PILLS */}
                <div className="mt-4 flex flex-wrap gap-2">
                    {STATUS_FILTERS.map((filter) => {
                        const isActive = activeFilter === filter.value;

                        return (
                            <button
                                key={filter.value}
                                type="button"
                                onClick={() => setActiveFilter(filter.value)}
                                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                                    isActive
                                        ? "border-[#013B09] bg-[#013B09] text-white"
                                        : "border-[#A7E8B0] bg-[#F0FEF1] text-[#013B09] hover:border-[#013B09] hover:bg-white"
                                }`}
                            >
                                {filter.label}
                                {filter.value !== "all" && (
                                    <span className="ml-2 opacity-70">
                                        (
                                        {
                                            bookings.filter((b) => {
                                                const s = String(
                                                    b.status || ""
                                                )
                                                    .toLowerCase()
                                                    .replace(/ /g, "_");
                                                return (
                                                    s ===
                                                    filter.value.toLowerCase()
                                                );
                                            }).length
                                        }
                                        )
                                    </span>
                                )}
                                {filter.value === "all" && (
                                    <span className="ml-2 opacity-70">
                                        ({bookings.length})
                                    </span>
                                )}
                            </button>
                        );
                    })}
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
                ) : filteredBookings.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-[#A7E8B0] bg-[#F0FEF1] p-10 text-center">
                        <CalendarDays className="mx-auto h-14 w-14 text-[#013B09]" />

                        <h3 className="mt-4 text-xl font-bold text-[#013B09]">
                            Booking tidak ditemukan
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            {activeFilter !== "all"
                                ? `Tidak ada booking dengan status "${STATUS_FILTERS.find((f) => f.value === activeFilter)?.label}".`
                                : "Coba gunakan keyword lain."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-245 border-separate border-spacing-y-3">
                            <thead>
                                <tr className="text-left text-sm text-gray-500">
                                    <th className="px-4 py-2">Booking</th>
                                    <th className="px-4 py-2">Pet</th>
                                    <th className="px-4 py-2">Owner</th>
                                    <th className="px-4 py-2">Paket</th>
                                    <th className="px-4 py-2">Tanggal</th>
                                    <th className="px-4 py-2">Jam</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2">Total</th>
                                    <th className="px-4 py-2">Aksi</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredBookings.map((booking) => {
                                    const ownerName =
                                        booking.user?.username ||
                                        booking.owner?.username ||
                                        `User #${booking.userId}`;

                                    const ownerEmail =
                                        booking.user?.email ||
                                        booking.owner?.email ||
                                        "";

                                    const packagePrice =
                                        booking.package?.price ?? 0;

                                    return (
                                        <tr
                                            key={booking.id}
                                            className="bg-[#F0FEF1] text-sm"
                                        >
                                            <td className="rounded-l-2xl px-4 py-4 font-semibold text-[#013B09]">
                                                #{booking.id}
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#013B09]">
                                                        <PawPrint size={20} />
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold text-[#013B09]">
                                                            {booking.pet
                                                                ?.name || "-"}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {booking.pet
                                                                ?.type || "Pet"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <UserRound size={16} />
                                                    <div>
                                                        <p>{ownerName}</p>
                                                        {ownerEmail && (
                                                            <p className="text-xs text-gray-400">
                                                                {ownerEmail}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Scissors size={16} />
                                                    {booking.package?.name ||
                                                        `Package #${booking.packageId}`}
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 text-gray-600">
                                                {formatAdminDate(
                                                    booking.tanggal
                                                )}
                                            </td>

                                            <td className="px-4 py-4 text-gray-600">
                                                {booking.jam}
                                            </td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getBookingStatusStyle(
                                                        booking.status
                                                    )}`}
                                                >
                                                    {getBookingStatusLabel(
                                                        booking.status
                                                    )}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4 font-semibold text-[#013B09]">
                                                {formatAdminRupiah(
                                                    packagePrice
                                                )}
                                            </td>

                                            <td className="rounded-r-2xl px-4 py-4">
                                                <Link
                                                    href={`/admin/booking/${booking.id}`}
                                                    className="inline-flex items-center gap-2 rounded-xl bg-[#013B09] px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-900"
                                                >
                                                    <Eye size={15} />
                                                    Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}

function SummaryCard({ title, value }: { title: string; value: number }) {
    return (
        <div className="rounded-3xl border border-[#A7E8B0]/40 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">{title}</p>
            <h3 className="mt-2 text-4xl font-bold text-[#013B09]">
                {value}
            </h3>
        </div>
    );
}