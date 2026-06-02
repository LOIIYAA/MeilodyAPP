import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const token = request.cookies.get("meilody_token")?.value;
    const role = request.cookies.get("meilody_role")?.value;

    const isAdminRoute = pathname.startsWith("/admin");
    const isCustomerRoute = pathname.startsWith("/customer");

    const isLoginPage = pathname === "/auth/login";
    const isRegisterPage = pathname === "/auth/register";
    const isAuthPage = isLoginPage || isRegisterPage;

    if (isAdminRoute) {
        if (!token || role !== "SUPER_ADMIN") {
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
    }

    if (isCustomerRoute) {
        if (!token || role !== "CUSTOMER") {
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
    }

    if (isAuthPage && token && role === "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (isAuthPage && token && role === "CUSTOMER") {
        return NextResponse.redirect(new URL("/customer", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/customer/:path*",
        "/auth/login",
        "/auth/register",
    ],
};