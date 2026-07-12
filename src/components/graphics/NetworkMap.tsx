"use client";

// ============================================================
// NetworkMap — the homepage hero visual.
//
// A pure-SVG "survey map" of an anonymized multi-tier supplier
// network that behaves like a LIVE intelligence feed: every
// ~8s the detected disruption rotates (semiconductors → port →
// lithium), the hot downstream route re-routes with marching
// dashes, pulse rings move to the affected node, and a HUD
// shows a ticking UTC clock + signals counter.
//
// TWO PRESENTATIONS, one state: a wide landscape map (md and
// up) and — because a shrunken map reads poorly on phones — a
// live "decision feed" card stack on mobile, cycling through
// the same scenarios. Switched purely with CSS classes so
// server and client markup always match (hydration-safe).
//
// Reduced motion: transform/loop animations are disabled by
// MotionConfig + the motion-safe-only CSS class.
// ============================================================

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ---------- Shared network data ----------

type NodeMeta = {
  id: string;
  tier: string;
  name: string;
  coords: string;
  kind: "dot" | "plant";
};

const NODES: NodeMeta[] = [
  { id: "rare-earth", tier: "TIER-3", name: "Rare Earth — Inland China", coords: "36.1°N 103.8°E", kind: "dot" },
  { id: "lithium", tier: "TIER-3", name: "Lithium — Atacama, Chile", coords: "23.9°S 68.2°W", kind: "dot" },
  { id: "semis", tier: "TIER-2", name: "Semiconductors — Taiwan", coords: "24.8°N 121.0°E", kind: "dot" },
  { id: "castings", tier: "TIER-2", name: "Castings — Saxony, Germany", coords: "51.0°N 13.7°E", kind: "dot" },
  { id: "port", tier: "TRANSSHIPMENT", name: "Port — Singapore", coords: "1.26°N 103.8°E", kind: "dot" },
  { id: "elex", tier: "TIER-1", name: "Electronics — Monterrey, MX", coords: "25.7°N 100.3°W", kind: "dot" },
  { id: "powertrain", tier: "TIER-1", name: "Powertrain — Michigan, US", coords: "42.3°N 83.0°W", kind: "dot" },
  { id: "plant", tier: "OEM PLANT", name: "Final Assembly — Kentucky, US", coords: "38.2°N 84.9°W", kind: "plant" },
];

type Edge = { from: string; to: string; bow: number };

const EDGES: Edge[] = [
  { from: "rare-earth", to: "semis", bow: -30 },
  { from: "rare-earth", to: "castings", bow: 40 },
  { from: "lithium", to: "castings", bow: 30 },
  { from: "lithium", to: "semis", bow: -70 },
  { from: "semis", to: "port", bow: -35 },
  { from: "castings", to: "port", bow: 35 },
  { from: "port", to: "elex", bow: -35 },
  { from: "port", to: "powertrain", bow: 35 },
  { from: "semis", to: "elex", bow: -60 },
  { from: "elex", to: "plant", bow: -30 },
  { from: "powertrain", to: "plant", bow: 30 },
];

const edgeKey = (e: Edge) => `${e.from}-${e.to}`;

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

type Pos = { x: number; y: number };

/** Quadratic curve between two nodes, bowed perpendicular to the chord. */
function edgePath(e: Edge, pos: Record<string, Pos>, bowScale = 1): string {
  const a = pos[e.from];
  const b = pos[e.to];
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const bow = e.bow * bowScale;
  const px = Math.round((mx + nx * bow) * 100) / 100;
  const py = Math.round((my + ny * bow) * 100) / 100;
  return `M ${a.x} ${a.y} Q ${px} ${py} ${b.x} ${b.y}`;
}

// ---------- Layouts ----------

// Landscape (md+), viewBox 1200×640
const DESK: Record<string, Pos & { labelSide: "top" | "bottom" }> = {
  "rare-earth": { x: 150, y: 175, labelSide: "top" },
  lithium: { x: 180, y: 480, labelSide: "bottom" },
  semis: { x: 400, y: 140, labelSide: "top" },
  castings: { x: 375, y: 430, labelSide: "bottom" },
  port: { x: 620, y: 300, labelSide: "bottom" },
  elex: { x: 840, y: 170, labelSide: "top" },
  powertrain: { x: 830, y: 465, labelSide: "bottom" },
  plant: { x: 1065, y: 305, labelSide: "top" },
};

// ---------- Rotating disruption scenarios ----------

type Scenario = {
  node: string;
  title: string;
  sub: string;
  hot: string[];
  signal: string;
  /** Mobile decision-feed copy. */
  feed: { trace: string; action: string };
};

