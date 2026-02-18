import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="border-t border-[var(--border-subtle)] bg-white/50">
            <div className="max-w-6xl mx-auto px-5 sm:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2.5 mb-3">
                            <Image src="/logo.png" alt="Real Properties" width={32} height={32} className="rounded" />
                            <span className="text-[15px] font-semibold text-[var(--text-primary)]">Real Properties</span>
                        </div>
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xs">
                            Trusted real estate consultants in Kottayam District. We help you find verified homes and plots with complete transparency.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-2 mt-4">
                            <a
                                href="https://wa.me/919447139342"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-[#25d366]/10 flex items-center justify-center hover:bg-[#25d366]/20 transition-colors"
                            >
                                <svg className="w-4 h-4 text-[#25d366]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </a>
                            <a
                                href="https://www.facebook.com/realktymproperties"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-[#1877f2]/10 flex items-center justify-center hover:bg-[#1877f2]/20 transition-colors"
                            >
                                <svg className="w-4 h-4 text-[#1877f2]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Quick Links</h3>
                        <div className="space-y-2">
                            <Link href="/" className="block text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Home</Link>
                            <Link href="/properties" className="block text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">All Properties</Link>
                            <Link href="/properties?type=HOUSE" className="block text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Houses</Link>
                            <Link href="/properties?type=PLOT" className="block text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Plots</Link>
                            <a href="https://www.facebook.com/realktymproperties" target="_blank" rel="noopener noreferrer" className="block text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Facebook Page</a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Contact</h3>
                        <div className="space-y-2 text-sm text-[var(--text-muted)]">
                            <p>Kottayam District</p>
                            <p>Kerala, India</p>
                            <a
                                href="https://wa.me/919447139342"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-[#25d366] hover:underline mt-1"
                            >
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                +91 94471 39342
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[var(--border-subtle)] mt-8 pt-6 text-center text-xs text-[var(--text-muted)]">
                    <p>&copy; {new Date().getFullYear()} Real Properties — Real Estate Consultants, Kottayam. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
