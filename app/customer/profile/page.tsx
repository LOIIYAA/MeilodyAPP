"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { LogOut, Mail, PawPrint, Save, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

import {
    CustomerProfile,
    getCustomerProfile,
    updateCustomerProfile,
} from "@/lib/Customer_Service";

import { clearAuthSession } from "@/lib/authService";

const PROFILE_IMAGE = "/CustomerPhoto/profile/ProfileHero.jpg";

export default function CustomerProfilePage() {
    const router = useRouter();

    const [profile, setProfile] = useState<CustomerProfile | null>(null);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getCustomerProfile();

            setProfile(data);
            setUsername(data.username);
            setEmail(data.email);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal memuat profile."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleUpdateProfile = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!username.trim() || !email.trim()) {
            setError("Username dan email wajib diisi.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccessMessage("");

            const updatedProfile = await updateCustomerProfile({
                username: username.trim(),
                email: email.trim(),
            });

            setProfile(updatedProfile);
            setUsername(updatedProfile.username);
            setEmail(updatedProfile.email);

            localStorage.setItem(
                "meilody_user",
                JSON.stringify(updatedProfile)
            );

            setSuccessMessage("Profile berhasil diperbarui 🐾");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal memperbarui profile."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        clearAuthSession();
        router.push("/auth/login");
    };

    if (loading) {
        return (
            <section className="mx-auto max-w-7xl px-5 py-8">
                <div className="h-80 animate-pulse rounded-3xl bg-white" />
            </section>
        );
    }

    return (
        <section className="mx-auto max-w-7xl px-5 py-8">
            {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
                    {successMessage}
                </div>
            )}

            <div className="relative overflow-hidden rounded-3xl border border-[#A7E8B0]/50 bg-white p-8 shadow-sm md:p-10">
                <PawPrint className="absolute right-10 top-8 h-20 w-20 rotate-12 text-[#A7E8B0]/40" />

                <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                    <div>
                        <p className="mb-3 inline-flex rounded-full bg-[#F0FEF1] px-4 py-2 text-sm font-semibold text-[#013B09]">
                            Customer Profile
                        </p>

                        <h1 className="text-3xl font-bold leading-tight text-[#013B09] md:text-5xl">
                            Profile Akun Kamu
                        </h1>

                        <p className="mt-4 max-w-xl text-gray-600">
                            Lihat dan perbarui data akun customer MeiLody Paws.
                        </p>
                    </div>

                    <div className="relative hidden h-56 overflow-hidden rounded-3xl bg-[#F0FEF1] lg:block">
                        <Image
                            src={PROFILE_IMAGE}
                            alt="Profile MeiLody Paws"
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 40vw"
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-3xl border border-[#A7E8B0]/40 bg-white p-6 shadow-sm">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#F0FEF1] text-[#013B09]">
                            <UserRound size={48} />
                        </div>

                        <h2 className="mt-4 text-2xl font-bold text-[#013B09]">
                            {profile?.username}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {profile?.email}
                        </p>

                        <span className="mt-4 rounded-full bg-[#F0FEF1] px-4 py-2 text-sm font-semibold text-[#013B09]">
                            {profile?.role}
                        </span>
                    </div>

                    <div className="mt-6 space-y-3">
                        <div className="rounded-2xl bg-[#F0FEF1] p-4">
                            <p className="text-xs text-gray-500">User ID</p>
                            <p className="mt-1 font-semibold text-[#013B09]">
                                #{profile?.id}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-[#F0FEF1] p-4">
                            <p className="text-xs text-gray-500">
                                Bergabung Sejak
                            </p>
                            <p className="mt-1 font-semibold text-[#013B09]">
                                {profile?.createdAt
                                    ? new Intl.DateTimeFormat("id-ID", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    }).format(new Date(profile.createdAt))
                                    : "-"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 font-semibold text-white transition hover:bg-red-600"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>

                <form
                    onSubmit={handleUpdateProfile}
                    className="rounded-3xl border border-[#A7E8B0]/40 bg-white p-6 shadow-sm"
                >
                    <h2 className="text-2xl font-bold text-[#013B09]">
                        Edit Profile
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Ubah username dan email akun kamu.
                    </p>

                    <div className="mt-6 space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#013B09]">
                                Username
                            </label>

                            <div className="relative">
                                <UserRound
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    value={username}
                                    onChange={(event) =>
                                        setUsername(event.target.value)
                                    }
                                    className="h-12 w-full rounded-2xl border border-[#A7E8B0]/50 bg-[#F0FEF1] pl-11 pr-4 text-sm text-[#013B09] outline-none transition focus:border-[#013B09]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#013B09]">
                                Email
                            </label>

                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    className="h-12 w-full rounded-2xl border border-[#A7E8B0]/50 bg-[#F0FEF1] pl-11 pr-4 text-sm text-[#013B09] outline-none transition focus:border-[#013B09]"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#F96302] font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <Save size={18} />
                        {saving ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                </form>
            </div>
        </section>
    );
}