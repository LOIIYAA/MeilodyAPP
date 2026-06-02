"use client";

import { CreditCard, UploadCloud } from "lucide-react";

import {
    CustomerBooking,
    formatRupiah,
} from "@/lib/Customer_Service";

import { SectionTitle } from "./BookingShared";

interface StepUploadPaymentProps {
    createdBooking: CustomerBooking | null;
    selectedTotal: number;
    proofFile: File | null;
    uploadingProof: boolean;
    onFileChange: (file: File | null) => void;
    onUpload: () => void;
}

export default function StepUploadPayment({
    createdBooking,
    selectedTotal,
    proofFile,
    uploadingProof,
    onFileChange,
    onUpload,
}: StepUploadPaymentProps) {
    return (
        <div>
            <SectionTitle
                title="Upload Bukti Pembayaran"
                desc="Upload bukti pembayaran agar admin dapat melakukan verifikasi booking kamu."
            />

            {!createdBooking ? (
                <div className="rounded-3xl border border-dashed border-[#A7E8B0] bg-[#F0FEF1] p-8 text-center">
                    <CreditCard className="mx-auto h-14 w-14 text-[#013B09]" />

                    <h3 className="mt-4 text-xl font-bold text-[#013B09]">
                        Booking belum dibuat
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                        Buat booking terlebih dahulu di step konfirmasi sebelum
                        upload bukti pembayaran.
                    </p>
                </div>
            ) : (
                <>
                    <div className="rounded-3xl bg-[#F0FEF1] p-5">
                        <p className="text-sm text-gray-500">
                            Booking ID
                        </p>

                        <h3 className="mt-1 text-2xl font-bold text-[#013B09]">
                            #{createdBooking.id}
                        </h3>

                        <p className="mt-4 text-sm text-gray-500">
                            Total Pembayaran
                        </p>

                        <h4 className="mt-1 text-3xl font-bold text-[#F96302]">
                            {formatRupiah(selectedTotal)}
                        </h4>
                    </div>

                    <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-[#A7E8B0] bg-white p-8 text-center transition hover:bg-[#F0FEF1]">
                        <UploadCloud className="h-14 w-14 text-[#013B09]" />

                        <p className="mt-4 text-sm font-semibold text-[#013B09]">
                            {proofFile
                                ? proofFile.name
                                : "Klik untuk pilih file bukti pembayaran"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            Format disarankan: JPG, PNG, atau PDF.
                        </p>

                        <input
                            type="file"
                            accept="image/*,.pdf"
                            className="hidden"
                            onChange={(event) =>
                                onFileChange(event.target.files?.[0] || null)
                            }
                        />
                    </label>

                    <button
                        type="button"
                        onClick={onUpload}
                        disabled={uploadingProof}
                        className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#013B09] font-semibold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <UploadCloud size={20} />
                        {uploadingProof
                            ? "Mengupload..."
                            : "Upload Bukti Pembayaran"}
                    </button>
                </>
            )}
        </div>
    );
}