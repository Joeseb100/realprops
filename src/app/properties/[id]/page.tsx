import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPrice, formatArea, getWhatsAppLink, getPhoneLink, generateSEOTitle, timeAgo } from "@/lib/utils";
import ImageGallery from "@/components/ImageGallery";
import StickyCallBar from "@/components/StickyCallBar";
import Badge from "@/components/Badge";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

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
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-stone-500 mb-6">
                    <Link href="/" className="hover:text-stone-700">Home</Link>
                    <span>/</span>
                    <Link href="/properties" className="hover:text-stone-700">Properties</Link>
                    <span>/</span>
                    <span className="text-stone-900 font-medium line-clamp-1">{property.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left: Images + Description */}
                    <div className="lg:col-span-3">
                        <ImageGallery images={property.images} />

                        {/* Description */}
                        <div className="mt-8 bg-white rounded-2xl border border-stone-200 p-6">
                            <h2 className="text-xl font-bold mb-4">About this property</h2>
                            <p className="text-stone-600 leading-relaxed whitespace-pre-line">
                                {property.description}
                            </p>
                        </div>
                    </div>

                    {/* Right: Details + CTA */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-stone-200 p-6 sticky top-24">
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {isNew && <Badge variant="green">Recently Added</Badge>}
                                {property.status === "SOLD" && <Badge variant="red">Sold</Badge>}
                                {property.type === "PLOT" && <Badge variant="blue">Plot</Badge>}
                                {property.type === "HOUSE" && <Badge variant="amber">House</Badge>}
                            </div>

                            <h1 className="text-2xl font-bold mb-2">{property.title}</h1>

                            <p className="flex items-center gap-1 text-stone-500 mb-4">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {property.location}
                            </p>

                            <p className="text-3xl font-bold text-amber-600 mb-6">
                                {formatPrice(property.price)}
                            </p>

                            {/* Key Details */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {property.type === "HOUSE" && (
                                    <>
                                        <div className="bg-stone-50 rounded-xl p-3 text-center">
                                            <p className="text-lg font-bold text-stone-800">{property.bedrooms}</p>
                                            <p className="text-xs text-stone-500">Bedrooms</p>
                                        </div>
                                        <div className="bg-stone-50 rounded-xl p-3 text-center">
                                            <p className="text-lg font-bold text-stone-800">{property.bathrooms}</p>
                                            <p className="text-xs text-stone-500">Bathrooms</p>
                                        </div>
                                    </>
                                )}
                                <div className="bg-stone-50 rounded-xl p-3 text-center">
                                    <p className="text-lg font-bold text-stone-800">{formatArea(property.areaSqft)}</p>
                                    <p className="text-xs text-stone-500">Area</p>
                                </div>
                                <div className="bg-stone-50 rounded-xl p-3 text-center">
                                    <p className="text-lg font-bold text-stone-800">{property.type}</p>
                                    <p className="text-xs text-stone-500">Type</p>
                                </div>
                            </div>

                            <p className="text-xs text-stone-400 mb-6">
                                Listed {timeAgo(property.createdAt)}
                            </p>

                            {/* CTA Buttons */}
                            {property.status !== "SOLD" && (
                                <div className="space-y-3">
                                    <a
                                        href={getPhoneLink(property.phoneNumber)}
                                        className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        Call Now
                                    </a>
                                    <a
                                        href={getWhatsAppLink(property.phoneNumber, property.title)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                        WhatsApp
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky mobile CTA */}
            {property.status !== "SOLD" && (
                <StickyCallBar phone={property.phoneNumber} title={property.title} />
            )}

            {/* Bottom padding for sticky bar */}
            <div className="h-20 md:hidden" />
        </>
    );
}
