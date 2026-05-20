"use client";

// ============================================================
// Hero Section
//
// Full-viewport dark screen split into:
//   Left  — Headline, sub-copy, CTA buttons, animated badge.
//   Right — The live 3D SupplyNetworkCanvas (Three.js).
//
// Framer Motion animates the text in from below on mount.
// A pulsing "LIVE" badge reinforces the real-time feeling.
// On mobile the canvas collapses below the text.
// ============================================================

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { ArrowRight, Radio } from "lucide-react";

// Dynamic import with no SSR — globe.gl uses WebGL + window.
// Using the 3D Earth globe (vs. abstract floating network) — it
// instantly reads as "global enterprise supply chain" to investors.
const SupplyGlobeCanvas = dynamic(
  () => import("@/components/three/SupplyGlobeCanvas"),
  { ssr: false, loading: () => <div style={{ width: "100%", height: "100%" }} /> }
);

// Framer Motion variants — stagger children in sequence
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 40 },
  // "easeOut" avoids the Framer Motion v12 Easing array type restriction
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        // Grid-dot background — faint cyan dots at intersections
        backgroundImage:
          "radial-gradient(circle, rgba(0,229,255,0.08) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    >
      {/* Radial glow behind the left text — depth effect */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "20%",
          left: "-10%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* Violet glow from top-right corner */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-15%",
          right: "5%",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Main content grid ── */}
      <div
        style={{
          width: "100%",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "6rem 2rem 4rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
        }}
        className="hero-grid"
      >
        {/* ── LEFT: copy ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Live badge */}
          <motion.div variants={itemVariants}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.3rem 0.9rem",
                borderRadius: 999,
                border: "1px solid rgba(0,229,255,0.3)",
                background: "rgba(0,229,255,0.06)",
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--cyan)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {/* Blinking dot — same animation as a live broadcast indicator */}
              <Radio size={11} style={{ animation: "pulse-risk 1.5s infinite" }} />
              Agentic AI · Real-Time Intelligence
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={itemVariants}
            style={{
              fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
            }}
          >
            Your Supply Chain{" "}
            <span
              style={{
                color: "var(--cyan)",
                // Cyan text glow defined in globals.css
                textShadow: "0 0 30px rgba(0,229,255,0.35)",
              }}
            >
              Has Blind Spots.
            </span>
            <br />
            SNOE Sees All of Them.
          </motion.h1>

          {/* Sub-copy */}
          <motion.p
            variants={itemVariants}
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: "var(--text-secondary)",
              maxWidth: 480,
            }}
          >
            Agentic AI that models your entire supplier ecosystem — Tier-1 through
            Tier-N — and detects geopolitical shocks, tariff changes, and logistics
            disruptions before they reach your production floor.
          </motion.p>

          {/* Stat pills */}
          <motion.div
            variants={itemVariants}
            style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}
          >
            {[
              { value: "< 30 min", label: "Disruption detection" },
              { value: "Tier-N",   label: "Full network depth" },
              { value: "72-edge",  label: "Graph propagation" },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "var(--cyan)",
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "0.05em" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            variants={itemVariants}
            style={{ display: "flex", gap: "1rem", flexWrap: "wrap", paddingTop: "0.5rem" }}
          >
            {/* Primary CTA — glowing cyan */}
            <a
              href="#demo"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.8rem 1.6rem",
                borderRadius: 8,
                background: "var(--cyan)",
                color: "#050810",
                fontWeight: 700,
                fontSize: "0.9rem",
                textDecoration: "none",
                letterSpacing: "0.02em",
                boxShadow: "0 0 30px rgba(0,229,255,0.35)",
                transition: "box-shadow 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 0 50px rgba(0,229,255,0.6)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 0 30px rgba(0,229,255,0.35)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              }}
            >
              Simulate a Disruption
              <ArrowRight size={16} />
            </a>

            {/* Secondary CTA — ghost */}
            <a
              href="#blindspot"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.8rem 1.6rem",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.12)",
                color: "var(--text-primary)",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
                background: "rgba(255,255,255,0.03)",
                transition: "border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "rgba(0,229,255,0.4)";
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "rgba(0,229,255,0.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "rgba(255,255,255,0.12)";
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "rgba(255,255,255,0.03)";
              }}
            >
              See the Blindspot
            </a>
          </motion.div>
        </motion.div>

        {/* ── RIGHT: 3D Earth globe canvas ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          style={{
            position: "relative",
            height: "580px",
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid rgba(0,229,255,0.08)",
            background: "rgba(0,229,255,0.02)",
          }}
        >
          {/* Globe canvas fills the container */}
          <SupplyGlobeCanvas />

          {/* Corner label — terminal aesthetic */}
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              color: "rgba(0,229,255,0.5)",
              textTransform: "uppercase",
              zIndex: 2,
            }}
          >
            Live Globe · 15 Suppliers · 10 Countries
          </div>

          {/* Bottom-right: disruption notice that fades in/out */}
          <motion.div
            style={{
              position: "absolute",
              bottom: 16,
              right: 16,
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              color: "#ef4444",
              letterSpacing: "0.12em",
            }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#ef4444",
                boxShadow: "0 0 8px #ef4444",
                display: "inline-block",
              }}
            />
            DISRUPTION CASCADE ACTIVE
          </motion.div>
        </motion.div>
      </div>

      {/* ── Scroll hint at the bottom ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
          }}
        >
          scroll to explore
        </span>
        {/* Animated vertical line that drops down */}
        <motion.div
          style={{
            width: 1,
            height: 40,
            background: "linear-gradient(to bottom, var(--cyan), transparent)",
          }}
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>

      {/* Responsive styles for the hero grid */}
      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </section>
  );
}
