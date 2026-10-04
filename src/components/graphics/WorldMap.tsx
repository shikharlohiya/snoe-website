"use client";

// ============================================================
// WorldMap — homepage hero visual (light, Everstream-style).
//
// A real world map (Natural Earth projection) with the
// anonymized supplier network plotted on it: teal supplier
// nodes, an OEM plant, dashed connection arcs, and a live
// rotating disruption (every ~8s the detected event moves and
// its downstream route lights up orange). Clean light theme —
// no dark container. Labels hide on small screens; dots +
// arcs + disruption callout stay.
// ============================================================

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LAND_PATH, MAP_NODES, MAP_VIEWBOX } from "./worldMapData";

type NodeMeta = {
  id: string;
  tier: string;
  label: string;
  kind: "dot" | "plant";
  /** label placement vs the dot */
  side: "top" | "bottom";
};

const NODES: NodeMeta[] = [
  { id: "rare-earth", tier: "TIER-3", label: "Inland China", kind: "dot", side: "top" },
  { id: "lithium", tier: "TIER-3", label: "Chile", kind: "dot", side: "bottom" },
  { id: "semis", tier: "TIER-2", label: "Taiwan", kind: "dot", side: "top" },
  { id: "castings", tier: "TIER-2", label: "Germany", kind: "dot", side: "top" },
  { id: "port", tier: "TRANSSHIPMENT", label: "Singapore", kind: "dot", side: "bottom" },
  { id: "elex", tier: "TIER-1", label: "Mexico", kind: "dot", side: "bottom" },
  { id: "powertrain", tier: "TIER-1", label: "Michigan", kind: "dot", side: "top" },
  { id: "plant", tier: "OEM PLANT", label: "Kentucky", kind: "plant", side: "bottom" },
];

type Edge = { from: string; to: string };
const EDGES: Edge[] = [
  { from: "rare-earth", to: "semis" },
  { from: "rare-earth", to: "castings" },
  { from: "lithium", to: "castings" },
  { from: "lithium", to: "semis" },
  { from: "semis", to: "port" },
  { from: "castings", to: "port" },
  { from: "port", to: "elex" },
  { from: "port", to: "powertrain" },
  { from: "semis", to: "elex" },
  { from: "elex", to: "plant" },
  { from: "powertrain", to: "plant" },
];
const ekey = (e: Edge) => `${e.from}-${e.to}`;

