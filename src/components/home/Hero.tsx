"use client";

// Homepage hero: briefing-style eyebrow, serif headline, lede,
// CTAs — then the full-width NetworkMap survey figure beneath.

import { motion } from "framer-motion";

import Button from "@/components/ui/Button";
import NetworkMap from "@/components/graphics/NetworkMap";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: "easeOut" as const },
});

export default function Hero() {
  return (
    <section className="rule-b bg-paper bg-hero-glow">
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-14 md:pt-24">
        <motion.p className="coord-label" {...rise(0)}>
          Supplier Network Optimization Engine
        </motion.p>

        <motion.h1
          className="font-display mt-6 max-w-[15ch] text-[clamp(2.75rem,6.5vw,5rem)] font-semibold leading-[1.05] text-ink"
          {...rise(0.1)}
        >
          See every tier.{" "}
          <span className="text-gradient">Act before the shock.</span>
        </motion.h1>

        <motion.p
          className="mt-5 max-w-[52ch] text-[1.0625rem] leading-[1.6] text-ink-soft md:mt-7 md:text-[1.125rem]"
          {...rise(0.2)}
        >
          Agentic AI that senses geopolitical, tariff, and logistics risk
          across every supplier tier — and recommends action before disruption
          reaches your line.
        </motion.p>

        <motion.div className="mt-9 flex flex-wrap items-center gap-4" {...rise(0.3)}>
          <Button href="/contact">Request a briefing</Button>
          <Button href="/whitepaper" variant="outline">
            Read the whitepaper
          </Button>
        </motion.div>
      </div>

      {/* Survey map figure — NetworkMap renders a portrait
          layout on phones, landscape from md up */}
      <motion.div className="mx-auto max-w-7xl px-2 pb-10 sm:px-6 md:pb-14" {...rise(0.35)}>
        <div className="rounded-2xl border border-hairline bg-paper-raised/50 p-2 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:p-4">
          <NetworkMap />
        </div>
      </motion.div>
    </section>
  );
}
