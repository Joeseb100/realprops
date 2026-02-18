"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            alt="Real Properties"
                            width={40}
                            height={40}
                            className="rounded-lg"
                        />
                        <span className="text-xl font-bold text-stone-900 tracking-tight">
                            Real<span className="text-amber-700">Properties</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="/"
                            className="text-stone-600 hover:text-stone-900 font-medium transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/properties"
                            className="text-stone-600 hover:text-stone-900 font-medium transition-colors"
                        >
                            Properties
                        </Link>
                        <Link
                            href="/properties?type=HOUSE"
                            className="text-stone-600 hover:text-stone-900 font-medium transition-colors"
                        >
                            Houses
                        </Link>
                        <Link
                            href="/properties?type=PLOT"
                            className="text-stone-600 hover:text-stone-900 font-medium transition-colors"
                        >
                            Plots
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="md:hidden p-2 text-stone-600"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {open ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden bg-white border-t border-stone-200 py-4 px-4 space-y-3">
                    <Link href="/" onClick={() => setOpen(false)} className="block text-stone-700 font-medium py-2">Home</Link>
                    <Link href="/properties" onClick={() => setOpen(false)} className="block text-stone-700 font-medium py-2">Properties</Link>
                    <Link href="/properties?type=HOUSE" onClick={() => setOpen(false)} className="block text-stone-700 font-medium py-2">Houses</Link>
                    <Link href="/properties?type=PLOT" onClick={() => setOpen(false)} className="block text-stone-700 font-medium py-2">Plots</Link>
                </div>
            )}
        </nav>
    );
}
