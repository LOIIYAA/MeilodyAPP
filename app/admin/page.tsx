"use client";

import { useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    CreditCard,
    PawPrint,
    Scissors,
    Users,
} from "lucide-react";

import {
    AdminBooking,
    DashboardSummary,
    formatAdminDate,
    formatAdminRupiah,
    getAdminBookings,
    getAdminDashboard,
    getBookingStatusLabel,
    getBookingStatusStyle,
} from "@/lib/admin_service";

export default function AdminDashboardPage() {
    const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
    const [bookings, setBookings] = useState<AdminBooking[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError("");

            const dashboardData = await getAdminDashboard();
            setDashboard(dashboardData);

            try {
                const bookingData = await getAdminBookings();
                setBookings(Array.isArray(bookingData) ? bookingData : []);
            } catch {
                setBookings([]);
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal memuat dashboard admin."
            );
        } finally {
            setLoading(false);
        }
    };

    const todayBookings = useMemo(() => {
        const today = new Date().toISOString().slice(0, 10);

        return bookings.filter((booking) => {
            if (!booking.tanggal) return false;

            return new Date(booking.tanggal).toISOString().slice(0, 10) === today;
        });
    }, [bookings]);

    const prosesGroomingCount = useMemo(() => {
        return bookings.filter(
            (booking) => booking.status === "proses_grooming"
        ).length;
    }, [bookings]);

    const paidCount = useMemo(() => {
        return bookings.filter((booking) => booking.status === "paid").length;
    }, [bookings]);

    const recentBookings = useMemo(() => {
        return [...bookings]
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            )
            .slice(0, 5);
    }, [bookings]);

    const stats = [
        {
            title: "Total User",
            value: dashboard?.totalUser ?? 0,
            desc: "Customer terdaftar",
            icon: Users,
            color: "bg-blue-50 text-blue-700",
        },
        {
            title: "Total Pet",
            value: dashboard?.totalPet ?? 0,
            desc: "Pet terdaftar",
            icon: PawPrint,
            color: "bg-green-50 text-green-700",
        },
        {
            title: "Total Booking",
            value: dashboard?.totalBooking ?? 0,
            desc: "Semua booking grooming",
            icon: CalendarDays,
            color: "bg-orange-50 text-orange-700",
        },
        {
            title: "Total Transaksi",
            value: dashboard?.totalTransaksi ?? 0,
            desc: "Pembayaran masuk",
            icon: CreditCard,
            color: "bg-purple-50 text-purple-700",
        },
    ];

    const bookingStats = [
        {
            title: "Booking Hari Ini",
            value: todayBookings.length,
            desc: "Jadwal grooming hari ini",
            icon: CalendarDays,
        },
        {
            title: "Pending Approval",
            value: dashboard?.pendingBooking ?? 0,
            desc: "Butuh approve admin",
            icon: Clock3,
        },
        {
            title: "Paid",
            value: paidCount,
            desc: "Pembayaran diterima",
            icon: CreditCard,
        },
        {
            title: "On Progress",
            value: prosesGroomingCount,
            desc: "Sedang proses grooming",
            icon: Scissors,
        },
        {
            title: "Completed",
            value: dashboard?.completedBooking ?? 0,
            desc: "Grooming selesai",
            icon: CheckCircle2,
        },
    ];

    if (loading) {
        return (
            <section className="space-y-6">
                <div className="h-48 animate-pulse rounded-3xl bg-white" />

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-36 animate-pulse rounded-3xl bg-white"
                        />
                    ))}
                </div>

                <div className="h-96 animate-pulse rounded-3xl bg-white" />
            </section>
        );
    }

    return (
        <section className="space-y-8">
            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* HERO DASHBOARD */}
            <div className="relative overflow-hidden rounded-3xl bg-[#013B09] p-8 text-white shadow-sm md:p-10">
                <PawPrint className="absolute right-10 top-8 h-24 w-24 rotate-12 text-white/10" />
                <PawPrint className="absolute bottom-6 right-44 h-14 w-14 -rotate-12 text-white/10" />

                <div className="relative z-10">
                    <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-[#A7E8B0]">
                        Admin Dashboard
                    </p>

                    <h1 className="text-3xl font-bold md:text-5xl">
                        Welcome Back, Admin 👋
                    </h1>

                    <p className="mt-4 max-w-2xl text-white/75">
                        Monitor aktivitas grooming, booking, transaksi, dan data
                        customer MeiLody Paws dari satu dashboard.
                    </p>
                </div>
            </div>

            {/* MAIN SUMMARY */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="rounded-3xl border border-[#A7E8B0]/40 bg-white p-6 shadow-sm"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        {item.title}
                                    </p>

                                    <h2 className="mt-2 text-4xl font-bold text-[#013B09]">
                                        {item.value}
                                    </h2>

                                    <p className="mt-2 text-sm text-gray-500">
                                        {item.desc}
                                    </p>
                                </div>

                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color}`}
                                >
                                    <Icon size={23} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* BOOKING STATUS */}
            <div className="rounded-3xl border border-[#A7E8B0]/40 bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-[#013B09]">
                            Ringkasan Booking
                        </h2>

                        <p className="text-sm text-gray-500">
                            Pantau booking berdasarkan status operasional.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                    {bookingStats.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.title}
                                className="rounded-3xl bg-[#F0FEF1] p-5"
                            >
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#013B09]">
                                    <Icon size={22} />
                                </div>

                                <h3 className="mt-4 text-3xl font-bold text-[#013B09]">
                                    {item.value}
                                </h3>

                                <p className="mt-1 text-sm font-semibold text-[#013B09]">
                                    {item.title}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    {item.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* RECENT BOOKING */}
            <div className="rounded-3xl border border-[#A7E8B0]/40 bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-[#013B09]">
                            Booking Terbaru
                        </h2>

                        <p className="text-sm text-gray-500">
                            Data terbaru dari booking customer.
                        </p>
                    </div>
                </div>

                {recentBookings.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-[#A7E8B0] bg-[#F0FEF1] p-10 text-center">
                        <PawPrint className="mx-auto h-12 w-12 text-[#013B09]" />

                        <h3 className="mt-4 text-xl font-bold text-[#013B09]">
                            Belum ada booking terbaru
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            Data booking akan muncul setelah customer melakukan
                            pemesanan grooming.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-212.5 border-separate border-spacing-y-3">
                            <thead>
                                <tr className="text-left text-sm text-gray-500">
                                    <th className="px-4 py-2">Booking</th>
                                    <th className="px-4 py-2">Pet</th>
                                    <th className="px-4 py-2">Owner</th>
                                    <th className="px-4 py-2">Paket</th>
                                    <th className="px-4 py-2">Jadwal</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2">Total</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentBookings.map((booking) => {
                                    const ownerName =
                                        booking.user?.username ||
                                        booking.owner?.username ||
                                        "-";

                                    const packageName =
                                        booking.package?.name || "-";

                                    const packagePrice =
                                        booking.package?.price ?? 0;

                                    return (
                                        <tr
                                            key={booking.id}
                                            className="rounded-2xl bg-[#F0FEF1] text-sm"
                                        >
                                            <td className="rounded-l-2xl px-4 py-4 font-semibold text-[#013B09]">
                                                #{booking.id}
                                            </td>

                                            <td className="px-4 py-4">
                                                <div>
                                                    <p className="font-semibold text-[#013B09]">
                                                        {booking.pet?.name ||
                                                            "-"}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {booking.pet?.type ||
                                                            "Pet"}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 text-gray-600">
                                                {ownerName}
                                            </td>

                                            <td className="px-4 py-4 text-gray-600">
                                                {packageName}
                                            </td>

                                            <td className="px-4 py-4 text-gray-600">
                                                <p>
                                                    {formatAdminDate(
                                                        booking.tanggal
                                                    )}
                                                </p>
                                                <p className="text-xs">
                                                    {booking.jam}
                                                </p>
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

                                            <td className="rounded-r-2xl px-4 py-4 font-semibold text-[#013B09]">
                                                {formatAdminRupiah(packagePrice)}
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