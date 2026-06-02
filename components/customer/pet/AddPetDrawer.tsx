"use client";

import { PawPrint, X } from "lucide-react";
import { useEffect, useState } from "react";

type PetFormPayload = {
    name: string;
    type: string;
    age: number;
};

interface AddPetDrawerProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (payload: PetFormPayload) => Promise<void>;
    mode?: "add" | "edit";
    initialData?: PetFormPayload | null;
}

export default function AddPetDrawer({
    open,
    onClose,
    onSubmit,
    mode = "add",
    initialData = null,
}: AddPetDrawerProps) {
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [age, setAge] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (open) {
            setName(initialData?.name ?? "");
            setType(initialData?.type ?? "");
            setAge(initialData ? String(initialData.age) : "");
            setError("");
        }
    }, [open, initialData]);

    const handleSubmit = async () => {
        if (!name.trim() || !type.trim() || !age.trim()) {
            setError("Semua field wajib diisi.");
            return;
        }

        const ageNumber = Number(age);

        if (Number.isNaN(ageNumber) || ageNumber < 0) {
            setError("Umur pet harus berupa angka valid.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await onSubmit({
                name: name.trim(),
                type: type.trim(),
                age: ageNumber,
            });
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal menyimpan pet."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div
                onClick={onClose}
                className={`fixed inset-0 z-80 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
            />

            <aside
                className={`fixed right-0 top-0 z-90 h-screen w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F0FEF1] text-[#013B09]">
                            <PawPrint size={24} />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-[#013B09]">
                                {mode === "edit" ? "Edit Pet" : "Tambah Pet"}
                            </h2>
                            <p className="text-sm text-gray-500">
                                Masukkan data anabul kamu.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-5 px-6 py-6">
                    {error && (
                        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[#013B09]">
                            Nama Pet
                        </label>

                        <input
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="Contoh: Milo"
                            className="h-12 w-full rounded-2xl border border-[#A7E8B0]/50 bg-[#F0FEF1] px-4 text-sm outline-none focus:border-[#013B09]"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[#013B09]">
                            Jenis Pet
                        </label>

                        <input
                            value={type}
                            onChange={(event) =>
                                setType(event.target.value)
                            }
                            placeholder="Contoh: Kucing"
                            className="h-12 w-full rounded-2xl border border-[#A7E8B0]/50 bg-[#F0FEF1] px-4 text-sm outline-none focus:border-[#013B09]"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[#013B09]">
                            Umur Pet
                        </label>

                        <input
                            type="number"
                            value={age}
                            onChange={(event) =>
                                setAge(event.target.value)
                            }
                            placeholder="Contoh: 2"
                            className="h-12 w-full rounded-2xl border border-[#A7E8B0]/50 bg-[#F0FEF1] px-4 text-sm outline-none focus:border-[#013B09]"
                        />
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white p-6">
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-12 flex-1 rounded-2xl border border-gray-200 font-semibold text-gray-600 transition hover:bg-gray-50"
                        >
                            Batal
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="h-12 flex-1 rounded-2xl bg-[#F96302] font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading
                                ? "Menyimpan..."
                                : mode === "edit"
                                    ? "Update Pet"
                                    : "Simpan Pet"}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
