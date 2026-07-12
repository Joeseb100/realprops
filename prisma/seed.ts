import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    // -------------------------------------------------------------------------
    // Admin credentials are driven by env vars.
    // Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD before running `prisma db seed`.
    // The defaults below are for local dev ONLY — seeding with them in production
    // is blocked intentionally.
    //
    // NOTE: Sample properties have been intentionally removed from this seed.
    // The live database already contains real property data — re-seeding will
    // NOT touch property records at all. Only the admin account is managed here.
    // -------------------------------------------------------------------------
    const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@realproperties.com";
    const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "admin123";

    if (process.env.NODE_ENV === "production" && adminPassword === "admin123") {
        throw new Error(
            "Refusing to seed with the default password in production. " +
            "Set SEED_ADMIN_PASSWORD to a strong secret before running the seed."
        );
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    await prisma.admin.upsert({
        where: { email: adminEmail },
        update: {}, // existing admin record is left unchanged
        create: {
            email: adminEmail,
            password: hashedPassword,
        },
    });
    console.log(`✅ Admin user ready: ${adminEmail}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
