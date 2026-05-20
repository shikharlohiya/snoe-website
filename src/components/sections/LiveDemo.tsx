"use client";

// ============================================================
// LiveDemo — "Simulate a Disruption" interactive section.
//
// No sign-up wall. Users click one of 4 scenario buttons and
// watch a mini network graph react with cascading animations —
// nodes change color, edges glow, and a timeline of impacts
// appears on the right side.
//
// This is the section that makes SNOE feel real before any
// sales conversation happens.
// ============================================================

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Scenario definitions ─────────────────────────────────────

interface Scenario {
  id:       string;
  icon:     string;
  label:    string;
  location: string;
  color:    string;      // accent color for this scenario
  // Which node IDs get hit (in sequence — simulates cascade)
  cascade:  number[][];  // cascade[0] fires first, cascade[1] 600ms later, etc.
  impacts: {
    time:    string;
    message: string;
    severity: "low" | "medium" | "high";
  }[];
}

const SCENARIOS: Scenario[] = [
  {
    id:       "port",
    icon:     "⚓",
    label:    "Port Closure",
    location: "Busan, South Korea",
    color:    "#F59E0B",
    cascade:  [[8, 9], [5, 6], [2, 3], [1]],
    impacts:  [
      { time: "0 min",  message: "Port closure detected — Busan container terminal", severity: "high" },
      { time: "2 min",  message: "3 Tier-2 semiconductor suppliers affected",         severity: "high" },
      { time: "8 min",  message: "T1 electronics supply at risk — 47-day buffer",     severity: "medium" },
      { time: "23 min", message: "Alternative route via Shanghai identified",          severity: "low" },
      { time: "25 min", message: "Prescriptive recommendation: reroute + buffer buy", severity: "low" },
    ],
  },
  {
    id:       "sanctions",
    icon:     "🚫",
    label:    "Sanctions Update",
    location: "Rare Earth Minerals",
    color:    "#EF4444",
    cascade:  [[11, 12], [7, 8], [3, 4], [1, 2]],
    impacts:  [
      { time: "0 min",  message: "Export restriction: rare earth minerals — China",   severity: "high" },
      { time: "4 min",  message: "Tier-3 lithium & magnet suppliers flagged critical", severity: "high" },
      { time: "11 min", message: "EV battery supply chain risk: 3 T1 manufacturers",  severity: "high" },
      { time: "18 min", message: "Alternative: Australian & Chilean sources viable",   severity: "medium" },
      { time: "22 min", message: "Requalification timeline: 6 weeks estimated",       severity: "medium" },
    ],
  },
  {
    id:       "tariff",
    icon:     "📊",
    label:    "Tariff Spike",
    location: "China +45%",
    color:    "#7C3AED",
    cascade:  [[10, 11, 12], [6, 7], [2]],
    impacts:  [
      { time: "0 min",  message: "US tariff update: Chinese imports +45%",            severity: "high" },
      { time: "3 min",  message: "Cost model recalculated — 8 affected SKUs",         severity: "medium" },
      { time: "9 min",  message: "Sourcing optimization: Vietnam/Mexico alternatives", severity: "medium" },
      { time: "15 min", message: "Net cost delta: +12% if no action, -3% if rerouted",severity: "low" },
      { time: "20 min", message: "Executive brief generated — CFO approval requested", severity: "low" },
    ],
  },
  {
    id:       "quake",
    icon:     "🌏",
    label:    "Earthquake",
    location: "Tohoku, Japan",
    color:    "#00E5FF",
    cascade:  [[7, 8, 9], [4, 5, 6], [1, 2, 3]],
    impacts:  [
      { time: "0 min",  message: "M7.2 earthquake — Tohoku industrial region",        severity: "high" },
      { time: "1 min",  message: "5 Tier-2 auto-parts manufacturers offline",         severity: "high" },
      { time: "6 min",  message: "Transmission + brake component supply disrupted",   severity: "high" },
      { time: "14 min", message: "Production impact: 72h if no alternative sourced",  severity: "medium" },
      { time: "19 min", message: "Korean + German alternatives identified & ranked",  severity: "low" },
    ],
  },
];

// ── Mini network diagram used inside the demo ────────────────

// 13 fixed nodes in a hierarchy layout for the demo visualization
const DEMO_NODES = [
  { id: 1,  x: 50, y: 8  },   // plant center
  { id: 2,  x: 25, y: 28 }, { id: 3, x: 50, y: 28 }, { id: 4, x: 75, y: 28 }, // T1
  { id: 5,  x: 12, y: 52 }, { id: 6,  x: 30, y: 52 }, { id: 7,  x: 50, y: 52 },
  { id: 8,  x: 68, y: 52 }, { id: 9,  x: 86, y: 52 }, // T2
  { id: 10, x: 8,  y: 76 }, { id: 11, x: 28, y: 76 }, { id: 12, x: 55, y: 76 },
  { id: 13, x: 80, y: 76 }, // T3
];

const DEMO_EDGES = [
  [1,2],[1,3],[1,4],
  [2,5],[2,6],[3,6],[3,7],[3,8],[4,8],[4,9],
  [5,10],[6,11],[7,11],[8,12],[9,12],[9,13],
];

