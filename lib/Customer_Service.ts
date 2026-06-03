// lib/Customer_Service.ts

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function getApiUrl(path: string) {
    return `${API_BASE_URL.replace(/\/$/, "")}${path}`;
}

function getToken() {
    if (typeof window === "undefined") return null;

    return localStorage.getItem("meilody_token");
}

type ApiMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface ApiRequestOptions extends RequestInit {
    method?: ApiMethod;
}

async function apiRequest<T>(
    path: string,
    options: ApiRequestOptions = {}
): Promise<T> {
    const token = getToken();

    const isFormData = options.body instanceof FormData;

    const headers: HeadersInit = {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(getApiUrl(path), {
        ...options,
        headers,
    });

    const text = await response.text();

    let data: unknown = null;

    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        if (!response.ok) {
            throw new Error(
                `Request gagal (${response.status}). Response backend bukan JSON.`
            );
        }

        throw new Error("Response backend bukan JSON. Cek endpoint API.");
    }

    if (!response.ok) {
        const errorData = data as {
            message?: string | string[];
            error?: string;
            statusCode?: number;
        };

        if (Array.isArray(errorData.message)) {
            throw new Error(errorData.message.join(", "));
        }

        throw new Error(
            errorData.message ||
            errorData.error ||
            `Request ${path} gagal. Status: ${response.status}`
        );
    }

    return data as T;
}

/* =========================
   TYPES
========================= */

export type UserRole = "CUSTOMER" | "SUPER_ADMIN" | string;

export interface CustomerProfile {
    id: number;
    username: string;
    email: string;
    role: UserRole;
    createdAt: string;
    updatedAt?: string;
}

export interface UpdateProfilePayload {
    username: string;
    email: string;
}

export interface CustomerPet {
    id: number;
    name: string;
    type: string;
    age: number;
    userId: number;
    createdAt: string;
    updatedAt?: string;
    isDeleted?: boolean;
}

export interface PetPayload {
    name: string;
    type: string;
    age: number;
}

export interface GroomingPackage {
    id: number;
    name: string;
    price: number;
    description: string;
}

export type BookingStatus =
    | "pending"
    | "paid"
    | "proses_grooming"
    | "completed"
    | "reject"
    | "cancelled"
    | "canceled"
    | "on_progress"
    | "on progress"
    | string;

export interface CustomerBooking {
    id: number;
    userId: number;
    petId: number;
    packageId: number;
    tanggal: string;
    jam: string;
    status: BookingStatus;
    createdAt: string;
    updatedAt: string;

    pet?: CustomerPet;
    package?: GroomingPackage;
    transaksi?: CustomerTransaction[];
    transaction?: CustomerTransaction;
}

export interface CreateBookingPayload {
    petId: number;
    packageId: number;
    tanggal: string;
    jam: string;
}

export interface AvailableSlotResponse {
    date?: string;
    availableSlots?: string[];
    bookedSlots?: string[];
    slots?: string[] | AvailableSlotObject[];
    data?: string[] | AvailableSlotObject[];
    message?: string;
}

export interface AvailableSlotObject {
    jam?: string;
    time?: string;
    slot?: string;
    available?: boolean;
    isAvailable?: boolean;
}

export type TransactionStatus =
    | "pending"
    | "paid"
    | "reject"
    | "cancelled"
    | "waiting"
    | string;

// Status baru dari BE
export type PaymentStatus = "PENDING" | "PAID" | string;
export type GroomingStatus = "WAITING" | "PROGRESS" | "DONE" | string;

export interface UploadTransactionPayload {
    bookingId: number;
    total: number | string;
    proof: File;
}

export interface CustomerTransaction {
    id: number;
    bookingId?: number;
    booking_id?: number;
    total: number | string;
    proof?: string;
    proofUrl?: string;
    // Status lama (fallback kompatibilitas)
    status?: TransactionStatus;
    // Status baru dari BE
    paymentStatus?: PaymentStatus;
    groomingStatus?: GroomingStatus;
    createdAt?: string;
    updatedAt?: string;
    booking?: CustomerBooking;
}

