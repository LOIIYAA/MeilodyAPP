"use client";

import { useState, useEffect } from "react";

interface PackageModalProps {
    onClose: () => void;
    onSave: (pkg: { id?: number; name: string; price: number; description: string }) => void;
    initialData?: { id?: number; name: string; price: number; description: string };
}

export default function PackageModal({ onClose, onSave, initialData }: PackageModalProps) {
    const [name, setName] = useState(initialData?.name || "");
    const [price, setPrice] = useState(initialData?.price || 0);
    const [description, setDescription] = useState(initialData?.description || "");

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setPrice(initialData.price);
            setDescription(initialData.description);
        }
    }, [initialData]);

    const handleSubmit = () => {
        if (!name) return alert("Nama paket harus diisi");
        onSave({ id: initialData?.id, name, price, description });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
                <h2 className="text-lg font-semibold mb-4">{initialData ? "Edit Package" : "Add Package"}</h2>

                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium">Nama Paket</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 w-full rounded border px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Harga</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className="mt-1 w-full rounded border px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Deskripsi</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 w-full rounded border px-3 py-2"
                        />
                    </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={onClose} className="px-3 py-1 rounded bg-gray-200">Cancel</button>
                    <button onClick={handleSubmit} className="px-3 py-1 rounded bg-[#013B09] text-white">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}