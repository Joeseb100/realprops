import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

// POST /api/properties/bulk - Bulk create properties from JSON array
export async function POST(request: NextRequest) {
    const authed = await isAuthenticated();
    if (!authed) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { properties } = await request.json();

        if (!Array.isArray(properties) || properties.length === 0) {
            return NextResponse.json(
                { error: "Please provide an array of properties" },
                { status: 400 }
            );
        }

        const results = [];
        const errors = [];

        for (let i = 0; i < properties.length; i++) {
            const p = properties[i];
            try {
                // Validate required fields
                if (!p.title || !p.price || !p.location || !p.areaSqft || !p.phoneNumber || !p.description) {
                    errors.push({ row: i + 1, error: "Missing required fields (title, price, location, areaSqft, phoneNumber, description)" });
                    continue;
                }

                const created = await prisma.property.create({
                    data: {
                        title: p.title,
                        price: parseFloat(p.price),
                        location: p.location,
                        type: p.type || "HOUSE",
                        areaSqft: parseInt(p.areaSqft),
                        bedrooms: parseInt(p.bedrooms) || 0,
                        bathrooms: parseInt(p.bathrooms) || 0,
                        description: p.description,
                        phoneNumber: p.phoneNumber,
                        status: p.status || "AVAILABLE",
                        images: p.images?.length
                            ? {
                                create: p.images.map((url: string) => ({ imageUrl: url })),
                            }
                            : undefined,
                    },
                });
                results.push({ row: i + 1, id: created.id, title: created.title });
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : "Unknown error";
                errors.push({ row: i + 1, error: message });
            }
        }

        return NextResponse.json({
            success: results.length,
            failed: errors.length,
            results,
            errors,
        });
    } catch {
        return NextResponse.json(
            { error: "Invalid request body" },
            { status: 400 }
        );
    }
}
