import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import AdminActions from "./AdminActions";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const authed = await isAuthenticated();
    if (!authed) redirect("/admin/login");

    const properties = await prisma.property.findMany({
        include: { images: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <p className="text-stone-500">{properties.length} properties listed</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/admin/properties/new"
                        className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Property
                    </Link>
                    <AdminActions type="logout" />
                </div>
            </div>

            {/* Properties table */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-stone-50 border-b border-stone-200">
                            <tr>
                                <th className="text-left px-6 py-3 font-semibold text-stone-600">Property</th>
                                <th className="text-left px-6 py-3 font-semibold text-stone-600">Location</th>
                                <th className="text-left px-6 py-3 font-semibold text-stone-600">Price</th>
                                <th className="text-left px-6 py-3 font-semibold text-stone-600">Type</th>
                                <th className="text-left px-6 py-3 font-semibold text-stone-600">Status</th>
                                <th className="text-right px-6 py-3 font-semibold text-stone-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {properties.map((property) => (
                                <tr key={property.id} className="hover:bg-stone-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {property.images[0] ? (
                                                <img
                                                    src={property.images[0].imageUrl}
                                                    alt=""
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <span className="font-medium text-stone-900 line-clamp-1">{property.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-stone-600">{property.location}</td>
                                    <td className="px-6 py-4 font-semibold text-stone-900">{formatPrice(property.price)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${property.type === "HOUSE" ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700"
                                            }`}>
                                            {property.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${property.status === "AVAILABLE" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                                            }`}>
                                            {property.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/properties/${property.id}`}
                                                className="text-stone-500 hover:text-amber-600 transition-colors"
                                                title="Edit"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </Link>
                                            <AdminActions type="toggleStatus" propertyId={property.id} currentStatus={property.status} />
                                            <AdminActions type="delete" propertyId={property.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {properties.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-stone-400 mb-4">No properties yet.</p>
                        <Link
                            href="/admin/properties/new"
                            className="text-amber-600 hover:text-amber-700 font-medium"
                        >
                            Add your first property →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
