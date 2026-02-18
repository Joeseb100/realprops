import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Don't check auth for login page
    return <>{children}</>;
}

// Helper for admin pages to use
export async function requireAuth() {
    const authed = await isAuthenticated();
    if (!authed) redirect("/admin/login");
}
