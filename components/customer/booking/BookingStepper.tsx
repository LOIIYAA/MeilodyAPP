"use client";

import { Check } from "lucide-react";

type BookingStepperProps = {
    currentStep?: number;
    activeStep?: number;
    step?: number;
    steps?: string[];
};

const DEFAULT_STEPS = [
    "Pilih Pet",
    "Pilih Paket",
    "Pilih Jadwal",
    "Konfirmasi",
    "Pembayaran",
];

export default function BookingStepper({
    currentStep,
    activeStep,
    step,
    steps = DEFAULT_STEPS,
}: BookingStepperProps) {
    const active = currentStep ?? activeStep ?? step ?? 1;

    return (
        <div className="w-full rounded-3xl border border-orange-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
                {steps.map((label, index) => {
                    const stepNumber = index + 1;
                    const isDone = stepNumber < active;
                    const isActive = stepNumber === active;

                    return (
                        <div
                            key={label}
                            className="flex flex-1 items-center"
                        >
                            <div className="flex flex-col items-center gap-2">
                                <div
                                    className={[
                                        "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold transition",
                                        isDone
                                            ? "border-orange-500 bg-orange-500 text-white"
                                            : isActive
                                                ? "border-orange-500 bg-orange-50 text-orange-600"
                                                : "border-slate-200 bg-slate-50 text-slate-400",
                                    ].join(" ")}
                                >
                                    {isDone ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        stepNumber
                                    )}
                                </div>

                                <p
                                    className={[
                                        "hidden text-center text-xs font-semibold md:block",
                                        isActive
                                            ? "text-orange-600"
                                            : isDone
                                                ? "text-slate-700"
                                                : "text-slate-400",
                                    ].join(" ")}
                                >
                                    {label}
                                </p>
                            </div>

                            {index < steps.length - 1 && (
                                <div
                                    className={[
                                        "mx-2 h-1 flex-1 rounded-full transition",
                                        stepNumber < active
                                            ? "bg-orange-500"
                                            : "bg-slate-100",
                                    ].join(" ")}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}