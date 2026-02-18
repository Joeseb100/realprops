import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPrice, formatArea, generateSEOTitle, timeAgo } from "@/lib/utils";
import ImageGallery from "@/components/ImageGallery";
import StickyCallBar from "@/components/StickyCallBar";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 30;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const property = await prisma.property.findUnique({
        where: { id: parseInt(id) },
    });

    if (!property) return { title: "Property Not Found" };

    const title = generateSEOTitle(property);
    return {
        title,
        description: property.description.slice(0, 160),
    };
}

export default async function PropertyDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const property = await prisma.property.findUnique({
        where: { id: parseInt(id) },
        include: { images: true },
    });

    if (!property) notFound();

    const isNew =
        new Date().getTime() - new Date(property.createdAt).getTime() <
        7 * 24 * 60 * 60 * 1000;

    return (
        <>
            <div className="max-w-6xl mx-auto px-5 sm:px-6 py-8 pt-24">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-5">
                    <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/properties" className="hover:text-[var(--text-primary)] transition-colors">Properties</Link>
                    <span>/</span>
                    <span className="text-[var(--text-primary)] font-medium line-clamp-1">{property.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Left: Images + Description */}
                    <div className="lg:col-span-3">
                        <ImageGallery images={property.images} />

                        {/* Description */}
                        <div className="mt-6 glass rounded-xl p-5">
                            <h2 className="text-base font-semibold text-[var(--text-primary)] mb-3">About this property</h2>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                                {property.description}
                            </p>
                        </div>
                    </div>

                    {/* Right: Details + CTA */}
                    <div className="lg:col-span-2">
                        <div className="glass rounded-xl p-5 sticky top-24">
                            {/* Badges */}
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {isNew && (
                                    <span className="text-xs font-medium bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md">
                                        New
                                    </span>
                                )}
                                {property.status === "SOLD" && (
                                    <span className="text-xs font-medium bg-red-50 text-red-600 px-2.5 py-1 rounded-md">
                                        Sold
                                    </span>
                                )}
                                <span className="text-xs font-medium bg-[var(--accent-soft)] text-[var(--accent)] px-2.5 py-1 rounded-md">
                                    {property.type === "PLOT" ? "Plot" : "House"}
                                </span>
                            </div>

                            <h1 className="text-xl font-semibold text-[var(--text-primary)] mb-1.5">{property.title}</h1>

                            <p className="flex items-center gap-1 text-sm text-[var(--text-muted)] mb-4">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {property.location}
                            </p>

                            <p className="text-2xl font-bold text-[var(--text-primary)] mb-5">
                                {formatPrice(property.price)}
                            </p>

                            {/* Key Details */}
                            <div className="grid grid-cols-2 gap-2 mb-5">
                                {property.type === "HOUSE" && (
                                    <>
                                        <div className="bg-[var(--bg-primary)] rounded-lg p-3 text-center">
                                            <p className="text-base font-semibold text-[var(--text-primary)]">{property.bedrooms}</p>
                                            <p className="text-xs text-[var(--text-muted)]">Bedrooms</p>
                                        </div>
                                        <div className="bg-[var(--bg-primary)] rounded-lg p-3 text-center">
                                            <p className="text-base font-semibold text-[var(--text-primary)]">{property.bathrooms}</p>
                                            <p className="text-xs text-[var(--text-muted)]">Bathrooms</p>
                                        </div>
                                    </>
                                )}
                                <div className="bg-[var(--bg-primary)] rounded-lg p-3 text-center">
                                    <p className="text-base font-semibold text-[var(--text-primary)]">{formatArea(property.areaSqft)}</p>
                                    <p className="text-xs text-[var(--text-muted)]">Area</p>
                                </div>
                                <div className="bg-[var(--bg-primary)] rounded-lg p-3 text-center">
                                    <p className="text-base font-semibold text-[var(--text-primary)]">{property.type}</p>
                                    <p className="text-xs text-[var(--text-muted)]">Type</p>
                                </div>
                            </div>

                            <p className="text-xs text-[var(--text-muted)] mb-5">
                                Listed {timeAgo(property.createdAt)}
                            </p>

                            {/* CTA */}
                            {property.status !== "SOLD" && (
                                <a
                                    href={`https://wa.me/919447139342?text=${encodeURIComponent(`Hi, I'm interested in: ${property.title}. Can you share more details?`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-[#25d366] hover:bg-[#22c55e] text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    Contact on WhatsApp
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky mobile CTA */}
            {property.status !== "SOLD" && (
                <StickyCallBar phone="+919447139342" title={property.title} />
            )}

            <div className="h-20 md:hidden" />
        </>
    );
}
