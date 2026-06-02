import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Heart, PawPrint } from "lucide-react";

const CTA_IMAGE = "/LandingpagePhoto/CtaPets.jpg";

export default function CtaBanner() {
    return (
        <section className="bg-[#F0FEF1] px-6 py-12">
            <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#013B09] px-8 py-10 shadow-sm md:px-12">
                <PawPrint className="absolute left-6 top-8 h-20 w-20 rotate-12 text-white/10" />
                <PawPrint className="absolute right-10 bottom-10 h-16 w-16 rotate-[-20deg] text-white/10" />

                <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.3fr_0.8fr]">
                    <div>
                        <h2 className="text-3xl font-bold leading-tight text-white md:text-4xl">
                            Ready to Pamper Your Lovely Pet?
                            <Heart className="ml-3 inline h-8 w-8 text-[#F96302]" />
                        </h2>

                        <p className="mt-4 max-w-2xl leading-7 text-white/80">
                            Booking sekarang dan berikan pengalaman grooming terbaik untuk
                            anabul kesayangan Anda.
                        </p>

                        <Link
                            href="/auth/login"
                            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#F96302] px-7 py-4 font-semibold text-white transition hover:bg-orange-600"
                        >
                            <CalendarDays size={18} />
                            Booking Sekarang
                        </Link>
                    </div>

                    <div className="relative hidden h-52 lg:block rounded-2xl overflow-hidden">
                        <Image
                            src="/LandingpagePhoto/CtaPets.jpg"
                            alt="Lovely pets MeiLody Paws"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}