import Image from "next/image";
import Link from "next/link";
import {
    CheckCircle2,
    Crown,
    Gem,
    PawPrint,
    Scissors,
} from "lucide-react";

const packages = [
    {
        title: "Grooming Lite",
        desc: "Perawatan dasar untuk menjaga kebersihan dan kesegaran.",
        price: "Rp 120.000",
        img: "/LandingpagePhoto/ServiceLite.jpg",
        icon: Scissors,
        badgeColor: "bg-[#013B09]",
        features: ["Mandi & Blow", "Cukur", "Potong Kuku"],
    },
    {
        title: "Grooming Standard",
        desc: "Perawatan lengkap untuk anabul yang aktif dan menggemaskan.",
        price: "Rp 200.000",
        img: "/LandingpagePhoto/ServiceStandard.jpg",
        icon: Crown,
        badgeColor: "bg-[#F96302]",
        popular: true,
        features: [
            "Mandi & Blow",
            "Hair Cut",
            "Bersih Telinga",
            "Potong Kuku",
            "Pawfume",
        ],
    },
    {
        title: "Grooming Premium",
        desc: "Perawatan eksklusif untuk anabul tersayang Anda.",
        price: "Rp 350.000",
        img: "/LandingpagePhoto/ServicePremium.jpg",
        icon: Gem,
        badgeColor: "bg-[#013B09]",
        features: [
            "Mandi & Spa",
            "Hair Cut",
            "Bersih Telinga",
            "Potong Kuku",
            "Pawfume",
            "Treatment",
        ],
    },
];

export default function ServiceSection() {
    return (
        <section id="service" className="relative overflow-hidden bg-[#F0FEF1] px-6 py-20">
            <PawPrint className="absolute left-10 top-20 h-12 w-12 rotate-12 text-[#A7E8B0]/60" />
            <PawPrint className="absolute right-12 top-32 h-16 w-16 rotate-[-15deg] text-[#A7E8B0]/60" />
            <PawPrint className="absolute bottom-16 left-6 h-12 w-12 rotate-[-20deg] text-[#A7E8B0]/60" />

            <div className="mx-auto max-w-7xl">
                <div className="mb-12 text-center">
                    <div className="mb-3 flex items-center justify-center gap-3 text-[#A7E8B0]">
                        <PawPrint size={24} />
                        <h2 className="text-3xl font-bold text-[#013B09] md:text-4xl">
                            Layanan MeiLody
                        </h2>
                        <PawPrint size={24} />
                    </div>

                    <p className="text-gray-600">
                        Paket premium untuk perawatan terbaik anabul Anda.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {packages.map((pkg) => {
                        const Icon = pkg.icon;

                        return (
                            <div
                                key={pkg.title}
                                className={`relative overflow-hidden rounded-3xl bg-white p-4 shadow-sm transition hover:-translate-y-2 hover:shadow-xl ${pkg.popular ? "border-2 border-[#A7E8B0]" : "border border-gray-100"
                                    }`}
                            >
                                {pkg.popular && (
                                    <div className="absolute right-4 top-4 z-20 rounded-bl-xl rounded-tr-2xl bg-[#013B09] px-4 py-2 text-xs font-semibold text-white">
                                        Most Popular
                                    </div>
                                )}

                                <div className="relative h-52 overflow-hidden rounded-2xl bg-[#F0FEF1]">
                                    <Image
                                        src={pkg.img}
                                        alt={pkg.title}
                                        fill
                                        className="object-cover transition duration-500 hover:scale-105"
                                    />

                                    <div
                                        className={`absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full ${pkg.badgeColor} text-white shadow-md`}
                                    >
                                        <Icon size={22} />
                                    </div>
                                </div>

                                <div className="px-3 pb-4 pt-6 text-center">
                                    <h3 className="text-2xl font-bold text-[#013B09]">
                                        {pkg.title}
                                    </h3>

                                    <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-gray-600">
                                        {pkg.desc}
                                    </p>

                                    <div className="mt-6 grid grid-cols-2 gap-3 text-left">
                                        {pkg.features.map((feature) => (
                                            <div
                                                key={feature}
                                                className="flex items-center gap-2 text-xs text-gray-700"
                                            >
                                                <CheckCircle2
                                                    size={14}
                                                    className="shrink-0 text-[#013B09]"
                                                />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <p className="mt-6 text-2xl font-bold text-[#F96302]">
                                        {pkg.price}
                                    </p>

                                    <Link
                                        href="/auth/login"
                                        className="mt-5 inline-flex rounded-xl bg-[#F96302] px-8 py-3 font-semibold text-white transition hover:bg-orange-600"
                                    >
                                        Pilih Paket
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}