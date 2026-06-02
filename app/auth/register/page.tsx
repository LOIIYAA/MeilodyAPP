"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import {
    ArrowRight,
    Eye,
    EyeOff,
    Lock,
    Mail,
    PawPrint,
    User,
} from "lucide-react";

import AuthInput from "@/components/auth/AuthInput";
import AuthSideCard from "@/components/auth/AuthSideCard";
import AuthToast from "@/components/auth/AuthToast";
import { registerCustomer } from "@/lib/authService";

const REGISTER_IMAGE = "/AuthPhoto/RegisterImage.jpg";

export default function RegisterPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [agree, setAgree] = useState(false);
    const [loading, setLoading] = useState(false);

    const [toast, setToast] = useState({
        show: false,
        type: "success" as "success" | "error",
        title: "",
        message: "",
    });

    const showToast = (
        type: "success" | "error",
        title: string,
        message: string
    ) => {
        setToast({
            show: true,
            type,
            title,
            message,
        });
    };

    const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!username || !email || !password) {
            showToast(
                "error",
                "Data belum lengkap",
                "Username, email, dan password wajib diisi."
            );
            return;
        }

        if (password.length < 6) {
            showToast(
                "error",
                "Password terlalu pendek",
                "Password minimal 6 karakter."
            );
            return;
        }

        if (!agree) {
            showToast(
                "error",
                "Persetujuan diperlukan",
                "Kamu harus menyetujui Terms and Condition."
            );
            return;
        }

        try {
            setLoading(true);

            await registerCustomer({
                username,
                email,
                password,
                role: "CUSTOMER",
            });

            showToast(
                "success",
                "Registrasi berhasil!",
                "Mengarahkan ke halaman login..."
            );

            setTimeout(() => {
                router.push("/auth/login");
            }, 2000);
        } catch (error) {
            showToast(
                "error",
                "Registrasi gagal",
                error instanceof Error
                    ? error.message
                    : "Terjadi kesalahan saat register."
            );

            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#F0FEF1] px-5 py-8 text-[#013B09]">
            <AuthToast
                show={toast.show}
                type={toast.type}
                title={toast.title}
                message={toast.message}
            />

            <div className="mx-auto max-w-7xl">
                {/* LOGO */}
                <Link href="/" className="mb-8 inline-flex items-center gap-3">
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
                        <PawPrint className="h-7 w-7 text-[#013B09]" />

                        <span className="absolute bottom-2 right-2 h-2.5 w-2.5 rounded-full bg-[#F96302]" />
                    </div>

                    <span className="text-xl font-bold">
                        MeiLody Paws
                    </span>
                </Link>

                <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
                    {/* LEFT IMAGE CARD */}
                    <div className="hidden lg:block">
                        <AuthSideCard
                            image={REGISTER_IMAGE}
                            variant="register"
                        />
                    </div>

                    {/* FORM CARD */}
                    <section className="rounded-3xl bg-white/65 p-6 shadow-sm backdrop-blur md:p-10 lg:p-12">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold md:text-4xl">
                                Daftar dan Bergabung
                            </h1>

                            <p className="mt-2 text-gray-500">
                                Sudah memiliki akun?{" "}
                                <Link
                                    href="/auth/login"
                                    className="font-semibold text-[#F96302]"
                                >
                                    Masuk
                                </Link>
                            </p>
                        </div>

                        {/* GOOGLE BUTTON UI */}
                        <button
                            type="button"
                            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-white text-sm font-semibold text-[#013B09] shadow-sm transition hover:bg-gray-50"
                        >
                            <span className="text-xl font-bold text-[#4285F4]">
                                G
                            </span>

                            Daftar dengan Google
                        </button>

                        <div className="my-8 flex items-center gap-4 text-sm text-gray-400">
                            <div className="h-px flex-1 bg-gray-200" />
                            Atau
                            <div className="h-px flex-1 bg-gray-200" />
                        </div>

                        <form onSubmit={handleRegister} className="space-y-5">
                            <AuthInput
                                label="Username"
                                type="text"
                                placeholder="Masukkan username Anda"
                                value={username}
                                onChange={setUsername}
                                icon={<User size={18} />}
                            />

                            <AuthInput
                                label="Email"
                                type="email"
                                placeholder="Masukkan alamat email Anda"
                                value={email}
                                onChange={setEmail}
                                icon={<Mail size={18} />}
                            />

                            <AuthInput
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Masukkan kata sandi Anda"
                                value={password}
                                onChange={setPassword}
                                icon={<Lock size={18} />}
                                rightIcon={
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="flex items-center"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                }
                            />

                            <label className="flex items-start gap-3 text-sm text-gray-500">
                                <input
                                    type="checkbox"
                                    checked={agree}
                                    onChange={(event) =>
                                        setAgree(event.target.checked)
                                    }
                                    className="mt-1 h-5 w-5 rounded border-gray-300"
                                />

                                <span>
                                    Dengan membuat akun, menyatakan setuju dengan{" "}
                                    <span className="font-semibold text-[#013B09]">
                                        Terms and Condition
                                    </span>
                                </span>
                            </label>

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#F96302] font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {loading ? "Memproses..." : "Daftar"}
                                <ArrowRight size={20} />
                            </button>
                        </form>
                    </section>
                </div>

                <p className="mt-8 text-center text-sm text-gray-500">
                    © 2026 MeiLody Paws. All rights reserved.
                </p>
            </div>
        </main>
    );
}