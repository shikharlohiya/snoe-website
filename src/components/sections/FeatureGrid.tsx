"use client";

// ============================================================
// FeatureGrid — 6 feature cards with hover animations.
//
// Each card has:
//   • An animated icon that glows on hover
//   • A gradient accent bar on the top border
//   • A description + relevant tech tags
//   • Hover: the card lifts, border glows, icon scales up
//
// Cards scroll in with a stagger so they don't all appear
// at once — feels more alive.
// ============================================================

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// Feature data aligned with product document capabilities
const FEATURES = [
  {
    icon:     "⬡",
    color:    "#00E5FF",
    title:    "Multi-Tier Knowledge Graph",
    body:     "Models your entire supplier ecosystem as a dynamic network — from your production plants down to Tier-N raw material sources. Instantly see dependencies you never knew existed.",
    tags:     ["NetworkX", "Graph DB", "Tier-N Visibility"],
  },
  {
    icon:     "◎",
    color:    "#7C3AED",
    title:    "Geopolitical Risk Engine",
    body:     "Continuous ingestion of GDELT geopolitical events, sanctions lists, and trade restriction updates — mapped directly to affected suppliers in your graph.",
    tags:     ["GDELT API", "Sanctions Feed", "NLP Classification"],
  },
  {
    icon:     "≋",
    color:    "#F59E0B",
    title:    "Tariff & Trade Intelligence",
    body:     "Real-time tariff rate monitoring with automatic cost impact recalculation across all sourcing routes. Know the financial delta before the invoice arrives.",
    tags:     ["HTS Schedules", "Cost Modeling", "Route Optimization"],
  },
  {
    icon:     "◈",
    color:    "#EF4444",
    title:    "Disruption Simulation",
    body:     "Monte Carlo scenario simulation for port closures, natural disasters, sanctions, and tariff spikes. See cascading impact before deciding — not after.",
    tags:     ["Monte Carlo", "Scenario Planning", "Risk Propagation"],
  },
  {
    icon:     "▲",
    color:    "#22C55E",
    title:    "Prescriptive AI Recommendations",
    body:     "SHAP-explained, auditable recommendations for alternative suppliers, rerouting, and buffer strategies — ranked by cost, lead time, and resilience trade-offs.",
    tags:     ["SHAP Explainability", "Gradient Boost", "Multi-Objective"],
  },
  {
    icon:     "▶",
    color:    "#00E5FF",
    title:    "Autonomous Execution",
    body:     "Low-risk decisions (route switches, buffer buys) execute automatically with full audit logs. High-stakes actions surface for human-in-the-loop approval via ERP integration.",
    tags:     ["Reinforcement Learning", "ERP Integration", "Audit Logging"],
  },
];

// ── Single feature card ──────────────────────────────────────

function FeatureCard({
  feature,
  delay,
}: {
  feature: typeof FEATURES[0];
  delay: number;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -6,
        // Box shadow handled inline because Tailwind can't do dynamic colors
      }}
      className="glass-card feature-card"
      style={{
        padding: "clamp(1.4rem, 4vw, 2rem)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        // Top gradient accent border
        borderTop: `2px solid ${feature.color}`,
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        transition: "box-shadow 0.3s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          `0 0 0 1px ${feature.color}30, 0 20px 60px rgba(0,0,0,0.3), 0 0 30px ${feature.color}10`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "";
      }}
    >
      {/* Subtle background glow behind the icon */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${feature.color}12 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Icon */}
      <div
        style={{
          fontSize: "1.8rem",
          color: feature.color,
          textShadow: `0 0 20px ${feature.color}80`,
        }}
      >
        {feature.icon}
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: "1.05rem",
          fontWeight: 700,
          color: "var(--text-primary)",
          letterSpacing: "-0.02em",
        }}
      >
        {feature.title}
      </h3>

      {/* Body */}
      <p
        style={{
          fontSize: "0.85rem",
          color: "var(--text-secondary)",
          lineHeight: 1.7,
          flex: 1,
        }}
      >
        {feature.body}
      </p>

      {/* Tag pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
        {feature.tags.map((tag) => (
          <span
            key={tag}
            style={{
              padding: "0.18rem 0.55rem",
              borderRadius: 4,
              background: `${feature.color}0f`,
              border: `1px solid ${feature.color}25`,
              fontSize: "0.65rem",
              color: feature.color,
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.05em",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ── Section export ───────────────────────────────────────────

export default function FeatureGrid() {
  return (
    <section
      id="features"
      style={{
        padding: "clamp(4rem, 10vw, 8rem) clamp(1rem, 4vw, 2rem)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <motion.span
            className="text-label"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Platform Capabilities
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              marginTop: "0.75rem",
            }}
          >
            Everything Your Supply Chain{" "}
            <span style={{ color: "var(--cyan)" }}>Actually Needs</span>
          </motion.h2>
        </div>

        {/* Cards grid — 3 columns on desktop, 2 on tablet, 1 on phone */}
        <div
          className="feature-grid"
          style={{
            display: "grid",
            // minmax 280px lets two columns fit at ~600 px wide
            gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
            gap: "clamp(1rem, 3vw, 1.5rem)",
          }}
        >
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
