"use client";

import { CheckCircle2, Scissors } from "lucide-react";
import {
    GroomingPackage,
    formatRupiah,
} from "@/lib/Customer_Service";
import { EmptyBox, SectionTitle } from "./BookingShared";

interface StepChoosePackageProps {
    packages: GroomingPackage[];
    selectedPackage: GroomingPackage | null;
    onSelect: (item: GroomingPackage) => void;
}

export default function StepChoosePackage({
    packages,
    selectedPackage,
    onSelect,
}: StepChoosePackageProps) {
    return (
        <div>
            <SectionTitle
                title="Pilih Paket Grooming"
                desc="Pilih layanan grooming sesuai kebutuhan anabul."
            />

            {packages.length === 0 ? (
                <EmptyBox text="Paket grooming belum bisa dimuat dari backend." />
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {packages.map((item) => {
                        const active = selectedPackage?.id === item.id;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => onSelect(item)}
                                className={`relative rounded-3xl border p-5 text-left transition hover:-translate-y-1 hover:shadow-md ${
                                    active
                                        ? "border-[#013B09] bg-[#F0FEF1]"
                                        : "border-[#A7E8B0]/40 bg-white"
                                }`}
                            >
                                {active && (
                                    <CheckCircle2 className="absolute right-4 top-4 h-6 w-6 text-[#013B09]" />
                                )}

                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0FEF1] text-[#013B09]">
                                    <Scissors size={34} />
                                </div>

                                <h3 className="mt-5 text-xl font-bold text-[#013B09]">
                                    {item.name}
                                </h3>

                                <p className="mt-2 text-2xl font-bold text-[#F96302]">
                                    {formatRupiah(item.price)}
                                </p>

                                <p className="mt-3 text-sm leading-relaxed text-gray-500">
                                    {item.description}
                                </p>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}