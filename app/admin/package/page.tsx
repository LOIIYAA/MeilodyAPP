

"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
    BadgeDollarSign,
    Edit3,
    PackageCheck,
    Plus,
    Search,
    Scissors,
    Trash2,
    X,
} from "lucide-react";

import {
    createAdminGroomingPackage,
    deleteAdminGroomingPackage,
    formatAdminRupiah,
    getAdminGroomingPackages,
    GroomingPackage,
    GroomingPackagePayload,
    updateAdminGroomingPackage,
} from "@/lib/admin_service";

export default function AdminPackagePage() {
    const [packages, setPackages] = useState<GroomingPackage[]>([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] =
        useState<GroomingPackage | null>(null);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminGroomingPackages();
            setPackages(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal memuat grooming package."
            );
        } finally {
            setLoading(false);
        }
    };

    const filteredPackages = useMemo(() => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) return packages;

        return packages.filter((item) => {
            return (
                item.id.toString().includes(keyword) ||
                item.name.toLowerCase().includes(keyword) ||
                item.description.toLowerCase().includes(keyword) ||
                item.price.toString().includes(keyword)
            );
        });
    }, [packages, search]);

    const resetForm = () => {
        setName("");
        setPrice("");
        setDescription("");
        setSelectedPackage(null);
    };

    const openAddModal = () => {
        resetForm();
        setError("");
        setSuccessMessage("");
        setModalOpen(true);
    };

    const openEditModal = (item: GroomingPackage) => {
        setSelectedPackage(item);
        setName(item.name);
        setPrice(String(item.price));
        setDescription(item.description);
        setError("");
        setSuccessMessage("");
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        resetForm();
    };

    const showSuccess = (message: string) => {
        setSuccessMessage(message);

        setTimeout(() => {
            setSuccessMessage("");
        }, 2500);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!name.trim() || !price.trim() || !description.trim()) {
            setError("Nama paket, harga, dan deskripsi wajib diisi.");
            return;
        }

        const parsedPrice = Number(price);

        if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
            setError("Harga harus berupa angka lebih dari 0.");
            return;
        }

        const payload: GroomingPackagePayload = {
            name: name.trim(),
            price: parsedPrice,
            description: description.trim(),
        };

        try {
            setSaving(true);
            setError("");
            setSuccessMessage("");

            if (selectedPackage) {
                const updatedPackage = await updateAdminGroomingPackage(
                    selectedPackage.id,
                    payload
                );

                setPackages((prev) =>
                    prev.map((item) =>
                        item.id === selectedPackage.id
                            ? updatedPackage
                            : item
                    )
                );

                showSuccess("Grooming package berhasil diperbarui.");
            } else {
                const newPackage = await createAdminGroomingPackage(payload);

                setPackages((prev) => [newPackage, ...prev]);
                showSuccess("Grooming package berhasil ditambahkan.");
            }

            closeModal();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal menyimpan grooming package."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (item: GroomingPackage) => {
        const confirmed = window.confirm(
            `Yakin ingin menghapus package "${item.name}"?`
        );

        if (!confirmed) return;

        try {
            setError("");
            setSuccessMessage("");

            await deleteAdminGroomingPackage(item.id);

            setPackages((prev) =>
                prev.filter((packageItem) => packageItem.id !== item.id)
            );

            showSuccess("Grooming package berhasil dihapus.");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal menghapus grooming package."
            );
        }
    };

    return (
        <section className="space-y-8">
            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
                    {successMessage}
                </div>
            )}

            {/* HERO */}
            <div className="relative overflow-hidden rounded-3xl bg-[#013B09] p-8 text-white shadow-sm md:p-10">
                <Scissors className="absolute right-10 top-8 h-24 w-24 rotate-12 text-white/10" />
                <PackageCheck className="absolute bottom-6 right-44 h-14 w-14 -rotate-12 text-white/10" />

                <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-[#A7E8B0]">
                            Grooming Package
                        </p>

                        <h1 className="text-3xl font-bold md:text-5xl">
                            Kelola Paket Grooming
                        </h1>

                        <p className="mt-4 max-w-2xl text-white/75">
                            Tambah, ubah, dan hapus paket layanan grooming yang
                            tersedia untuk customer MeiLody Paws.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddModal}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F96302] px-6 py-4 font-semibold text-white transition hover:bg-orange-600"
                    >
                        <Plus size={20} />
                        Tambah Package
                    </button>
                </div>
            </div>

            {/* SEARCH + SUMMARY */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_0.6fr]">
                <div className="rounded-3xl border border-[#A7E8B0]/40 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-[#013B09]">
                                Daftar Package
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Cari berdasarkan ID, nama, harga, atau deskripsi.
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
                                placeholder="Cari package..."
                                className="h-12 w-full rounded-2xl border border-[#A7E8B0]/50 bg-[#F0FEF1] pl-11 pr-4 text-sm text-[#013B09] outline-none transition focus:border-[#013B09]"
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-[#A7E8B0]/40 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0FEF1] text-[#013B09]">
                            <PackageCheck size={28} />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Total Package
                            </p>
                            <h3 className="text-3xl font-bold text-[#013B09]">
                                {packages.length}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* PACKAGE LIST */}
            <div>
                {loading ? (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-64 animate-pulse rounded-3xl bg-white"
                            />
                        ))}
                    </div>
                ) : filteredPackages.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-[#A7E8B0] bg-white p-10 text-center shadow-sm">
                        <Scissors className="mx-auto h-14 w-14 text-[#013B09]" />

                        <h3 className="mt-4 text-xl font-bold text-[#013B09]">
                            Package tidak ditemukan
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            Coba gunakan keyword lain atau tambahkan package
                            baru.
                        </p>

                        <button
                            type="button"
                            onClick={openAddModal}
                            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#F96302] px-6 py-4 font-semibold text-white"
                        >
                            <Plus size={20} />
                            Tambah Package
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {filteredPackages.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-3xl border border-[#A7E8B0]/40 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F0FEF1] text-[#013B09]">
                                            <Scissors size={28} />
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold text-[#F96302]">
                                                ID #{item.id}
                                            </p>

                                            <h3 className="text-xl font-bold text-[#013B09]">
                                                {item.name}
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 rounded-2xl bg-[#F0FEF1] p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#013B09]">
                                            <BadgeDollarSign size={22} />
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Harga
                                            </p>

                                            <p className="text-xl font-bold text-[#013B09]">
                                                {formatAdminRupiah(item.price)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 rounded-2xl bg-[#F0FEF1] p-5">
                                    <p className="text-xs text-gray-500">
                                        Deskripsi
                                    </p>

                                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => openEditModal(item)}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#013B09] px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-900"
                                    >
                                        <Edit3 size={16} />
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(item)}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                                    >
                                        <Trash2 size={16} />
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL ADD / EDIT */}
            {modalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-5">
                    <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-[#013B09]">
                                    {selectedPackage
                                        ? "Edit Package"
                                        : "Tambah Package"}
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Isi data package grooming dengan benar.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="rounded-full bg-[#F0FEF1] p-2 text-[#013B09]"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#013B09]">
                                    Nama Package
                                </label>

                                <input
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    placeholder="Contoh: Lite Grooming"
                                    className="h-12 w-full rounded-2xl border border-[#A7E8B0]/50 bg-[#F0FEF1] px-4 text-sm outline-none focus:border-[#013B09]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#013B09]">
                                    Harga
                                </label>

                                <input
                                    type="number"
                                    value={price}
                                    onChange={(event) =>
                                        setPrice(event.target.value)
                                    }
                                    placeholder="Contoh: 500000"
                                    className="h-12 w-full rounded-2xl border border-[#A7E8B0]/50 bg-[#F0FEF1] px-4 text-sm outline-none focus:border-[#013B09]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#013B09]">
                                    Deskripsi
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(event) =>
                                        setDescription(event.target.value)
                                    }
                                    placeholder="Contoh: Mandi + Blow dry"
                                    rows={4}
                                    className="w-full resize-none rounded-2xl border border-[#A7E8B0]/50 bg-[#F0FEF1] px-4 py-3 text-sm outline-none focus:border-[#013B09]"
                                />
                            </div>

                            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="h-12 flex-1 rounded-2xl border border-gray-200 font-semibold text-gray-600 transition hover:bg-gray-50"
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
                                        : selectedPackage
                                          ? "Simpan Perubahan"
                                          : "Tambah Package"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
