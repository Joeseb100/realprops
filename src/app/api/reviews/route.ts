import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookie } from "@/lib/auth";

// GET /api/reviews — get approved reviews (public) or all reviews (admin)
export async function GET() {
    const admin = await getAdminFromCookie();

    const reviews = await prisma.review.findMany({
        where: admin ? {} : { approved: true },
        orderBy: { createdAt: "desc" },
        take: 20,
    });

    return NextResponse.json(reviews);
}

// POST /api/reviews — submit a review (public)
export async function POST(request: NextRequest) {
    const body = await request.json();
    const { name, rating, comment } = body;

    if (!name || !comment || !rating) {
        return NextResponse.json({ error: "Name, rating, and comment are required" }, { status: 400 });
    }

    const review = await prisma.review.create({
        data: {
            name: name.trim(),
            rating: Math.min(5, Math.max(1, parseInt(rating))),
            comment: comment.trim(),
            approved: false, // needs admin approval
        },
    });

    return NextResponse.json({ message: "Review submitted! It will appear after approval.", review }, { status: 201 });
}

// PATCH /api/reviews — approve/delete review (admin only)
export async function PATCH(request: NextRequest) {
    const admin = await getAdminFromCookie();
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, action } = body;

    if (action === "approve") {
        await prisma.review.update({ where: { id }, data: { approved: true } });
        return NextResponse.json({ message: "Review approved" });
    } else if (action === "delete") {
        await prisma.review.delete({ where: { id } });
        return NextResponse.json({ message: "Review deleted" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