/* =========================
   PROFILE
   GET   /users/profile
   PATCH /users/profile
========================= */

export function getCustomerProfile() {
    return apiRequest<CustomerProfile>("/users/profile", {
        method: "GET",
    });
}

export function updateCustomerProfile(payload: UpdateProfilePayload) {
    return apiRequest<CustomerProfile>("/users/profile", {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

/* =========================
   PET
   GET    /pets/my
   GET    /pets/:id
   POST   /pets
   PATCH  /pets/:id
   DELETE /pets/:id
========================= */

export function getMyPets() {
    return apiRequest<CustomerPet[]>("/pets/my", {
        method: "GET",
    });
}

export function getPetById(id: number | string) {
    return apiRequest<CustomerPet>(`/pets/${id}`, {
        method: "GET",
    });
}

export function createPet(payload: PetPayload) {
    return apiRequest<CustomerPet>("/pets", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function updatePet(id: number | string, payload: PetPayload) {
    return apiRequest<CustomerPet>(`/pets/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

export function deletePet(id: number | string) {
    return apiRequest<CustomerPet>(`/pets/${id}`, {
        method: "DELETE",
    });
}

/* =========================
   GROOMING PACKAGE
   GET /grooming-package
   GET /grooming-package/:id
========================= */

export function getGroomingPackages() {
    return apiRequest<GroomingPackage[]>("/grooming-package", {
        method: "GET",
    });
}

export function getGroomingPackageById(id: number | string) {
    return apiRequest<GroomingPackage>(`/grooming-package/${id}`, {
        method: "GET",
    });
}

/* =========================
   BOOKING CUSTOMER
   POST  /booking
   GET   /booking/current
   GET   /booking/history
   GET   /booking/:id
   PATCH /booking/:id/cancel
========================= */

export function createBooking(payload: CreateBookingPayload) {
    return apiRequest<CustomerBooking>("/booking", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function getCurrentBookings() {
    return apiRequest<CustomerBooking[]>("/booking/current", {
        method: "GET",
    });
}

export function getBookingHistory() {
    return apiRequest<CustomerBooking[]>("/booking/history", {
        method: "GET",
    });
}

export function getBookingById(id: number | string) {
    return apiRequest<CustomerBooking>(`/booking/${id}`, {
        method: "GET",
    });
}

export function cancelBooking(id: number | string) {
    return apiRequest<CustomerBooking>(`/booking/${id}/cancel`, {
        method: "PATCH",
    });
}

/* =========================
   AVAILABLE SLOT
   GET /booking/available-slot?date=YYYY-MM-DD
========================= */

export const DEFAULT_BOOKING_SLOTS = [
    "09:00",
    "11:00",
    "13:00",
    "15:00",
    "17:00",
];

function normalizeSlots(response: unknown): string[] {
    if (!response) return DEFAULT_BOOKING_SLOTS;

    if (Array.isArray(response)) {
        return normalizeSlotArray(response);
    }

    const data = response as AvailableSlotResponse;

    if (Array.isArray(data.availableSlots)) {
        return normalizeSlotArray(data.availableSlots);
    }

    if (Array.isArray(data.slots)) {
        return normalizeSlotArray(data.slots);
    }

    if (Array.isArray(data.data)) {
        return normalizeSlotArray(data.data);
    }

    if (Array.isArray(data.bookedSlots)) {
        const booked = data.bookedSlots.map((slot) => String(slot));

        return DEFAULT_BOOKING_SLOTS.filter(
            (slot) => !booked.includes(slot)
        );
    }

    return DEFAULT_BOOKING_SLOTS;
}

function normalizeSlotArray(slots: unknown[]): string[] {
    const normalized = slots
        .map((slot) => {
            if (typeof slot === "string") return slot;

            const slotObject = slot as AvailableSlotObject;

            const isUnavailable =
                slotObject.available === false ||
                slotObject.isAvailable === false;

            if (isUnavailable) return "";

            return slotObject.jam || slotObject.time || slotObject.slot || "";
        })
        .filter(Boolean)
        .map((slot) => String(slot));

    return normalized.length > 0 ? normalized : DEFAULT_BOOKING_SLOTS;
}

export async function getAvailableSlots(date: string) {
    if (!date) return DEFAULT_BOOKING_SLOTS;

    try {
        const response = await apiRequest<AvailableSlotResponse | string[]>(
            `/booking/available-slot?date=${encodeURIComponent(date)}`,
            { method: "GET" }
        );

        return normalizeSlots(response);
    } catch {
        try {
            const response = await apiRequest<AvailableSlotResponse | string[]>(
                `/booking/available-slot/${encodeURIComponent(date)}`,
                { method: "GET" }
            );

            return normalizeSlots(response);
        } catch {
            return DEFAULT_BOOKING_SLOTS;
        }
    }
}

/* =========================
   TRANSAKSI / PAYMENT
   POST /transaksi
   GET  /transaksi/me
   GET  /transaksi/:id
   GET  /transaksi/:id/print  ← invoice
========================= */

export async function uploadTransaction({
    bookingId,
    total,
    proof,
}: UploadTransactionPayload) {
    const formData = new FormData();

    formData.append("bookingId", String(bookingId));
    formData.append("total", String(total));
    formData.append("proof", proof);

    return apiRequest<CustomerTransaction>("/transaksi", {
        method: "POST",
        body: formData,
    });
}

export function getMyTransactions() {
    return apiRequest<CustomerTransaction[]>("/transaksi/me", {
        method: "GET",
    });
}

export function getTransactionById(id: number | string) {
    return apiRequest<CustomerTransaction>(`/transaksi/${id}`, {
        method: "GET",
    });
}

export async function downloadInvoice(transaksiId: number | string) {
    const token = getToken();

    const response = await fetch(
        getApiUrl(`/transaksi/${transaksiId}/print`),
        {
            method: "GET",
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        }
    );

    if (!response.ok) {
        throw new Error(
            `Gagal mengunduh invoice. Status: ${response.status}`
        );
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" })
    );

    window.open(url, "_blank");

    setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/* =========================
   HELPERS FORMAT
========================= */

export function formatRupiah(value: number | string | undefined | null) {
    if (value === undefined || value === null || value === "") {
        return "Rp 0";
    }

    const numberValue =
        typeof value === "string"
            ? Number(value.replace(/\D/g, ""))
            : value;

    if (Number.isNaN(numberValue)) return "Rp 0";

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(numberValue);
}

export function formatDateIndonesia(date?: string | null) {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(parsedDate);
}

export function formatDateInput(date: Date) {
    return date.toISOString().slice(0, 10);
}

export function normalizeBookingStatus(status?: string | null) {
    return String(status || "unknown").toLowerCase().replace(/_/g, " ");
}

export function getBookingStatusLabel(status?: string | null) {
    const normalized = normalizeBookingStatus(status);

    if (normalized === "pending") return "Menunggu Pembayaran";
    if (normalized === "paid") return "Pembayaran Diterima";
    if (normalized === "proses grooming") return "Sedang Grooming";
    if (normalized === "on progress") return "Sedang Grooming";
    if (normalized === "completed") return "Selesai";
    if (normalized === "reject") return "Ditolak";
    if (normalized === "cancelled" || normalized === "canceled") {
        return "Dibatalkan";
    }

    return String(status || "-");
}

export function getBookingStatusStyle(status?: string | null) {
    const normalized = normalizeBookingStatus(status);

    if (normalized === "pending") {
        return "border-yellow-200 bg-yellow-50 text-yellow-700";
    }

    if (normalized === "paid") {
        return "border-blue-200 bg-blue-50 text-blue-700";
    }

    if (normalized === "proses grooming" || normalized === "on progress") {
        return "border-orange-200 bg-orange-50 text-orange-700";
    }

    if (normalized === "completed") {
        return "border-green-200 bg-green-50 text-green-700";
    }

    if (
        normalized === "reject" ||
        normalized === "cancelled" ||
        normalized === "canceled"
    ) {
        return "border-red-200 bg-red-50 text-red-700";
    }

    return "border-gray-200 bg-gray-50 text-gray-700";
}

export function getPaymentStatusLabel(status?: string | null) {
    const normalized = String(status || "").toLowerCase();

    if (normalized === "pending" || normalized === "waiting") {
        return "Menunggu Verifikasi";
    }
    if (normalized === "paid") return "Pembayaran Disetujui";
    if (normalized === "reject") return "Pembayaran Ditolak";
    if (normalized === "cancelled" || normalized === "canceled") {
        return "Dibatalkan";
    }

    return String(status || "Belum Upload");
}

export function getPaymentStatusStyle(status?: string | null) {
    const normalized = String(status || "").toLowerCase();

    if (normalized === "pending" || normalized === "waiting") {
        return "border-yellow-200 bg-yellow-50 text-yellow-700";
    }

    if (normalized === "paid") {
        return "border-green-200 bg-green-50 text-green-700";
    }

    if (
        normalized === "reject" ||
        normalized === "cancelled" ||
        normalized === "canceled"
    ) {
        return "border-red-200 bg-red-50 text-red-700";
    }

    return "border-gray-200 bg-gray-50 text-gray-700";
}

// Helper baru: label & style untuk groomingStatus dari BE
export function getGroomingStatusLabel(status?: string | null) {
    const normalized = String(status || "").toUpperCase();

    if (normalized === "WAITING") return "Menunggu Grooming";
    if (normalized === "PROGRESS") return "Sedang Grooming";
    if (normalized === "DONE") return "Grooming Selesai";

    return null; // null = tidak perlu ditampilkan
}

export function getGroomingStatusStyle(status?: string | null) {
    const normalized = String(status || "").toUpperCase();

    if (normalized === "WAITING") {
        return "border-yellow-200 bg-yellow-50 text-yellow-700";
    }
    if (normalized === "PROGRESS") {
        return "border-orange-200 bg-orange-50 text-orange-700";
    }
    if (normalized === "DONE") {
        return "border-green-200 bg-green-50 text-green-700";
    }

    return "border-gray-200 bg-gray-50 text-gray-700";
}

export function getTransactionByBookingId(
    transactions: CustomerTransaction[] = [],
    bookingId?: number | null
) {
    if (!bookingId) return null;

    return (
        transactions.find((transaction: any) => {
            return (
                transaction &&
                (Number(transaction.bookingId) === Number(bookingId) ||
                    Number(transaction.bookingid) === Number(bookingId) ||
                    Number(transaction.booking_id) === Number(bookingId) ||
                    Number(transaction.booking?.id) === Number(bookingId))
            );
        }) || null
    );
}

export function getBookingTotal(booking?: CustomerBooking | null) {
    if (!booking) return 0;

    return booking.package?.price ?? booking.transaction?.total ?? 0;
}

// Helper derive status customer dari paymentStatus + groomingStatus transaksi
// Sama seperti di admin, karena BE tidak otomatis sync booking.status
export function deriveCustomerBookingStatus(
    bookingStatus?: string | null,
    transaction?: CustomerTransaction | null
): string {
    if (!transaction) return bookingStatus ?? "pending";

    const pay = (transaction.paymentStatus ?? transaction.status ?? "")
        .toUpperCase();
    const groom = (transaction.groomingStatus ?? "").toUpperCase();

    if (groom === "DONE") return "completed";
    if (groom === "PROGRESS") return "proses_grooming";
    if (pay === "PAID") return "paid";

    return bookingStatus ?? "pending";
}