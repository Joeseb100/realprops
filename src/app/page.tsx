import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PropertyCard from "@/components/PropertyCard";
import type { Property } from "@/types";

export const revalidate = 30; // cache page for 30s, then refresh in background

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

  const totalProperties = await prisma.property.count();

  return (
    <>
      {/* Hero — clean, warm, trust-building */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        {/* Soft ambient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f0ebe4] via-[var(--bg-primary)] to-[var(--bg-primary)]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent)]/[0.04] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[var(--accent)] mb-4 tracking-wide uppercase">
              Trusted Real Estate Broker · Kanjirapally
            </p>
            <h1 className="text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.15] mb-5 text-[var(--text-primary)] tracking-tight">
              Find your next home
              <br />
              with someone you trust.
            </h1>
            <p className="text-[17px] text-[var(--text-secondary)] mb-8 leading-relaxed max-w-lg">
              We help families find verified homes and plots in Kanjirapally and nearby areas.
              No hidden costs, no surprises — just honest property deals.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 bg-[var(--text-primary)] text-white px-6 py-3 rounded-lg font-medium text-[15px] hover:opacity-90 transition-opacity"
              >
                Browse Properties
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a
                href="https://wa.me/919447139342?text=Hi%2C%20I%27m%20looking%20for%20a%20property%20in%20Kanjirapally."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white border border-[var(--border-subtle)] text-[var(--text-primary)] px-6 py-3 rounded-lg font-medium text-[15px] hover:bg-black/[0.02] transition-colors shadow-sm"
              >
                <svg className="w-4 h-4 text-[#25d366]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Talk to Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators — glass cards */}
      <section className="max-w-6xl mx-auto px-5 sm:px-6 -mt-4 mb-16">
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <div className="glass rounded-xl px-4 py-5 text-center card-hover">
            <p className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">{totalProperties}+</p>
            <p className="text-xs md:text-sm text-[var(--text-muted)] mt-1">Properties Listed</p>
          </div>
          <div className="glass rounded-xl px-4 py-5 text-center card-hover">
            <p className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">{locations.length}</p>
            <p className="text-xs md:text-sm text-[var(--text-muted)] mt-1">Locations Covered</p>
          </div>
          <div className="glass rounded-xl px-4 py-5 text-center card-hover">
            <p className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">10+</p>
            <p className="text-xs md:text-sm text-[var(--text-muted)] mt-1">Years Experience</p>
          </div>
        </div>
      </section>

      {/* Browse by Location */}
      {locations.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 sm:px-6 mb-16">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Browse by area
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {locations.map((loc) => (
              <Link
                key={loc.location}
                href={`/properties?location=${encodeURIComponent(loc.location)}`}
                className="group px-4 py-2 glass rounded-lg hover:bg-white/90 transition-all text-sm"
              >
                <span className="font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                  {loc.location}
                </span>
                <span className="text-[var(--text-muted)] text-xs ml-1.5">
                  {loc._count.location}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Properties */}
      <section className="max-w-6xl mx-auto px-5 sm:px-6 mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Available Properties
          </h2>
          <Link
            href="/properties"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] font-medium transition-colors flex items-center gap-1"
          >
            View all
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass rounded-2xl">
            <p className="text-[var(--text-muted)] text-base">No properties listed yet.</p>
            <p className="text-[var(--text-muted)] text-sm mt-1">Check back soon!</p>
          </div>
        )}
      </section>

      {/* CTA — subtle, not pushy */}
      <section className="max-w-6xl mx-auto px-5 sm:px-6 mb-16">
        <div className="glass rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-xl md:text-2xl font-semibold mb-3 text-[var(--text-primary)]">
            Need help finding the right property?
          </h2>
          <p className="text-[var(--text-secondary)] text-[15px] mb-6 max-w-md mx-auto leading-relaxed">
            Reach out on WhatsApp and we&apos;ll help you find exactly what you&apos;re looking for. No pressure, just honest guidance.
          </p>
          <a
            href="https://wa.me/919447139342?text=Hi%2C%20I%20need%20help%20finding%20a%20property."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25d366] text-white px-6 py-3 rounded-lg font-medium text-[15px] hover:opacity-90 transition-opacity"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </section>

      {/* Bottom padding on mobile */}
      <div className="h-16 md:hidden" />
    </>
  );
}
