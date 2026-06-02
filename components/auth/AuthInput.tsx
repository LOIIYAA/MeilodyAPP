"use client";

import { ReactNode } from "react";

interface AuthInputProps {
    label: string;
    type: string;
    placeholder: string;
    value: string;
    icon: ReactNode;
    rightIcon?: ReactNode;
    onChange: (value: string) => void;
}

export default function AuthInput({
    label,
    type,
    placeholder,
    value,
    icon,
    rightIcon,
    onChange,
}: AuthInputProps) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-[#013B09]">
                {label}
            </label>

            <div className="flex h-12 items-center gap-3 rounded-xl bg-white px-4 shadow-sm">
                <span className="text-gray-400">{icon}</span>

                <input
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    onChange={(event) => onChange(event.target.value)}
                    className="w-full bg-transparent text-sm text-[#013B09] outline-none placeholder:text-gray-400"
                />

                {rightIcon && <span className="text-gray-400">{rightIcon}</span>}
            </div>
        </div>
    );
}