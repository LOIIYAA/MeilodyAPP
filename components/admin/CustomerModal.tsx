"use client";

import { useState, useEffect } from "react";

interface CustomerModalProps {
  onClose: () => void;
  onSave: (customer: any) => void;
  initialData?: any;
}

export default function CustomerModal({ onClose, onSave, initialData }: CustomerModalProps) {
  const [username, setUsername] = useState(initialData?.username || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [role, setRole] = useState(initialData?.role || "CUSTOMER");
  const [pet, setPet] = useState(initialData?.pet || "");

  useEffect(() => {
    if (initialData) {
      setUsername(initialData.username);
      setEmail(initialData.email);
      setRole(initialData.role);
      setPet(initialData.pet);
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!username || !email) return alert("Username dan Email wajib diisi!");
    onSave({ id: initialData?.id, username, email, role, pet });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">{initialData ? "Edit Customer" : "Add Customer"}</h2>

        <div className="space-y-3">
          <input
            className="w-full rounded border px-3 py-2"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="w-full rounded border px-3 py-2"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full rounded border px-3 py-2"
            placeholder="Pet"
            value={pet}
            onChange={(e) => setPet(e.target.value)}
          />
          <select className="w-full rounded border px-3 py-2" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="CUSTOMER">CUSTOMER</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
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