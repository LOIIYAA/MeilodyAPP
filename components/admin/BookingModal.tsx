"use client";

import { useState, useEffect } from "react";

interface BookingModalProps {
    onClose: () => void;
    onSave: (booking: any) => void;
    initialData?: any;
}

export default function BookingModal({ onClose, onSave, initialData }: BookingModalProps) {
    const [pet, setPet] = useState(initialData?.pet || "");
    const [owner, setOwner] = useState(initialData?.owner || "");
    const [pkg, setPkg] = useState(initialData?.package || "");
    const [date, setDate] = useState(initialData?.date || "");
    const [time, setTime] = useState(initialData?.time || "");
    const [status, setStatus] = useState(initialData?.status || "Paid");

    useEffect(() => {
        if (initialData) {
            setPet(initialData.pet);
            setOwner(initialData.owner);
            setPkg(initialData.package);
            setDate(initialData.date);
            setTime(initialData.time);
            setStatus(initialData.status);
        }
    }, [initialData]);

    const handleSubmit = () => {
        if (!pet || !owner || !pkg || !date || !time) return alert("Semua field harus diisi!");
        onSave({ id: initialData?.id, pet, owner, package: pkg, date, time, status });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
                <h2 className="text-lg font-semibold mb-4">{initialData ? "Edit Booking" : "Add Booking"}</h2>

                <div className="space-y-3">
                    <input className="w-full rounded border px-3 py-2" placeholder="Nama Pet" value={pet} onChange={(e) => setPet(e.target.value)} />
                    <input className="w-full rounded border px-3 py-2" placeholder="Owner" value={owner} onChange={(e) => setOwner(e.target.value)} />
                    <input className="w-full rounded border px-3 py-2" placeholder="Package" value={pkg} onChange={(e) => setPkg(e.target.value)} />
                    <input type="date" className="w-full rounded border px-3 py-2" value={date} onChange={(e) => setDate(e.target.value)} />
                    <input type="time" className="w-full rounded border px-3 py-2" value={time} onChange={(e) => setTime(e.target.value)} />
                    <select className="w-full rounded border px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="Paid">Paid</option>
                        <option value="On Progress">On Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={onClose} className="px-3 py-1 rounded bg-gray-200">Cancel</button>
                    <button onClick={handleSubmit} className="px-3 py-1 rounded bg-[#013B09] text-white">Save</button>
                </div>
            </div>
        </div>
    );
}