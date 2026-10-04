"use client";

// Homepage hero — Everstream-style teal-blue band with white
// headline, then the live network map framed as a dark
// "product" dashboard that straddles down into the white page.

import { motion } from "framer-motion";

// Button import kept for the commented-out hero CTAs below.
// import Button from "@/components/ui/Button";
import WorldMap from "@/components/graphics/WorldMap";
import NewsTicker from "@/components/home/NewsTicker";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: "easeOut" as const },
});

export default function Hero() {
  return (
    <>
      {/* Teal-blue hero band */}
      <section className="relative overflow-hidden bg-cobalt">
        {/* depth: darker-teal radial + warm glow toward the map */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 70% at 88% 0%, rgba(3,84,122,0.55), transparent 60%), radial-gradient(ellipse 50% 60% at 12% 110%, rgba(255,255,255,0.10), transparent 60%)",
          }}
        />
        {/* faint engineering grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.6]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, rgba(255,255,255,0.06) 0 1px, transparent 1px 56px), repeating-linear-gradient(to bottom, rgba(255,255,255,0.06) 0 1px, transparent 1px 56px)",
          }}
        />

        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 pb-16 pt-16 md:pb-24 md:pt-24 lg:grid-cols-[1.25fr_0.75fr] lg:items-start lg:gap-12">
          {/* Left — headline */}
          <div>
            <motion.p
              className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-white/70"
              {...rise(0)}
            >
              Supplier Network Optimization Engine
            </motion.p>

            <motion.h1
              className="font-display mt-6 max-w-[15ch] text-[clamp(2.5rem,5.5vw,4.5rem)] font-bold leading-[1.05] text-white"
              {...rise(0.1)}
            >
              See every tier.{" "}
              <span className="text-[#9BDCF5]">Act before the shock.</span>
            </motion.h1>

            <motion.p
              className="mt-5 max-w-[52ch] text-[1.0625rem] leading-[1.6] text-white/85 md:mt-7 md:text-[1.125rem]"
              {...rise(0.2)}
            >
              Agentic AI that senses geopolitical, tariff, and logistics risk
              across every supplier tier — and recommends action before
              disruption reaches your line.
            </motion.p>

            {/* Hero CTAs — hidden per request. Restore by un-commenting.
            <motion.div className="mt-9 flex flex-wrap items-center gap-4" {...rise(0.3)}>
              <Button href="/contact">Request a briefing</Button>
              <Button href="/whitepaper" variant="outlineLight">
                Read the whitepaper
              </Button>
            </motion.div>
            */}
          </div>

          {/* Right — live news ticker */}
          <motion.div {...rise(0.35)}>
            <NewsTicker />
          </motion.div>
        </div>
      </section>

      {/* Full-width supplier world map — flush below the teal band
          (no gap, no overlap), edge-to-edge like the blue box. */}
      <motion.section
        className="rule-b border-hairline bg-[#EAF2F8] pb-8 sm:pb-10"
        {...rise(0.35)}
      >
        <WorldMap />
      </motion.section>
    </>
  );
}
