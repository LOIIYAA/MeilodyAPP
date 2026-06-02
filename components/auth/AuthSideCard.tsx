import Image from "next/image";
import { BadgeCheck, Star } from "lucide-react";

interface AuthSideCardProps {
    image: string;
    variant: "login" | "register";
}

export default function AuthSideCard({ image, variant }: AuthSideCardProps) {
    const text =
        variant === "register"
            ? "MeiLody memahami bahwa setiap hewan peliharaan bukan sekadar peliharaan, tetapi bagian berharga dari rumah dan cerita hidup Anda. Karena itu, setiap layanan kami hadir dengan kehangatan."
            : "Setiap pelayanan di MeiLody membawa janji. Setiap peliharaan berjalan melangkah ke MeiLody, kita akan menyambutnya lembut seperti keluarga kami.";

    const label =
        variant === "register" ? "Pelayanan Profesional" : "With Love, MeiLody team";

    return (
        <div className="space-y-6">
            <div className="relative h-90 overflow-hidden rounded-3xl bg-white shadow-sm lg:h-130">
                <Image src={image} alt="MeiLody Auth" fill className="object-cover" />
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-sm">
                <p className="text-xl leading-9 text-[#013B09]">
                    {variant === "login" ? (
                        <>
                            Setiap pelayanan di <strong>MeiLody membawa janji.</strong> Setiap
                            peliharaan berjalan melangkah ke MeiLody, kita akan{" "}
                            <strong>menyambutnya lembut seperti keluarga kami.</strong>
                        </>
                    ) : (
                        text
                    )}
                </p>

                <div className="mt-6 flex items-center gap-3 text-[#F96302]">
                    {variant === "register" ? (
                        <BadgeCheck size={20} />
                    ) : (
                        <Star size={20} fill="currentColor" />
                    )}

                    <span className="font-medium">{label}</span>
                </div>
            </div>
        </div>
    );
}