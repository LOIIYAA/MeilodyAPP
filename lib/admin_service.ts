// lib/admin_service.ts

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
            `Terjadi kesalahan pada server. Status: ${response.status}`
        );
    }

    return data as T;
}

/* =========================
   TYPES
========================= */

export type AdminRole = "SUPER_ADMIN" | "CUSTOMER" | string;

export interface AdminProfile {
    id: number;
    username: string;
    email: string;
    role: AdminRole;
    createdAt: string;
    updatedAt?: string;
}

export interface UpdateAdminProfilePayload {
    username: string;
    email: string;
}

export interface DashboardSummary {
    totalUser: number;
    totalPet: number;
    totalBooking: number;
    totalTransaksi: number;
    pendingBooking: number;
    completedBooking: number;
}

export interface GroomingPackage {
    id: number;
    name: string;
    price: number;
    description: string;
}

export interface GroomingPackagePayload {
    name: string;
    price: number;
    description: string;
}

export interface AdminPet {
    id: number;
    name: string;
    type: string;
    age: number;
    userId: number;
    createdAt: string;
    updatedAt?: string;
}

export interface AdminCustomer {
    id: number;
    username: string;
    email: string;
    role: AdminRole;
    createdAt: string;
    updatedAt?: string;
    pets?: AdminPet[];
    bookings?: AdminBooking[];
}

export type BookingStatus =
    | "pending"
    | "paid"
    | "proses_grooming"
    | "completed"
    | "reject"
    | "cancelled"
    | string;

export interface AdminBooking {
    id: number;
    userId: number;
    petId: number;
    packageId: number;
    tanggal: string;
    jam: string;
    status: BookingStatus;
    createdAt: string;
    updatedAt: string;

    user?: AdminCustomer;
    owner?: AdminCustomer;
    pet?: AdminPet;
    package?: GroomingPackage;
    transaksi?: AdminTransaction[];
    transaction?: AdminTransaction;
}

export interface UpdateBookingStatusPayload {
    status: BookingStatus;
}

export type TransactionStatus =
    | "pending"
    | "paid"
    | "reject"
    | "cancelled"
    | string;

// Status baru sesuai endpoint BE
export type PaymentStatus = "PENDING" | "PAID" | string;
export type GroomingStatus = "WAITING" | "PROGRESS" | "DONE" | string;

export interface AdminTransaction {
    id: number;
    bookingId: number;
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
    booking?: AdminBooking;
}

export interface UpdateTransactionStatusPayload {
    status: TransactionStatus;
}

export interface UpdateGroomingStatusPayload {
    status: GroomingStatus;
}

/* =========================
   DASHBOARD
   GET /dashboard
========================= */

export function getAdminDashboard() {
    return apiRequest<DashboardSummary>("/dashboard", {
        method: "GET",
    });
}

/* =========================
   GROOMING PACKAGE CRUD
   GET    /grooming-package
   GET    /grooming-package/:id
   POST   /grooming-package
   PATCH  /grooming-package/:id
   DELETE /grooming-package/:id
========================= */

export function getAdminGroomingPackages() {
    return apiRequest<GroomingPackage[]>("/grooming-package", {
        method: "GET",
    });
}

export function getAdminGroomingPackageById(id: number | string) {
    return apiRequest<GroomingPackage>(`/grooming-package/${id}`, {
        method: "GET",
    });
}

export function createAdminGroomingPackage(payload: GroomingPackagePayload) {
    return apiRequest<GroomingPackage>("/grooming-package", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function updateAdminGroomingPackage(
    id: number | string,
    payload: GroomingPackagePayload
) {
    return apiRequest<GroomingPackage>(`/grooming-package/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

export function deleteAdminGroomingPackage(id: number | string) {
    return apiRequest<GroomingPackage | null>(`/grooming-package/${id}`, {
        method: "DELETE",
    });
}

/* =========================
   BOOKING MANAGEMENT ADMIN
   GET   /booking
   GET   /booking/:id
   PATCH /booking/:id/status
========================= */

export function getAdminBookings() {
    return apiRequest<AdminBooking[]>("/booking", {
        method: "GET",
    });
}

export function getAdminBookingById(id: number | string) {
    return apiRequest<AdminBooking>(`/booking/${id}`, {
        method: "GET",
    });
}

export function updateAdminBookingStatus(
    id: number | string,
    payload: UpdateBookingStatusPayload
) {
    return apiRequest<AdminBooking>(`/booking/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

/* =========================
   TRANSAKSI ADMIN
   GET   /transaksi
   GET   /transaksi/:id
   PATCH /transaksi/:id/status   — update status lama (fallback)
   PATCH /transaksi/:id/verify   — verifikasi pembayaran → paymentStatus: PAID
   PATCH /transaksi/:id/grooming — update grooming status (PROGRESS | DONE)
========================= */

export function getAdminTransactions() {
    return apiRequest<AdminTransaction[]>("/transaksi", {
        method: "GET",
    });
}

export function getAdminTransactionById(id: number | string) {
    return apiRequest<AdminTransaction>(`/transaksi/${id}`, {
        method: "GET",
    });
}

export function updateAdminTransactionStatus(
    id: number | string,
    payload: UpdateTransactionStatusPayload
) {
    return apiRequest<AdminTransaction>(`/transaksi/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

export function verifyAdminPayment(id: number | string) {
    return apiRequest<AdminTransaction>(`/transaksi/${id}/verify`, {
        method: "PATCH",
    });
}

export function updateAdminGroomingStatus(
    id: number | string,
    payload: UpdateGroomingStatusPayload
) {
    return apiRequest<AdminTransaction>(`/transaksi/${id}/grooming`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

/* =========================
   CUSTOMER ADMIN
   GET /users
   GET /users/:id
========================= */

export function getAdminCustomers() {
    return apiRequest<AdminCustomer[]>("/users", {
        method: "GET",
    });
}

export function getAdminCustomerById(id: number | string) {
    return apiRequest<AdminCustomer>(`/users/${id}`, {
        method: "GET",
    });
}

/* =========================
   PROFILE ADMIN
   GET   /users/profile
   PATCH /users/profile
========================= */

export function getAdminProfile() {
    return apiRequest<AdminProfile>("/users/profile", {
        method: "GET",
    });
}

export function updateAdminProfile(payload: UpdateAdminProfilePayload) {
    return apiRequest<AdminProfile>("/users/profile", {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

/* =========================
   HELPERS
========================= */

export function formatAdminRupiah(value: number | string) {
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

export function formatAdminDate(date?: string | null) {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(parsedDate);
}

export function normalizeAdminStatus(status?: string | null) {
    return String(status || "unknown").toLowerCase().replace(/_/g, " ");
}

export function getBookingStatusLabel(status?: string | null) {
    const normalized = normalizeAdminStatus(status);

    if (normalized === "pending") return "Pending";
    if (normalized === "paid") return "Paid";
    if (normalized === "proses grooming") return "Proses Grooming";
    if (normalized === "completed") return "Completed";
    if (normalized === "reject") return "Rejected";
    if (normalized === "cancelled") return "Cancelled";

    return status;
}

export function getBookingStatusStyle(status: string) {
    const normalized = normalizeAdminStatus(status);

    if (normalized === "pending") {
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }

    if (normalized === "paid") {
        return "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (normalized === "proses grooming") {
        return "bg-orange-50 text-orange-700 border-orange-200";
    }

    if (normalized === "completed") {
        return "bg-green-50 text-green-700 border-green-200";
    }

    if (normalized === "reject" || normalized === "cancelled") {
        return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-gray-50 text-gray-700 border-gray-200";
}