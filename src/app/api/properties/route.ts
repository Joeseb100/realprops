import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookie } from "@/lib/auth";

const ALLOWED_STATUSES = new Set(["AVAILABLE", "SOLD"]);
const ALLOWED_TYPES = new Set(["HOUSE", "PLOT"]);

// GET /api/properties — list properties with optional location/status filter
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");
    // Sanitize status against the known enum — reject arbitrary values
    const rawStatus = searchParams.get("status") ?? "AVAILABLE";
    const status = ALLOWED_STATUSES.has(rawStatus) ? rawStatus : "AVAILABLE";

    const where: Record<string, unknown> = { status };
    if (location && location !== "all") {
        where.location = location.slice(0, 100); // cap length
    }

    const properties = await prisma.property.findMany({
        where,
        include: { images: true },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(properties);
}

// POST /api/properties — create new property (admin only)
export async function POST(request: NextRequest) {
    const admin = await getAdminFromCookie();
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { title, price, location, type, areaSqft, bedrooms, bathrooms, description, phoneNumber, imageUrls } = body;

    // --- Required field validation ---
    if (!title || typeof title !== "string" || (title as string).trim().length === 0) {
        return NextResponse.json({ error: "title is required" }, { status: 400 });
    }
    if (!location || typeof location !== "string" || (location as string).trim().length === 0) {
        return NextResponse.json({ error: "location is required" }, { status: 400 });
    }
    if (!description || typeof description !== "string" || (description as string).trim().length === 0) {
        return NextResponse.json({ error: "description is required" }, { status: 400 });
    }
    if (!phoneNumber || typeof phoneNumber !== "string") {
        return NextResponse.json({ error: "phoneNumber is required" }, { status: 400 });
    }

    const parsedPrice = parseFloat(price as string);
    if (!price || isNaN(parsedPrice) || parsedPrice <= 0) {
        return NextResponse.json({ error: "price must be a positive number" }, { status: 400 });
    }

    const parsedArea = parseInt(areaSqft as string);
    if (!areaSqft || isNaN(parsedArea) || parsedArea <= 0) {
        return NextResponse.json({ error: "areaSqft must be a positive integer" }, { status: 400 });
    }

    const resolvedType = (type as string)?.toUpperCase();
    if (!ALLOWED_TYPES.has(resolvedType)) {
        return NextResponse.json({ error: "type must be HOUSE or PLOT" }, { status: 400 });
    }

    // --- Length caps to prevent oversized payloads ---
    if ((title as string).length > 200) return NextResponse.json({ error: "title too long" }, { status: 400 });
    if ((location as string).length > 100) return NextResponse.json({ error: "location too long" }, { status: 400 });
    if ((description as string).length > 5000) return NextResponse.json({ error: "description too long" }, { status: 400 });
    if ((phoneNumber as string).length > 20) return NextResponse.json({ error: "phoneNumber too long" }, { status: 400 });

    const urls = Array.isArray(imageUrls) ? (imageUrls as string[]).filter((u) => typeof u === "string") : [];

    const property = await prisma.property.create({
        data: {
            title: (title as string).trim(),
            price: parsedPrice,
            location: (location as string).trim(),
            type: resolvedType,
            areaSqft: parsedArea,
            bedrooms: Math.max(0, parseInt(bedrooms as string) || 0),
            bathrooms: Math.max(0, parseInt(bathrooms as string) || 0),
            description: (description as string).trim(),
            phoneNumber: (phoneNumber as string).trim(),
            images: { create: urls.map((url) => ({ imageUrl: url })) },
        },
        include: { images: true },
    });

    return NextResponse.json(property, { status: 201 });
}
