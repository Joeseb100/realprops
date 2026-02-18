import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "realproperties-secret-key-change-in-production";

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export function generateToken(payload: { id: number; email: string }): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { id: number; email: string } | null {
    try {
        return jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    } catch {
        return null;
    }
}

export async function getAdminFromCookie(): Promise<{ id: number; email: string } | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return null;
    return verifyToken(token);
}

export async function isAuthenticated(): Promise<boolean> {
    const admin = await getAdminFromCookie();
    return admin !== null;
}
