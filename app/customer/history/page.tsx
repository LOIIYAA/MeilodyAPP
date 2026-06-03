"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, PawPrint, RefreshCcw, Search } from "lucide-react";

import {
    CustomerBooking,
    CustomerTransaction,
    cancelBooking,
    downloadInvoice,
    getBookingHistory,
    getCurrentBookings,
    getMyTransactions,
    getBookingTotal,
    uploadTransaction,
} from "@/lib/Customer_Service";

import HistoryBookingCard from "@/components/customer/history/HistoryBookingCard";

import {
    EmptyHistoryBox,
    HistorySectionHeader,
    HistorySummaryCard,
} from "@/components/customer/history/HistoryShared";

/* =========================
   STATUS FILTERS
========================= */

const STATUS_FILTERS = [
    { label: "Semua", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Paid", value: "paid" },
    { label: "Proses Grooming", value: "proses_grooming" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
];

/* =========================
   NORMALIZE HELPERS
========================= */

function normalizeBookings(data: unknown): CustomerBooking[] {
    if (Array.isArray(data)) {
        return data.filter((item) => item && item.id);
    }

    const response = data as {
        data?: CustomerBooking[] | { bookings?: CustomerBooking[] };
        bookings?: CustomerBooking[];
        history?: CustomerBooking[];
    };

    if (Array.isArray(response?.bookings)) {
        return response.bookings.filter((item) => item && item.id);
    }

    if (Array.isArray(response?.history)) {
        return response.history.filter((item) => item && item.id);
    }

    if (Array.isArray(response?.data)) {
        return response.data.filter((item) => item && item.id);
    }

    if (
        response?.data &&
        !Array.isArray(response.data) &&
        Array.isArray(response.data.bookings)
    ) {
        return response.data.bookings.filter((item) => item && item.id);
    }

    return [];
}

function normalizeTransactions(data: unknown): CustomerTransaction[] {
    if (Array.isArray(data)) {
        return data.filter((item) => item && item.id);
    }

    const response = data as {
        data?: CustomerTransaction[] | { transactions?: CustomerTransaction[] };
        transactions?: CustomerTransaction[];
    };

    if (Array.isArray(response?.transactions)) {
        return response.transactions.filter((item) => item && item.id);
    }

    if (Array.isArray(response?.data)) {
        return response.data.filter((item) => item && item.id);
    }

    if (
        response?.data &&
        !Array.isArray(response.data) &&
        Array.isArray(response.data.transactions)
    ) {
        return response.data.transactions.filter((item) => item && item.id);
    }

    return [];
}

type TransactionWithBookingRef = CustomerTransaction & {
    bookingId?: number | string | null;
    booking_id?: number | string | null;
    booking?: {
        id?: number | string | null;
    };
};

function getTransactionBookingId(transaction?: CustomerTransaction | null) {
    if (!transaction) return null;

    const trx = transaction as TransactionWithBookingRef;

    return trx.bookingId ?? trx.booking_id ?? trx.booking?.id ?? null;
}

function findTransactionByBookingId(
    transactions: CustomerTransaction[],
    bookingId: number
) {
    return (
        transactions.find(
            (transaction) =>
                Number(getTransactionBookingId(transaction)) ===
                Number(bookingId)
        ) ?? null
    );
}

/* =========================
   LOCAL STORAGE HELPERS
========================= */

const LOCAL_TRANSACTION_KEY = "meilody_uploaded_transactions";

function getLocalTransactions(): CustomerTransaction[] {
    if (typeof window === "undefined") return [];

    try {
        const raw = localStorage.getItem(LOCAL_TRANSACTION_KEY);
        const parsed = raw ? JSON.parse(raw) : [];

        return Array.isArray(parsed)
            ? parsed.filter((item) => item && getTransactionBookingId(item))
            : [];
    } catch {
        return [];
    }
}

function saveLocalTransaction(transaction: CustomerTransaction) {
    if (typeof window === "undefined") return;

    const bookingId = getTransactionBookingId(transaction);
    if (!bookingId) return;

    const existing = getLocalTransactions();

    const filtered = existing.filter(
        (item) =>
            Number(getTransactionBookingId(item)) !== Number(bookingId)
    );

    localStorage.setItem(
        LOCAL_TRANSACTION_KEY,
        JSON.stringify([transaction, ...filtered])
    );
}

function mergeTransactions(
    apiTransactions: CustomerTransaction[],
    localTransactions: CustomerTransaction[]
) {
    const merged = [...localTransactions, ...apiTransactions];

    const uniqueByBooking = new Map<number, CustomerTransaction>();

    merged.forEach((transaction) => {
        const bookingId = getTransactionBookingId(transaction);
        if (!bookingId) return;

        uniqueByBooking.set(Number(bookingId), transaction);
    });

    return Array.from(uniqueByBooking.values());
}

/* =========================
   FILTER HELPER
========================= */

function filterBookings(
    bookings: CustomerBooking[],
    keyword: string,
    statusFilter: string
) {
    return bookings.filter((booking) => {
        // Filter by status
        if (statusFilter !== "all") {
            const bookingStatus = String(booking.status || "")
                .toLowerCase()
                .replace(/ /g, "_");
            const filterValue = statusFilter.toLowerCase();

            if (bookingStatus !== filterValue) return false;
        }

        // Filter by search keyword
        const query = keyword.toLowerCase().trim();
        if (!query) return true;

        return (
            booking.id.toString().includes(query) ||
            String(booking.status || "").toLowerCase().includes(query) ||
            String(booking.jam || "").toLowerCase().includes(query) ||
            String(booking.tanggal || "").toLowerCase().includes(query) ||
            String(booking.pet?.name || "").toLowerCase().includes(query) ||
            String(booking.pet?.type || "").toLowerCase().includes(query) ||
            String(booking.package?.name || "").toLowerCase().includes(query)
        );
    });
}

/* =========================
   PAGE COMPONENT
========================= */

export default function CustomerHistoryPage() {
    const [currentBookings, setCurrentBookings] = useState<CustomerBooking[]>(
        []
    );
    const [historyBookings, setHistoryBookings] = useState<CustomerBooking[]>(
        []
    );
    const [transactions, setTransactions] = useState<CustomerTransaction[]>([]);

    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [cancellingId, setCancellingId] = useState<number | null>(null);
    const [uploadingId, setUploadingId] = useState<number | null>(null);
    const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<
        number | null
    >(null);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        fetchHistoryData();
    }, []);

    async function fetchHistoryData() {
        try {
            setLoading(true);
            setError("");

            const [currentData, historyData, transactionsData] =
                await Promise.all([
                    getCurrentBookings(),
                    getBookingHistory(),
                    getMyTransactions(),
                ]);

            const normalizedCurrentBookings = normalizeBookings(currentData);
            const normalizedHistoryBookings = normalizeBookings(historyData);
            const normalizedApiTransactions =
                normalizeTransactions(transactionsData);
            const localTransactions = getLocalTransactions();

            setCurrentBookings(normalizedCurrentBookings);
            setHistoryBookings(normalizedHistoryBookings);
            setTransactions(
                mergeTransactions(
                    normalizedApiTransactions,
                    localTransactions
                )
            );
        } catch (error) {
            console.error("Gagal mengambil data history:", error);
            setError("Gagal mengambil data history booking.");
        } finally {
            setLoading(false);
        }
    }

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            setSuccessMessage("");
            await fetchHistoryData();
        } finally {
            setRefreshing(false);
        }
    };

    const handleCancelBooking = async (bookingId: number) => {
        const confirmed = window.confirm(
            "Yakin ingin membatalkan booking ini?"
        );
        if (!confirmed) return;

        try {
            setCancellingId(bookingId);
            setError("");
            setSuccessMessage("");

            await cancelBooking(bookingId);

            setSuccessMessage("Booking berhasil dibatalkan.");
            await fetchHistoryData();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal membatalkan booking."
            );
        } finally {
            setCancellingId(null);
        }
    };

    const handleUploadProofFromHistory = async (
        booking: CustomerBooking,
        file: File
    ) => {
        if (!booking?.id) {
            setError("ID booking tidak valid.");
            return;
        }

        try {
            setUploadingId(booking.id);
            setError("");
            setSuccessMessage("");

            const uploadedTransaction = await uploadTransaction({
                bookingId: booking.id,
                total: getBookingTotal(booking),
                proof: file,
            });

            const normalizedTransaction = {
                ...uploadedTransaction,
                bookingId:
                    getTransactionBookingId(uploadedTransaction) ?? booking.id,
            } as CustomerTransaction;

            saveLocalTransaction(normalizedTransaction);

            setTransactions((prev) => {
                const withoutSameBooking = prev.filter(
                    (transaction) =>
                        Number(getTransactionBookingId(transaction)) !==
                        Number(booking.id)
                );

                return [normalizedTransaction, ...withoutSameBooking];
            });

            setSuccessMessage(
                "Bukti pembayaran berhasil diupload. Menunggu verifikasi admin."
            );

            await fetchHistoryData();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal upload bukti pembayaran."
            );
        } finally {
            setUploadingId(null);
        }
    };

    const handleDownloadInvoice = async (transaksiId: number) => {
        try {
            setDownloadingInvoiceId(transaksiId);
            setError("");
            await downloadInvoice(transaksiId);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal mengunduh invoice."
            );
        } finally {
            setDownloadingInvoiceId(null);
        }
    };

    // Semua booking digabung untuk keperluan hitung badge filter
    const allBookings = useMemo(
        () => [...currentBookings, ...historyBookings],
        [currentBookings, historyBookings]
    );

    const filteredCurrentBookings = useMemo(() => {
        return filterBookings(currentBookings, search, activeFilter);
    }, [currentBookings, search, activeFilter]);

    const filteredHistoryBookings = useMemo(() => {
        return filterBookings(historyBookings, search, activeFilter);
    }, [historyBookings, search, activeFilter]);

    const completedCount = useMemo(() => {
        return historyBookings.filter(
            (booking) =>
                String(booking.status).toLowerCase() === "completed"
        ).length;
    }, [historyBookings]);

    const cancelledCount = useMemo(() => {
        return historyBookings.filter((booking) => {
            const status = String(booking.status).toLowerCase();
            return status === "cancelled" || status === "canceled";
        }).length;
    }, [historyBookings]);

    const pendingPaymentCount = useMemo(() => {
        return currentBookings.filter((booking) => {
            const transaction = findTransactionByBookingId(
                transactions,
                booking.id
            );

            const hasProof = Boolean(
                transaction?.proof || transaction?.proofUrl
            );

            return !hasProof;
        }).length;
    }, [currentBookings, transactions]);

    return (
        <section className="mx-auto max-w-7xl px-5 py-8">
            {error && (
                <div className="mb-5 rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-4 text-sm text-yellow-700">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
                    {successMessage}
                </div>
            )}

            {/* HERO */}
            <div className="relative overflow-hidden rounded-3xl border border-[#A7E8B0]/50 bg-white p-8 shadow-sm md:p-10">
                <CalendarDays className="absolute right-10 top-8 h-20 w-20 rotate-12 text-[#A7E8B0]/40" />
                <PawPrint className="absolute bottom-6 right-44 h-12 w-12 -rotate-12 text-[#A7E8B0]/40" />

                <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="mb-3 inline-flex rounded-full bg-[#F0FEF1] px-4 py-2 text-sm font-semibold text-[#013B09]">
                            History Grooming
                        </p>

                        <h1 className="text-3xl font-bold leading-tight text-[#013B09] md:text-5xl">
                            Riwayat Booking Kamu
                        </h1>

                        <p className="mt-4 max-w-2xl text-gray-600">
                            Pantau booking aktif, status pembayaran, dan
                            riwayat grooming anabul kamu.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#013B09] px-5 font-semibold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <RefreshCcw
                            size={18}
                            className={refreshing ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>
                </div>
            </div>

            {/* SUMMARY CARDS */}
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                <HistorySummaryCard
                    title="Booking Aktif"
                    value={currentBookings.length}
                    desc="Booking yang sedang berjalan"
                />

                <HistorySummaryCard
                    title="Menunggu Payment"
                    value={pendingPaymentCount}
                    desc="Perlu upload/verifikasi pembayaran"
                />

                <HistorySummaryCard
                    title="Completed"
                    value={completedCount}
                    desc="Grooming yang sudah selesai"
                />

                <HistorySummaryCard
                    title="Cancelled"
                    value={cancelledCount}
                    desc="Booking yang dibatalkan"
                />
            </div>

            {/* SEARCH & FILTER */}
            <div className="mt-8 rounded-3xl border border-[#A7E8B0]/40 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-[#013B09]">
                            Cari Booking
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Cari berdasarkan ID booking, pet, paket, status,
                            tanggal, atau jam.
                        </p>
                    </div>

                    <div className="relative w-full md:max-w-sm">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Cari history..."
                            className="h-12 w-full rounded-2xl border border-[#A7E8B0]/50 bg-[#F0FEF1] pl-11 pr-4 text-sm text-[#013B09] outline-none transition focus:border-[#013B09]"
                        />
                    </div>
                </div>

                {/* FILTER PILLS */}
                <div className="mt-4 flex flex-wrap gap-2">
                    {STATUS_FILTERS.map((filter) => {
                        const isActive = activeFilter === filter.value;

                        const count =
                            filter.value === "all"
                                ? allBookings.length
                                : allBookings.filter((b) => {
                                      const s = String(b.status || "")
                                          .toLowerCase()
                                          .replace(/ /g, "_");
                                      return (
                                          s === filter.value.toLowerCase()
                                      );
                                  }).length;

                        return (
                            <button
                                key={filter.value}
                                type="button"
                                onClick={() => setActiveFilter(filter.value)}
                                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                                    isActive
                                        ? "border-[#013B09] bg-[#013B09] text-white"
                                        : "border-[#A7E8B0] bg-[#F0FEF1] text-[#013B09] hover:border-[#013B09] hover:bg-white"
                                }`}
                            >
                                {filter.label}
                                <span className="ml-2 opacity-70">
                                    ({count})
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* BOOKING LIST */}
            {loading ? (
                <div className="mt-8 space-y-5">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-64 animate-pulse rounded-3xl bg-white"
                        />
                    ))}
                </div>
            ) : (
                <div className="mt-8 space-y-10">
                    {/* BOOKING AKTIF */}
                    <section>
                        <HistorySectionHeader
                            title="Booking Sedang Berjalan"
                            desc="Booking aktif yang masih menunggu payment, approval, atau proses grooming."
                        />

                        {filteredCurrentBookings.length === 0 ? (
                            <EmptyHistoryBox
                                title={
                                    activeFilter !== "all"
                                        ? `Tidak ada booking aktif dengan status "${STATUS_FILTERS.find((f) => f.value === activeFilter)?.label}"`
                                        : "Belum ada booking aktif"
                                }
                                desc={
                                    activeFilter !== "all"
                                        ? "Coba pilih filter status lain."
                                        : "Booking aktif akan muncul setelah kamu membuat jadwal grooming."
                                }
                            />
                        ) : (
                            <div className="space-y-5">
                                {filteredCurrentBookings.map((booking) => {
                                    const transaction =
                                        findTransactionByBookingId(
                                            transactions,
                                            booking.id
                                        );

                                    return (
                                        <HistoryBookingCard
                                            key={booking.id}
                                            booking={booking}
                                            transaction={transaction}
                                            onCancel={handleCancelBooking}
                                            cancellingId={cancellingId}
                                            onUploadProof={
                                                handleUploadProofFromHistory
                                            }
                                            uploadingId={uploadingId}
                                            onDownloadInvoice={
                                                handleDownloadInvoice
                                            }
                                            downloadingInvoiceId={
                                                downloadingInvoiceId
                                            }
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    {/* RIWAYAT BOOKING */}
                    <section>
                        <HistorySectionHeader
                            title="Riwayat Booking"
                            desc="Daftar booking yang sudah selesai, ditolak, atau dibatalkan."
                        />

                        {filteredHistoryBookings.length === 0 ? (
                            <EmptyHistoryBox
                                title={
                                    activeFilter !== "all"
                                        ? `Tidak ada riwayat dengan status "${STATUS_FILTERS.find((f) => f.value === activeFilter)?.label}"`
                                        : "Belum ada riwayat booking"
                                }
                                desc={
                                    activeFilter !== "all"
                                        ? "Coba pilih filter status lain."
                                        : "Riwayat grooming akan muncul setelah booking selesai atau dibatalkan."
                                }
                            />
                        ) : (
                            <div className="space-y-5">
                                {filteredHistoryBookings.map((booking) => {
                                    const transaction =
                                        findTransactionByBookingId(
                                            transactions,
                                            booking.id
                                        );

                                    return (
                                        <HistoryBookingCard
                                            key={booking.id}
                                            booking={booking}
                                            transaction={transaction}
                                            onCancel={handleCancelBooking}
                                            cancellingId={cancellingId}
                                            onUploadProof={
                                                handleUploadProofFromHistory
                                            }
                                            uploadingId={uploadingId}
                                            onDownloadInvoice={
                                                handleDownloadInvoice
                                            }
                                            downloadingInvoiceId={
                                                downloadingInvoiceId
                                            }
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>
            )}
        </section>
    );
}