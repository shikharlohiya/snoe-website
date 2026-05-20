"use client";

// ============================================================
// HowItWorks — "Sense → Reason → Simulate → Act"
//
// Four phases of the SNOE agentic loop presented as:
//   • A vertical timeline with an animated connecting line
//     that draws itself as cards scroll into view.
//   • Each card slides in from alternating sides (left/right).
//   • The active phase glows and expands its icon.
//
// This section replaces the typical bullet-point feature list
// with a storytelling flow unique to agentic AI products.
// ============================================================

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// Step data pulled directly from the product document
const PHASES = [
  {
    id:     "sense",
    number: "01",
    label:  "Sense",
    color:  "#00E5FF",
    icon:   "◎",      // represents a "monitoring eye"
    title:  "Continuous Signal Ingestion",
    body:   `Autonomous agents ingest geopolitical events, sanctions updates, tariff changes,
             port disruptions, and supplier health signals in real time — across every tier of
             your network. No manual refresh. No waiting for a report.`,
    tags:   ["GDELT Events", "Sanctions Feeds", "Port Congestion", "Trade Signals"],
  },
  {
    id:     "reason",
    number: "02",
    label:  "Reason",
    color:  "#7C3AED",
    icon:   "⬡",      // hexagon = graph/network
    title:  "Graph-Based Impact Analysis",
    body:   `SNOE maps every signal onto your supplier knowledge graph — propagating risk from
             Tier-3 raw material sources through Tier-2, Tier-1, and into your production plants.
             Centrality algorithms detect which nodes are load-bearing before they fail.`,
    tags:   ["Knowledge Graph", "Risk Propagation", "Graph Centrality", "NLP Interpretation"],
  },
  {
    id:     "simulate",
    number: "03",
    label:  "Simulate",
    color:  "#F59E0B",
    icon:   "◈",      // represents branching/scenario
    title:  "Scenario Simulation & Trade-Offs",
    body:   `Before committing to any action, SNOE runs Monte Carlo simulations across
             alternative sourcing routes, supplier substitutions, and inventory buffers —
             weighing cost vs. service level vs. resilience for each option.`,
    tags:   ["Monte Carlo", "Scenario Planning", "Cost vs. Resilience", "Alternative Routes"],
  },
  {
    id:     "act",
    number: "04",
    label:  "Act",
    color:  "#22C55E",
    icon:   "▶",      // represents execution
    title:  "Prescriptive & Autonomous Execution",
    body:   `Recommendations surface as explainable, auditable actions. Low-risk decisions
             execute autonomously with governance guardrails. High-stakes changes go through
             a human-in-the-loop approval flow — directly integrated with your ERP and TMS.`,
    tags:   ["ERP Integration", "SHAP Explainability", "Audit Logging", "Auto-Routing"],
  },
];

// ── Single phase card ────────────────────────────────────────

