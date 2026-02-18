"use client";

import { useEffect, useState } from "react";
import { ReviewForm, ReviewCard } from "./Reviews";

interface Review {
    id: number;
    name: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export default function ReviewsSection() {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        fetch("/api/reviews")
            .then((r) => r.json())
            .then((data) => setReviews(data))
            .catch(() => { });
    }, []);

    return (
        <section className="max-w-6xl mx-auto px-5 sm:px-6 mb-16">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                        What our clients say
                    </h2>
                    {reviews.length > 0 && (
                        <p className="text-sm text-[var(--text-muted)] mt-0.5">
                            {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Review cards */}
                <div className="space-y-3 order-2 md:order-1">
                    {reviews.length > 0 ? (
                        reviews.slice(0, 4).map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))
                    ) : (
                        <div className="glass rounded-xl p-6 text-center">
                            <p className="text-sm text-[var(--text-muted)]">
                                No reviews yet. Be the first to share your experience!
                            </p>
                        </div>
                    )}
                </div>

                {/* Write a review */}
                <div className="order-1 md:order-2">
                    <ReviewForm />
                </div>
            </div>
        </section>
    );
}
