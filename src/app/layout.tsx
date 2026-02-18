import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Real Properties | Trusted Homes & Plots in Kanjirapally",
  description:
    "Find verified homes and plots in Kanjirapally. Trusted real estate broker with 10+ years experience. Contact on WhatsApp for instant details.",
  keywords: "real estate, Kanjirapally, houses, plots, property for sale, Kerala, broker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