const SCENARIOS: Scenario[] = [
  {
    node: "semis",
    title: "DISRUPTION DETECTED",
    sub: "T-72H TO PRODUCTION IMPACT",
    hot: ["semis-port", "port-elex", "semis-elex", "elex-plant"],
    signal: "semis-port",
    feed: {
      trace: "2 Tier-1 plants exposed via Taiwan fab dependency",
      action: "Reroute 8 POs via alternate hub · +2.1 days",
    },
  },
  {
    node: "port",
    title: "PORT CONGESTION",
    sub: "12-DAY QUEUE — REROUTING",
    hot: ["castings-port", "port-elex", "port-powertrain"],
    signal: "port-powertrain",
    feed: {
      trace: "14 in-transit POs queued · Tier-1 shortage in 9 days",
      action: "Release safety stock at Tier-1 · bridge 5 days",
    },
  },
  {
    node: "lithium",
    title: "EXPORT PERMIT DELAY",
    sub: "TIER-3 LITHIUM — 9-DAY BUFFER",
    hot: ["lithium-castings", "castings-port", "port-powertrain", "powertrain-plant"],
    signal: "lithium-castings",
    feed: {
      trace: "Hidden dependency inferred: feeds 2 Tier-2 suppliers",
      action: "Qualify dual-source foundry · 11-week lead",
    },
  },
];

const SCENARIO_MS = 8000;

const LON_LABELS = ["60°E", "80°E", "100°E", "120°E", "140°E", "160°E", "180°"];
const LAT_LABELS = ["50°N", "35°N", "20°N", "5°N", "10°S", "25°S"];

// ---------- Shared sub-renderers ----------

function EdgesLayer({
  scenario,
  pos,
  bowScale,
}: {
  scenario: Scenario;
  pos: Record<string, Pos>;
  bowScale?: number;
}) {
  return (
    <g fill="none">
      {EDGES.map((e, i) => {
        const hot = scenario.hot.includes(edgeKey(e));
        return (
          <motion.path
            key={edgeKey(e)}
            d={edgePath(e, pos, bowScale)}
            strokeDasharray="5 5"
            className={hot ? "dash-flow" : undefined}
            filter={hot ? "url(#nm-glow)" : undefined}
            initial={{ opacity: 0, stroke: "var(--ink-soft)" }}
            animate={{
              opacity: hot ? 1 : 0.45,
              stroke: hot ? "var(--accent)" : "var(--ink-soft)",
              strokeWidth: hot ? 2.2 : 1.1,
            }}
            transition={{ duration: 0.7, delay: 0.3 + i * 0.05 }}
          />
        );
      })}
    </g>
  );
}

function PulseRings({ x, y, restartKey }: { x: number; y: number; restartKey: number }) {
  return (
    <g key={restartKey}>
      <circle cx={x} cy={y} r="10" fill="none" stroke="var(--accent)" strokeWidth="1" className="motion-safe-only" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "ping-soft 2.4s ease-out infinite" }} />
      <circle cx={x} cy={y} r="10" fill="none" stroke="var(--accent)" strokeWidth="1" className="motion-safe-only" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "ping-soft 2.4s ease-out 1.2s infinite" }} />
    </g>
  );
}

