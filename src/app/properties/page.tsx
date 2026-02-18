import { prisma } from "@/lib/prisma";
import PropertyCard from "@/components/PropertyCard";
import type { Property } from "@/types";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Properties for Sale in Kanjirapally | Houses & Plots",
    description:
        "Browse premium houses and plots for sale in Kanjirapally. Filter by location, find your dream property, and call now.",
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    {type === "PLOT" ? "Plots" : type === "HOUSE" ? "Houses" : "Properties"}{" "}
                    {location && location !== "all" ? `in ${location}` : "in Kanjirapally"}
                </h1>
                <p className="text-stone-500">
                    {properties.length} {properties.length === 1 ? "property" : "properties"} found
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-stone-200 p-4 mb-8 flex flex-wrap gap-3">
                {/* Location filter */}
                <div className="flex flex-wrap gap-2">
                    <Link
                        href="/properties"
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!location || location === "all"
                                ? "bg-amber-600 text-white"
                                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                            }`}
                    >
                        All Locations
                    </Link>
                    {locations.map((loc) => (
                        <Link
                            key={loc.location}
                            href={`/properties?location=${encodeURIComponent(loc.location)}${type ? `&type=${type}` : ""}`}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location === loc.location
                                    ? "bg-amber-600 text-white"
                                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                                }`}
                        >
                            {loc.location} ({loc._count.location})
                        </Link>
                    ))}
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-stone-200 self-center hidden sm:block" />

                {/* Type filter */}
                <div className="flex gap-2">
                    <Link
                        href={`/properties${location ? `?location=${encodeURIComponent(location)}` : ""}`}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!type
                                ? "bg-stone-800 text-white"
                                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                            }`}
                    >
                        All Types
                    </Link>
                    <Link
                        href={`/properties?type=HOUSE${location ? `&location=${encodeURIComponent(location)}` : ""}`}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${type === "HOUSE"
                                ? "bg-stone-800 text-white"
                                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                            }`}
                    >
                        Houses
                    </Link>
                    <Link
                        href={`/properties?type=PLOT${location ? `&location=${encodeURIComponent(location)}` : ""}`}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${type === "PLOT"
                                ? "bg-stone-800 text-white"
                                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                            }`}
                    >
                        Plots
                    </Link>
                </div>
            </div>

            {/* Grid */}
            {properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-stone-200">
                    <svg className="w-16 h-16 mx-auto text-stone-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-stone-400 text-lg">No properties found.</p>
                    <p className="text-stone-400 text-sm mt-1">Try changing your filters.</p>
                    <Link
                        href="/properties"
                        className="inline-block mt-4 text-amber-600 hover:text-amber-700 font-medium"
                    >
                        Clear all filters
                    </Link>
                </div>
            )}

            {/* Bottom padding for mobile sticky bar */}
            <div className="h-16 md:hidden" />
        </div>
    );
}
