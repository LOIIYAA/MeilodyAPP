"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    CheckCircle2,
    Clock,
    PawPrint,
    Wallet,
} from "lucide-react";

import {
    CustomerBooking,
    CustomerPet,
    CustomerProfile,
    getBookingHistory,
    getCurrentBookings,
    getCustomerProfile,
    getMyPets,

} from "@/lib/Customer_Service"


const CUSTOMER_HERO_IMAGE = "/CustomerPhoto/CustomerHero.jpg";
const CUSTOMER_CTA_IMAGE = "/CustomerPhoto/CustomerCta.jpg";

function formatDate(date: string) {
    if (!date) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
}

function normalizeStatus(status: string) {
    return status.toLowerCase().replace(/_/g, " ");
}

function isActiveStatus(status: string) {
    const normalized = normalizeStatus(status);

    return (
        normalized === "pending" ||
        normalized === "paid" ||
        normalized === "on progress"
    );
}

function getStatusLabel(status: string) {
    const normalized = normalizeStatus(status);

    if (normalized === "pending") return "Menunggu Pembayaran";
    if (normalized === "paid") return "Paid";
    if (normalized === "on progress") return "Sedang Diproses";
    if (normalized === "completed") return "Selesai";
    if (normalized === "cancelled" || normalized === "canceled") {
        return "Dibatalkan";
    }

    return status;
}

function getStatusClass(status: string) {
    const normalized = normalizeStatus(status);

    if (normalized === "pending") return "bg-yellow-100 text-yellow-700";
    if (normalized === "paid") return "bg-green-100 text-green-700";
    if (normalized === "on progress") return "bg-blue-100 text-blue-700";
    if (normalized === "completed") return "bg-green-100 text-green-700";
    if (normalized === "cancelled" || normalized === "canceled") {
        return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-600";
}

function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
}: {
    title: string;
    value: number;
    subtitle: string;
    icon: React.ElementType;
}) {
    return (
        <div className="rounded-2xl border border-[#A7E8B0]/40 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0FEF1] text-[#013B09]">
                    <Icon size={24} />
                </div>

                <div>
                    <p className="text-sm text-gray-500">{title}</p>

                    <h3 className="mt-1 text-2xl font-bold text-[#013B09]">
                        {value}
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
                </div>
            </div>
        </div>
    );
}

