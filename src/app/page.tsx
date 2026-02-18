import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PropertyCard from "@/components/PropertyCard";
import type { Property } from "@/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredProperties = (await prisma.property.findMany({
    where: { status: "AVAILABLE" },
    include: { images: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  })) as Property[];

  const locations = await prisma.property.groupBy({
    by: ["location"],
    _count: { location: true },
  });

  return (
    <>
      {/* Hero */}
      <section className="relative bg-stone-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900/30" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-600/20 border border-amber-600/30 text-amber-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              Trusted Properties in Kanjirapally
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 tracking-tight">
              Premium Homes & Plots
              <br />
              <span className="text-amber-500">in Kanjirapally</span>
            </h1>
            <p className="text-lg md:text-xl text-stone-300 mb-8 leading-relaxed max-w-xl">
              Find your dream property. Handpicked houses and plots at the best prices. Zero brokerage, direct from owners.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-colors shadow-lg shadow-amber-600/25"
              >
                View Properties
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/properties?type=PLOT"
                className="inline-flex items-center gap-2 border-2 border-stone-600 hover:border-stone-400 text-white px-8 py-3.5 rounded-xl font-semibold transition-colors"
              >
                Browse Plots
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-amber-600">{featuredProperties.length}+</p>
              <p className="text-sm text-stone-500 mt-1">Properties</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-amber-600">{locations.length}</p>
              <p className="text-sm text-stone-500 mt-1">Locations</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-amber-600">100%</p>
              <p className="text-sm text-stone-500 mt-1">Verified</p>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Location */}
      {locations.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Browse by <span className="text-amber-600">Location</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {locations.map((loc) => (
              <Link
                key={loc.location}
                href={`/properties?location=${encodeURIComponent(loc.location)}`}
                className="group px-6 py-3 bg-white rounded-xl border border-stone-200 hover:border-amber-500 hover:shadow-md transition-all"
              >
                <span className="font-medium text-stone-700 group-hover:text-amber-700 transition-colors">
                  {loc.location}
                </span>
                <span className="text-stone-400 text-sm ml-2">
                  ({loc._count.location})
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">
            Featured <span className="text-amber-600">Properties</span>
          </h2>
          <Link
            href="/properties"
            className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200">
            <p className="text-stone-400 text-lg">No properties listed yet.</p>
            <p className="text-stone-400 text-sm mt-1">Check back soon!</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Looking for the perfect property?
          </h2>
          <p className="text-stone-300 mb-8">
            Call us now and get instant details about any property. We&apos;re here to help you find your dream home.
          </p>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-colors"
          >
            Browse All Properties
          </Link>
        </div>
      </section>

      {/* Add bottom padding on mobile for sticky bar */}
      <div className="h-16 md:hidden" />
    </>
  );
}
