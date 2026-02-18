"use client";

import Image from "next/image";
import { useState } from "react";

export default function ImageGallery({ images }: { images: { id: number; imageUrl: string }[] }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[16/9] bg-stone-100 rounded-2xl flex items-center justify-center">
                <p className="text-stone-400">No images available</p>
            </div>
        );
    }

    return (
        <>
            {/* Main image */}
            <div
                className="relative aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => setLightboxOpen(true)}
            >
                <Image
                    src={images[selectedIndex].imageUrl}
                    alt="Property"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white bg-black/50 px-4 py-2 rounded-full text-sm font-medium">
                        Click to enlarge
                    </span>
                </div>
                {images.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                        {selectedIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                    {images.map((img, i) => (
                        <button
                            key={img.id}
                            onClick={() => setSelectedIndex(i)}
                            className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${i === selectedIndex
                                    ? "border-amber-600 shadow-md"
                                    : "border-transparent opacity-70 hover:opacity-100"
                                }`}
                        >
                            <Image src={img.imageUrl} alt="" fill className="object-cover" sizes="80px" />
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setLightboxOpen(false)}
                >
                    <button
                        className="absolute top-6 right-6 text-white/80 hover:text-white z-10"
                        onClick={() => setLightboxOpen(false)}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Prev */}
                    {images.length > 1 && (
                        <button
                            className="absolute left-4 text-white/80 hover:text-white z-10"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                            }}
                        >
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    <div className="relative w-full max-w-5xl aspect-[16/9]" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={images[selectedIndex].imageUrl}
                            alt="Property"
                            fill
                            className="object-contain"
                            sizes="100vw"
                        />
                    </div>

                    {/* Next */}
                    {images.length > 1 && (
                        <button
                            className="absolute right-4 text-white/80 hover:text-white z-10"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                            }}
                        >
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                </div>
            )}
        </>
    );
}