function PhaseCard({
  phase,
  index,
}: {
  phase: typeof PHASES[0];
  index: number;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  // Trigger when card enters viewport
  const inView = useInView(ref, { once: true, margin: "-100px" });

  // Alternate cards left/right for visual rhythm (desktop only).
  // The .phase-row class is referenced by the responsive media query
  // at the bottom of this file to flatten the layout on mobile.
  const fromLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className="phase-row"
      // Data attr lets CSS check which side a card is on
      data-side={fromLeft ? "left" : "right"}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "2rem",
        // Right-side cards reverse the layout
        flexDirection: fromLeft ? "row" : "row-reverse",
        position: "relative",
      }}
    >
      {/* ── Timeline node (the circle on the center line) ── */}
      <div
        className="phase-node"
        style={{
          position: "absolute",
          // Center the node on the timeline line (desktop)
          left: "calc(50% - 20px)",
          top: "1.5rem",
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: `${phase.color}20`,
          border: `2px solid ${phase.color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
          zIndex: 2,
          boxShadow: inView ? `0 0 20px ${phase.color}50` : "none",
          transition: "box-shadow 0.5s ease",
        }}
      >
        {phase.icon}
      </div>

      {/* ── Half-width spacer on the opposite side (hidden on mobile) ── */}
      <div className="phase-spacer" style={{ flex: 1 }} />

      {/* ── Card ── */}
      <motion.div
        initial={{ opacity: 0, x: fromLeft ? -50 : 50 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card phase-card"
        style={{
          flex: 1,
          padding: "2rem",
          borderColor: `${phase.color}20`,
          maxWidth: 480,
        }}
      >
        {/* Phase number + label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              color: phase.color,
              letterSpacing: "0.2em",
            }}
          >
            {phase.number}
          </span>
          <span
            style={{
              padding: "0.2rem 0.7rem",
              borderRadius: 999,
              background: `${phase.color}15`,
              border: `1px solid ${phase.color}40`,
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: phase.color,
            }}
          >
            {phase.label}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: "1.2rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "0.75rem",
            letterSpacing: "-0.02em",
          }}
        >
          {phase.title}
        </h3>

        {/* Body text */}
        <p
          style={{
            fontSize: "0.88rem",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            marginBottom: "1.25rem",
          }}
        >
          {phase.body}
        </p>

        {/* Tag pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {phase.tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: "0.2rem 0.6rem",
                borderRadius: 4,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontSize: "0.68rem",
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.05em",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ── Animated connecting timeline line ─────────────────────────

// Draws a vertical line from top to bottom using SVG stroke-dashoffset
// so it appears to "grow" as the section scrolls into view.
function TimelineLine() {
  const ref    = useRef<SVGLineElement>(null);
  const inView = useInView(ref, { once: true, margin: "-200px" });

  return (
    <svg
      style={{
        position: "absolute",
        left: "50%",
        top: 0,
        width: 2,
        height: "100%",
        transform: "translateX(-50%)",
        pointerEvents: "none",
      }}
    >
      {/* Background track */}
      <line
        x1="1" y1="0" x2="1" y2="100%"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
      />
      {/* Animated fill line */}
      <motion.line
        ref={ref}
        x1="1" y1="0" x2="1" y2="100%"
        stroke="url(#timelineGrad)"
        strokeWidth="1"
        strokeDasharray="1000"
        animate={inView ? { strokeDashoffset: 0 } : { strokeDashoffset: 1000 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <defs>
        <linearGradient id="timelineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#00E5FF" />
          <stop offset="33%"  stopColor="#7C3AED" />
          <stop offset="66%"  stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#22C55E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Section export ───────────────────────────────────────────

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        padding: "clamp(4rem, 10vw, 8rem) clamp(1rem, 4vw, 2rem)",
        maxWidth: 1100,
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: "5rem" }}>
        <motion.span
          className="text-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          The Agentic Loop
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            marginTop: "0.75rem",
            color: "var(--text-primary)",
          }}
        >
          From Signal to Action in Minutes
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            marginTop: "1rem",
            color: "var(--text-secondary)",
            maxWidth: 560,
            margin: "1rem auto 0",
            lineHeight: 1.7,
          }}
        >
          SNOE runs a continuous sense–reason–simulate–act loop. No manual triggers,
          no periodic reports. Just autonomous intelligence working 24/7.
        </motion.p>
      </div>

      {/* Timeline container */}
      <div className="phase-timeline" style={{ position: "relative", display: "flex", flexDirection: "column", gap: "5rem" }}>
        {/* The animated line running down the center */}
        <TimelineLine />

        {/* Phase cards */}
        {PHASES.map((phase, i) => (
          <PhaseCard key={phase.id} phase={phase} index={i} />
        ))}
      </div>

      {/* Responsive overrides — single-column layout on mobile.
          Desktop:   center timeline line, cards alternate left/right.
          Mobile:    timeline pinned to the left, all cards stack on the right. */}
      <style>{`
        @media (max-width: 760px) {
          /* Move the central timeline line to the left edge */
          .phase-timeline > svg {
            left: 20px !important;
            transform: none !important;
          }
          /* All rows behave the same — single row, card on the right */
          .phase-row {
            flex-direction: row !important;
            gap: 1rem !important;
            padding-left: 0 !important;
          }
          /* Node sits on the left timeline, not the centre */
          .phase-node {
            left: 0 !important;
            top: 0.5rem !important;
            width: 36px !important;
            height: 36px !important;
            font-size: 1rem !important;
          }
          /* Remove the half-width spacer that's only useful on desktop */
          .phase-spacer {
            display: none !important;
          }
          /* Card takes remaining width, indented past the timeline node */
          .phase-card {
            margin-left: 52px !important;
            max-width: 100% !important;
            padding: 1.5rem !important;
          }
        }
        @media (max-width: 760px) {
          .phase-timeline {
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