export default function CustomerHomePage() {
    const [profile, setProfile] = useState<CustomerProfile | null>(null);
    const [pets, setPets] = useState<CustomerPet[]>([]);
    const [currentBookings, setCurrentBookings] = useState<CustomerBooking[]>(
        []
    );
    const [historyBookings, setHistoryBookings] = useState<CustomerBooking[]>(
        []
    );

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            const [
                profileResult,
                petsResult,
                currentResult,
                historyResult,
            ] = await Promise.allSettled([
                getCustomerProfile(),
                getMyPets(),
                getCurrentBookings(),
                getBookingHistory(),
            ]);

            if (profileResult.status === "fulfilled") {
                setProfile(profileResult.value);
            }

            if (petsResult.status === "fulfilled") {
                setPets(Array.isArray(petsResult.value) ? petsResult.value : []);
            }

            if (currentResult.status === "fulfilled") {
                setCurrentBookings(
                    Array.isArray(currentResult.value) ? currentResult.value : []
                );
            }

            if (historyResult.status === "fulfilled") {
                setHistoryBookings(
                    Array.isArray(historyResult.value) ? historyResult.value : []
                );
            }

            setLoading(false);
        };

        loadData();
    }, []);

    const activeBookings = useMemo(() => {
        if (currentBookings.length > 0) {
            return currentBookings;
        }

        return historyBookings.filter((booking) =>
            isActiveStatus(booking.status)
        );
    }, [currentBookings, historyBookings]);

    const completedCount = useMemo(() => {
        return historyBookings.filter(
            (booking) => normalizeStatus(booking.status) === "completed"
        ).length;
    }, [historyBookings]);

    const waitingPaymentCount = useMemo(() => {
        return activeBookings.filter(
            (booking) => normalizeStatus(booking.status) === "pending"
        ).length;
    }, [activeBookings]);

    if (loading) {
        return (
            <section className="mx-auto max-w-7xl px-5 py-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-56 rounded-3xl bg-white" />
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-5">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-28 rounded-2xl bg-white"
                            />
                        ))}
                    </div>
                    <div className="h-80 rounded-3xl bg-white" />
                </div>
            </section>
        );
    }

    return (
        <section className="mx-auto max-w-7xl px-5 py-8">
            {/* WELCOME */}
            <div className="relative overflow-hidden rounded-3xl border border-[#A7E8B0]/50 bg-white p-8 shadow-sm md:p-10">
                <PawPrint className="absolute right-10 top-8 h-20 w-20 rotate-12 text-[#A7E8B0]/40" />
                <PawPrint className="absolute bottom-6 right-44 h-12 w-12 -rotate-12 text-[#A7E8B0]/40" />

                <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    <div>
                        <p className="mb-3 inline-flex rounded-full bg-[#F0FEF1] px-4 py-2 text-sm font-semibold text-[#013B09]">
                            Customer Dashboard
                        </p>

                        <h1 className="text-3xl font-bold leading-tight text-[#013B09] md:text-5xl">
                            Welcome Back, {profile?.username || "Customer"} 👋
                        </h1>

                        <p className="mt-4 max-w-xl text-gray-600">
                            Yuk, pantau booking grooming anabul kesayanganmu dan
                            lanjutkan perawatan terbaik bersama MeiLody Paws.
                        </p>
                    </div>

                    {/* IMAGE SLOT */}
                    <div className="relative hidden h-56 overflow-hidden rounded-3xl bg-[#F0FEF1] lg:block">
                        <Image
                            src={CUSTOMER_HERO_IMAGE}
                            alt="Customer MeiLody Paws"
                            fill
                            priority
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* SUMMARY */}
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
                <StatCard
                    title="Total Pet"
                    value={pets.length}
                    subtitle="Pet terdaftar"
                    icon={PawPrint}
                />

                <StatCard
                    title="Total Booking"
                    value={
                        historyBookings.length > 0
                            ? historyBookings.length
                            : activeBookings.length
                    }
                    subtitle="Semua booking"
                    icon={CalendarDays}
                />

                <StatCard
                    title="Sedang Berjalan"
                    value={activeBookings.length}
                    subtitle="Booking aktif"
                    icon={Clock}
                />

                <StatCard
                    title="Menunggu Pembayaran"
                    value={waitingPaymentCount}
                    subtitle="Perlu diselesaikan"
                    icon={Wallet}
                />

                <StatCard
                    title="Selesai"
                    value={completedCount}
                    subtitle="Grooming selesai"
                    icon={CheckCircle2}
                />
            </div>

            {/* CURRENT BOOKING */}
            <div className="mt-8 rounded-3xl border border-[#A7E8B0]/40 bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-[#013B09]">
                            Booking yang Sedang Berjalan
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Pantau status grooming yang masih aktif.
                        </p>
                    </div>

                    <Link
                        href="/customer/history"
                        className="text-sm font-semibold text-[#013B09] hover:text-[#F96302]"
                    >
                        Lihat Semua
                    </Link>
                </div>

                {activeBookings.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#A7E8B0] bg-[#F0FEF1] px-6 py-10 text-center">
                        <PawPrint className="mx-auto h-12 w-12 text-[#013B09]" />

                        <h3 className="mt-4 text-lg font-bold text-[#013B09]">
                            Belum ada booking aktif
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            Mulai booking grooming untuk anabul kesayanganmu.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-212.5 border-collapse">
                            <thead>
                                <tr className="border-b text-left text-sm text-gray-500">
                                    <th className="px-4 py-3">No</th>
                                    <th className="px-4 py-3">Pet</th>
                                    <th className="px-4 py-3">Paket</th>
                                    <th className="px-4 py-3">Tanggal</th>
                                    <th className="px-4 py-3">Jam</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {activeBookings.slice(0, 5).map(
                                    (booking, index) => (
                                        <tr
                                            key={booking.id}
                                            className="border-b text-sm last:border-none hover:bg-[#F0FEF1]/60"
                                        >
                                            <td className="px-4 py-4 text-gray-500">
                                                {index + 1}
                                            </td>

                                            <td className="px-4 py-4">
                                                <p className="font-semibold text-[#013B09]">
                                                    {booking.pet?.name || "-"}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {booking.pet?.type || "-"}
                                                </p>
                                            </td>

                                            <td className="px-4 py-4 text-gray-600">
                                                {booking.package?.name || "-"}
                                            </td>

                                            <td className="px-4 py-4 text-gray-600">
                                                {formatDate(booking.tanggal)}
                                            </td>

                                            <td className="px-4 py-4 text-gray-600">
                                                {booking.jam}
                                            </td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                                                        booking.status
                                                    )}`}
                                                >
                                                    {getStatusLabel(
                                                        booking.status
                                                    )}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4 text-right">
                                                <Link
                                                    href="/customer/history"
                                                    className="rounded-xl border border-[#013B09] px-4 py-2 text-xs font-semibold text-[#013B09] transition hover:bg-[#013B09] hover:text-white"
                                                >
                                                    Lihat Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* CTA */}
            <div className="relative mt-8 overflow-hidden rounded-3xl bg-[#013B09] p-8 shadow-sm md:p-10">
                <PawPrint className="absolute left-6 top-6 h-20 w-20 rotate-12 text-white/10" />
                <PawPrint className="absolute right-10 bottom-8 h-16 w-16 -rotate-12 text-white/10" />

                <div className="relative z-10 grid grid-cols-1 items-center gap-8 md:grid-cols-[1.3fr_0.7fr]">
                    <div>
                        <p className="mb-2 text-sm font-semibold text-[#A7E8B0]">
                            Booking Grooming
                        </p>

                        <h2 className="text-2xl font-bold text-white md:text-3xl">
                            Saatnya anabul tampil bersih dan wangi!
                        </h2>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
                            Pilih pet, pilih paket grooming, tentukan tanggal dan jam,
                            lalu upload bukti pembayaran untuk menunggu verifikasi admin.
                        </p>

                        <Link
                            href="/customer/booking"
                            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F96302] px-6 py-4 font-semibold text-white transition hover:bg-orange-600"
                        >
                            <CalendarDays size={20} />
                            Booking Grooming Sekarang
                        </Link>
                    </div>

                    {/* IMAGE SLOT */}
                    <div className="relative hidden h-52 md:block rounded-2xl overflow-hidden">
                        <Image
                            src={CUSTOMER_CTA_IMAGE}
                            alt="Booking grooming MeiLody Paws"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        
        </section>
    );
}