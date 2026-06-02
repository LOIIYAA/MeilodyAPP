import Image from "next/image";
import {
    Award,
    Heart,
    PawPrint,
    ShieldCheck,
    Users,
    Wallet,
} from "lucide-react";

const WHY_IMAGE = "/LandingpagePhoto/WhyGroomer.jpg";

const benefits = [
    {
        title: "One Animal One Groomer",
        desc: "Setiap anabul ditangani oleh satu groomer khusus.",
        icon: Users,
    },
    {
        title: "Standar Layanan Profesional",
        desc: "Mengutamakan sterilitas alat dan produk berkualitas.",
        icon: Award,
    },
    {
        title: "Nyaman & Terawat",
        desc: "Ruang grooming bersih, wangi, dan penuh kasih sayang.",
        icon: Heart,
    },
    {
        title: "Harga Terjangkau",
        desc: "Kualitas terbaik dengan harga yang bersahabat.",
        icon: Wallet,
    },
];

export default function KeunggulanSection() {
    return (
        <section id="keunggulan" className="relative bg-[#F0FEF1] px-6 py-20">
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
                {/* IMAGE */}
                <div className="relative">
                    <div className="relative h-107.5 overflow-hidden rounded-4xl bg-white shadow-sm">
                        <Image
                            src="/LandingpagePhoto/WhyGroomer.jpg"
                            alt="Professional pet groomer MeiLody Paws"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="absolute -left-4 bottom-8 rounded-full border-2 border-[#A7E8B0] bg-white px-6 py-5 text-center shadow-sm">
                        <PawPrint className="mx-auto mb-1 h-6 w-6 text-[#F96302]" />
                        <p className="text-sm font-bold leading-5 text-[#013B09]">
                            Safe
                            <br />
                            & Sanitize
                            <br />
                            & Love
                        </p>
                    </div>
                </div>

                {/* CONTENT */}
                <div>
                    <div className="mb-4 flex items-center gap-3">
                        <Heart className="h-7 w-7 text-[#F96302]" />
                        <h2 className="text-3xl font-bold text-[#013B09] md:text-4xl">
                            Kenapa Memilih MeiLody?
                        </h2>
                    </div>

                    <p className="mb-10 max-w-xl leading-7 text-gray-600">
                        Kami berkomitmen memberikan pengalaman terbaik untuk anabul dan
                        pawrent melalui layanan yang aman, nyaman, serta penuh perhatian.
                    </p>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {benefits.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.title}
                                    className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F0FEF1] text-[#013B09]">
                                        <Icon size={27} />
                                    </div>

                                    <h3 className="text-lg font-bold text-[#013B09]">
                                        {item.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-gray-600">
                                        {item.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <ShieldCheck className="absolute bottom-10 right-10 hidden h-16 w-16 text-[#A7E8B0]/60 lg:block" />
        </section>
    );
}