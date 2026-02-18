import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookie } from "@/lib/auth";

// GET /api/properties — list all properties with optional location filter
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");
    const status = searchParams.get("status") || "AVAILABLE";

    const where: Record<string, unknown> = {};
    if (location && location !== "all") {
        where.location = location;
    }
    if (status) {
        where.status = status;
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

    const body = await request.json();
    const {
        title,
        price,
        location,
        type,
        areaSqft,
        bedrooms,
        bathrooms,
        description,
        phoneNumber,
        imageUrls,
    } = body;

    const property = await prisma.property.create({
        data: {
            title,
            price: parseFloat(price),
            location,
            type: type || "HOUSE",
            areaSqft: parseInt(areaSqft),
            bedrooms: parseInt(bedrooms) || 0,
            bathrooms: parseInt(bathrooms) || 0,
            description,
            phoneNumber,
            images: {
                create: (imageUrls || []).map((url: string) => ({ imageUrl: url })),
            },
        },
        include: { images: true },
    });

    return NextResponse.json(property, { status: 201 });
}
