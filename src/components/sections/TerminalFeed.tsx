"use client";

// ============================================================
// TerminalFeed — Scrolling intelligence ticker bar.
//
// A full-width marquee of live-looking risk events with
// country flags, severity badges, and timestamps.
// Scrolls continuously — pauses on hover.
//
// Placed before the CTA to reinforce the "always on" feel.
// ============================================================

import { motion } from "framer-motion";

// Risk event data — looks like a real intelligence feed
const EVENTS = [
  { flag: "🇰🇷", severity: "WARN",     text: "Port congestion — Busan terminal, South Korea — 3 T2 suppliers affected" },
  { flag: "🇨🇳", severity: "CRITICAL", text: "Rare earth export restriction — 7 downstream suppliers at risk" },
  { flag: "🇯🇵", severity: "WARN",     text: "Seismic activity — Tohoku industrial zone — monitoring active" },
  { flag: "🇩🇪", severity: "INFO",     text: "Rhine water level low — automotive logistics delay +3 days" },
  { flag: "🇹🇼", severity: "CRITICAL", text: "Semiconductor fab capacity cut 12% — TSMC allocation notice" },
  { flag: "🇨🇱", severity: "WARN",     text: "Codelco copper output -8% — lithium battery supply ripple" },
  { flag: "🇸🇦", severity: "INFO",     text: "Aramco / SABIC petrochemical price adjustment — resins +6%" },
  { flag: "🇺🇸", severity: "INFO",     text: "US tariff recalculation complete — 14 sourcing routes updated" },
  { flag: "🇹🇭", severity: "WARN",     text: "Flooding risk — Thai Rubber Latex region — 60-day buffer activated" },
  { flag: "🇩🇪", severity: "INFO",     text: "Continental AG production realignment — Q3 allocation adjusted" },
];

// Color per severity level
const SEVERITY_COLOR: Record<string, string> = {
  CRITICAL: "#ef4444",
  WARN:     "#f59e0b",
  INFO:     "#00e5ff",
};

// Duplicate the array so the marquee loops seamlessly
const DOUBLED = [...EVENTS, ...EVENTS];

export default function TerminalFeed() {
  return (
    <section
      style={{
        borderTop:    "1px solid rgba(0,229,255,0.1)",
        borderBottom: "1px solid rgba(0,229,255,0.1)",
        background:   "rgba(0,229,255,0.02)",
        padding:      "0.9rem 0",
        overflow:     "hidden",
        position:     "relative",
      }}
    >
      {/* Left fade mask */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 120,
          background: "linear-gradient(to right, var(--bg-primary), transparent)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Right fade mask */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 120,
          background: "linear-gradient(to left, var(--bg-primary), transparent)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* "LIVE" chip pinned on the far left */}
      <div
        style={{
          position: "absolute",
          left: 16,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          background: "var(--bg-primary)",
          padding: "0.2rem 0.6rem",
          borderRadius: 4,
          border: "1px solid rgba(0,229,255,0.2)",
        }}
      >
        <motion.span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#ef4444",
            boxShadow: "0 0 8px #ef4444",
            display: "inline-block",
          }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            color: "var(--text-muted)",
            textTransform: "uppercase",
          }}
        >
          LIVE
        </span>
      </div>

      {/* Marquee strip */}
      <div className="animate-marquee" style={{ paddingLeft: 140 }}>
        {DOUBLED.map((event, i) => (
          <div
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              marginRight: "3rem",
              whiteSpace: "nowrap",
            }}
          >
            {/* Flag */}
            <span style={{ fontSize: "0.9rem" }}>{event.flag}</span>

            {/* Severity badge */}
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                color: SEVERITY_COLOR[event.severity] || "#fff",
                padding: "0.1rem 0.4rem",
                border: `1px solid ${SEVERITY_COLOR[event.severity] || "#fff"}40`,
                borderRadius: 3,
              }}
            >
              {event.severity}
            </span>

            {/* Event text */}
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--text-secondary)",
              }}
            >
              {event.text}
            </span>

            {/* Separator */}
            <span style={{ color: "var(--text-muted)", opacity: 0.3 }}>|</span>
          </div>
        ))}
      </div>
    </section>
  );
}
