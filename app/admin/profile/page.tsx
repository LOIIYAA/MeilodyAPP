"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    LogOut,
    Mail,
    PawPrint,
    Save,
    ShieldCheck,
    UserRound,
} from "lucide-react";

import {
    AdminProfile,
    getAdminProfile,
    updateAdminProfile,
} from "@/lib/admin_service";

import { clearAuthSession } from "@/lib/authService";

export default function AdminProfilePage() {
    const router = useRouter();

    const [profile, setProfile] = useState<AdminProfile | null>(null);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminProfile();

            setProfile(data);
            setUsername(data.username);
            setEmail(data.email);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal memuat profile admin."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (
        event: FormEvent<HTMLFormElement>
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

            const updatedProfile = await updateAdminProfile({
                username: username.trim(),
                email: email.trim(),
            });

            setProfile(updatedProfile);
            setUsername(updatedProfile.username);
            setEmail(updatedProfile.email);

            if (typeof window !== "undefined") {
                localStorage.setItem(
                    "meilody_user",
                    JSON.stringify(updatedProfile)
                );
            }

            setSuccessMessage("Profile admin berhasil diperbarui.");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal memperbarui profile admin."
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
            <section className="space-y-6">
                <div className="h-48 animate-pulse rounded-3xl bg-white" />
                <div className="h-96 animate-pulse rounded-3xl bg-white" />
            </section>
        );
    }

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
                <ShieldCheck className="absolute right-10 top-8 h-24 w-24 rotate-12 text-white/10" />
                <PawPrint className="absolute bottom-6 right-44 h-14 w-14 -rotate-12 text-white/10" />

                <div className="relative z-10">
                    <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-[#A7E8B0]">
                        Admin Profile
                    </p>

                    <h1 className="text-3xl font-bold md:text-5xl">
                        Profile Admin
                    </h1>

                    <p className="mt-4 max-w-2xl text-white/75">
                        Kelola informasi akun admin yang sedang login di
                        MeiLody Paws.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                {/* PROFILE CARD */}
                <div className="rounded-3xl border border-[#A7E8B0]/40 bg-white p-6 shadow-sm">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#F0FEF1] text-[#013B09]">
                            <UserRound size={58} />
                        </div>

                        <h2 className="mt-5 text-2xl font-bold text-[#013B09]">
                            {profile?.username}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {profile?.email}
                        </p>

                        <span className="mt-4 inline-flex rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                            {profile?.role}
                        </span>
                    </div>

                    <div className="mt-7 space-y-4">
                        <InfoBox label="Admin ID" value={`#${profile?.id}`} />

                        <InfoBox
                            label="Bergabung Sejak"
                            value={
                                profile?.createdAt
                                    ? new Intl.DateTimeFormat("id-ID", {
                                          day: "2-digit",
                                          month: "long",
                                          year: "numeric",
                                      }).format(new Date(profile.createdAt))
                                    : "-"
                            }
                        />
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

                {/* UPDATE FORM */}
                <form
                    onSubmit={handleUpdateProfile}
                    className="rounded-3xl border border-[#A7E8B0]/40 bg-white p-6 shadow-sm"
                >
                    <h2 className="text-2xl font-bold text-[#013B09]">
                        Update Profile
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Ubah username dan email akun admin.
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
                                    placeholder="Masukkan username"
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
                                    placeholder="Masukkan email"
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

function InfoBox({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-3xl bg-[#F0FEF1] p-5">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="mt-1 font-semibold text-[#013B09]">{value}</p>
        </div>
    );
}
