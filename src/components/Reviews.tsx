"use client";

import { useState } from "react";

function StarRating({ rating, onRate, interactive = false }: {
    rating: number;
    onRate?: (r: number) => void;
    interactive?: boolean;
}) {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={!interactive}
                    onClick={() => onRate?.(star)}
                    onMouseEnter={() => interactive && setHover(star)}
                    onMouseLeave={() => interactive && setHover(0)}
                    className={`${interactive ? "cursor-pointer" : "cursor-default"} transition-colors`}
                >
                    <svg
                        className={`w-5 h-5 ${star <= (hover || rating)
                                ? "text-amber-400 fill-amber-400"
                                : "text-gray-200 fill-gray-200"
                            }`}
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </button>
            ))}
        </div>
    );
}

export function ReviewForm() {
    const [name, setName] = useState("");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, rating, comment }),
            });

            if (res.ok) {
                setSubmitted(true);
            }
        } catch {
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if (submitted) {
        return (
            <div className="glass rounded-xl p-6 text-center">
                <div className="text-2xl mb-2">🙏</div>
                <p className="font-medium text-[var(--text-primary)]">Thank you for your review!</p>
                <p className="text-sm text-[var(--text-muted)] mt-1">It will appear on the site after approval.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="glass rounded-xl p-5 space-y-4">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Share your experience</h3>

            <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Your Name</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Rahul Thomas"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-white/50 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
            </div>

            <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Rating</label>
                <StarRating rating={rating} onRate={setRating} interactive />
            </div>

            <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Your Review</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    rows={3}
                    placeholder="Tell us about your experience..."
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-white/50 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--text-primary)] text-white py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
                {loading ? "Submitting..." : "Submit Review"}
            </button>
        </form>
    );
}

export function ReviewCard({ review }: { review: { name: string; rating: number; comment: string; createdAt: string } }) {
    const timeAgo = (date: string) => {
        const diff = Date.now() - new Date(date).getTime();
        const days = Math.floor(diff / 86400000);
        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        if (days < 30) return `${days} days ago`;
        const months = Math.floor(days / 30);
        return `${months} month${months > 1 ? "s" : ""} ago`;
    };

    return (
        <div className="glass rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-sm font-semibold text-[var(--accent)]">
                        {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{review.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{timeAgo(review.createdAt)}</p>
                    </div>
                </div>
                <StarRating rating={review.rating} />
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{review.comment}</p>
        </div>
    );
}
