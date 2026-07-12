import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookie } from "@/lib/auth";

const ALLOWED_STATUSES = new Set(["AVAILABLE", "SOLD"]);
const ALLOWED_TYPES = new Set(["HOUSE", "PLOT"]);

function parseId(raw: string): number | null {
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
}

// GET /api/properties/[id]
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (!id) return NextResponse.json({ error: "Invalid property ID" }, { status: 400 });

    const property = await prisma.property.findUnique({
        where: { id },
        include: { images: true },
    });

    if (!property) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(property);
}

// PUT /api/properties/[id] — update property (admin only)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await getAdminFromCookie();
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (!id) return NextResponse.json({ error: "Invalid property ID" }, { status: 400 });

    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { title, price, location, type, areaSqft, bedrooms, bathrooms, description, phoneNumber, status, imageUrls } = body;

    // Validate enum fields when provided
    if (status !== undefined && !ALLOWED_STATUSES.has(status as string)) {
        return NextResponse.json({ error: "status must be AVAILABLE or SOLD" }, { status: 400 });
    }
    if (type !== undefined && !ALLOWED_TYPES.has((type as string)?.toUpperCase())) {
        return NextResponse.json({ error: "type must be HOUSE or PLOT" }, { status: 400 });
    }

    // Delete old images and replace if new ones provided
    if (imageUrls) {
        await prisma.propertyImage.deleteMany({ where: { propertyId: id } });
    }

    const urls = Array.isArray(imageUrls)
        ? (imageUrls as string[]).filter((u) => typeof u === "string")
        : undefined;

    const property = await prisma.property.update({
        where: { id },
        data: {
            title: title !== undefined ? (title as string).trim() : undefined,
            price: price !== undefined ? parseFloat(price as string) : undefined,
            location: location !== undefined ? (location as string).trim() : undefined,
            type: type !== undefined ? (type as string).toUpperCase() : undefined,
            areaSqft: areaSqft !== undefined ? parseInt(areaSqft as string) : undefined,
            bedrooms: bedrooms !== undefined ? Math.max(0, parseInt(bedrooms as string) || 0) : undefined,
            bathrooms: bathrooms !== undefined ? Math.max(0, parseInt(bathrooms as string) || 0) : undefined,
            description: description !== undefined ? (description as string).trim() : undefined,
            phoneNumber: phoneNumber !== undefined ? (phoneNumber as string).trim() : undefined,
            status: status as string | undefined,
            ...(urls ? { images: { create: urls.map((url) => ({ imageUrl: url })) } } : {}),
        },
        include: { images: true },
    });

    return NextResponse.json(property);
}

// DELETE /api/properties/[id] — delete property (admin only)
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await getAdminFromCookie();
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (!id) return NextResponse.json({ error: "Invalid property ID" }, { status: 400 });

    await prisma.property.delete({ where: { id } });

    return NextResponse.json({ success: true });
}
