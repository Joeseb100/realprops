import { NextRequest, NextResponse } from "next/server";
import { getAdminFromCookie } from "@/lib/auth";

// POST /api/upload — upload images to Supabase Storage
export async function POST(request: NextRequest) {
    const admin = await getAdminFromCookie();
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Dynamically import to avoid build errors when env vars aren't set
    const { uploadImage } = await import("@/lib/supabase");

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
        return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const urls: string[] = [];

    for (const file of files) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");

        try {
            const publicUrl = await uploadImage(buffer, safeName, file.type || "image/jpeg");
            urls.push(publicUrl);
        } catch (err) {
            console.error("Upload error:", err);
            return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
        }
    }

    return NextResponse.json({ urls });
}
