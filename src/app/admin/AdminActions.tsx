"use client";

import { useRouter } from "next/navigation";

interface AdminActionsProps {
    type: "delete" | "toggleStatus" | "logout";
    propertyId?: number;
    currentStatus?: string;
}

export default function AdminActions({ type, propertyId, currentStatus }: AdminActionsProps) {
    const router = useRouter();

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this property?")) return;
        await fetch(`/api/properties/${propertyId}`, { method: "DELETE" });
        router.refresh();
    }

    async function handleToggleStatus() {
        const newStatus = currentStatus === "AVAILABLE" ? "SOLD" : "AVAILABLE";
        await fetch(`/api/properties/${propertyId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        });
        router.refresh();
    }

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
    }

    if (type === "logout") {
        return (
            <button
                onClick={handleLogout}
                className="border border-stone-300 hover:border-stone-400 text-stone-600 px-4 py-2.5 rounded-xl font-medium transition-colors text-sm"
            >
                Logout
            </button>
        );
    }

    if (type === "toggleStatus") {
        return (
            <button
                onClick={handleToggleStatus}
                className="text-stone-500 hover:text-amber-600 transition-colors"
                title={currentStatus === "AVAILABLE" ? "Mark as Sold" : "Mark as Available"}
            >
                {currentStatus === "AVAILABLE" ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )}
            </button>
        );
    }

    return (
        <button
            onClick={handleDelete}
            className="text-stone-500 hover:text-red-600 transition-colors"
            title="Delete"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
    );
}