function SignalDot({
  scenarioIdx,
  path,
}: {
  scenarioIdx: number;
  path: string;
}) {
  return (
    <motion.circle
      key={`dot-${scenarioIdx}`}
      r="4"
      fill="var(--accent)"
      filter="url(#nm-glow)"
      className="motion-safe-only"
      style={{ offsetPath: `path("${path}")` }}
      initial={{ offsetDistance: "0%", opacity: 0 }}
      animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
      transition={{ duration: 3, delay: 1.2, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
    />
  );
}

// ---------- Component ----------

export default function NetworkMap() {
  // Deterministic initial state (scenario 0, placeholder clock)
  // keeps SSR and hydration identical; the feed starts after mount.
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [clock, setClock] = useState("--:--:--");
  const [signals, setSignals] = useState(14203);

  const scenario = SCENARIOS[scenarioIdx];
  const signalEdge = EDGES.find((e) => edgeKey(e) === scenario.signal)!;

  useEffect(() => {
    const rotate = setInterval(
      () => setScenarioIdx((i) => (i + 1) % SCENARIOS.length),
      SCENARIO_MS
    );
    const tick = setInterval(() => {
      setClock(new Date().toISOString().slice(11, 19));
      setSignals((s) => s + 1 + Math.floor(Math.random() * 3));
    }, 1000);
    return () => {
      clearInterval(rotate);
      clearInterval(tick);
    };
  }, []);

  const drawn = (delay: number) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8, delay },
  });

  const deskActive = DESK[scenario.node];

  return (
    <>
      {/* ================= LANDSCAPE (md and up) ================= */}
      <svg
        viewBox="0 0 1200 640"
        role="img"
        aria-label="Live map of a multi-tier supplier network from Tier-3 raw materials to an OEM assembly plant, cycling through detected disruptions"
        className="hidden h-auto w-full select-none md:block"
      >
        <defs>
          {/* soft electric glow for hot routes and the live dot */}
          <filter id="nm-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* graticule */}
        <g>
          {Array.from({ length: 14 }, (_, i) => (
            <line key={`v${i}`} x1={80 + i * 80} y1={0} x2={80 + i * 80} y2={640} stroke="var(--hairline-faint)" strokeWidth="1" />
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <line key={`h${i}`} x1={0} y1={50 + i * 90} x2={1200} y2={50 + i * 90} stroke="var(--hairline-faint)" strokeWidth="1" />
          ))}
          {LON_LABELS.map((t, i) => (
            <text key={t} x={160 + i * 160} y={20} textAnchor="middle" className="fill-ink-faint font-mono" fontSize="10" letterSpacing="1">
              {t}
            </text>
          ))}
          {LAT_LABELS.map((t, i) => (
            <text key={t} x={12} y={54 + i * 90} className="fill-ink-faint font-mono" fontSize="10" letterSpacing="1">
              {t}
            </text>
          ))}
        </g>

        {/* contours */}
        <g stroke="var(--hairline)" strokeWidth="1" fill="none" opacity="0.7">
          <path d="M240 620c-90-60-130-150-90-230s150-120 260-90 160 120 130 210-90 130-180 140-80-10-120-30z" />
          <path d="M280 560c-60-40-90-100-60-155s100-80 175-60 110 80 90 140-60 90-120 95-55-5-85-20z" />
          <path d="M960 120c70 20 110 70 100 130s-70 100-140 90-110-60-100-125 70-115 140-95z" />
          <path d="M980 165c45 15 70 45 63 85s-45 65-90 58-72-40-65-82 47-74 92-61z" />
        </g>

        <EdgesLayer scenario={scenario} pos={DESK} />
        <SignalDot scenarioIdx={scenarioIdx} path={edgePath(signalEdge, DESK)} />

        {/* nodes + labels */}
        {NODES.map((n, i) => {
          const p = DESK[n.id];
          const labelY = p.labelSide === "top" ? p.y - 46 : p.y + 26;
          const disrupted = scenario.node === n.id;
          return (
            <motion.g key={n.id} {...drawn(0.15 + i * 0.08)}>
              {disrupted && <PulseRings x={p.x} y={p.y} restartKey={scenarioIdx} />}
              {n.kind === "plant" ? (
                <rect x={p.x - 6} y={p.y - 6} width="12" height="12" fill="var(--ink)" stroke="var(--paper)" strokeWidth="2" />
              ) : (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={disrupted ? 6 : 5}
                  fill={disrupted ? "var(--accent)" : "var(--ink)"}
                  stroke={disrupted ? "var(--accent-deep)" : "var(--paper)"}
                  strokeWidth="2"
                  filter={disrupted ? "url(#nm-glow)" : undefined}
                  style={{ transition: "fill 0.5s, stroke 0.5s" }}
                />
              )}
              <line x1={p.x} y1={p.labelSide === "top" ? p.y - 8 : p.y + 8} x2={p.x} y2={p.labelSide === "top" ? labelY + 24 : labelY - 8} stroke="var(--ink-faint)" strokeWidth="1" />
              <text x={p.x} y={labelY} textAnchor="middle" className="fill-ink-faint font-mono" fontSize="9" letterSpacing="1.5">
                {n.tier}
              </text>
              <text x={p.x} y={labelY + 13} textAnchor="middle" className="fill-ink" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)">
                {n.name}
              </text>
              <text x={p.x} y={labelY + 25} textAnchor="middle" className="fill-ink-faint font-mono" fontSize="8.5" letterSpacing="1">
                {n.coords}
              </text>
            </motion.g>
          );
        })}

        {/* rotating annotation stamp */}
        <AnimatePresence mode="wait">
          <motion.g
            key={`stamp-${scenarioIdx}`}
            transform="rotate(-2 630 78)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
          >
            <rect x={500} y={52} width={260} height={52} fill="var(--accent-wash)" stroke="var(--accent)" strokeWidth="1.5" />
            <text x={630} y={74} textAnchor="middle" className="fill-accent-deep font-mono" fontSize="11" fontWeight="600" letterSpacing="2">
              {scenario.title}
            </text>
            <text x={630} y={92} textAnchor="middle" className="fill-accent-deep font-mono" fontSize="9.5" letterSpacing="1.5">
              {scenario.sub}
            </text>
          </motion.g>
        </AnimatePresence>

        {/* pointer from stamp to the active node */}
        <motion.line
          x1={scenario.node === "lithium" ? 510 : 540}
          y1={106}
          animate={{
            x2: deskActive.x + (deskActive.x > 545 ? -14 : 12),
            y2: deskActive.y - 10,
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          initial={false}
          stroke="var(--accent)"
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity="0.7"
        />

        {/* live HUD */}
        <g>
          <rect x={962} y={44} width={218} height={58} fill="var(--paper-raised)" stroke="var(--hairline)" strokeWidth="1" />
          <circle cx={978} cy={62} r="4" fill="var(--accent)" className="animate-pulse" />
          <text x={990} y={66} className="fill-ink font-mono" fontSize="10.5" fontWeight="600" letterSpacing="2">
            LIVE FEED
          </text>
          <text x={1168} y={66} textAnchor="end" className="fill-ink-soft font-mono" fontSize="10.5" letterSpacing="1">
            {clock} UTC
          </text>
          <text x={978} y={88} className="fill-ink-faint font-mono" fontSize="9" letterSpacing="1.5">
            SIGNALS PROCESSED
          </text>
          <text x={1168} y={88} textAnchor="end" className="fill-accent-deep font-mono" fontSize="10.5" fontWeight="600" letterSpacing="1">
            {signals.toLocaleString("en-US")}
          </text>
        </g>

        {/* legend */}
        <g>
          <rect x={962} y={556} width={218} height={64} fill="var(--paper-raised)" stroke="var(--hairline)" strokeWidth="1" />
          <text x={974} y={576} className="fill-ink-faint font-mono" fontSize="9" letterSpacing="1.5">
            FIG. 01 — SUPPLIER NETWORK
          </text>
          <circle cx={980} cy={592} r="4" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />
          <text x={992} y={596} className="fill-ink-soft font-mono" fontSize="9">
            SUPPLIER NODE
          </text>
          <circle cx={980} cy={608} r="4" fill="var(--accent)" stroke="var(--accent-deep)" strokeWidth="1" />
          <text x={992} y={612} className="fill-ink-soft font-mono" fontSize="9">
            ACTIVE DISRUPTION
          </text>
        </g>
      </svg>

      {/* ============ MOBILE: live decision feed ============ */}
      <div className="md:hidden">
        {/* header strip */}
        <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
          <span className="flex items-center gap-2 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
            Live feed
          </span>
          <span className="font-mono text-[0.6875rem] tracking-[0.1em] text-ink-soft">
            {clock} UTC
          </span>
        </div>

        <div className="p-4">
          <AnimatePresence mode="wait">
            <motion.ul
              key={`feed-${scenarioIdx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {/* EVENT */}
              <motion.li
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
                className="rounded-xl border border-accent/40 bg-accent-wash p-4"
              >
                <p className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-accent-deep">
                  Event · T+00:00
                </p>
                <p className="mt-1.5 text-[0.9375rem] font-semibold leading-snug text-ink">
                  {byId[scenario.node].name}
                </p>
                <p className="mt-1 font-mono text-[0.6875rem] tracking-[0.08em] text-accent-deep">
                  {scenario.title} · {scenario.sub}
                </p>
              </motion.li>

              {/* TRACE */}
              <motion.li
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.35 }}
                className="rounded-xl border border-hairline bg-paper-raised p-4"
              >
                <p className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-cobalt">
                  Graph trace · T+00:04
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  {scenario.feed.trace}
                </p>
              </motion.li>

              {/* RECOMMEND */}
              <motion.li
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.35 }}
                className="rounded-xl border border-hairline bg-paper-raised p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-ink">
                    Recommend · T+00:11
                  </p>
                  <span className="rounded-full border border-hairline px-2.5 py-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-ink-faint">
                    Awaiting approval
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink">
                  {scenario.feed.action}
                </p>
              </motion.li>
            </motion.ul>
          </AnimatePresence>

          {/* footer: scenario dots + signals */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2" role="tablist" aria-label="Disruption scenarios">
              {SCENARIOS.map((s, i) => (
                <button
                  key={s.node}
                  type="button"
                  role="tab"
                  aria-selected={i === scenarioIdx}
                  aria-label={s.title}
                  onClick={() => setScenarioIdx(i)}
                  className={
                    i === scenarioIdx
                      ? "h-1.5 w-6 rounded-full bg-accent transition-all"
                      : "h-1.5 w-1.5 rounded-full bg-hairline transition-all"
                  }
                />
              ))}
            </div>
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink-faint">
              Signals{" "}
              <span className="font-semibold text-accent-deep">
                {signals.toLocaleString("en-US")}
              </span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
