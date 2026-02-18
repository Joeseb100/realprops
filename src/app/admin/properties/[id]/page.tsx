"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import type { Property } from "@/types";

export default function EditPropertyPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [files, setFiles] = useState<FileList | null>(null);
    const [existingImages, setExistingImages] = useState<{ id: number; imageUrl: string }[]>([]);
    const [form, setForm] = useState({
        title: "",
        price: "",
        location: "",
        type: "HOUSE",
        areaSqft: "",
        bedrooms: "0",
        bathrooms: "0",
        description: "",
        phoneNumber: "",
        status: "AVAILABLE",
    });

    useEffect(() => {
        fetch(`/api/properties/${id}`)
            .then((res) => res.json())
            .then((data: Property) => {
                setForm({
                    title: data.title,
                    price: String(data.price),
                    location: data.location,
                    type: data.type,
                    areaSqft: String(data.areaSqft),
                    bedrooms: String(data.bedrooms),
                    bathrooms: String(data.bathrooms),
                    description: data.description,
                    phoneNumber: data.phoneNumber,
                    status: data.status,
                });
                setExistingImages(data.images || []);
            })
            .finally(() => setFetching(false));
    }, [id]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrls: string[] | undefined;

            // Only upload new images if provided
            if (files && files.length > 0) {
                const formData = new FormData();
                Array.from(files).forEach((file) => formData.append("files", file));
                const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
                const uploadData = await uploadRes.json();
                imageUrls = uploadData.urls || [];
            }

            const updateData: Record<string, unknown> = { ...form };
            if (imageUrls) updateData.imageUrls = imageUrls;

            const res = await fetch(`/api/properties/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData),
            });

            if (res.ok) {
                router.push("/admin");
                router.refresh();
            }
        } catch (err) {
            console.error(err);
            alert("Failed to update property");
        } finally {
            setLoading(false);
        }
    }

    if (fetching) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-8 text-center text-stone-400">
                Loading...
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold mb-6">Edit Property</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5">
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Title</label>
                    <input name="title" value={form.title} onChange={handleChange} required
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Price (₹)</label>
                        <input name="price" type="number" value={form.price} onChange={handleChange} required
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Location</label>
                        <input name="location" value={form.location} onChange={handleChange} required
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Type</label>
                        <select name="type" value={form.type} onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none bg-white">
                            <option value="HOUSE">House</option>
                            <option value="PLOT">Plot</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Area (sq.ft)</label>
                        <input name="areaSqft" type="number" value={form.areaSqft} onChange={handleChange} required
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Status</label>
                        <select name="status" value={form.status} onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none bg-white">
                            <option value="AVAILABLE">Available</option>
                            <option value="SOLD">Sold</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Phone Number</label>
                        <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none" />
                    </div>
                </div>

                {form.type === "HOUSE" && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">Bedrooms</label>
                            <input name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">Bathrooms</label>
                            <input name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none" />
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} required rows={5}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none resize-none" />
                </div>

                {/* Existing images */}
                {existingImages.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Current Images</label>
                        <div className="flex gap-2 flex-wrap">
                            {existingImages.map((img) => (
                                <img key={img.id} src={img.imageUrl} alt="" className="w-20 h-20 rounded-lg object-cover" />
                            ))}
                        </div>
                        <p className="text-xs text-stone-400 mt-1">Upload new images below to replace these.</p>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                        Replace Images (optional)
                    </label>
                    <input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)}
                        className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" />
                </div>

                <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={loading}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white py-3 rounded-xl font-semibold transition-colors">
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button type="button" onClick={() => router.back()}
                        className="px-6 py-3 border border-stone-300 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors font-medium">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
