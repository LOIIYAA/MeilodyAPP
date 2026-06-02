"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, PawPrint, Scissors } from "lucide-react";

import {
    CustomerBooking,
    CustomerPet,
    DEFAULT_BOOKING_SLOTS,
    GroomingPackage,
    createBooking,
    getAvailableSlots,
    getGroomingPackages,
    getMyPets,
    uploadTransaction,
} from "@/lib/Customer_Service";

import BookingStepper from "@/components/customer/booking/BookingStepper";
import BookingSummary from "@/components/customer/booking/BookingSummary";
import StepChoosePet from "@/components/customer/booking/StepChoosePet";
import StepChoosePackage from "@/components/customer/booking/StepChoosePackage";
import StepChooseSchedule from "@/components/customer/booking/StepChooseSchedule";
import StepConfirmBooking from "@/components/customer/booking/StepConfirmBooking";
import StepUploadPayment from "@/components/customer/booking/StepUploadPayment";

type BookingStep = 1 | 2 | 3 | 4 | 5;

export default function CustomerBookingPage() {
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState<BookingStep>(1);

    const [pets, setPets] = useState<CustomerPet[]>([]);
    const [packages, setPackages] = useState<GroomingPackage[]>([]);

    const [selectedPet, setSelectedPet] = useState<CustomerPet | null>(null);
    const [selectedPackage, setSelectedPackage] =
        useState<GroomingPackage | null>(null);

    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    const [availableSlots, setAvailableSlots] =
        useState<string[]>(DEFAULT_BOOKING_SLOTS);

    const [createdBooking, setCreatedBooking] =
        useState<CustomerBooking | null>(null);

    const [proofFile, setProofFile] = useState<File | null>(null);

    const [loadingPage, setLoadingPage] = useState(true);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [creatingBooking, setCreatingBooking] = useState(false);
    const [uploadingProof, setUploadingProof] = useState(false);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const todayDate = useMemo(() => {
        return new Date().toISOString().slice(0, 10);
    }, []);

    const selectedTotal = useMemo(() => {
        return selectedPackage?.price ?? 0;
    }, [selectedPackage]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (selectedDate) {
            fetchAvailableSlots(selectedDate);
        }
    }, [selectedDate]);

    const fetchInitialData = async () => {
        try {
            setLoadingPage(true);
            setError("");

            const [petResult, packageResult] = await Promise.allSettled([
                getMyPets(),
                getGroomingPackages(),
            ]);

            if (petResult.status === "fulfilled") {
                setPets(Array.isArray(petResult.value) ? petResult.value : []);
            } else {
                setPets([]);
            }

            if (packageResult.status === "fulfilled") {
                setPackages(
                    Array.isArray(packageResult.value)
                        ? packageResult.value
                        : []
                );
            } else {
                setPackages([]);
            }

            if (
                petResult.status === "rejected" ||
                packageResult.status === "rejected"
            ) {
                setError(
                    "Beberapa data belum bisa dimuat karena backend sedang bermasalah."
                );
            }
        } finally {
            setLoadingPage(false);
        }
    };

    const fetchAvailableSlots = async (date: string) => {
        try {
            setLoadingSlots(true);
            setSelectedTime("");

            const slots = await getAvailableSlots(date);

            setAvailableSlots(
                Array.isArray(slots) && slots.length > 0
                    ? slots
                    : DEFAULT_BOOKING_SLOTS
            );
        } catch {
            setAvailableSlots(DEFAULT_BOOKING_SLOTS);
        } finally {
            setLoadingSlots(false);
        }
    };

    const canGoNext = () => {
        if (currentStep === 1) return Boolean(selectedPet);
        if (currentStep === 2) return Boolean(selectedPackage);
        if (currentStep === 3) return Boolean(selectedDate && selectedTime);

        return true;
    };

    const handleNextStep = () => {
        setError("");
        setSuccessMessage("");

        if (!canGoNext()) {
            if (currentStep === 1) {
                setError("Pilih pet terlebih dahulu.");
            }

            if (currentStep === 2) {
                setError("Pilih paket grooming terlebih dahulu.");
            }

            if (currentStep === 3) {
                setError("Pilih tanggal dan jam grooming terlebih dahulu.");
            }

            return;
        }

        setCurrentStep((prev) => Math.min(prev + 1, 5) as BookingStep);
    };

    const handlePrevStep = () => {
        setError("");
        setSuccessMessage("");

        setCurrentStep((prev) => Math.max(prev - 1, 1) as BookingStep);
    };

    const handleCreateBooking = async () => {
        if (!selectedPet || !selectedPackage || !selectedDate || !selectedTime) {
            setError("Data booking belum lengkap.");
            return;
        }

        try {
            setCreatingBooking(true);
            setError("");
            setSuccessMessage("");

            const booking = await createBooking({
                petId: selectedPet.id,
                packageId: selectedPackage.id,
                tanggal: selectedDate,
                jam: selectedTime,
            });

            setCreatedBooking(booking);
            setSuccessMessage(
                "Booking berhasil dibuat. Silakan upload bukti pembayaran."
            );
            setCurrentStep(5);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal membuat booking."
            );
        } finally {
            setCreatingBooking(false);
        }
    };

    const handleUploadProof = async () => {
        if (!createdBooking) {
            setError("Booking belum dibuat.");
            return;
        }

        if (!proofFile) {
            setError("Pilih file bukti pembayaran terlebih dahulu.");
            return;
        }

        try {
            setUploadingProof(true);
            setError("");
            setSuccessMessage("");

            await uploadTransaction({
                bookingId: createdBooking.id,
                total: selectedTotal,
                proof: proofFile,
            });

            setSuccessMessage(
                "Bukti pembayaran berhasil diupload. Menunggu approval admin."
            );

            setTimeout(() => {
                router.push("/customer/history");
            }, 1500);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal upload bukti pembayaran."
            );
        } finally {
            setUploadingProof(false);
        }
    };

    return (
        <section className="mx-auto max-w-7xl px-5 py-8">
            {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
                    {successMessage}
                </div>
            )}

            {/* HERO */}
            <div className="relative overflow-hidden rounded-3xl border border-[#A7E8B0]/50 bg-white p-8 shadow-sm md:p-10">
                <PawPrint className="absolute right-10 top-8 h-20 w-20 rotate-12 text-[#A7E8B0]/40" />
                <Scissors className="absolute bottom-6 right-44 h-12 w-12 -rotate-12 text-[#A7E8B0]/40" />

                <div className="relative z-10">
                    <p className="mb-3 inline-flex rounded-full bg-[#F0FEF1] px-4 py-2 text-sm font-semibold text-[#013B09]">
                        Booking Grooming
                    </p>

                    <h1 className="text-3xl font-bold leading-tight text-[#013B09] md:text-5xl">
                        Jadwalkan Grooming Anabul
                    </h1>

                    <p className="mt-4 max-w-2xl text-gray-600">
                        Pilih pet, paket grooming, jadwal, lalu upload bukti
                        pembayaran agar admin dapat memproses booking kamu.
                    </p>
                </div>
            </div>

            <BookingStepper currentStep={currentStep} />

            <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                <div className="rounded-3xl border border-[#A7E8B0]/40 bg-white p-6 shadow-sm">
                    {loadingPage ? (
                        <div className="space-y-4">
                            <div className="h-8 w-52 animate-pulse rounded-xl bg-[#F0FEF1]" />

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="h-52 animate-pulse rounded-3xl bg-[#F0FEF1]"
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {currentStep === 1 && (
                                <StepChoosePet
                                    pets={pets}
                                    selectedPet={selectedPet}
                                    onSelect={setSelectedPet}
                                />
                            )}

                            {currentStep === 2 && (
                                <StepChoosePackage
                                    packages={packages}
                                    selectedPackage={selectedPackage}
                                    onSelect={setSelectedPackage}
                                />
                            )}

                            {currentStep === 3 && (
                                <StepChooseSchedule
                                    selectedDate={selectedDate}
                                    selectedTime={selectedTime}
                                    availableSlots={availableSlots}
                                    todayDate={todayDate}
                                    loadingSlots={loadingSlots}
                                    onDateChange={setSelectedDate}
                                    onTimeChange={setSelectedTime}
                                />
                            )}

                            {currentStep === 4 && (
                                <StepConfirmBooking
                                    selectedPet={selectedPet}
                                    selectedPackage={selectedPackage}
                                    selectedDate={selectedDate}
                                    selectedTime={selectedTime}
                                    creatingBooking={creatingBooking}
                                    onCreateBooking={handleCreateBooking}
                                />
                            )}

                            {currentStep === 5 && (
                                <StepUploadPayment
                                    createdBooking={createdBooking}
                                    selectedTotal={selectedTotal}
                                    proofFile={proofFile}
                                    uploadingProof={uploadingProof}
                                    onFileChange={setProofFile}
                                    onUpload={handleUploadProof}
                                />
                            )}
                        </>
                    )}

                    {/* NAVIGATION */}
                    {currentStep < 4 && (
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
                            <button
                                type="button"
                                onClick={handlePrevStep}
                                disabled={currentStep === 1}
                                className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-gray-200 px-6 font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <ArrowLeft size={18} />
                                Kembali
                            </button>

                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#F96302] px-6 font-semibold text-white transition hover:bg-orange-600"
                            >
                                Lanjut
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
                            <button
                                type="button"
                                onClick={handlePrevStep}
                                disabled={creatingBooking}
                                className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-gray-200 px-6 font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <ArrowLeft size={18} />
                                Kembali
                            </button>
                        </div>
                    )}

                    {currentStep === 5 && !createdBooking && (
                        <div className="mt-8">
                            <button
                                type="button"
                                onClick={() => setCurrentStep(4)}
                                className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-gray-200 px-6 font-semibold text-gray-600 transition hover:bg-gray-50"
                            >
                                <ArrowLeft size={18} />
                                Kembali ke Konfirmasi
                            </button>
                        </div>
                    )}
                </div>

                <BookingSummary
                    selectedPet={selectedPet}
                    selectedPackage={selectedPackage}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    createdBooking={createdBooking}
                />
            </div>
        </section>
    );
}
