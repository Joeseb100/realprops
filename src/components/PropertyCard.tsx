"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice, formatArea } from "@/lib/utils";
import Badge from "./Badge";
import type { Property } from "@/types";

export default function PropertyCard({ property }: { property: Property }) {
    const mainImage = property.images?.[0]?.imageUrl || "/placeholder-property.jpg";
    const isNew =
        new Date().getTime() - new Date(property.createdAt).getTime() <
        7 * 24 * 60 * 60 * 1000;

    return (
        <Link
            href={`/properties/${property.id}`}
            className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100"
        >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                    src={mainImage}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                    {isNew && <Badge variant="green">Recently Added</Badge>}
                    {property.status === "SOLD" && <Badge variant="red">Sold</Badge>}
                    {property.type === "PLOT" && <Badge variant="blue">Plot</Badge>}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white text-xl font-bold">{formatPrice(property.price)}</p>
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className="font-semibold text-stone-900 text-lg mb-1 group-hover:text-amber-700 transition-colors line-clamp-1">
                    {property.title}
                </h3>
                <p className="text-stone-500 text-sm flex items-center gap-1 mb-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {property.location}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-stone-600">
                    {property.type === "HOUSE" && (
                        <>
                            <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                {property.bedrooms} Beds
                            </span>
                            <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                </svg>
                                {property.bathrooms} Baths
                            </span>
                        </>
                    )}
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        {formatArea(property.areaSqft)}
                    </span>
                </div>

                {/* Call CTA */}
                <div
                    onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `tel:${property.phoneNumber}`;
                    }}
                    className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white text-center py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call Now
                </div>
            </div>
        </Link>
    );
}
