"use client";

import { CheckCircle2 } from "lucide-react";

interface BookingStepperProps {
    currentStep: number;
}

const steps = [
    "Pilih Pet",
    "Pilih Paket",
    "Pilih Jadwal",
    "Konfirmasi",
    "Payment",
];

export default function BookingStepper({ currentStep }: BookingStepperProps) {
    return (
        <div className="mt-8 rounded-3xl border border-[#A7E8B0]/40 bg-white p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                {steps.map((item, index) => {
                    const stepNumber = index + 1;
                    const active = currentStep === stepNumber;
                    const done = currentStep > stepNumber;

                    return (
                        <div key={item} className="flex items-center gap-3">
                            <div
                                className={`flex h-11 w-11 items-center justify-center rounded-full border text-sm font-bold ${
                                    active
                                        ? "border-[#013B09] bg-[#013B09] text-white"
                                        : done
                                          ? "border-green-500 bg-green-500 text-white"
                                          : "border-gray-200 bg-white text-gray-400"
                                }`}
                            >
                                {done ? (
                                    <CheckCircle2 size={20} />
                                ) : (
                                    stepNumber
                                )}
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-[#013B09]">
                                    Step {stepNumber}
                                </p>

                                <p className="text-xs text-gray-500">
                                    {item}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}