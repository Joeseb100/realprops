import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookie } from "@/lib/auth";

const ALLOWED_ACTIONS = new Set(["approve", "delete"]);

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
    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { name, rating, comment } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!comment || typeof comment !== "string" || comment.trim().length === 0) {
        return NextResponse.json({ error: "Comment is required" }, { status: 400 });
    }
    if (!rating) {
        return NextResponse.json({ error: "Rating is required" }, { status: 400 });
    }

    // Length caps to prevent oversized payloads
    if (name.trim().length > 100) {
        return NextResponse.json({ error: "Name must be 100 characters or fewer" }, { status: 400 });
    }
    if (comment.trim().length > 1000) {
        return NextResponse.json({ error: "Comment must be 1000 characters or fewer" }, { status: 400 });
    }

    const parsedRating = Math.min(5, Math.max(1, parseInt(rating as string)));
    if (isNaN(parsedRating)) {
        return NextResponse.json({ error: "Rating must be a number between 1 and 5" }, { status: 400 });
    }

    const review = await prisma.review.create({
        data: {
            name: name.trim(),
            rating: parsedRating,
            comment: comment.trim(),
            approved: false,
        },
    });

    return NextResponse.json(
        { message: "Review submitted! It will appear after approval.", review },
        { status: 201 }
    );
}

// PATCH /api/reviews — approve/delete review (admin only)
export async function PATCH(request: NextRequest) {
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

    const { id, action } = body;

    if (!id || typeof id !== "number") {
        return NextResponse.json({ error: "Valid numeric id is required" }, { status: 400 });
    }
    if (!action || !ALLOWED_ACTIONS.has(action as string)) {
        return NextResponse.json({ error: "action must be 'approve' or 'delete'" }, { status: 400 });
    }

    if (action === "approve") {
        await prisma.review.update({ where: { id: id as number }, data: { approved: true } });
        return NextResponse.json({ message: "Review approved" });
    } else {
        await prisma.review.delete({ where: { id: id as number } });
        return NextResponse.json({ message: "Review deleted" });
    }
}
