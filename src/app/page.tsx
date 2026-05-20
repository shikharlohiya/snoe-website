"use client";

// ============================================================
// page.tsx — Root page: wires all sections together.
//
// Render order:
//   1. Preloader     — assembles SNOE letters, fades out
//   2. CustomCursor  — glowing cyan orb replaces default cursor
//   3. Navbar        — fixed top bar, frosts on scroll
//   4. Hero          — 3D network canvas + headline copy
//   5. CostClock     — live disruption cost ticker + stat cards
//   6. Blindspot     — scroll-driven tier-reveal diagram
//   7. HowItWorks    — Sense → Reason → Simulate → Act timeline
//   8. LiveDemo      — interactive disruption simulation
//   9. FeatureGrid   — 6 animated feature cards
//  10. TerminalFeed  — scrolling intelligence ticker
//  11. CTASection    — full-width "Stop Reacting" CTA
//  12. Footer        — minimal nav + copyright
// ============================================================

import { useState } from "react";

// UI chrome
import Preloader    from "@/components/ui/Preloader";
import Navbar       from "@/components/ui/Navbar";

// Page sections
import Hero         from "@/components/sections/Hero";
import CostClock    from "@/components/sections/CostClock";
import Blindspot    from "@/components/sections/Blindspot";
import HowItWorks   from "@/components/sections/HowItWorks";
import LiveDemo     from "@/components/sections/LiveDemo";
import FeatureGrid  from "@/components/sections/FeatureGrid";
import TerminalFeed from "@/components/sections/TerminalFeed";
import CTASection   from "@/components/sections/CTASection";
import Footer       from "@/components/sections/Footer";

export default function HomePage() {
  // Controls whether the main content is visible.
  // Flips to true once the Preloader's exit animation completes.
  const [ready, setReady] = useState(false);

  return (
    <>
      {/* Preloader — blocks content until SNOE logo animation finishes */}
      <Preloader onComplete={() => setReady(true)} />

      {/* Main site — only shown after preloader exits */}
      {ready && (
        <main>
          {/* Fixed navbar — frosts up on scroll */}
          <Navbar />

          {/* 1. Hero: full-viewport 3D network + headline */}
          <Hero />

          {/* 2. Cost Clock: live cost ticker + stat cards */}
          <CostClock />

          {/* 3. Blindspot: scroll-driven tier reveal */}
          <Blindspot />

          {/* 4. How It Works: Sense → Reason → Simulate → Act */}
          <HowItWorks />

          {/* 5. Live Demo: interactive disruption simulation */}
          <LiveDemo />

          {/* 6. Features: 6 animated feature cards */}
          <FeatureGrid />

          {/* 7. Terminal Feed: scrolling live intelligence ticker */}
          <TerminalFeed />

          {/* 8. CTA: "Stop Reacting. Start Anticipating." */}
          <CTASection />

          {/* 9. Footer */}
          <Footer />
        </main>
      )}
    </>
  );
}
