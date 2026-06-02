"use client";

import Link from "next/link";
import { PawPrint, Plus } from "lucide-react";

export function SectionTitle({
    title,
    desc,
}: {
    title: string;
    desc: string;
}) {
    return (
        <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#013B09]">
                {title}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
                {desc}
            </p>
        </div>
    );
}

export function InfoBox({
    label,
    value,
    highlight = false,
}: {
    label: string;
    value?: string;
    highlight?: boolean;
}) {
    return (
        <div className="rounded-2xl bg-[#F0FEF1] p-4">
            <p className="text-xs text-gray-500">
                {label}
            </p>

            <p
                className={`mt-1 font-bold ${
                    highlight ? "text-[#F96302]" : "text-[#013B09]"
                }`}
            >
                {value || "-"}
            </p>
        </div>
    );
}

export function EmptyBox({
    text,
    actionHref,
    actionText,
}: {
    text: string;
    actionHref?: string;
    actionText?: string;
}) {
    return (
        <div className="rounded-3xl border border-dashed border-[#A7E8B0] bg-[#F0FEF1] p-10 text-center">
            <PawPrint className="mx-auto h-14 w-14 text-[#013B09]" />

            <p className="mt-4 text-sm text-gray-500">
                {text}
            </p>

            {actionHref && actionText && (
                <Link
                    href={actionHref}
                    className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#F96302] px-6 py-4 font-semibold text-white transition hover:bg-orange-600"
                >
                    <Plus size={20} />
                    {actionText}
                </Link>
            )}
        </div>
    );
}