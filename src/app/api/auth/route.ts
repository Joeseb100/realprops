import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, generateToken } from "@/lib/auth";

// ---------------------------------------------------------------------------
// Simple in-memory rate limiter — 5 attempts per IP per 15 minutes.
// Note: resets on server restart. Adequate for single-instance (Vercel Hobby).
// ---------------------------------------------------------------------------
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, { count: number; firstAttempt: number }>();

function getClientIp(req: NextRequest): string {
    return (
        req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
        req.headers.get("x-real-ip") ??
        "unknown"
    );
}

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = attempts.get(ip);

    if (!entry || now - entry.firstAttempt > WINDOW_MS) {
        attempts.set(ip, { count: 1, firstAttempt: now });
        return false;
    }

    entry.count += 1;
    return entry.count > MAX_ATTEMPTS;
}

function clearRateLimit(ip: string) {
    attempts.delete(ip);
}

// POST /api/auth — admin login
export async function POST(request: NextRequest) {
    const ip = getClientIp(request);

    if (isRateLimited(ip)) {
        return NextResponse.json(
            { error: "Too many login attempts. Try again in 15 minutes." },
            { status: 429 }
        );
    }

    let email: string, password: string;
    try {
        const body = await request.json();
        email = (body.email ?? "").trim().toLowerCase();
        password = body.password ?? "";
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (email.length > 254 || password.length > 128) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });

    // Always run bcrypt to prevent timing-based email enumeration
    const dummyHash = "$2a$12$invalidhashfortimingnormalization000000000000000000000";
    const valid = admin
        ? await verifyPassword(password, admin.password)
        : await verifyPassword(password, dummyHash).then(() => false);

    if (!admin || !valid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Successful login — clear rate limit for this IP
    clearRateLimit(ip);

    const token = generateToken({ id: admin.id, email: admin.email });

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // upgraded from "lax" — admin actions are same-origin only
        maxAge: 60 * 60 * 24, // 24h matches token expiry
        path: "/",
    });

    return response;
}
