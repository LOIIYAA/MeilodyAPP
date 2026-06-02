"use client";

import type { ReactNode } from "react";
import {
    CalendarDays,
    Clock3,
    CreditCard,
    Download,
    Eye,
    PawPrint,
    Scissors,
    XCircle,
} from "lucide-react";

import {
    CustomerBooking,
    CustomerTransaction,
    formatDateIndonesia,
    formatRupiah,
    getBookingTotal,
} from "@/lib/Customer_Service";

import {
    BookingStatusBadge,
    PaymentStatusBadge,
} from "./HistoryShared";

interface HistoryBookingCardProps {
    booking?: CustomerBooking | null;
    transaction?: CustomerTransaction | null;
    onCancel?: (bookingId: number) => void;
    cancellingId?: number | null;
    onUploadProof?: (booking: CustomerBooking, file: File) => Promise<void>;
    uploadingId?: number | null;
}

function canCancelBooking(status?: string | null) {
    const normalized = String(status || "").toLowerCase();

    return normalized === "pending" || normalized === "paid";
}

export default function HistoryBookingCard({
    booking,
    transaction,
    onCancel,
    cancellingId = null,
    onUploadProof,
    uploadingId = null,
}: HistoryBookingCardProps) {
    if (!booking || !booking.id) {
        return null;
    }

    const bookingId = booking.id;

    const total = transaction?.total ?? getBookingTotal(booking);

    const proofUrl = transaction?.proofUrl || transaction?.proof || "";
    const hasProof = Boolean(proofUrl);

    const bookingStatus = String(booking.status || "").toLowerCase();

    const paymentVerified =
        bookingStatus === "paid" ||
        bookingStatus === "proses_grooming" ||
        bookingStatus === "on_progress" ||
        bookingStatus === "on progress" ||
        bookingStatus === "completed" ||
        transaction?.status === "paid";

    const paymentStatus =
        transaction?.status || (hasProof ? "pending" : undefined);

    const isCancelling = cancellingId === bookingId;
    const isUploading = uploadingId === bookingId;

    const showUploadButton = Boolean(onUploadProof) && !hasProof;
    const showCancelButton =
        Boolean(onCancel) && canCancelBooking(booking.status);

    const petName = booking.pet?.name || `Pet #${booking.petId || "-"}`;
    const petType = booking.pet?.type || "Pet Grooming";

    const packageName =
        booking.package?.name || `Package #${booking.packageId || "-"}`;

    return (
        <div className="rounded-3xl border border-[#A7E8B0]/40 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F0FEF1] text-[#013B09]">
                        <PawPrint size={28} />
                    </div>

                    <div>
                        <p className="text-xs font-semibold text-[#F96302]">
                            Booking #{bookingId}
                        </p>

                        <h3 className="text-xl font-bold text-[#013B09]">
                            {petName}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            {petType}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <BookingStatusBadge status={booking.status} />
                    <PaymentStatusBadge status={paymentStatus} />
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <InfoItem
                    icon={<Scissors size={20} />}
                    label="Paket"
                    value={packageName}
                />

                <InfoItem
                    icon={<CalendarDays size={20} />}
                    label="Tanggal"
                    value={formatDateIndonesia(booking.tanggal)}
                />

                <InfoItem
                    icon={<Clock3 size={20} />}
                    label="Jam"
                    value={booking.jam || "-"}
                />

                <InfoItem
                    icon={<CreditCard size={20} />}
                    label="Total"
                    value={formatRupiah(total)}
                    highlight
                />
            </div>

            <div className="mt-5 rounded-2xl bg-[#F0FEF1] p-4">
                <p className="text-xs text-gray-500">Status Payment</p>

                <p className="mt-1 text-sm font-semibold text-[#013B09]">
                    {transaction
                        ? `Transaksi #${transaction.id}`
                        : "Belum ada data transaksi / bukti pembayaran"}
                </p>

                {hasProof ? (
                    <p className="mt-1 text-xs text-gray-500">
                        Bukti pembayaran sudah diupload.{" "}
                        {paymentVerified
                            ? "Pembayaran sudah diverifikasi admin."
                            : "Menunggu verifikasi admin."}
                    </p>
                ) : (
                    <p className="mt-1 text-xs text-gray-500">
                        Bukti pembayaran belum tersedia. Silakan upload bukti
                        pembayaran.
                    </p>
                )}
            </div>

            {showUploadButton && (
                <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-[#A7E8B0] bg-[#F0FEF1] px-5 py-4 text-sm font-semibold text-[#013B09] transition hover:bg-white">
                    <CreditCard size={18} />

                    {isUploading
                        ? "Mengupload bukti..."
                        : "Upload Bukti Pembayaran"}

                    <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        disabled={isUploading}
                        onChange={async (event) => {
                            const file = event.target.files?.[0];

                            if (!file || !onUploadProof) return;

                            await onUploadProof(booking, file);

                            event.target.value = "";
                        }}
                    />
                </label>
            )}

            {hasProof && transaction && (
                <div className="mt-5 rounded-2xl border border-[#A7E8B0]/50 bg-white p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm font-bold text-[#013B09]">
                                Detail Transaksi
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                {paymentVerified
                                    ? "Pembayaran sudah diverifikasi admin."
                                    : "Bukti pembayaran sudah diupload dan menunggu verifikasi admin."}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                            <a
                                href={proofUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#013B09] px-4 py-3 text-xs font-semibold text-white transition hover:bg-green-900"
                            >
                                <Eye size={15} />
                                Lihat Bukti
                            </a>

                            <a
                                href={proofUrl}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F96302] px-4 py-3 text-xs font-semibold text-white transition hover:bg-orange-600"
                            >
                                <Download size={15} />
                                Unduh Bukti
                            </a>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div className="rounded-xl bg-[#F0FEF1] p-3">
                            <p className="text-xs text-gray-500">
                                ID Transaksi
                            </p>

                            <p className="mt-1 font-semibold text-[#013B09]">
                                #{transaction.id || "-"}
                            </p>
                        </div>

                        <div className="rounded-xl bg-[#F0FEF1] p-3">
                            <p className="text-xs text-gray-500">
                                Booking ID
                            </p>

                            <p className="mt-1 font-semibold text-[#013B09]">
                                #{transaction.bookingId || bookingId}
                            </p>
                        </div>

                        <div className="rounded-xl bg-[#F0FEF1] p-3">
                            <p className="text-xs text-gray-500">Nominal</p>

                            <p className="mt-1 font-semibold text-[#F96302]">
                                {formatRupiah(transaction.total ?? total)}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {showCancelButton && (
                <div className="mt-5 flex justify-end">
                    <button
                        type="button"
                        onClick={() => onCancel?.(bookingId)}
                        disabled={isCancelling}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <XCircle size={17} />
                        {isCancelling ? "Membatalkan..." : "Cancel Booking"}
                    </button>
                </div>
            )}
        </div>
    );
}

function InfoItem({
    icon,
    label,
    value,
    highlight = false,
}: {
    icon: ReactNode;
    label: string;
    value: string;
    highlight?: boolean;
}) {
    return (
        <div className="rounded-2xl bg-[#F0FEF1] p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#013B09]">
                {icon}
            </div>

            <p className="text-xs text-gray-500">{label}</p>

            <p
                className={`mt-1 font-semibold ${
                    highlight ? "text-[#F96302]" : "text-[#013B09]"
                }`}
            >
                {value}
            </p>
        </div>
    );
}