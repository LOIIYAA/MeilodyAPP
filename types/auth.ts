export type UserRole = "SUPER_ADMIN" | "CUSTOMER";

export interface AuthUser {
    id: number;
    username: string;
    email: string;
    role: UserRole;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
    role: "CUSTOMER";
}

export interface LoginResponse {
    token: string;
    user: AuthUser;
}

export interface RegisterResponse {
    id: number;
    username: string;
    email: string;
    password?: string;
    role: "CUSTOMER";
    createdAt?: string;
    updatedAt?: string;
}