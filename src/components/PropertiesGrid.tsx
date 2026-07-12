"use client";

import { useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import type { Property } from "@/types";

const PAGE_SIZE = 9;

export default function PropertiesGrid({ properties }: { properties: Property[] }) {
    const [visible, setVisible] = useState(PAGE_SIZE);

    const shown = properties.slice(0, visible);
    const hasMore = visible < properties.length;

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shown.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => setVisible((v) => v + PAGE_SIZE)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium text-[15px] hover:bg-white/80 transition-all card-hover"
                    >
                        Show More
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <span className="text-xs text-[var(--text-muted)]">
                            ({Math.min(PAGE_SIZE, properties.length - visible)} more)
                        </span>
                    </button>
                </div>
            )}
        </>
    );
}
