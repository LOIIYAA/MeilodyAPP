"use client";

import { CreditCard } from "lucide-react";

import {
    CustomerPet,
    GroomingPackage,
    formatDateIndonesia,
    formatRupiah,
} from "@/lib/Customer_Service";

import { InfoBox, SectionTitle } from "./BookingShared";

interface StepConfirmBookingProps {
    selectedPet: CustomerPet | null;
    selectedPackage: GroomingPackage | null;
    selectedDate: string;
    selectedTime: string;
    creatingBooking: boolean;
    onCreateBooking: () => void;
}

export default function StepConfirmBooking({
    selectedPet,
    selectedPackage,
    selectedDate,
    selectedTime,
    creatingBooking,
    onCreateBooking,
}: StepConfirmBookingProps) {
    return (
        <div>
            <SectionTitle
                title="Konfirmasi Booking"
                desc="Pastikan semua data booking grooming sudah benar sebelum membuat booking."
            />

            <div className="rounded-3xl bg-[#F0FEF1] p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoBox
                        label="Pet"
                        value={selectedPet?.name || "-"}
                    />

                    <InfoBox
                        label="Jenis Pet"
                        value={selectedPet?.type || "-"}
                    />

                    <InfoBox
                        label="Paket Grooming"
                        value={selectedPackage?.name || "-"}
                    />

                    <InfoBox
                        label="Total Pembayaran"
                        value={formatRupiah(selectedPackage?.price ?? 0)}
                        highlight
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
                </div>
            </div>

            <div className="mt-6 rounded-3xl border border-[#A7E8B0]/40 bg-white p-5">
                <p className="text-sm font-semibold text-[#013B09]">
                    Catatan Payment
                </p>

                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    Setelah booking dibuat, kamu akan diarahkan ke step upload
                    bukti pembayaran. Admin akan melakukan approval setelah
                    bukti pembayaran berhasil diupload.
                </p>
            </div>

            <button
                type="button"
                onClick={onCreateBooking}
                disabled={creatingBooking}
                className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#F96302] font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
                <CreditCard size={20} />
                {creatingBooking ? "Membuat Booking..." : "Buat Booking"}
            </button>
        </div>
    );
}