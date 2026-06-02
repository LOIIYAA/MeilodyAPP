export default function Footer() {
    return (
        <footer className="bg-[#F0FEF1] ">
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                    {/* Brand */}
                    <div>
                        <h2 className="text-2xl font-bold text-[#013B09]">
                            MeiLody Paws
                        </h2>

                        <p className="mt-3 text-gray-600 max-w-sm">
                            Menyambut setiap anabul layaknya keluarga, dengan pelayanan
                            grooming yang nyaman, aman, dan profesional.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="font-semibold text-[#013B09] mb-3">
                            Navigasi
                        </h3>

                        <ul className="space-y-2 text-gray-600">
                            <li>
                                <a href="#home" className="hover:text-[#013B09]">
                                    Beranda
                                </a>
                            </li>

                            <li>
                                <a href="#service" className="hover:text-[#013B09]">
                                    Layanan
                                </a>
                            </li>

                            <li>
                                <a href="#keunggulan" className="hover:text-[#013B09]">
                                    Keunggulan
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-[#013B09] mb-3">
                            Kontak
                        </h3>

                        <div className="space-y-2 text-gray-600">
                            <p>📍 Malang, Jawa Timur</p>
                            <p>📞 0812-3456-7890</p>
                            <p>✉️ admin@meilody.com</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="border-t mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">
                        © 2026 MeiLody Paws. All Rights Reserved.
                    </p>

                    <a
                        href="#home"
                        className="px-4 py-2 bg-[#F96302] text-white rounded-lg hover:bg-orange-600 transition"
                    >
                        Kembali ke Atas ↑
                    </a>
                </div>
            </div>
        </footer>
    );
}