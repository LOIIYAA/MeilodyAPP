import { Clock, PawPrint, Star, Users } from "lucide-react";

const stats = [
    {
        icon: PawPrint,
        value: "500+",
        label: "Happy Pets",
    },
    {
        icon: Users,
        value: "100+",
        label: "Customers",
    },
    {
        icon: Star,
        value: "4.9",
        label: "Rating",
    },
    {
        icon: Clock,
        value: "24/7",
        label: "Care",
    },
];

export default function StatsSection() {
    return (
        <section className="bg-[#F0FEF1] px-6 py-6">
            <div className="mx-auto max-w-7xl rounded-3xl border border-[#A7E8B0]/50 bg-[#E9F8EA] p-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.label}
                                className="relative overflow-hidden rounded-2xl bg-white px-6 py-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#013B09] text-white">
                                        <Icon size={26} />
                                    </div>

                                    <div>
                                        <h3 className="text-2xl font-bold text-[#013B09]">
                                            {stat.value}
                                        </h3>
                                        <p className="text-sm text-gray-600">{stat.label}</p>
                                    </div>
                                </div>

                                <PawPrint className="absolute bottom-4 right-5 h-7 w-7 rotate-12 text-[#A7E8B0]" />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}