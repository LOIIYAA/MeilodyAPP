"use client";

import {
    CustomerBooking,
    CustomerPet,
    GroomingPackage,
    formatDateIndonesia,
    formatRupiah,
} from "@/lib/Customer_Service";

import { InfoBox } from "./BookingShared";

interface BookingSummaryProps {
    selectedPet: CustomerPet | null;
    selectedPackage: GroomingPackage | null;
    selectedDate: string;
    selectedTime: string;
    createdBooking: CustomerBooking | null;
}

export default function BookingSummary({
    selectedPet,
    selectedPackage,
    selectedDate,
    selectedTime,
    createdBooking,
}: BookingSummaryProps) {
    return (
        <aside className="h-fit rounded-3xl border border-[#A7E8B0]/40 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#013B09]">
                Ringkasan Booking
            </h2>

            <p className="mt-1 text-sm text-gray-500">
                Detail pilihan grooming kamu.
            </p>

            <div className="mt-6 space-y-4">
                <InfoBox
                    label="Pet"
                    value={selectedPet?.name || "-"}
                />

                <InfoBox
                    label="Paket Grooming"
                    value={selectedPackage?.name || "-"}
                />

                <InfoBox
                    label="Tanggal"
                    value={
                        selectedDate
                            ? formatDateIndonesia(selectedDate)
                            : "-"
                    }
                />

                <InfoBox
                    label="Jam"
                    value={selectedTime || "-"}
                />

                <InfoBox
                    label="Total"
                    value={formatRupiah(selectedPackage?.price ?? 0)}
                    highlight
                />

                <InfoBox
                    label="Status"
                    value={
                        createdBooking
                            ? "Menunggu Upload Payment"
                            : "Belum dibuat"
                    }
                />
            </div>

            <div className="mt-6 rounded-3xl bg-[#F0FEF1] p-5">
                <p className="text-sm font-semibold text-[#013B09]">
                    Catatan
                </p>

                <ul className="mt-3 space-y-2 text-sm text-gray-600">
                    <li>• Pastikan pet sudah benar.</li>
                    <li>• Booking dibuat setelah konfirmasi.</li>
                    <li>• Upload bukti pembayaran setelah booking berhasil.</li>
                    <li>• Admin akan melakukan approval pembayaran.</li>
                </ul>
            </div>
        </aside>
    );
}