function MiniNetwork({ affectedIds }: { affectedIds: Set<number> }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* SVG edges */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {DEMO_EDGES.map(([from, to], i) => {
          const f = DEMO_NODES.find((n) => n.id === from)!;
          const t = DEMO_NODES.find((n) => n.id === to)!;
          const hot = affectedIds.has(from) || affectedIds.has(to);
          return (
            <line
              key={i}
              x1={f.x} y1={f.y} x2={t.x} y2={t.y}
              stroke={hot ? "#ef4444" : "rgba(0,229,255,0.15)"}
              strokeWidth={hot ? "0.8" : "0.4"}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {DEMO_NODES.map((node) => {
        const hot = affectedIds.has(node.id);
        return (
          <motion.div
            key={node.id}
            animate={{
              backgroundColor: hot ? "#ef4444" : "#00e5ff",
              boxShadow: hot
                ? "0 0 16px #ef4444"
                : "0 0 8px rgba(0,229,255,0.4)",
              scale: hot ? [1, 1.3, 1] : 1,
            }}
            transition={{ duration: 0.4 }}
            style={{
              position: "absolute",
              left:   `${node.x}%`,
              top:    `${node.y}%`,
              width:  node.id === 1 ? 14 : 10,
              height: node.id === 1 ? 14 : 10,
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </div>
  );
}

// ── Impact timeline ───────────────────────────────────────────

function ImpactTimeline({ scenario }: { scenario: Scenario | null }) {
  // Reveal impact items one by one with 800ms delays
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (!scenario) { setRevealed(0); return; }
    setRevealed(0);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setRevealed(count);
      if (count >= scenario.impacts.length) clearInterval(interval);
    }, 800);
    return () => clearInterval(interval);
  }, [scenario]);

  if (!scenario) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "var(--text-muted)",
          fontSize: "0.85rem",
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.1em",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <span style={{ fontSize: "1.5rem" }}>◎</span>
        Select a scenario to simulate
      </div>
    );
  }

  const severityColor = (s: string) =>
    s === "high" ? "#ef4444" : s === "medium" ? "#f59e0b" : "#22c55e";

  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "0.5rem" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: scenario.color, letterSpacing: "0.15em" }}>
          SNOE INTELLIGENCE — {scenario.label.toUpperCase()}
        </div>
        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{scenario.location}</div>
      </div>

      {/* Impact items */}
      <AnimatePresence>
        {scenario.impacts.slice(0, revealed).map((impact, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}
          >
            {/* Time */}
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                color: "var(--text-muted)",
                minWidth: 44,
                paddingTop: 2,
              }}
            >
              {impact.time}
            </span>
            {/* Severity dot */}
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: severityColor(impact.severity),
                boxShadow: `0 0 6px ${severityColor(impact.severity)}`,
                flexShrink: 0,
                marginTop: 4,
              }}
            />
            {/* Message */}
            <span
              style={{
                fontSize: "0.8rem",
                color: "var(--text-secondary)",
                lineHeight: 1.4,
              }}
            >
              {impact.message}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── Section export ───────────────────────────────────────────

export default function LiveDemo() {
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [affectedIds,    setAffectedIds]    = useState(new Set<number>());

  // Fire cascading node highlights in sequence
  function triggerScenario(scenario: Scenario) {
    setActiveScenario(scenario);
    setAffectedIds(new Set());

    let allAffected = new Set<number>();
    scenario.cascade.forEach((wave, i) => {
      setTimeout(() => {
        wave.forEach((id) => allAffected.add(id));
        setAffectedIds(new Set(allAffected));
      }, i * 600);
    });
  }

  return (
    <section
      id="demo"
      style={{
        padding: "8rem 2rem",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <motion.span
            className="text-label"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            No Demo Request Required
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
            Simulate a Disruption{" "}
            <span style={{ color: "var(--cyan)" }}>Right Now</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{
              marginTop: "0.75rem",
              color: "var(--text-secondary)",
              fontSize: "0.95rem",
            }}
          >
            Pick a real-world disruption scenario and watch SNOE respond.
          </motion.p>
        </div>

        {/* Scenario buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginBottom: "3rem",
          }}
        >
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => triggerScenario(s)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.7rem 1.4rem",
                borderRadius: 8,
                border: `1px solid ${activeScenario?.id === s.id ? s.color : "rgba(255,255,255,0.1)"}`,
                background: activeScenario?.id === s.id ? `${s.color}15` : "rgba(255,255,255,0.03)",
                color: activeScenario?.id === s.id ? s.color : "var(--text-secondary)",
                fontSize: "0.88rem",
                fontWeight: 600,
                cursor: "none",
                transition: "all 0.2s",
                boxShadow: activeScenario?.id === s.id ? `0 0 20px ${s.color}30` : "none",
              }}
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
              <span
                style={{
                  fontSize: "0.68rem",
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                — {s.location}
              </span>
            </button>
          ))}
        </div>

        {/* Main demo panel */}
        <div
          className="glass-card"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            minHeight: 420,
            overflow: "hidden",
          }}
        >
          {/* Left: mini network visualization */}
          <div
            style={{
              borderRight: "1px solid rgba(255,255,255,0.06)",
              padding: "1.5rem",
              position: "relative",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                color: "rgba(0,229,255,0.4)",
                letterSpacing: "0.15em",
                marginBottom: "1rem",
              }}
            >
              SUPPLIER NETWORK — LIVE VIEW
            </div>
            <div style={{ height: 340 }}>
              <MiniNetwork affectedIds={affectedIds} />
            </div>
          </div>

          {/* Right: impact timeline */}
          <div>
            <div
              style={{
                padding: "1rem 1.5rem 0",
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                color: "rgba(0,229,255,0.4)",
                letterSpacing: "0.15em",
              }}
            >
              SNOE RESPONSE TIMELINE
            </div>
            <ImpactTimeline scenario={activeScenario} />
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 640px) {
          #demo .glass-card { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
