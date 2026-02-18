import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookie } from "@/lib/auth";

// GET /api/properties/[id]
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const property = await prisma.property.findUnique({
        where: { id: parseInt(id) },
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

    const { id } = await params;
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
        status,
        imageUrls,
    } = body;

    // Delete old images and replace if new ones provided
    if (imageUrls) {
        await prisma.propertyImage.deleteMany({
            where: { propertyId: parseInt(id) },
        });
    }

    const property = await prisma.property.update({
        where: { id: parseInt(id) },
        data: {
            title,
            price: price ? parseFloat(price) : undefined,
            location,
            type,
            areaSqft: areaSqft ? parseInt(areaSqft) : undefined,
            bedrooms: bedrooms !== undefined ? parseInt(bedrooms) : undefined,
            bathrooms: bathrooms !== undefined ? parseInt(bathrooms) : undefined,
            description,
            phoneNumber,
            status,
            ...(imageUrls
                ? {
                    images: {
                        create: imageUrls.map((url: string) => ({ imageUrl: url })),
                    },
                }
                : {}),
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

    const { id } = await params;
    await prisma.property.delete({
        where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
}
