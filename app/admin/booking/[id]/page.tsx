"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    CreditCard,
    PawPrint,
    Scissors,
    UserRound,
    XCircle,
} from "lucide-react";

import {
    AdminBooking,
    AdminTransaction,
    BookingStatus,
    formatAdminDate,
    formatAdminRupiah,
    getAdminBookingById,
    getAdminTransactions,
    getBookingStatusLabel,
    getBookingStatusStyle,
    updateAdminBookingStatus,
} from "@/lib/admin_service";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function AdminBookingDetailPage() {
    const params = useParams();
    const bookingId = params.id as string;

    const [booking, setBooking] = useState<AdminBooking | null>(null);
    const [transactions, setTransactions] = useState<AdminTransaction[]>([]);

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (bookingId) {
            fetchDetail();
        }
    }, [bookingId]);

    const fetchDetail = async () => {
        try {
            setLoading(true);
            setError("");

            const bookingData = await getAdminBookingById(bookingId);
            setBooking(bookingData);

            try {
                const transactionData = await getAdminTransactions();
                setTransactions(
                    Array.isArray(transactionData) ? transactionData : []
                );
            } catch {
                setTransactions([]);
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal memuat detail booking."
            );
        } finally {
            setLoading(false);
        }
    };

    const transaction = useMemo(() => {
        if (!booking) return null;

        if (booking.transaction) return booking.transaction;

        if (Array.isArray(booking.transaksi) && booking.transaksi.length > 0) {
            return booking.transaksi[0];
        }

        return (
            transactions.find(
                (item) => Number(item.bookingId) === Number(booking.id)
            ) || null
        );
    }, [booking, transactions]);

    const proofImage = useMemo(() => {
        const rawProof = transaction?.proofUrl || transaction?.proof;

        if (!rawProof) return "";

        const cleanProof = String(rawProof).replace(/\\/g, "/");

        if (cleanProof.startsWith("http")) return cleanProof;

        if (cleanProof.startsWith("/")) {
            return `${API_BASE_URL.replace(/\/$/, "")}${cleanProof}`;
        }

        return `${API_BASE_URL.replace(/\/$/, "")}/${cleanProof}`;
    }, [transaction]);

    const handleUpdateStatus = async (status: BookingStatus) => {
        if (!booking) return;

        try {
            setUpdating(true);
            setError("");
            setSuccessMessage("");

            const updatedBooking = await updateAdminBookingStatus(booking.id, {
                status,
            });

            setBooking((prev) => {
                if (!prev) return updatedBooking;

                return {
                    ...prev,
                    ...updatedBooking,
                    pet: updatedBooking.pet ?? prev.pet,
                    package: updatedBooking.package ?? prev.package,
                    user: updatedBooking.user ?? prev.user,
                    owner: updatedBooking.owner ?? prev.owner,
                    transaksi: updatedBooking.transaksi ?? prev.transaksi,
                    transaction:
                        updatedBooking.transaction ?? prev.transaction,
                };
            });

            setSuccessMessage("Status booking berhasil diperbarui.");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal memperbarui status booking."
            );
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <section className="space-y-6">
                <div className="h-12 w-48 animate-pulse rounded-2xl bg-white" />
                <div className="h-80 animate-pulse rounded-3xl bg-white" />
                <div className="h-96 animate-pulse rounded-3xl bg-white" />
            </section>
        );
    }

    if (!booking) {
        return (
            <section className="space-y-6">
                <Link
                    href="/admin/booking"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#013B09] hover:text-[#F96302]"
                >
                    <ArrowLeft size={18} />
                    Kembali ke Booking
                </Link>

                <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
                    <CalendarDays className="mx-auto h-14 w-14 text-[#013B09]" />

                    <h1 className="mt-4 text-2xl font-bold text-[#013B09]">
                        Booking tidak ditemukan
                    </h1>
                </div>
            </section>
        );
    }

    const ownerName =
        booking.user?.username ||
        booking.owner?.username ||
        `User #${booking.userId}`;

    const ownerEmail =
        booking.user?.email || booking.owner?.email || "Email tidak tersedia";

    const totalPrice = booking.package?.price ?? transaction?.total ?? 0;

    return (
        <section className="space-y-8">
            <Link
                href="/admin/booking"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#013B09] hover:text-[#F96302]"
            >
                <ArrowLeft size={18} />
                Kembali ke Booking Management
            </Link>

            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
                    {successMessage}
                </div>
            )}

            {/* HERO */}
            <div className="relative overflow-hidden rounded-3xl bg-[#013B09] p-8 text-white shadow-sm md:p-10">
                <CalendarDays className="absolute right-10 top-8 h-24 w-24 rotate-12 text-white/10" />

                <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-[#A7E8B0]">
                            Booking Detail
                        </p>

                        <h1 className="text-3xl font-bold md:text-5xl">
                            Booking #{booking.id}
                        </h1>

                        <p className="mt-4 max-w-2xl text-white/75">
                            Review detail booking, cek bukti pembayaran, dan
                            update status grooming customer.
                        </p>
                    </div>

                    <span
                        className={`inline-flex w-fit rounded-full border px-4 py-2 text-sm font-semibold ${getBookingStatusStyle(
                            booking.status
                        )}`}
                    >
                        {getBookingStatusLabel(booking.status)}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                {/* DETAIL DATA */}
                <div className="rounded-3xl border border-[#A7E8B0]/40 bg-white p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-[#013B09]">
                        Informasi Booking
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Data lengkap booking grooming customer.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InfoCard
                            icon={<PawPrint size={22} />}
                            label="Nama Pet"
                            value={booking.pet?.name || `Pet #${booking.petId}`}
                            desc={booking.pet?.type || "Pet"}
                        />

                        <InfoCard
                            icon={<UserRound size={22} />}
                            label="Owner"
                            value={ownerName}
                            desc={ownerEmail}
                        />

                        <InfoCard
                            icon={<Scissors size={22} />}
                            label="Paket Grooming"
                            value={
                                booking.package?.name ||
                                `Package #${booking.packageId}`
                            }
                            desc={
                                booking.package?.description ||
                                "Paket grooming"
                            }
                        />

                        <InfoCard
                            icon={<CreditCard size={22} />}
                            label="Total Pembayaran"
                            value={formatAdminRupiah(totalPrice)}
                            desc="Total dari package / transaksi"
                        />

                        <InfoCard
                            icon={<CalendarDays size={22} />}
                            label="Tanggal"
                            value={formatAdminDate(booking.tanggal)}
                            desc="Tanggal booking"
                        />

                        <InfoCard
                            icon={<Clock3 size={22} />}
                            label="Jam"
                            value={booking.jam}
                            desc="Slot grooming"
                        />
                    </div>

                    <div className="mt-6 rounded-3xl bg-[#F0FEF1] p-5">
                        <p className="text-sm font-semibold text-[#013B09]">
                            Deskripsi Paket
                        </p>

                        <p className="mt-2 text-sm leading-relaxed text-gray-600">
                            {booking.package?.description ||
                                "Tidak ada deskripsi paket."}
                        </p>
                    </div>
                </div>

                {/* PAYMENT PROOF */}
                <div className="rounded-3xl border border-[#A7E8B0]/40 bg-white p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-[#013B09]">
                        Bukti Pembayaran
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Preview bukti pembayaran dari customer.
                    </p>

                    <div className="mt-6">
                        {proofImage ? (
                            <div className="flex h-80 items-center justify-center overflow-hidden rounded-3xl border border-[#A7E8B0]/40 bg-[#F0FEF1]">
                                <img
                                    src={proofImage}
                                    alt="Bukti pembayaran"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                        ) : (
                            <div className="flex h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-[#A7E8B0] bg-[#F0FEF1] text-center">
                                <CreditCard className="h-14 w-14 text-[#013B09]" />

                                <h3 className="mt-4 text-xl font-bold text-[#013B09]">
                                    Belum ada bukti pembayaran
                                </h3>

                                <p className="mt-2 max-w-sm text-sm text-gray-500">
                                    Bukti pembayaran akan muncul setelah customer
                                    upload transaksi.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-5 rounded-3xl bg-[#F0FEF1] p-5">
                        <p className="text-xs text-gray-500">
                            Status Transaksi
                        </p>

                        <p className="mt-1 text-lg font-bold text-[#013B09]">
                            {transaction?.status || "Belum tersedia"}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Booking ID #{booking.id}
                        </p>
                    </div>
                </div>
            </div>

            {/* ACTION */}
            <div className="rounded-3xl border border-[#A7E8B0]/40 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-[#013B09]">
                    Aksi Status Booking
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Gunakan tombol ini untuk memproses status booking customer.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                    <button
                        type="button"
                        disabled={updating}
                        onClick={() => handleUpdateStatus("paid")}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 py-4 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <CreditCard size={18} />
                        Set Paid
                    </button>

                    <button
                        type="button"
                        disabled={updating}
                        onClick={() =>
                            handleUpdateStatus("proses_grooming")
                        }
                        className="flex items-center justify-center gap-2 rounded-2xl bg-[#F96302] px-4 py-4 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <Scissors size={18} />
                        Start Grooming
                    </button>

                    <button
                        type="button"
                        disabled={updating}
                        onClick={() => handleUpdateStatus("completed")}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-4 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <CheckCircle2 size={18} />
                        Mark Completed
                    </button>

                    <button
                        type="button"
                        disabled={updating}
                        onClick={() => handleUpdateStatus("reject")}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-4 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <XCircle size={18} />
                        Reject
                    </button>
                </div>

                {updating && (
                    <p className="mt-4 text-sm font-semibold text-gray-500">
                        Memperbarui status...
                    </p>
                )}
            </div>
        </section>
    );
}

function InfoCard({
    icon,
    label,
    value,
    desc,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    desc?: string;
}) {
    return (
        <div className="rounded-3xl bg-[#F0FEF1] p-5">
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#013B09]">
                    {icon}
                </div>

                <div>
                    <p className="text-xs text-gray-500">{label}</p>

                    <p className="mt-1 text-lg font-bold text-[#013B09]">
                        {value}
                    </p>

                    {desc && (
                        <p className="mt-1 text-xs text-gray-500">{desc}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
