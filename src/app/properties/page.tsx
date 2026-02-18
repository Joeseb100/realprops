import { prisma } from "@/lib/prisma";
import PropertyCard from "@/components/PropertyCard";
import type { Property } from "@/types";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Properties for Sale in Kanjirapally | Houses & Plots",
    description:
        "Browse verified houses and plots for sale in Kanjirapally. Filter by location, find your dream property.",
};

export default async function PropertiesPage({
    searchParams,
}: {
    searchParams: Promise<{ location?: string; type?: string }>;
}) {
    const params = await searchParams;
    const location = params.location;
    const type = params.type;

    const where: Record<string, unknown> = { status: "AVAILABLE" };
    if (location && location !== "all") where.location = location;
    if (type) where.type = type;

    const properties = (await prisma.property.findMany({
        where,
        include: { images: true },
        orderBy: { createdAt: "desc" },
    })) as Property[];

    const locations = await prisma.property.groupBy({
        by: ["location"],
        _count: { location: true },
    });

    return (
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-8 pt-24">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-1">
                    {type === "PLOT" ? "Plots" : type === "HOUSE" ? "Houses" : "Properties"}{" "}
                    {location && location !== "all" ? `in ${location}` : "for sale"}
                </h1>
                <p className="text-sm text-[var(--text-muted)]">
                    {properties.length} {properties.length === 1 ? "property" : "properties"} available
                </p>
            </div>

            {/* Filters */}
            <div className="glass rounded-xl p-3 mb-6 flex flex-wrap gap-2">
                {/* Location filter */}
                <Link
                    href="/properties"
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${!location || location === "all"
                        ? "bg-[var(--text-primary)] text-white"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/[0.03]"
                        }`}
                >
                    All
                </Link>
                {locations.map((loc) => (
                    <Link
                        key={loc.location}
                        href={`/properties?location=${encodeURIComponent(loc.location)}${type ? `&type=${type}` : ""}`}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${location === loc.location
                            ? "bg-[var(--text-primary)] text-white"
                            : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/[0.03]"
                            }`}
                    >
                        {loc.location} <span className="opacity-50">{loc._count.location}</span>
                    </Link>
                ))}

                <div className="w-px h-6 bg-[var(--border-subtle)] self-center mx-1 hidden sm:block" />

                {/* Type filter */}
                <Link
                    href={`/properties${location ? `?location=${encodeURIComponent(location)}` : ""}`}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${!type
                        ? "bg-[var(--accent)] text-white"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/[0.03]"
                        }`}
                >
                    All Types
                </Link>
                <Link
                    href={`/properties?type=HOUSE${location ? `&location=${encodeURIComponent(location)}` : ""}`}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${type === "HOUSE"
                        ? "bg-[var(--accent)] text-white"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/[0.03]"
                        }`}
                >
                    Houses
                </Link>
                <Link
                    href={`/properties?type=PLOT${location ? `&location=${encodeURIComponent(location)}` : ""}`}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${type === "PLOT"
                        ? "bg-[var(--accent)] text-white"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/[0.03]"
                        }`}
                >
                    Plots
                </Link>
            </div>

            {/* Grid */}
            {properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {properties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 glass rounded-xl">
                    <p className="text-[var(--text-muted)] text-base mb-1">No properties found.</p>
                    <p className="text-[var(--text-muted)] text-sm">Try changing your filters.</p>
                    <Link
                        href="/properties"
                        className="inline-block mt-4 text-[var(--accent)] hover:underline font-medium text-sm"
                    >
                        Clear all filters
                    </Link>
                </div>
            )}

            <div className="h-16 md:hidden" />
        </div>
    );
}
