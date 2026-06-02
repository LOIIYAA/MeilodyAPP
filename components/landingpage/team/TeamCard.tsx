"use client";
import {
    FaGithub,
    FaLinkedin,
    FaEnvelope,
} from "react-icons/fa";
import PawDecor from "./PawDecor";

interface TeamCardProps {
    name: string;
    role: string;
    desc: string;
    img: string;
    techStack: string[];
    socials: { github: string; linkedin: string; mail: string };
}

export default function TeamCard({ name, role, desc, img, techStack, socials }: TeamCardProps) {
    return (
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center gap-4 hover:shadow-lg transition relative">
            <img src={img}  alt={name} className="w-32 h-32 object-cover rounded-full" />
            <h3 className="text-lg font-semibold text-[#013B09]">{name}</h3>
            <p className="text-orange-500 font-medium">{role}</p>
            <p className="text-gray-600 text-center">{desc}</p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 justify-center mt-2">
                {techStack.map((tech) => (
                    <span key={tech} className="text-sm px-2 py-1 bg-[#F0FEF1] rounded-full text-[#013B09]">{tech}</span>
                ))}
            </div>

            {/* Socials */}
            <div className="flex gap-4 mt-2">
                <a href={socials.github} target="_blank" rel="noopener noreferrer">
                    <FaGithub className="text-[#F96302] text-xl hover:text-[#A7E8B0]" />
                </a>
                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin className="text-[#F96302] text-xl hover:text-[#A7E8B0]" />
                </a>
                <a href={socials.mail}>
                    <FaEnvelope className="text-[#F96302] text-xl hover:text-[#A7E8B0]" />
                </a>
            </div>

            {/* Decorative paw */}
            <PawDecor className="absolute top-4 right-4 text-2xl" />
        </div>
    );
}