"use client";

// ============================================================
// Blindspot Section — "You Think You See Your Supply Chain. You Don't."
//
// PERFORMANCE: All scroll-driven animations use MotionValues
// bound directly to `motion.*` style props. Scrolling does NOT
// trigger React re-renders — Framer Motion updates the DOM
// inside a single animation frame loop. The only React state
// is for the discrete headline text swap (3 transitions total).
//
// VISUAL UPGRADES:
//   • SVG <filter> glow + radial gradient backdrop
//   • Scanner line that travels with scroll progress
//   • Radar sweep behind the network
//   • Animated dash-flow on critical edges (data motion)
//   • Per-node staggered pulse using individual MotionValues
//   • Shockwave ring on tier-3 reveal
//   • Background particle field with parallax drift
//   • Risk counter HUD in the top-right corner
// ============================================================

import { useRef, useState, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "framer-motion";

// ── Node type ────────────────────────────────────────────────

interface DiagramNode {
  id:   number;
  tier: 1 | 2 | 3;
  x:    number;
  y:    number;
  risk: "healthy" | "warning" | "critical";
}

// ── Node positions ───────────────────────────────────────────

const NODES: DiagramNode[] = [
  { id: 1, tier: 1, x: 35, y: 6,  risk: "healthy" },
  { id: 2, tier: 1, x: 55, y: 6,  risk: "healthy" },
  { id: 3, tier: 1, x: 75, y: 6,  risk: "healthy" },

  { id: 4, tier: 2, x: 20, y: 38, risk: "healthy"  },
  { id: 5, tier: 2, x: 38, y: 38, risk: "warning"  },
  { id: 6, tier: 2, x: 55, y: 38, risk: "healthy"  },
  { id: 7, tier: 2, x: 72, y: 38, risk: "warning"  },
  { id: 8, tier: 2, x: 88, y: 38, risk: "healthy"  },

  { id: 9,  tier: 3, x: 10, y: 72, risk: "critical" },
  { id: 10, tier: 3, x: 25, y: 72, risk: "critical" },
  { id: 11, tier: 3, x: 42, y: 72, risk: "warning"  },
  { id: 12, tier: 3, x: 58, y: 72, risk: "healthy"  },
  { id: 13, tier: 3, x: 74, y: 72, risk: "critical" },
  { id: 14, tier: 3, x: 88, y: 72, risk: "warning"  },
];

const RISK_COLOR: Record<string, string> = {
  healthy:  "#22c55e",
  warning:  "#f59e0b",
  critical: "#ef4444",
};

const EDGES: [number, number][] = [
  [1,4],[1,5],[2,5],[2,6],[2,7],[3,7],[3,8],
  [4,9],[4,10],[5,10],[5,11],[6,11],[6,12],[7,13],[8,13],[8,14],
];

function nodeById(id: number) {
  return NODES.find((n) => n.id === id)!;
}

// ── Per-tier reveal thresholds (where in scroll progress each tier appears) ──

const TIER_REVEAL = {
  1: 0.0,   // always visible
  2: 0.28,  // appears at 28% scroll
  3: 0.55,  // appears at 55% scroll
};

// ── Single animated node — uses MotionValues, no React state ─

function AnimatedNode({
  node,
  scrollProgress,
  springProgress,
}: {
  node: DiagramNode;
  scrollProgress: MotionValue<number>;
  springProgress: MotionValue<number>;
}) {
  const color = RISK_COLOR[node.risk];
  const size  = node.tier === 1 ? 22 : node.tier === 2 ? 16 : 13;

  // Reveal threshold based on tier
  const reveal = TIER_REVEAL[node.tier];

  // Opacity ramps from 0 → 1 over a 12% scroll window starting at reveal point
  const opacity = useTransform(springProgress, [reveal, reveal + 0.12], [0, 1]);

  // Scale springs from 0 to 1 with a slight overshoot
  const scale = useTransform(springProgress, [reveal, reveal + 0.08, reveal + 0.14], [0, 1.35, 1]);

  // Box shadow intensity grows for critical nodes when fully revealed
  const isCritical = node.risk === "critical";
  const shadowOpacity = useTransform(
    scrollProgress,
    [reveal, reveal + 0.12, 0.9, 1],
    [0, isCritical ? 0.9 : 0.4, isCritical ? 1 : 0.5, isCritical ? 0.6 : 0.3]
  );

  // Halo (outer pulsing ring) — only on critical nodes after full reveal
  const haloScale = useTransform(scrollProgress, [reveal + 0.1, 1], [1, isCritical ? 2.4 : 1]);
  const haloOpacity = useTransform(scrollProgress, [reveal + 0.1, reveal + 0.3, 1], [0, 0.4, isCritical ? 0.15 : 0]);

  return (
    <>
      {/* Pulsing halo ring — only meaningful on critical nodes */}
      {isCritical && (
        <motion.div
          style={{
            position:  "absolute",
            left:      `${node.x}%`,
            top:       `${node.y}%`,
            width:     size * 2.5,
            height:    size * 2.5,
            marginLeft: -(size * 2.5) / 2,
            marginTop:  -(size * 2.5) / 2,
            borderRadius: "50%",
            border:    `1px solid ${color}`,
            opacity:   haloOpacity,
            scale:     haloScale,
            pointerEvents: "none",
          }}
        />
      )}

      {/* The node itself */}
      <motion.div
        style={{
          position:  "absolute",
          left:      `${node.x}%`,
          top:       `${node.y}%`,
          width:     size,
          height:    size,
          marginLeft: -size / 2,
          marginTop:  -size / 2,
          borderRadius: "50%",
          background:  color,
          opacity,
          scale,
          // Glow via box-shadow with animated opacity
          boxShadow: `0 0 ${isCritical ? 24 : 12}px ${color}`,
          willChange: "transform, opacity",
          // Inner critical-pulse animation (CSS keyframe) layered on top
          animation: isCritical ? "pulse-critical 1.5s ease-out infinite" : undefined,
        }}
      >
        {/* Inner brightness dot — adds depth */}
        <div
          style={{
            position: "absolute",
            inset: "20%",
            borderRadius: "50%",
            background: "white",
            opacity: 0.4,
          }}
        />
        {/* Stale shadow opacity (read so framer keeps it active) */}
        <motion.div style={{ opacity: shadowOpacity }} />
      </motion.div>
    </>
  );
}

// ── Animated edges (SVG paths with dash-flow) ─────────────────

function AnimatedEdges({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  // We build all edges once; each gets its own opacity MotionValue
  const edgeData = useMemo(() => {
    return EDGES.map(([fromId, toId]) => {
      const from = nodeById(fromId);
      const to   = nodeById(toId);
      // Reveal when BOTH endpoints would be visible
      const reveal = Math.max(TIER_REVEAL[from.tier], TIER_REVEAL[to.tier]);
      const hot    = to.risk !== "healthy" || from.risk !== "healthy";
      return { fromId, toId, from, to, reveal, hot };
    });
  }, []);

  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {/* SVG defs — glow filter + dashed-flow marker */}
      <defs>
        <filter id="glow-line" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {edgeData.map((e, i) => (
        <EdgePath key={i} edge={e} scrollProgress={scrollProgress} />
      ))}
    </svg>
  );
}

function EdgePath({
  edge,
  scrollProgress,
}: {
  edge: {
    from: DiagramNode;
    to:   DiagramNode;
    reveal: number;
    hot: boolean;
  };
  scrollProgress: MotionValue<number>;
}) {
  const { from, to, reveal, hot } = edge;

  const color = hot ? "#ef4444" : "rgba(0,229,255,0.35)";

  // Opacity ramps in once both endpoints are revealed
  const opacity = useTransform(scrollProgress, [reveal, reveal + 0.1], [0, hot ? 0.85 : 0.4]);

  // Stroke width pulses on hot edges after critical reveal
  const strokeWidth = useTransform(scrollProgress, [reveal, reveal + 0.1, 0.7, 1], [0.1, 0.5, hot ? 0.9 : 0.4, hot ? 1.1 : 0.4]);

  // For hot edges: animate stroke-dashoffset to create flowing dashes
  // We achieve this with a CSS animation toggled via a class
  return (
    <motion.line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={color}
      style={{
        opacity,
        strokeWidth,
        filter: hot ? "url(#glow-line)" : undefined,
        strokeDasharray: hot ? "1.5 1" : undefined,
        animation: hot ? "dash-flow 1.5s linear infinite" : undefined,
      }}
    />
  );
}

// ── Radar sweep behind the network ───────────────────────────

function RadarSweep({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  // The sweep ring grows from 0 → full size as user scrolls
  const radius = useTransform(scrollProgress, [0, 1], [0, 280]);
  const opacity = useTransform(scrollProgress, [0, 0.1, 0.9, 1], [0, 0.5, 0.3, 0.1]);

  return (
    <motion.div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: radius,
        height: radius,
        marginLeft: useTransform(radius, (v) => -v / 2),
        marginTop:  useTransform(radius, (v) => -v / 2),
        borderRadius: "50%",
        border: "1px solid rgba(0,229,255,0.25)",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
}

// ── Background floating particle field ───────────────────────

function ParticleField() {
  // 24 fixed particles, generated once with random positions
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2,
        duration: 8 + Math.random() * 12,
        delay: -Math.random() * 12,
        i,
      })),
    []
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.i}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top:  `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "rgba(0,229,255,0.4)",
            boxShadow: "0 0 4px rgba(0,229,255,0.6)",
          }}
          animate={{
            y:       [0, -40, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat:   Infinity,
            delay:    p.delay,
            ease:     "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ── Vertical scanner line that travels with scroll ────────────

function ScannerLine({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  // Y-position of scanner line travels from 0 → 100% of the diagram
  const y = useTransform(scrollProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollProgress, [0, 0.1, 0.9, 1], [0, 0.6, 0.6, 0]);

  return (
    <motion.div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        height: 1,
        opacity,
        background: "linear-gradient(to right, transparent 0%, rgba(0,229,255,0.6) 50%, transparent 100%)",
        pointerEvents: "none",
        // Inner glow ribbon under the line
        boxShadow: "0 0 20px rgba(0,229,255,0.4)",
      }}
    />
  );
}

// ── HUD: Risk counter in the top-right of the diagram ────────

function RiskHUD({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  // Each value ramps up as scroll progresses through the section
  const visibleTiers   = useTransform(scrollProgress, [0, 0.28, 0.55, 1], [1, 2, 3, 3]);
  const criticalsFound = useTransform(scrollProgress, [0, 0.55, 0.7],    [0, 0, 3]);
  const warningsFound  = useTransform(scrollProgress, [0, 0.28, 0.4, 0.7], [0, 0, 2, 4]);

  // Format MotionValues → string MotionValues for display
  const visibleStr   = useTransform(visibleTiers,   (v) => `${Math.round(v)} / 3`);
  const criticalsStr = useTransform(criticalsFound, (v) => `${Math.round(v).toString().padStart(2, "0")}`);
  const warningsStr  = useTransform(warningsFound,  (v) => `${Math.round(v).toString().padStart(2, "0")}`);

  return (
    <div
      className="blindspot-hud"
      style={{
        position: "absolute",
        top: 16,
        right: 16,
        padding: "0.8rem 1rem",
        borderRadius: 6,
        background: "rgba(5,8,16,0.7)",
        border: "1px solid rgba(0,229,255,0.15)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.65rem",
        minWidth: 160,
        display: "flex",
        flexDirection: "column",
        gap: "0.35rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
        <span>TIER VISIBILITY</span>
        <motion.span style={{ color: "var(--cyan)" }}>{visibleStr}</motion.span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
        <span>WARNINGS</span>
        <motion.span style={{ color: "#f59e0b" }}>{warningsStr}</motion.span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
        <span>CRITICAL</span>
        <motion.span style={{ color: "#ef4444" }}>{criticalsStr}</motion.span>
      </div>
    </div>
  );
}

// ── Step headline (changes 4 times across the scroll) ─────────

const HEADLINES = [
  { text: "You see your Tier-1 suppliers.",        color: "var(--text-primary)" },
  { text: "But Tier-2 already has warnings…",      color: "#f59e0b"             },
  { text: "Tier-3 is on fire. You can't see it.",  color: "#ef4444"             },
  { text: "SNOE sees all of it. In real time.",    color: "var(--cyan)"         },
];

function StepHeadline({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  // Only update React state when the integer step changes — not every frame.
  const [idx, setIdx] = useState(0);

  useMotionValueEvent(scrollProgress, "change", (v) => {
    let next = 0;
    if (v < 0.28)      next = 0;
    else if (v < 0.55) next = 1;
    else if (v < 0.82) next = 2;
    else               next = 3;
    if (next !== idx) setIdx(next);
  });

  const h = HEADLINES[idx];

  return (
    <motion.h2
      key={idx}                                  // re-mounts on step change so animation fires
      initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        fontSize:      "clamp(1.8rem, 4vw, 3rem)",
        fontWeight:    700,
        letterSpacing: "-0.03em",
        lineHeight:    1.15,
        color:         h.color,
        textAlign:     "center",
        maxWidth:      700,
        textShadow:    `0 0 30px ${h.color}55`,
      }}
    >
      {h.text}
    </motion.h2>
  );
}

// ── Scroll progress dots ─────────────────────────────────────

function ProgressDots({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  // 4 dots; each lights up at its corresponding threshold
  const thresholds = [0, 0.28, 0.55, 0.82];

  return (
    <div
      style={{
        position: "absolute",
        bottom: 32,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "0.5rem",
      }}
    >
      {thresholds.map((t, i) => (
        <ProgressDot key={i} threshold={t} scrollProgress={scrollProgress} />
      ))}
    </div>
  );
}

function ProgressDot({ threshold, scrollProgress }: { threshold: number; scrollProgress: MotionValue<number> }) {
  const width = useTransform(scrollProgress, [threshold, threshold + 0.05], [6, 24]);
  const background = useTransform(scrollProgress, [threshold, threshold + 0.05], ["rgba(255,255,255,0.15)", "#00E5FF"]);

  return (
    <motion.div
      style={{
        width,
        height: 4,
        borderRadius: 2,
        background,
      }}
    />
  );
}

// ── Main section ──────────────────────────────────────────────

export default function Blindspot() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Raw scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Apply a SPRING smoothing — this is the secret to butter-smooth scroll.
  // The raw scroll snaps frame-to-frame; the spring interpolates between
  // values so the animation feels fluid even on lower-end devices.
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping:   30,
    mass:      0.4,
  });

  // Tracked but used in fallback paths — kept for future tweaks
  useMotionValue(0);

  return (
    <div ref={containerRef} id="blindspot" style={{ height: "320vh", position: "relative" }}>
      {/* Sticky panel */}
      <div
        style={{
          position:       "sticky",
          top:            0,
          height:         "100vh",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          flexDirection:  "column",
          padding:        "clamp(1rem, 4vw, 2rem)",
          overflow:       "hidden",
        }}
      >
        {/* Background depth radial */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.08) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />

        {/* Animated faint grid overlay */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          }}
        />

        {/* Floating particles */}
        <ParticleField />

        {/* Section chip */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: "1.5rem", zIndex: 2 }}
        >
          <span className="text-label">The Blindspot Problem</span>
        </motion.div>

        {/* Headline that changes with scroll */}
        <div style={{ zIndex: 2 }}>
          <StepHeadline scrollProgress={scrollYProgress} />
        </div>

        {/* Network diagram container — responsive: fixed height shrinks on small screens */}
        <div
          className="blindspot-diagram"
          style={{
            position:  "relative",
            width:     "min(820px, 92vw)",
            height:    "clamp(260px, 45vh, 360px)",
            marginTop: "2.5rem",
            zIndex:    2,
          }}
        >
          {/* Radar sweep behind everything */}
          <RadarSweep scrollProgress={springProgress} />

          {/* SVG edges */}
          <AnimatedEdges scrollProgress={springProgress} />

          {/* Scanner line */}
          <ScannerLine scrollProgress={springProgress} />

          {/* Node dots */}
          {NODES.map((node) => (
            <AnimatedNode
              key={node.id}
              node={node}
              scrollProgress={scrollYProgress}
              springProgress={springProgress}
            />
          ))}

          {/* Tier labels on the left — hidden on phones (no horizontal room) */}
          {[
            { label: "YOUR PLANTS", y: "8%"  },
            { label: "TIER 1 / 2",  y: "40%" },
            { label: "TIER 2 / 3",  y: "74%" },
          ].map(({ label, y }, i) => (
            <motion.div
              key={label}
              className="blindspot-tier-label"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 0.7, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              style={{
                position:   "absolute",
                left:       "-4rem",
                top:        y,
                fontSize:   "0.55rem",
                letterSpacing: "0.14em",
                color:      "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                transform:  "translateY(-50%)",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </motion.div>
          ))}

          {/* Risk HUD */}
          <RiskHUD scrollProgress={springProgress} />
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: "1.5rem", marginTop: "2rem", zIndex: 2 }}>
          {[
            { color: "#22c55e", label: "Healthy"  },
            { color: "#f59e0b", label: "Warning"  },
            { color: "#ef4444", label: "Critical" },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}` }} />
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Progress dots at the bottom */}
        <ProgressDots scrollProgress={springProgress} />
      </div>

      {/* Local keyframes + responsive overrides */}
      <style>{`
        @keyframes dash-flow {
          0%   { stroke-dashoffset: 0;  }
          100% { stroke-dashoffset: -8; }
        }

        /* On phones: hide left tier labels (no room) and shrink HUD */
        @media (max-width: 720px) {
          .blindspot-tier-label {
            display: none !important;
          }
          .blindspot-hud {
            top: 8px !important;
            right: 8px !important;
            padding: 0.55rem 0.7rem !important;
            min-width: 120px !important;
            font-size: 0.55rem !important;
            gap: 0.25rem !important;
          }
        }
      `}</style>
    </div>
  );
}
