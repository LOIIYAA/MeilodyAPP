"use client";

import { CalendarDays, PawPrint } from "lucide-react";

import {
    getBookingStatusLabel,
    getBookingStatusStyle,
    getPaymentStatusLabel,
    getPaymentStatusStyle,
} from "@/lib/Customer_Service";

export function HistorySectionHeader({
    title,
    desc,
}: {
    title: string;
    desc: string;
}) {
    return (
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
                <h2 className="text-2xl font-bold text-[#013B09]">
                    {title}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    {desc}
                </p>
            </div>
        </div>
    );
}

export function BookingStatusBadge({
    status,
}: {
    status?: string | null;
}) {
    return (
        <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getBookingStatusStyle(
                status
            )}`}
        >
            {getBookingStatusLabel(status)}
        </span>
    );
}

export function PaymentStatusBadge({
    status,
}: {
    status?: string | null;
}) {
    return (
        <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getPaymentStatusStyle(
                status
            )}`}
        >
            {getPaymentStatusLabel(status)}
        </span>
    );
}

export function EmptyHistoryBox({
    title,
    desc,
}: {
    title: string;
    desc: string;
}) {
    return (
        <div className="rounded-3xl border border-dashed border-[#A7E8B0] bg-[#F0FEF1] p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#013B09]">
                <CalendarDays size={34} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-[#013B09]">
                {title}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
                {desc}
            </p>
        </div>
    );
}

export function HistorySummaryCard({
    title,
    value,
    desc,
}: {
    title: string;
    value: number;
    desc: string;
}) {
    return (
        <div className="rounded-3xl border border-[#A7E8B0]/40 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500">
                        {title}
                    </p>

                    <h3 className="mt-2 text-4xl font-bold text-[#013B09]">
                        {value}
                    </h3>

                    <p className="mt-2 text-xs text-gray-500">
                        {desc}
                    </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0FEF1] text-[#013B09]">
                    <PawPrint size={25} />
                </div>
            </div>
        </div>
    );
}