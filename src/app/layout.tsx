// ============================================================
// Root Layout — SNOE Website
// Loads Google Fonts, sets global metadata, wraps every page.
// Space Grotesk = headlines, Geist Mono = data/terminal text.
// ============================================================

import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";

// Space Grotesk — geometric display font for headlines
// Replaces generic Inter that every competitor uses
const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Geist Mono — monospace for data numbers, terminal ticker, risk scores
const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SNOE — Supplier Network Optimization Engine",
  description:
    "Agentic AI platform that gives industrial manufacturers real-time multi-tier supplier intelligence, geopolitical risk awareness, and autonomous disruption response.",
  keywords: [
    "supply chain intelligence",
    "supplier network optimization",
    "geopolitical risk",
    "tariff analysis",
    "agentic AI",
    "multi-tier visibility",
  ],
  openGraph: {
    title: "SNOE — Supplier Network Optimization Engine",
    description:
      "Stop reacting. Start anticipating. AI-powered supply chain intelligence for industrial manufacturers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      // Attach CSS variable names so Tailwind and globals.css can reference them
      className={`${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
