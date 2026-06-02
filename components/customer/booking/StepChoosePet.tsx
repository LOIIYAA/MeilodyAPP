"use client";

import { CheckCircle2, PawPrint } from "lucide-react";
import { CustomerPet } from "@/lib/Customer_Service";
import { EmptyBox, SectionTitle } from "./BookingShared";

interface StepChoosePetProps {
    pets: CustomerPet[];
    selectedPet: CustomerPet | null;
    onSelect: (pet: CustomerPet) => void;
}

export default function StepChoosePet({
    pets,
    selectedPet,
    onSelect,
}: StepChoosePetProps) {
    return (
        <div>
            <SectionTitle
                title="Pilih Pet"
                desc="Pilih anabul yang akan melakukan grooming."
            />

            {pets.length === 0 ? (
                <EmptyBox
                    text="Belum ada pet. Tambahkan pet terlebih dahulu di halaman Pet Saya."
                    actionHref="/customer/pet"
                    actionText="Tambah Pet"
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {pets.map((pet) => {
                        const active = selectedPet?.id === pet.id;

                        return (
                            <button
                                key={pet.id}
                                type="button"
                                onClick={() => onSelect(pet)}
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
                                    <PawPrint size={34} />
                                </div>

                                <h3 className="mt-5 text-xl font-bold text-[#013B09]">
                                    {pet.name}
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    {pet.type} • {pet.age} Tahun
                                </p>

                                <p className="mt-4 text-xs font-semibold text-[#F96302]">
                                    ID #{pet.id}
                                </p>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}