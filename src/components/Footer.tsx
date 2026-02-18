import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-stone-900 text-stone-400 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Image
                                src="/logo.png"
                                alt="Real Properties"
                                width={40}
                                height={40}
                                className="rounded-lg"
                            />
                            <span className="text-xl font-bold text-white tracking-tight">
                                Real<span className="text-amber-500">Properties</span>
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed">
                            Premium homes and plots in Kanjirapally. Find your dream property today.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <div className="space-y-2">
                            <Link href="/" className="block text-sm hover:text-white transition-colors">Home</Link>
                            <Link href="/properties" className="block text-sm hover:text-white transition-colors">All Properties</Link>
                            <Link href="/properties?type=HOUSE" className="block text-sm hover:text-white transition-colors">Houses</Link>
                            <Link href="/properties?type=PLOT" className="block text-sm hover:text-white transition-colors">Plots</Link>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Contact</h3>
                        <p className="text-sm">Kanjirapally, Kottayam</p>
                        <p className="text-sm">Kerala, India</p>
                    </div>
                </div>

                <div className="border-t border-stone-800 mt-8 pt-8 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} RealProperties. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
