// ============================================================
// Root Layout — SNOE Website
// Light enterprise identity (Everstream palette):
//   Raleway       — display headlines
//   Work Sans     — body/UI copy
//   IBM Plex Mono — labels, stats, tables, badges
// Navbar + Footer mount here so every page shares the chrome.
// ============================================================

import type { Metadata } from "next";
import { Raleway, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MotionProvider from "@/components/ui/MotionProvider";
import { SITE } from "@/lib/site";

const raleway = Raleway({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "SNOE — Supplier Network Optimization Engine",
    template: "%s — SNOE",
  },
  description: SITE.description,
  keywords: [
    "supplier network optimization",
    "supply chain risk management",
    "multi-tier visibility",
    "geopolitical risk intelligence",
    "agentic AI",
    "decision intelligence",
  ],
  openGraph: {
    type: "website",
    siteName: "SNOE",
    title: "SNOE — Supplier Network Optimization Engine",
    description: SITE.description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "SNOE — See every tier. Act before the shock." }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${raleway.variable} ${workSans.variable} ${plexMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <MotionProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
