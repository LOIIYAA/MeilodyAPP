import {
    LoginPayload,
    LoginResponse,
    RegisterPayload,
    RegisterResponse,
} from "@/types/auth";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function getApiUrl(path: string) {
    return `${API_BASE_URL.replace(/\/$/, "")}${path}`;
}

// Decode JWT tanpa library tambahan
function decodeJwtPayload(token: string) {
    try {
        const base64 = token.split(".")[1];
        const decoded = JSON.parse(atob(base64));
        return decoded;
    } catch {
        return null;
    }
}

async function getErrorMessage(response: Response) {
    try {
        const data = await response.json();

        if (Array.isArray(data.message)) {
            return data.message.join(", ");
        }

        if (typeof data.message === "string") {
            return data.message;
        }

        if (typeof data.error === "string") {
            return data.error;
        }

        return "Terjadi kesalahan pada server.";
    } catch {
        return "Terjadi kesalahan pada server.";
    }
}

export async function registerCustomer(
    payload: RegisterPayload
): Promise<RegisterResponse> {
    const response = await fetch(getApiUrl("/auth/register"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(response);
        throw new Error(message);
    }

    return response.json();
}

export async function loginUser(
    payload: LoginPayload
): Promise<LoginResponse> {
    const response = await fetch(getApiUrl("/auth/login"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(response);
        throw new Error(message);
    }

    const data = await response.json();

    // Decode role dari JWT karena backend tidak mengembalikan field "user"
    const jwtPayload = decodeJwtPayload(data.token);

    return {
        ...data,
        user: {
            id: jwtPayload?.id ?? null,
            email: jwtPayload?.email ?? null,
            role: jwtPayload?.role ?? null,
        },
    };
}

export function saveAuthSession(data: LoginResponse) {
    if (typeof window === "undefined") return;

    localStorage.setItem("meilody_token", data.token);
    localStorage.setItem("meilody_user", JSON.stringify(data.user));

    document.cookie = `meilody_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `meilody_role=${data.user.role}; path=/; max-age=86400; SameSite=Lax`;
}

export function clearAuthSession() {
    if (typeof window === "undefined") return;

    localStorage.removeItem("meilody_token");
    localStorage.removeItem("meilody_user");

    document.cookie =
        "meilody_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
        "meilody_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}