"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
            <div className="max-w-6xl mx-auto px-5 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2.5">
                        <Image
                            src="/logo.png"
                            alt="Real Properties"
                            width={36}
                            height={36}
                            className="rounded"
                        />
                        <span className="text-[17px] font-semibold tracking-tight text-[var(--text-primary)]">
                            Real Properties
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link
                            href="/"
                            className="px-3.5 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.03] rounded-lg font-medium transition-all"
                        >
                            Home
                        </Link>
                        <Link
                            href="/properties"
                            className="px-3.5 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.03] rounded-lg font-medium transition-all"
                        >
                            Properties
                        </Link>
                        <Link
                            href="/properties?type=HOUSE"
                            className="px-3.5 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.03] rounded-lg font-medium transition-all"
                        >
                            Houses
                        </Link>
                        <Link
                            href="/properties?type=PLOT"
                            className="px-3.5 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.03] rounded-lg font-medium transition-all"
                        >
                            Plots
                        </Link>
                        <a
                            href="https://wa.me/919447139342"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 px-4 py-2 bg-[var(--accent)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Contact Us
                        </a>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-black/[0.03] transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {open ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden glass-strong border-t border-[var(--border-subtle)] py-3 px-5 space-y-1">
                    <Link href="/" onClick={() => setOpen(false)} className="block text-[var(--text-secondary)] font-medium py-2.5 px-3 rounded-lg hover:bg-black/[0.03] transition-colors text-sm">Home</Link>
                    <Link href="/properties" onClick={() => setOpen(false)} className="block text-[var(--text-secondary)] font-medium py-2.5 px-3 rounded-lg hover:bg-black/[0.03] transition-colors text-sm">Properties</Link>
                    <Link href="/properties?type=HOUSE" onClick={() => setOpen(false)} className="block text-[var(--text-secondary)] font-medium py-2.5 px-3 rounded-lg hover:bg-black/[0.03] transition-colors text-sm">Houses</Link>
                    <Link href="/properties?type=PLOT" onClick={() => setOpen(false)} className="block text-[var(--text-secondary)] font-medium py-2.5 px-3 rounded-lg hover:bg-black/[0.03] transition-colors text-sm">Plots</Link>
                    <a
                        href="https://wa.me/919447139342"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center bg-[var(--accent)] text-white font-medium py-2.5 px-3 rounded-lg text-sm mt-2"
                    >
                        Contact on WhatsApp
                    </a>
                </div>
            )}
        </nav>
    );
}