/** Upward-bowed arc (flight-path look) between two projected points. */
function arc(from: string, to: string): string {
  const a = MAP_NODES[from];
  const b = MAP_NODES[to];
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dist = Math.hypot(b.x - a.x, b.y - a.y);
  const cx = Math.round(mx * 10) / 10;
  const cy = Math.round((my - dist * 0.26) * 10) / 10;
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

type Scenario = {
  node: string;
  title: string;
  sub: string;
  hot: string[];
  signal: string;
};

const SCENARIOS: Scenario[] = [
  {
    node: "semis",
    title: "DISRUPTION DETECTED",
    sub: "Taiwan · T-72h to production impact",
    hot: ["semis-port", "port-elex", "semis-elex", "elex-plant"],
    signal: "semis-port",
  },
  {
    node: "port",
    title: "PORT CONGESTION",
    sub: "Singapore · 12-day queue, rerouting",
    hot: ["castings-port", "port-elex", "port-powertrain"],
    signal: "port-powertrain",
  },
  {
    node: "lithium",
    title: "EXPORT PERMIT DELAY",
    sub: "Chile · Tier-3 lithium, 9-day buffer",
    hot: ["lithium-castings", "castings-port", "port-powertrain", "powertrain-plant"],
    signal: "lithium-castings",
  },
];

const SCENARIO_MS = 8000;

export default function WorldMap() {
  const [idx, setIdx] = useState(0);

  const scn = SCENARIOS[idx];
  const sig = EDGES.find((e) => ekey(e) === scn.signal)!;

  useEffect(() => {
    const rot = setInterval(() => setIdx((i) => (i + 1) % SCENARIOS.length), SCENARIO_MS);
    return () => clearInterval(rot);
  }, []);

  const active = MAP_NODES[scn.node];

  return (
    <div>
    <svg
      viewBox={MAP_VIEWBOX}
      role="img"
      aria-label="World map of an anonymized multi-tier supplier network with a live rotating disruption"
      className="mx-auto h-auto w-full select-none"
    >
      <defs>
        <filter id="wm-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ocean / water — subtle pale sky-blue */}
      <rect x={0} y={0} width={1000} height={500} fill="#EAF2F8" />

      {/* land */}
      <path d={LAND_PATH} fill="#DCE3EC" stroke="#C6D0DC" strokeWidth={0.6} />

      {/* base arcs */}
      <g fill="none">
        {EDGES.map((e, i) => {
          const hot = scn.hot.includes(ekey(e));
          return (
            <motion.path
              key={ekey(e)}
              d={arc(e.from, e.to)}
              strokeDasharray="4 5"
              className={hot ? "dash-flow" : undefined}
              filter={hot ? "url(#wm-glow)" : undefined}
              initial={{ opacity: 0 }}
              animate={{
                opacity: hot ? 1 : 0.5,
                stroke: hot ? "var(--accent)" : "#9AA7B6",
                strokeWidth: hot ? 2 : 1,
              }}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.05 }}
            />
          );
        })}
      </g>

      {/* traveling signal dot */}
      <motion.circle
        key={`dot-${idx}`}
        r={3.2}
        fill="var(--accent)"
        filter="url(#wm-glow)"
        className="motion-safe-only"
        style={{ offsetPath: `path("${arc(sig.from, sig.to)}")` }}
        initial={{ offsetDistance: "0%", opacity: 0 }}
        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
        transition={{ duration: 3, delay: 1, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
      />

      {/* nodes */}
      {NODES.map((n, i) => {
        const p = MAP_NODES[n.id];
        const disrupted = scn.node === n.id;
        const ly = n.side === "top" ? p.y - 14 : p.y + 21;
        return (
          <motion.g
            key={n.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.06 }}
          >
            {disrupted && (
              <g key={`rings-${idx}`}>
                <circle cx={p.x} cy={p.y} r={7} fill="none" stroke="var(--accent)" strokeWidth={1} className="motion-safe-only" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "ping-soft 2.4s ease-out infinite" }} />
                <circle cx={p.x} cy={p.y} r={7} fill="none" stroke="var(--accent)" strokeWidth={1} className="motion-safe-only" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "ping-soft 2.4s ease-out 1.2s infinite" }} />
              </g>
            )}
            {n.kind === "plant" ? (
              <rect x={p.x - 4.5} y={p.y - 4.5} width={9} height={9} fill="#1F2A37" stroke="#fff" strokeWidth={1.5} />
            ) : (
              <circle
                cx={p.x}
                cy={p.y}
                r={disrupted ? 5.5 : 4}
                fill={disrupted ? "var(--accent)" : "var(--cobalt)"}
                stroke="#fff"
                strokeWidth={1.5}
                filter={disrupted ? "url(#wm-glow)" : undefined}
                style={{ transition: "fill .4s" }}
              />
            )}

            {/* labels — hidden on small screens */}
            <g className="hidden md:block">
              <text x={p.x} y={ly} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fontWeight={600} fill="#2E2E2E">
                {n.label}
              </text>
              <text x={p.x} y={n.side === "top" ? ly - 11 : ly + 11} textAnchor="middle" className="font-mono" fontSize={7} letterSpacing={1} fill="#8A94A2">
                {n.tier}
              </text>
            </g>
          </motion.g>
        );
      })}

      {/* disruption callout chip (follows the active node) — desktop only */}
      <AnimatePresence mode="wait">
        <motion.g
          key={`chip-${idx}`}
          className="hidden md:block"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {(() => {
            const cw = 210;
            // place chip above the node, clamped into the viewBox
            let cx = active.x - cw / 2;
            cx = Math.max(10, Math.min(cx, 1000 - cw - 10));
            const cy = active.y > 90 ? active.y - 66 : active.y + 18;
            return (
              <>
                <line x1={active.x} y1={active.y} x2={cx + cw / 2} y2={cy + 44} stroke="var(--accent)" strokeWidth={1} strokeDasharray="2 2" opacity={0.6} />
                <rect x={cx} y={cy} width={cw} height={44} rx={7} fill="#fff" stroke="var(--accent)" strokeWidth={1.25} />
                <circle cx={cx + 16} cy={cy + 17} r={3.5} fill="var(--accent)" className="motion-safe-only" style={{ animation: "ping-soft 2s ease-out infinite", transformBox: "fill-box", transformOrigin: "center" }} />
                <circle cx={cx + 16} cy={cy + 17} r={3.5} fill="var(--accent)" />
                <text x={cx + 28} y={cy + 20} className="font-mono" fontSize={9.5} fontWeight={700} letterSpacing={1} fill="#B36A00">
                  {scn.title}
                </text>
                <text x={cx + 14} y={cy + 35} fontFamily="var(--font-sans)" fontSize={9.5} fill="#55606E">
                  {scn.sub}
                </text>
              </>
            );
          })()}
        </motion.g>
      </AnimatePresence>

    </svg>

    {/* Mobile info strip — readable caption in place of the tiny SVG chip */}
    <div className="mx-4 mt-3 rounded-lg border border-hairline bg-white px-3 py-2.5 md:hidden">
      <p className="flex items-center gap-1.5 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-accent-deep">
        <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
        {scn.title}
      </p>
      <p className="mt-0.5 text-xs text-ink-soft">{scn.sub}</p>
    </div>
    </div>
  );
}
