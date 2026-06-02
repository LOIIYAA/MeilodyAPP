"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Edit3, PawPrint, Plus, Search, Trash2, X } from "lucide-react";

import {
    CustomerPet,
    getMyPets,
    createPet,
    updatePet,
    deletePet,
} from "@/lib/Customer_Service";

const PET_HERO_IMAGE = "/CustomerPhoto/pet/PetHero.jpg";
const PET_EMPTY_IMAGE = "/CustomerPhoto/pet/PetEmpty.jpg";

type PetFormPayload = {
    name: string;
    type: string;
    age: number;
};

export default function CustomerPetPage() {
    const [pets, setPets] = useState<CustomerPet[]>([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPet, setSelectedPet] = useState<CustomerPet | null>(null);

    const [petName, setPetName] = useState("");
    const [petType, setPetType] = useState("");
    const [petAge, setPetAge] = useState("");

    const fetchPets = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMyPets();

            const activePets = Array.isArray(data)
                ? data.filter((pet: any) => !pet.isDeleted)
                : [];

            setPets(activePets);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal memuat data pet."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPets();
    }, []);

    const filteredPets = useMemo(() => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) return pets;

        return pets.filter((pet) => {
            return (
                pet.id.toString().includes(keyword) ||
                pet.name.toLowerCase().includes(keyword) ||
                pet.type.toLowerCase().includes(keyword) ||
                pet.age.toString().includes(keyword)
            );
        });
    }, [pets, search]);

    const resetForm = () => {
        setPetName("");
        setPetType("");
        setPetAge("");
        setSelectedPet(null);
    };

    const openAddModal = () => {
        resetForm();
        setError("");
        setSuccessMessage("");
        setModalOpen(true);
    };

    const openEditModal = (pet: CustomerPet) => {
        setSelectedPet(pet);
        setPetName(pet.name);
        setPetType(pet.type);
        setPetAge(String(pet.age));
        setError("");
        setSuccessMessage("");
        setModalOpen(true);
    };

    const closeModal = () => {
        if (saving) return;

        setModalOpen(false);
        resetForm();
    };

    const showSuccess = (message: string) => {
        setSuccessMessage(message);

        setTimeout(() => {
            setSuccessMessage("");
        }, 2500);
    };

    const validateForm = () => {
        if (!petName.trim() || !petType.trim() || !petAge.trim()) {
            setError("Nama pet, jenis pet, dan umur wajib diisi.");
            return false;
        }

        const ageNumber = Number(petAge);

        if (Number.isNaN(ageNumber) || ageNumber < 0) {
            setError("Umur pet harus berupa angka yang valid.");
            return false;
        }

        return true;
    };

    const handleSubmitPet = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) return;

        const payload: PetFormPayload = {
            name: petName.trim(),
            type: petType.trim(),
            age: Number(petAge),
        };

        try {
            setSaving(true);
            setError("");
            setSuccessMessage("");

            if (selectedPet) {
                await updatePet(selectedPet.id, payload);
                showSuccess("Pet berhasil diperbarui 🐾");
            } else {
                await createPet(payload);
                showSuccess("Pet berhasil ditambahkan 🐾");
            }

            await fetchPets();

            setModalOpen(false);
            resetForm();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : selectedPet
                        ? "Gagal memperbarui pet."
                        : "Gagal menambahkan pet."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDeletePet = async (pet: CustomerPet) => {
        const confirmed = window.confirm(
            `Yakin ingin menghapus pet "${pet.name}"?`
        );

        if (!confirmed) return;

        try {
            setDeletingId(pet.id);

            const result = await deletePet(pet.id);

            console.log("DELETE RESULT:", result);

            await fetchPets();

            showSuccess("Pet berhasil dihapus 🐾");
        } catch (err) {
            console.error("DELETE ERROR:", err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal menghapus pet."
            );
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <>
            <section className="mx-auto max-w-7xl px-5 py-8">
                {error && !modalOpen && (
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
                    <PawPrint className="absolute bottom-6 right-44 h-12 w-12 -rotate-12 text-[#A7E8B0]/40" />

                    <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                        <div>
                            <p className="mb-3 inline-flex rounded-full bg-[#F0FEF1] px-4 py-2 text-sm font-semibold text-[#013B09]">
                                Pet Management
                            </p>

                            <h1 className="text-3xl font-bold leading-tight text-[#013B09] md:text-5xl">
                                Kelola Data Pet Kamu
                            </h1>

                            <p className="mt-4 max-w-xl text-gray-600">
                                Lihat semua data anabul yang sudah kamu
                                daftarkan. Data pet ini nanti digunakan untuk
                                proses booking grooming.
                            </p>

                            <button
                                type="button"
                                onClick={openAddModal}
                                className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-[#F96302] px-6 py-4 font-semibold text-white transition hover:bg-orange-600"
                            >
                                <Plus size={20} />
                                Tambah Pet
                            </button>
                        </div>

                        <div className="relative hidden h-56 overflow-hidden rounded-3xl bg-[#F0FEF1] lg:block">
                            <Image
                                src={PET_HERO_IMAGE}
                                alt="Pet MeiLody Paws"
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 40vw"
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* SEARCH */}
                <div className="mt-8 rounded-3xl border border-[#A7E8B0]/40 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-[#013B09]">
                                Daftar Pet
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Cari pet berdasarkan ID, nama, jenis, atau umur.
                            </p>
                        </div>

                        <div className="relative w-full md:max-w-sm">
                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Cari pet..."
                                className="h-12 w-full rounded-2xl border border-[#A7E8B0]/50 bg-[#F0FEF1] pl-11 pr-4 text-sm text-[#013B09] outline-none transition focus:border-[#013B09]"
                            />
                        </div>
                    </div>
                </div>

                {/* PET LIST */}
                <div className="mt-6">
                    {loading ? (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-64 animate-pulse rounded-3xl bg-white"
                                />
                            ))}
                        </div>
                    ) : filteredPets.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-[#A7E8B0] bg-white p-10 text-center shadow-sm">
                            <div className="relative mx-auto mb-6 h-40 w-40 overflow-hidden rounded-full bg-[#F0FEF1]">
                                <Image
                                    src={PET_EMPTY_IMAGE}
                                    alt="Pet tidak ditemukan"
                                    fill
                                    sizes="160px"
                                    className="object-cover"
                                />
                            </div>

                            <h3 className="text-xl font-bold text-[#013B09]">
                                Pet tidak ditemukan
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                Coba gunakan keyword lain atau tambahkan pet
                                baru.
                            </p>

                            <button
                                type="button"
                                onClick={openAddModal}
                                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#F96302] px-6 py-4 font-semibold text-white transition hover:bg-orange-600"
                            >
                                <Plus size={20} />
                                Tambah Pet
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {filteredPets.map((pet) => (
                                <div
                                    key={pet.id}
                                    className="rounded-3xl border border-[#A7E8B0]/40 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F0FEF1] text-[#013B09]">
                                            <PawPrint size={28} />
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold text-[#F96302]">
                                                ID #{pet.id}
                                            </p>

                                            <h3 className="text-xl font-bold text-[#013B09]">
                                                {pet.name}
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-500">
                                                {pet.type}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 grid grid-cols-2 gap-4">
                                        <div className="rounded-2xl bg-[#F0FEF1] p-4">
                                            <p className="text-xs text-gray-500">
                                                Jenis Pet
                                            </p>

                                            <p className="mt-1 font-semibold text-[#013B09]">
                                                {pet.type}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-[#F0FEF1] p-4">
                                            <p className="text-xs text-gray-500">
                                                Umur
                                            </p>

                                            <p className="mt-1 font-semibold text-[#013B09]">
                                                {pet.age} Tahun
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5 rounded-2xl bg-[#F0FEF1] p-4">
                                        <p className="text-xs text-gray-500">
                                            Dibuat pada
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-[#013B09]">
                                            {pet.createdAt
                                                ? new Intl.DateTimeFormat(
                                                    "id-ID",
                                                    {
                                                        day: "2-digit",
                                                        month: "long",
                                                        year: "numeric",
                                                    }
                                                ).format(
                                                    new Date(pet.createdAt)
                                                )
                                                : "-"}
                                        </p>
                                    </div>

                                    {/* ACTION BOX */}
                                    <div className="mt-5 rounded-2xl border border-[#A7E8B0]/50 bg-white p-3">
                                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Aksi Pet
                                        </p>

                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openEditModal(pet)
                                                }
                                                className="flex items-center justify-center gap-2 rounded-xl bg-[#013B09] px-3 py-3 text-sm font-semibold text-white transition hover:bg-green-900"
                                            >
                                                <Edit3 size={16} />
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDeletePet(pet)
                                                }
                                                disabled={
                                                    deletingId === pet.id
                                                }
                                                className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-3 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
                                            >
                                                <Trash2 size={16} />
                                                {deletingId === pet.id
                                                    ? "Hapus..."
                                                    : "Hapus"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CENTER MODAL ADD / EDIT */}
            {modalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-5">
                    <div className="relative w-full max-w-md rounded-4xl bg-white p-6 shadow-2xl">
                        <button
                            type="button"
                            onClick={closeModal}
                            disabled={saving}
                            className="absolute right-5 top-5 rounded-full bg-[#F0FEF1] p-2 text-[#013B09] transition hover:bg-[#A7E8B0]/40 disabled:cursor-not-allowed"
                        >
                            <X size={20} />
                        </button>

                        <div className="pr-10">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0FEF1] text-[#013B09]">
                                <PawPrint size={30} />
                            </div>

                            <h2 className="text-2xl font-bold text-[#013B09]">
                                {selectedPet
                                    ? "Edit Data Pet"
                                    : "Tambah Pet Baru"}
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                {selectedPet
                                    ? "Perbarui data anabul kamu."
                                    : "Masukkan data anabul kamu."}
                            </p>
                        </div>

                        {error && (
                            <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmitPet}
                            className="mt-6 space-y-4"
                        >
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#013B09]">
                                    Nama Pet
                                </label>

                                <input
                                    value={petName}
                                    onChange={(event) =>
                                        setPetName(event.target.value)
                                    }
                                    placeholder="Contoh: Milo"
                                    className="h-12 w-full rounded-2xl border border-[#A7E8B0]/50 bg-[#F0FEF1] px-4 text-sm text-[#013B09] outline-none transition focus:border-[#013B09]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#013B09]">
                                    Jenis Pet
                                </label>

                                <input
                                    value={petType}
                                    onChange={(event) =>
                                        setPetType(event.target.value)
                                    }
                                    placeholder="Contoh: Kucing"
                                    className="h-12 w-full rounded-2xl border border-[#A7E8B0]/50 bg-[#F0FEF1] px-4 text-sm text-[#013B09] outline-none transition focus:border-[#013B09]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#013B09]">
                                    Umur Pet
                                </label>

                                <input
                                    type="number"
                                    value={petAge}
                                    onChange={(event) =>
                                        setPetAge(event.target.value)
                                    }
                                    placeholder="Contoh: 2"
                                    className="h-12 w-full rounded-2xl border border-[#A7E8B0]/50 bg-[#F0FEF1] px-4 text-sm text-[#013B09] outline-none transition focus:border-[#013B09]"
                                />
                            </div>

                            <div className="flex gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    className="h-12 flex-1 rounded-2xl border border-gray-200 font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="h-12 flex-1 rounded-2xl bg-[#F96302] font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {saving
                                        ? "Menyimpan..."
                                        : selectedPet
                                            ? "Update Pet"
                                            : "Simpan Pet"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
