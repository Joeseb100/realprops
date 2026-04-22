"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PropertyRow {
    title: string;
    price: string;
    location: string;
    type: string;
    areaSqft: string;
    bedrooms: string;
    bathrooms: string;
    description: string;
    phoneNumber: string;
    images: File[];
    previews: string[];
}

const emptyRow = (): PropertyRow => ({
    title: "",
    price: "",
    location: "",
    type: "HOUSE",
    areaSqft: "",
    bedrooms: "0",
    bathrooms: "0",
    description: "",
    phoneNumber: "+919447139342",
    images: [],
    previews: [],
});

export default function BulkUploadPage() {
    const router = useRouter();
    const [rows, setRows] = useState<PropertyRow[]>([emptyRow()]);
    const [csvText, setCsvText] = useState("");
    const [mode, setMode] = useState<"form" | "csv">("form");
    const [loading, setLoading] = useState(false);
    const [uploadingRow, setUploadingRow] = useState<number | null>(null);
    const [results, setResults] = useState<{
        success: number;
        failed: number;
        errors: { row: number; error: string }[];
    } | null>(null);

    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    function addRow() {
        setRows([...rows, emptyRow()]);
    }

    function removeRow(index: number) {
        const updated = rows.filter((_, i) => i !== index);
        setRows(updated);
    }

    function updateRow(index: number, field: keyof Omit<PropertyRow, "images" | "previews">, value: string) {
        const updated = [...rows];
        updated[index] = { ...updated[index], [field]: value };
        setRows(updated);
    }

    function handleImagesChange(index: number, files: FileList | null) {
        if (!files || files.length === 0) return;
        const fileArr = Array.from(files);
        const previews = fileArr.map((f) => URL.createObjectURL(f));
        const updated = [...rows];
        updated[index] = { 
            ...updated[index], 
            images: [...updated[index].images, ...fileArr], 
            previews: [...updated[index].previews, ...previews] 
        };
        setRows(updated);
        // Reset file input so user can pick the same file again or add more
        if (fileInputRefs.current[index]) {
            fileInputRefs.current[index]!.value = "";
        }
    }

    function removeImage(rowIndex: number, imgIndex: number) {
        const updated = [...rows];
        const row = { ...updated[rowIndex] };
        row.images = row.images.filter((_, i) => i !== imgIndex);
        row.previews = row.previews.filter((_, i) => i !== imgIndex);
        updated[rowIndex] = row;
        setRows(updated);
        // Reset file input so user can re-pick
        if (fileInputRefs.current[rowIndex]) {
            fileInputRefs.current[rowIndex]!.value = "";
        }
    }

    function parseCSV(text: string): Omit<PropertyRow, "images" | "previews">[] {
        const lines = text.trim().split("\n");
        if (lines.length < 2) return [];

        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
        const parsed: Omit<PropertyRow, "images" | "previews">[] = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",").map((v) => v.trim());
            const row: Omit<PropertyRow, "images" | "previews"> = {
                title: "",
                price: "",
                location: "",
                type: "HOUSE",
                areaSqft: "",
                bedrooms: "0",
                bathrooms: "0",
                description: "",
                phoneNumber: "+919447139342",
            };

            headers.forEach((header, idx) => {
                const val = values[idx] || "";
                if (header === "title") row.title = val;
                else if (header === "price") row.price = val;
                else if (header === "location") row.location = val;
                else if (header === "type") row.type = val || "HOUSE";
                else if (header === "areasqft" || header === "area") row.areaSqft = val;
                else if (header === "bedrooms" || header === "beds") row.bedrooms = val;
                else if (header === "bathrooms" || header === "baths") row.bathrooms = val;
                else if (header === "description") row.description = val;
                else if (header === "phone" || header === "phonenumber") row.phoneNumber = val || "+919447139342";
            });

            if (row.title && row.price) parsed.push(row);
        }
        return parsed;
    }

    async function uploadRowImages(row: PropertyRow): Promise<string[]> {
        if (row.images.length === 0) return [];
        
        const urls: string[] = [];
        
        // Upload images one by one to avoid Vercel 4.5MB payload size limits
        for (const file of row.images) {
            const formData = new FormData();
            formData.append("files", file);
            try {
                const res = await fetch("/api/upload", { method: "POST", body: formData });
                if (!res.ok) {
                    console.error("Upload failed for file", file.name);
                    continue;
                }
                const data = await res.json();
                if (data.urls && data.urls.length > 0) {
                    urls.push(...data.urls);
                }
            } catch (err) {
                console.error("Error uploading file", file.name, err);
            }
        }
        
        return urls;
    }

    async function handleSubmit() {
        setLoading(true);
        setResults(null);

        const baseProperties = mode === "csv"
            ? parseCSV(csvText).map((p) => ({ ...p, images: [] as File[], previews: [] as string[] }))
            : rows;

        if (baseProperties.length === 0) {
            setResults({ success: 0, failed: 1, errors: [{ row: 0, error: "No valid properties to upload" }] });
            setLoading(false);
            return;
        }

        // Upload images per row, then collect properties with imageUrls
        const propertiesWithUrls: (Omit<PropertyRow, "images" | "previews"> & { imageUrls?: string[] })[] = [];

        for (let i = 0; i < baseProperties.length; i++) {
            setUploadingRow(i);
            const row = baseProperties[i];
            let imageUrls: string[] | undefined;
            try {
                if (row.images.length > 0) {
                    imageUrls = await uploadRowImages(row);
                }
            } catch {
                // Non-fatal: property will be created without images
            }
            const { images: _i, previews: _p, ...rest } = row as PropertyRow;
            propertiesWithUrls.push({ ...rest, ...(imageUrls ? { imageUrls } : {}) });
        }

        setUploadingRow(null);

        try {
            const res = await fetch("/api/properties/bulk", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ properties: propertiesWithUrls }),
            });
            const data = await res.json();
            setResults(data);
            if (data.success > 0) {
                setTimeout(() => router.push("/admin"), 2000);
            }
        } catch {
            setResults({ success: 0, failed: 1, errors: [{ row: 0, error: "Network error" }] });
        }
        setLoading(false);
    }

    const csvRowCount = parseCSV(csvText).length;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900">Bulk Upload Properties</h1>
                    <p className="text-stone-500 mt-1">Add multiple properties at once</p>
                </div>
                <Link
                    href="/admin"
                    className="text-stone-600 hover:text-stone-900 font-medium transition-colors"
                >
                    ← Back to Dashboard
                </Link>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setMode("form")}
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${mode === "form"
                        ? "bg-amber-600 text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                        }`}
                >
                    📝 Manual Entry
                </button>
                <button
                    onClick={() => setMode("csv")}
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${mode === "csv"
                        ? "bg-amber-600 text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                        }`}
                >
                    📄 Paste CSV
                </button>
            </div>

            {/* Results */}
            {results && (
                <div className={`mb-6 p-4 rounded-xl border ${results.success > 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                    <p className="font-semibold">
                        ✅ {results.success} uploaded successfully
                        {results.failed > 0 && <span className="text-red-600 ml-2">❌ {results.failed} failed</span>}
                    </p>
                    {results.errors?.length > 0 && (
                        <ul className="mt-2 text-sm text-red-600 space-y-1">
                            {results.errors.map((e, i) => (
                                <li key={i}>Row {e.row}: {e.error}</li>
                            ))}
                        </ul>
                    )}
                    {results.success > 0 && (
                        <p className="text-sm text-green-700 mt-2">Redirecting to dashboard...</p>
                    )}
                </div>
            )}

            {/* CSV Mode */}
            {mode === "csv" && (
                <div className="bg-white rounded-2xl border border-stone-200 p-6">
                    <div className="mb-4">
                        <p className="text-sm text-stone-500 mb-2">
                            Paste CSV data with headers: <code className="bg-stone-100 px-1 rounded">title, price, location, type, areaSqft, bedrooms, bathrooms, description, phoneNumber</code>
                        </p>
                        <p className="text-xs text-stone-400">
                            Example: <code className="bg-stone-50 px-1 rounded">title,price,location,type,areaSqft,bedrooms,bathrooms,description,phone</code>
                        </p>
                    </div>
                    <textarea
                        value={csvText}
                        onChange={(e) => setCsvText(e.target.value)}
                        rows={12}
                        placeholder={`title,price,location,type,areaSqft,bedrooms,bathrooms,description,phone\n3BHK House Kanjirapally,4500000,Kanjirapally Town,HOUSE,1500,3,2,Beautiful 3BHK house,+919447139342\nPlot in Erumely,1200000,Erumely,PLOT,2400,0,0,Residential plot near highway,+919447139342`}
                        className="w-full border border-stone-300 rounded-xl p-4 text-sm font-mono focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                    />
                    <div className="mt-3 flex items-center gap-3">
                        <button
                            onClick={() => {
                                const parsed = parseCSV(csvText);
                                if (parsed.length > 0) {
                                    setRows(parsed.map((p) => ({ ...p, images: [], previews: [] })));
                                    setMode("form");
                                }
                            }}
                            className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                        >
                            Preview as Form ({csvRowCount} rows) →
                        </button>
                    </div>
                </div>
            )}

            {/* Form Mode */}
            {mode === "form" && (
                <div className="space-y-4">
                    {rows.map((row, index) => (
                        <div key={index} className="bg-white rounded-2xl border border-stone-200 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-stone-700">Property #{index + 1}</h3>
                                {rows.length > 1 && (
                                    <button
                                        onClick={() => removeRow(index)}
                                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                                    >
                                        ✕ Remove
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <input
                                    placeholder="Title *"
                                    value={row.title}
                                    onChange={(e) => updateRow(index, "title", e.target.value)}
                                    className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                                />
                                <input
                                    placeholder="Price * (e.g. 4500000)"
                                    value={row.price}
                                    onChange={(e) => updateRow(index, "price", e.target.value)}
                                    className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                                />
                                <input
                                    placeholder="Location *"
                                    value={row.location}
                                    onChange={(e) => updateRow(index, "location", e.target.value)}
                                    className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                                />
                                <select
                                    value={row.type}
                                    onChange={(e) => updateRow(index, "type", e.target.value)}
                                    className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                                >
                                    <option value="HOUSE">House</option>
                                    <option value="PLOT">Plot</option>
                                </select>
                                <input
                                    placeholder="Area (sq.ft) *"
                                    value={row.areaSqft}
                                    onChange={(e) => updateRow(index, "areaSqft", e.target.value)}
                                    className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                                />
                                <div className="flex gap-2">
                                    <input
                                        placeholder="Beds"
                                        value={row.bedrooms}
                                        onChange={(e) => updateRow(index, "bedrooms", e.target.value)}
                                        className="border border-stone-300 rounded-lg px-3 py-2 text-sm w-1/2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                                    />
                                    <input
                                        placeholder="Baths"
                                        value={row.bathrooms}
                                        onChange={(e) => updateRow(index, "bathrooms", e.target.value)}
                                        className="border border-stone-300 rounded-lg px-3 py-2 text-sm w-1/2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                                    />
                                </div>
                                <input
                                    placeholder="Phone"
                                    value={row.phoneNumber}
                                    onChange={(e) => updateRow(index, "phoneNumber", e.target.value)}
                                    className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none md:col-span-2"
                                />
                            </div>
                            <textarea
                                placeholder="Description *"
                                value={row.description}
                                onChange={(e) => updateRow(index, "description", e.target.value)}
                                rows={2}
                                className="mt-3 w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                            />

                            {/* ── Image Upload ── */}
                            <div className="mt-4 pt-4 border-t border-stone-100">
                                <label className="block text-sm font-medium text-stone-700 mb-2">
                                    📷 Images <span className="text-stone-400 font-normal">(optional)</span>
                                </label>

                                {/* Thumbnails */}
                                {row.previews.length > 0 && (
                                    <div className="flex gap-2 flex-wrap mb-3">
                                        {row.previews.map((src, imgIdx) => (
                                            <div key={imgIdx} className="relative group">
                                                <img
                                                    src={src}
                                                    alt={`Preview ${imgIdx + 1}`}
                                                    className="w-20 h-20 object-cover rounded-xl border border-stone-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index, imgIdx)}
                                                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <input
                                    ref={(el) => { fileInputRefs.current[index] = el; }}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => handleImagesChange(index, e.target.files)}
                                    className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
                                />

                                {uploadingRow === index && (
                                    <p className="text-xs text-amber-600 mt-1 animate-pulse">⏳ Uploading images...</p>
                                )}
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={addRow}
                        className="w-full border-2 border-dashed border-stone-300 rounded-2xl py-4 text-stone-500 hover:text-stone-700 hover:border-stone-400 transition-colors font-medium"
                    >
                        + Add Another Property
                    </button>
                </div>
            )}

            {/* Submit */}
            <div className="mt-8 flex justify-end gap-3">
                <Link
                    href="/admin"
                    className="px-6 py-3 border border-stone-300 rounded-xl font-medium text-stone-600 hover:bg-stone-50 transition-colors"
                >
                    Cancel
                </Link>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-8 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white rounded-xl font-bold transition-colors shadow-lg shadow-amber-600/20"
                >
                    {loading
                        ? uploadingRow !== null
                            ? `Uploading images for #${uploadingRow + 1}...`
                            : "Creating properties..."
                        : `Upload ${mode === "csv" ? csvRowCount : rows.length} ${mode === "csv" ? csvRowCount : rows.length === 1 ? "Property" : "Properties"}`}
                </button>
            </div>
        </div>
    );
}
