"use client";

import { CalendarDays, Clock3 } from "lucide-react";
import { SectionTitle } from "./BookingShared";

interface StepChooseScheduleProps {
    selectedDate: string;
    selectedTime: string;
    availableSlots: string[];
    todayDate: string;
    loadingSlots: boolean;
    onDateChange: (date: string) => void;
    onTimeChange: (time: string) => void;
}

export default function StepChooseSchedule({
    selectedDate,
    selectedTime,
    availableSlots,
    todayDate,
    loadingSlots,
    onDateChange,
    onTimeChange,
}: StepChooseScheduleProps) {
    return (
        <div>
            <SectionTitle
                title="Pilih Tanggal & Jam"
                desc="Pilih tanggal grooming dan slot jam yang tersedia."
            />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-3xl border border-[#A7E8B0]/40 bg-[#F0FEF1] p-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#013B09]">
                        <CalendarDays size={30} />
                    </div>

                    <label className="mt-5 block text-sm font-semibold text-[#013B09]">
                        Tanggal Booking
                    </label>

                    <input
                        type="date"
                        value={selectedDate}
                        min={todayDate}
                        onChange={(event) => onDateChange(event.target.value)}
                        className="mt-3 h-12 w-full rounded-2xl border border-[#A7E8B0]/50 bg-white px-4 text-sm text-[#013B09] outline-none focus:border-[#013B09]"
                    />

                    <p className="mt-3 text-xs text-gray-500">
                        Sistem akan menampilkan slot tersedia berdasarkan tanggal
                        yang dipilih.
                    </p>
                </div>

                <div className="rounded-3xl border border-[#A7E8B0]/40 bg-white p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-[#013B09]">
                                Slot Jam
                            </h3>

                            <p className="text-sm text-gray-500">
                                Pilih salah satu jam grooming.
                            </p>
                        </div>

                        <Clock3 className="text-[#013B09]" size={26} />
                    </div>

                    {!selectedDate ? (
                        <div className="mt-5 rounded-2xl bg-[#F0FEF1] p-5 text-sm text-gray-500">
                            Pilih tanggal terlebih dahulu untuk melihat slot.
                        </div>
                    ) : loadingSlots ? (
                        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-12 animate-pulse rounded-2xl bg-[#F0FEF1]"
                                />
                            ))}
                        </div>
                    ) : availableSlots.length === 0 ? (
                        <div className="mt-5 rounded-2xl bg-[#F0FEF1] p-5 text-sm text-gray-500">
                            Tidak ada slot tersedia di tanggal ini.
                        </div>
                    ) : (
                        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
                            {availableSlots.map((slot) => {
                                const active = selectedTime === slot;

                                return (
                                    <button
                                        key={slot}
                                        type="button"
                                        onClick={() => onTimeChange(slot)}
                                        className={`h-12 rounded-2xl border text-sm font-semibold transition ${
                                            active
                                                ? "border-[#013B09] bg-[#013B09] text-white"
                                                : "border-[#A7E8B0]/50 bg-[#F0FEF1] text-[#013B09] hover:border-[#013B09]"
                                        }`}
                                    >
                                        {slot}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}