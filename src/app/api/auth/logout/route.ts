import { NextResponse } from "next/server";
import { getAdminFromCookie } from "@/lib/auth";

// POST /api/auth/logout — admin logout
export async function POST() {
    const admin = await getAdminFromCookie();
    if (!admin) {
        return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
    });

    return response;
}
