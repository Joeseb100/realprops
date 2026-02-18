"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPropertyPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<FileList | null>(null);
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
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            // Upload images first
            let imageUrls: string[] = [];
            if (files && files.length > 0) {
                const formData = new FormData();
                Array.from(files).forEach((file) => formData.append("files", file));
                const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
                const uploadData = await uploadRes.json();
                imageUrls = uploadData.urls || [];
            }

            // Create property
            const res = await fetch("/api/properties", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, imageUrls }),
            });

            if (res.ok) {
                router.push("/admin");
                router.refresh();
            }
        } catch (err) {
            console.error(err);
            alert("Failed to create property");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold mb-6">Add New Property</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5">
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Title</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Beautiful 3BHK Villa in Kanjirapally"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Price (₹)</label>
                        <input
                            name="price"
                            type="number"
                            value={form.price}
                            onChange={handleChange}
                            required
                            placeholder="e.g. 7500000"
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Location</label>
                        <input
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Kanjirapally Town"
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Type</label>
                        <select
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none bg-white"
                        >
                            <option value="HOUSE">House</option>
                            <option value="PLOT">Plot</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Area (sq.ft)</label>
                        <input
                            name="areaSqft"
                            type="number"
                            value={form.areaSqft}
                            onChange={handleChange}
                            required
                            placeholder="e.g. 1500"
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                        />
                    </div>
                </div>

                {form.type === "HOUSE" && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">Bedrooms</label>
                            <input
                                name="bedrooms"
                                type="number"
                                value={form.bedrooms}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">Bathrooms</label>
                            <input
                                name="bathrooms"
                                type="number"
                                value={form.bathrooms}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                            />
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Phone Number</label>
                    <input
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        required
                        placeholder="e.g. +919876543210"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Describe the property..."
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                        Property Images
                    </label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setFiles(e.target.files)}
                        className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white py-3 rounded-xl font-semibold transition-colors"
                    >
                        {loading ? "Creating..." : "Create Property"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 border border-stone-300 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
