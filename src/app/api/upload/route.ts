import { NextRequest, NextResponse } from "next/server";
import { getAdminFromCookie } from "@/lib/auth";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB per file
const MAX_FILES_PER_REQUEST = 20;

// POST /api/upload — upload images to Supabase Storage (admin only)
export async function POST(request: NextRequest) {
    const admin = await getAdminFromCookie();
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { uploadImage } = await import("@/lib/supabase");

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
        return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    if (files.length > MAX_FILES_PER_REQUEST) {
        return NextResponse.json(
            { error: `Too many files. Maximum ${MAX_FILES_PER_REQUEST} per request.` },
            { status: 400 }
        );
    }

    // Validate all files before uploading any
    for (const file of files) {
        if (!ALLOWED_MIME_TYPES.has(file.type)) {
            return NextResponse.json(
                { error: `File type "${file.type}" is not allowed. Use JPEG, PNG, WebP, or GIF.` },
                { status: 400 }
            );
        }
        if (file.size > MAX_FILE_SIZE_BYTES) {
            return NextResponse.json(
                { error: `File "${file.name}" exceeds the 10 MB size limit.` },
                { status: 400 }
            );
        }
    }

    const urls: string[] = [];

    for (const file of files) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        // Strip everything except alphanumerics, dots, and hyphens
        const safeName = file.name.replace(/[^a-zA-Z0-9.\-]/g, "_");

        try {
            const publicUrl = await uploadImage(buffer, safeName, file.type);
            urls.push(publicUrl);
        } catch (err) {
            console.error("Upload error:", err);
            return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
        }
    }

    return NextResponse.json({ urls });
}
