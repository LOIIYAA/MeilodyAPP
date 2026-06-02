import Image from "next/image";
import Link from "next/link";
import {
    CalendarDays,
    Heart,
    PawPrint,
    ShieldCheck,
    Sparkles,
    Star,
} from "lucide-react";

const HERO_IMAGE = "/LandingpagePhoto/HeroPets.jpg";

export default function HeroSection() {
    return (
        <section id="home" className="relative overflow-hidden bg-[#F0FEF1]">
            {/* DECORATION */}
            <PawPrint className="absolute left-8 top-20 h-14 w-14 rotate-[-20deg] text-[#A7E8B0]/50" />
            <PawPrint className="absolute bottom-24 left-12 h-12 w-12 rotate-12 text-[#A7E8B0]/50" />
            <PawPrint className="absolute right-10 top-40 h-16 w-16 rotate-12 text-[#A7E8B0]/50" />

            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-10 pt-10 lg:grid-cols-2 lg:pt-16">
                {/* LEFT CONTENT */}
                <div className="relative z-10">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#013B09] shadow-sm">
                        <ShieldCheck size={17} className="text-[#013B09]" />
                        Trusted Pet Grooming
                    </div>

                    <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight text-[#013B09] md:text-6xl">
                        Where Every
                        <br />
                        Paw Feels at Home
                        <Heart className="ml-4 inline h-9 w-9 text-[#F96302]" />
                    </h1>

                    <div className="mt-3 h-1 w-28 rounded-full bg-[#013B09]" />

                    <p className="mt-6 max-w-xl text-base leading-8 text-gray-700 md:text-lg">
                        Grooming yang nyaman, aman, dan profesional untuk anabul kesayangan
                        Anda di Malang. Karena setiap paw berhak tampil sehat dan bahagia.
                    </p>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                        <Link
                            href="/auth/login"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F96302] px-6 py-4 font-semibold text-white shadow-sm transition hover:bg-orange-600"
                        >
                            <CalendarDays size={18} />
                            Booking Sekarang
                        </Link>

                        <Link
                            href="#service"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#013B09] bg-white px-6 py-4 font-semibold text-[#013B09] transition hover:bg-[#013B09] hover:text-white"
                        >
                            <PawPrint size={18} />
                            Explore Service
                        </Link>
                    </div>
                </div>

                {/* RIGHT IMAGE */}
                <div className="relative">
                    <div className="relative h-107.5 overflow-hidden rounded-[3rem] bg-[#A7E8B0]/40 shadow-sm md:h-130">
                        <Image
                            src="/LandingpagePhoto/HeroPets.jpg"
                            alt="Happy pet grooming MeiLody Paws"
                            fill
                            priority
                            className="object-cover"
                        />
                    </div>

                    {/* FLOATING CARDS */}
                    <div className="absolute right-4 top-10 hidden w-44 rounded-2xl bg-white p-4 shadow-lg md:block">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#013B09] text-white">
                                <Star size={20} />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-[#013B09]">4.9 / 5</p>
                                <p className="text-xs text-gray-500">Rating Pelanggan</p>
                            </div>
                        </div>

                        <div className="mt-2 flex gap-1 text-[#F96302]">
                            <Star size={13} fill="currentColor" />
                            <Star size={13} fill="currentColor" />
                            <Star size={13} fill="currentColor" />
                            <Star size={13} fill="currentColor" />
                            <Star size={13} fill="currentColor" />
                        </div>
                    </div>

                    <div className="absolute right-8 top-44 hidden w-40 rounded-2xl bg-white p-4 shadow-lg md:block">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#013B09] text-white">
                                <PawPrint size={20} />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-[#013B09]">500+</p>
                                <p className="text-xs text-gray-500">Happy Pets</p>
                            </div>
                        </div>
                    </div>

                    <div className="absolute right-4 top-72 hidden w-44 rounded-2xl bg-white p-4 shadow-lg md:block">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#013B09] text-white">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-[#013B09]">
                                    Professional
                                </p>
                                <p className="text-xs text-gray-500">Groomer</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}