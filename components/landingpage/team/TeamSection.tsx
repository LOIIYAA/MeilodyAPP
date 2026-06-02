"use client";

import TeamCard from "./TeamCard";
import { teamMembers } from "@/data/dummyData";

export default function TeamSection() {
    return (
        <section
            id="team"
            className="w-full  bg-[#F0FEF1] py-20"
        >
            <div className="max-w-6xl mx-auto px-6">

                <h2 className="text-3xl md:text-4xl font-bold text-center text-[#013B09] mb-4">
                    Meet The Minds Behind
                    <span className="text-orange-500">
                        {" "}MeiLody Paws
                    </span>
                </h2>

                <p className="text-center text-gray-600 mb-12">
                    Kami adalah tim developer yang berdedikasi untuk membangun
                    pengalaman terbaik bagi pengguna MeiLody Paws.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {teamMembers.map((member) => (
                        <TeamCard
                            key={member.id}
                            name={member.name}
                            role={member.role}
                            desc={member.desc}
                            img={member.img}
                            techStack={member.techStack}
                            socials={member.socials}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}