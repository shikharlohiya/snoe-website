"use client";

// ============================================================
// CostClock Section
//
// Shows the *live* global cost of supply chain disruptions
// ticking up in real time — based on the $184B/year figure
// from the product document ($184B ÷ 365.25 ÷ 24 ÷ 3600 ≈ $5,831/s).
//
// Also animates in 4 stat cards (scroll-triggered) with
// count-up numbers showing the scale of the problem.
// ============================================================

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// ── Live cost clock ──────────────────────────────────────────

// Cost per second derived from $184B annual figure
const COST_PER_SECOND = 184_000_000_000 / (365.25 * 24 * 3600); // ≈ $5,831

// Formats a large number into a $ string with commas
function formatCost(n: number): string {
  return "$" + Math.floor(n).toLocaleString("en-US");
}

function LiveCostCounter() {
  // Start from a random point mid-day (so it doesn't reset to 0
  // every time the page loads — makes it feel more "live")
  const [cost, setCost] = useState(
    () => COST_PER_SECOND * (Math.random() * 43200) // random 0-12h offset
  );

  useEffect(() => {
    // Update every 100ms for smooth ticking without excessive renders
    const interval = setInterval(() => {
      setCost((prev) => prev + COST_PER_SECOND * 0.1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      {/* Label */}
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: "0.75rem",
        }}
      >
        Global supply chain disruption cost — today, so far
      </p>

      {/* The ticking number */}
      <motion.div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(2.2rem, 6vw, 5rem)",
          fontWeight: 700,
          color: "#ef4444",
          textShadow: "0 0 40px rgba(239,68,68,0.4)",
          letterSpacing: "-0.02em",
          tabularNums: "tabular-nums",
        } as React.CSSProperties}
      >
        {formatCost(cost)}
      </motion.div>

      {/* Ticking line underneath */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          marginTop: "0.75rem",
        }}
      >
        <motion.span
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#ef4444",
            boxShadow: "0 0 10px #ef4444",
          }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "var(--text-muted)",
            letterSpacing: "0.1em",
          }}
        >
          +{formatCost(COST_PER_SECOND)}/second
        </span>
      </div>
    </div>
  );
}

// ── Animated count-up stat card ──────────────────────────────

interface StatCardProps {
  numericEnd: number;  // the number to count up to
  suffix: string;      // appended after the number (e.g. "B", "%", " days")
  label: string;
  description: string;
  color: string;       // accent color for this card
  delay: number;
}

function StatCard({ numericEnd, suffix, label, description, color, delay }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Trigger animation only when card scrolls into view
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Counts from 0 to numericEnd over ~1.5s when inView becomes true
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const duration  = 1500;
    const startTime = performance.now();
    function step(now: number) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.floor(eased * numericEnd));
      if (progress < 1) requestAnimationFrame(step);
    }
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, numericEnd]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="glass-card"
      style={{
        padding: "1.8rem",
        borderColor: `${color}20`,
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {/* Colored top-line accent */}
      <div style={{ width: 32, height: 3, borderRadius: 2, background: color, marginBottom: "0.5rem" }} />

      {/* Animated count value */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "2.4rem",
          fontWeight: 700,
          color,
          lineHeight: 1,
        }}
      >
        {displayed}{suffix}
      </div>

      {/* Label */}
      <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>
        {label}
      </div>

      {/* Description */}
      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
        {description}
      </div>
    </motion.div>
  );
}

// ── Section export ───────────────────────────────────────────

const STATS: Omit<StatCardProps, "delay">[] = [
  {
    numericEnd:  184,
    suffix:      "B",
    label:       "Annual disruption cost",
    description: "Global cost of supply chain disruptions to manufacturers every year.",
    color:       "#ef4444",
  },
  {
    numericEnd:  73,
    suffix:      "%",
    label:       "Have no Tier-3 visibility",
    description: "Manufacturers with zero insight into their upstream raw material suppliers.",
    color:       "#f59e0b",
  },
  {
    numericEnd:  47,
    suffix:      " days",
    label:       "Average detection lag",
    description: "Days between a disruption event and an organization detecting it.",
    color:       "#7c3aed",
  },
  {
    numericEnd:  4,
    suffix:      "B",
    label:       "TAM for AI supply intelligence",
    description: "Total addressable market for AI-powered supplier network optimization.",
    color:       "#00e5ff",
  },
];

export default function CostClock() {
  return (
    <section
      id="cost"
      style={{
        padding: "clamp(3.5rem, 8vw, 6rem) clamp(1rem, 4vw, 2rem)",
        position: "relative",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Section label */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <span className="text-label">The Scale of the Problem</span>
      </div>

      {/* Live cost counter */}
      <LiveCostCounter />

      {/* Divider */}
      <div
        style={{
          width: 1,
          height: 60,
          background: "linear-gradient(to bottom, rgba(239,68,68,0.4), transparent)",
          margin: "3rem auto",
        }}
      />

      {/* Stat cards grid */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {STATS.map((stat, i) => (
          <StatCard key={stat.label} {...stat} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
}
