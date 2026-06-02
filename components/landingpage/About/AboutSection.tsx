"use client";

export default function AboutSection() {
    return (
        <section className="py-20 bg-[#F0FEF1]">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
                {/* Text content */}
                <div className="flex-1">
                    <span className="text-orange-500 uppercase text-sm tracking-wider mb-2 inline-block">
                        Tentang MeiLody Paws
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#013B09] mb-4">
                        Lebih dari sekadar tempat grooming.
                    </h2>
                    <p className="text-gray-700 mb-6">
                        MeiLody Paws hadir untuk memberikan pengalaman grooming terbaik
                        dengan penuh kasih sayang, perhatian, dan standar profesional tinggi.
                        Kami percaya setiap hewan peliharaan layak mendapatkan yang terbaik.
                    </p>

                    <a
                        href="/auth/login"
                        className="px-6 py-3 rounded-lg bg-[#F96302] text-white font-semibold hover:bg-orange-600 transition"
                    >
                        Reservasi Sekarang
                    </a>
                </div>

                {/* Image placeholder */}
                <div className="flex-1 relative">
                    <img
                        src="/AboutMeilody/AboutMeilody.jpg"
                        alt="About MeiLody Paws"
                        className="w-full h-96 object-cover rounded-xl shadow-lg"
                    />

                    {/* Highlight card */}
                    <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow flex items-center gap-2 w-64">
                        <span className="text-orange-500 text-xl">❤️</span>
                        <div>
                            <p className="text-sm font-semibold text-[#013B09]">
                                Dibangun dengan Cinta
                            </p>
                            <p className="text-xs text-gray-600">
                                Kami memperlakukan setiap hewan seperti keluarga.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Keunggulan section */}
            <div className="max-w-6xl mx-auto px-6 mt-20">
                <h3 className="text-xl font-semibold text-center text-[#013B09] mb-6">
                    Apa yang membuat kami berbeda?
                </h3>

                <div className="grid md:grid-cols-4 gap-6">
                    {[
                        { title: "Aman & Nyaman", desc: "Keamanan dan kenyamanan hewan peliharaan adalah prioritas utama kami." },
                        { title: "Groomer Profesional", desc: "Ditangani oleh groomer berpengalaman dan tersertifikasi di bidangnya." },
                        { title: "Produk Berkualitas", desc: "Kami menggunakan produk premium yang aman dan ramah untuk hewan." },
                        { title: "Layanan Personal", desc: "Kami memberikan perhatian khusus sesuai kebutuhan masing-masing hewan." }
                    ].map((item) => (
                        <div key={item.title} className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
                            <h4 className="font-semibold text-[#013B09] mb-2">{item.title}</h4>
                            <p className="text-gray-600 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="bg-[#F0FEF1] mt-12 rounded-xl p-6 flex justify-between items-center">
                    <p className="text-[#013B09] font-semibold">
                        Yuk, berikan pengalaman grooming terbaik untuk sahabat berbulu Anda!
                    </p>
                    <a
                        href="/auth/login"
                        className="px-6 py-3 rounded-lg bg-[#F96302] text-white font-semibold hover:bg-orange-600 transition"
                    >
                        Reservasi Sekarang
                    </a>
                </div>
            </div>
        </section>
    );
}