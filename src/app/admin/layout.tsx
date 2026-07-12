import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Route protection is handled by middleware.ts.
    // This layout is kept for shared admin UI wrappers if needed in the future.
    return <>{children}</>;
}

// Helper kept for backward-compat — admin pages that call requireAuth() still work fine.
export async function requireAuth() {
    const authed = await isAuthenticated();
    if (!authed) redirect("/admin/login");
}
