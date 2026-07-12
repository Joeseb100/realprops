import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// All /admin/* routes except /admin/login require a valid JWT cookie.
// Using `jose` here because the proxy runs on the Edge runtime where
// Node's `crypto` module (used by jsonwebtoken) is not available.

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only guard /admin/* routes
    if (!pathname.startsWith("/admin")) {
        return NextResponse.next();
    }

    // Login page is always public
    if (PUBLIC_ADMIN_PATHS.includes(pathname)) {
        return NextResponse.next();
    }

    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jwtVerify(token, secret);
        return NextResponse.next();
    } catch {
        // Token invalid or expired — clear the bad cookie and redirect
        const response = NextResponse.redirect(new URL("/admin/login", request.url));
        response.cookies.delete("admin_token");
        return response;
    }
}

export const config = {
    matcher: ["/admin/:path*"],
};
