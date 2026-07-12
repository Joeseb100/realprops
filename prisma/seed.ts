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



    // Create sample properties
    const sampleProperties = [
        {
            title: "Spacious 3BHK Villa with Garden",
            price: 7500000,
            location: "Kanjirapally Town",
            type: "HOUSE",
            areaSqft: 1800,
            bedrooms: 3,
            bathrooms: 2,
            description:
                "Beautiful 3BHK villa in the heart of Kanjirapally Town. Spacious rooms, modern kitchen, private garden, and car parking. Close to schools, hospitals, and market. Ready to move in.",
            phoneNumber: "+919876543210",
        },
        {
            title: "Modern 4BHK House Near Church",
            price: 9500000,
            location: "Kanjirapally Town",
            type: "HOUSE",
            areaSqft: 2200,
            bedrooms: 4,
            bathrooms: 3,
            description:
                "Premium 4BHK house with contemporary design. Italian marble flooring, modular kitchen, 3 attached bathrooms, sitout, and terrace. Located near the main church. Excellent neighbourhood.",
            phoneNumber: "+919876543210",
        },
        {
            title: "15 Cent Residential Plot",
            price: 3000000,
            location: "Erumely",
            type: "PLOT",
            areaSqft: 6534,
            bedrooms: 0,
            bathrooms: 0,
            description:
                "15 cent residential plot in Erumely. Well-connected road, electricity and water available. Ideal for building your dream home. Clear title, ready for registration.",
            phoneNumber: "+919876543210",
        },
        {
            title: "2BHK Budget House for Sale",
            price: 4500000,
            location: "Mundakayam",
            type: "HOUSE",
            areaSqft: 1200,
            bedrooms: 2,
            bathrooms: 1,
            description:
                "Affordable 2BHK house in Mundakayam. Well-maintained, good ventilation, kitchen garden space. 5 minutes from bus stand. Best value in the area.",
            phoneNumber: "+919876543210",
        },
        {
            title: "25 Cent Plot with Rubber Plantation",
            price: 5000000,
            location: "Erumely",
            type: "PLOT",
            areaSqft: 10890,
            bedrooms: 0,
            bathrooms: 0,
            description:
                "25 cent plot with established rubber plantation in Erumely. Peaceful location, surrounded by greenery. Road access available. Suitable for residential or agricultural purpose.",
            phoneNumber: "+919876543210",
        },
        {
            title: "Luxury 4BHK Duplex Villa",
            price: 15000000,
            location: "Kanjirapally Town",
            type: "HOUSE",
            areaSqft: 3000,
            bedrooms: 4,
            bathrooms: 4,
            description:
                "Ultra-premium duplex villa with designer interiors. Home theater, gym room, modular kitchen, solar panels, rainwater harvesting. Gated community with 24/7 security. The finest property in Kanjirapally.",
            phoneNumber: "+919876543210",
        },
    ];

    for (const prop of sampleProperties) {
        await prisma.property.create({
            data: prop,
        });
    }

    console.log(`✅ ${sampleProperties.length} sample properties created`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
