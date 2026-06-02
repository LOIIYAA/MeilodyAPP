"use client";

import { CheckCircle2, XCircle } from "lucide-react";

interface AuthToastProps {
    show: boolean;
    type: "success" | "error";
    title: string;
    message: string;
}

export default function AuthToast({
    show,
    type,
    title,
    message,
}: AuthToastProps) {
    if (!show) return null;

    return (
        <div className="fixed top-6 right-6 z-9999 animate-in slide-in-from-top">
            <div
                className={`min-w-[320px] rounded-2xl p-4 shadow-xl border bg-white ${type === "success"
                        ? "border-green-200"
                        : "border-red-200"
                    }`}
            >
                <div className="flex gap-3">
                    {type === "success" ? (
                        <CheckCircle2 className="text-green-500" size={24} />
                    ) : (
                        <XCircle className="text-red-500" size={24} />
                    )}

                    <div>
                        <h3 className="font-semibold text-[#013B09]">
                            {title}
                        </h3>

                        <p className="text-sm text-gray-500">
                            {message}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}