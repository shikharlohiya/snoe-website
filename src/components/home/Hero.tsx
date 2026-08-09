"use client";

// Homepage hero — Everstream-style teal-blue band with white
// headline, then the live network map framed as a dark
// "product" dashboard that straddles down into the white page.

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

        <div className="relative mx-auto max-w-6xl px-6 pb-40 pt-16 md:pb-56 md:pt-24">
          <motion.p
            className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-white/70"
            {...rise(0)}
          >
            Supplier Network Optimization Engine
          </motion.p>

          <motion.h1
            className="font-display mt-6 max-w-[15ch] text-[clamp(2.75rem,6.5vw,5rem)] font-bold leading-[1.05] text-white"
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
            across every supplier tier — and recommends action before disruption
            reaches your line.
          </motion.p>

          <motion.div className="mt-9 flex flex-wrap items-center gap-4" {...rise(0.3)}>
            <Button href="/contact">Request a briefing</Button>
            <Button href="/whitepaper" variant="outlineLight">
              Read the whitepaper
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Live map — dark "product" dashboard straddling teal → white.
          `.product-frame` flips the design tokens to dark for
          everything inside. Portrait layout on phones, landscape md+. */}
      <motion.div
        className="relative z-10 mx-auto -mt-28 max-w-7xl px-4 pb-12 sm:px-6 md:-mt-40 md:pb-16"
        {...rise(0.35)}
      >
        <div className="product-frame overflow-hidden rounded-2xl border border-[#1A2439] p-2 shadow-[0_40px_80px_-30px_rgba(3,58,84,0.65)] sm:p-4">
          <NetworkMap />
        </div>
      </motion.div>
    </>
  );
}
