"use client";

// ============================================================
// TierDiagram — "the blind spot" technical drawing.
//
// OEM and Tier-1 are drawn solid (what today's systems see).
// Tier-2/3 start as ghosted dashed outlines and resolve into
// solid ink when scrolled into view — what SNOE charts.
//
// Two layouts, CSS-switched (hydration-safe, no horizontal
// scroll): landscape left→right on md+, portrait top→bottom
// on phones.
// ============================================================

import { motion } from "framer-motion";

type Pt = { x: number; y: number };

type Tier = {
  id: string;
  label: string;
  known: boolean;
  nodes: Pt[]; // landscape coords
  mNodes: Pt[]; // portrait coords
  // landscape column center / portrait row anchor
  x: number;
  mY: number;
};

const TIERS: Tier[] = [
  {
    id: "t3",
    label: "TIER-3 / TIER-4",
    known: false,
    x: 110,
    nodes: [
      { x: 110, y: 90 },
      { x: 80, y: 170 },
      { x: 130, y: 250 },
      { x: 95, y: 330 },
    ],
    mY: 90,
    mNodes: [
      { x: 70, y: 90 },
      { x: 160, y: 78 },
      { x: 250, y: 95 },
      { x: 340, y: 82 },
    ],
  },
  {
    id: "t2",
    label: "TIER-2",
    known: false,
    x: 360,
    nodes: [
      { x: 360, y: 120 },
      { x: 335, y: 215 },
      { x: 375, y: 305 },
    ],
    mY: 205,
    mNodes: [
      { x: 110, y: 205 },
      { x: 205, y: 218 },
      { x: 300, y: 200 },
    ],
  },
  {
    id: "t1",
    label: "TIER-1",
    known: true,
    x: 620,
    nodes: [
      { x: 620, y: 150 },
      { x: 600, y: 275 },
    ],
    mY: 330,
    mNodes: [
      { x: 150, y: 330 },
      { x: 260, y: 338 },
    ],
  },
  {
    id: "oem",
    label: "OEM PLANT",
    known: true,
    x: 870,
    nodes: [{ x: 870, y: 212 }],
    mY: 448,
    mNodes: [{ x: 205, y: 448 }],
  },
];

// edges as [fromTierIdx, fromNodeIdx, toTierIdx, toNodeIdx]
const LINKS: [number, number, number, number][] = [
  [0, 0, 1, 0],
  [0, 1, 1, 0],
  [0, 1, 1, 1],
  [0, 2, 1, 1],
  [0, 2, 1, 2],
  [0, 3, 1, 2],
  [1, 0, 2, 0],
  [1, 1, 2, 0],
  [1, 1, 2, 1],
  [1, 2, 2, 1],
  [2, 0, 3, 0],
  [2, 1, 3, 0],
];

function linkPathH([ft, fn, tt, tn]: [number, number, number, number]): string {
  const a = TIERS[ft].nodes[fn];
  const b = TIERS[tt].nodes[tn];
  const mx = (a.x + b.x) / 2;
  return `M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
}

function linkPathV([ft, fn, tt, tn]: [number, number, number, number]): string {
  const a = TIERS[ft].mNodes[fn];
  const b = TIERS[tt].mNodes[tn];
  const my = (a.y + b.y) / 2;
  return `M ${a.x} ${a.y} C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
}

function linkKnown([ft, , tt]: [number, number, number, number]): boolean {
  return TIERS[ft].known && TIERS[tt].known;
}

const resolve = {
  initial: { opacity: 0.28 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-100px" as const },
  transition: { duration: 1.2, delay: 0.5 },
};

function NodeCircle({ p, known }: { p: Pt; known: boolean }) {
  return (
    <circle
      cx={p.x}
      cy={p.y}
      r="7"
      fill={known ? "var(--ink)" : "var(--paper)"}
      stroke="var(--ink)"
      strokeWidth="1.5"
      strokeDasharray={known ? undefined : "3 3"}
    />
  );
}

export default function TierDiagram() {
  return (
    <>
      {/* ---------- Landscape (md+) ---------- */}
      <svg
        viewBox="0 0 980 430"
        role="img"
        aria-label="Supplier tiers from Tier-3 to the OEM plant. Traditional systems chart only Tier-1; SNOE resolves the uncharted Tier-2 and Tier-3 territory."
        className="hidden h-auto w-full select-none md:block"
      >
        <line x1={495} y1={40} x2={495} y2={390} stroke="var(--hairline)" strokeWidth="1" strokeDasharray="2 6" />
        <text x={505} y={415} className="fill-ink-faint font-mono" fontSize="9.5" letterSpacing="2">
          CHARTED — VISIBLE TO TODAY&apos;S SYSTEMS
        </text>
        <motion.g {...resolve}>
          <text x={12} y={415} className="fill-accent-deep font-mono" fontSize="9.5" letterSpacing="2">
            UNCHARTED — RESOLVED BY SNOE
          </text>
        </motion.g>

        {/* survey sweep line (decorative) */}
        <motion.line
          x1={0}
          y1={40}
          x2={0}
          y2={390}
          stroke="var(--accent)"
          strokeWidth="1.5"
          className="motion-safe-only"
          initial={{ x: 495, opacity: 0 }}
          whileInView={{ x: 20, opacity: [0, 0.8, 0.8, 0] }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.6, delay: 0.35, ease: "easeInOut" }}
        />

        <g fill="none">
          {LINKS.map((l, i) =>
            linkKnown(l) ? (
              <path key={i} d={linkPathH(l)} stroke="var(--ink-soft)" strokeWidth="1.2" opacity="0.6" />
            ) : (
              <motion.path key={i} d={linkPathH(l)} stroke="var(--ink-soft)" strokeWidth="1.1" strokeDasharray="4 5" opacity="0.6" {...resolve} />
            )
          )}
        </g>

        {TIERS.map((tier) => {
          const content = (
            <>
              {tier.nodes.map((p, i) => (
                <NodeCircle key={i} p={p} known={tier.known} />
              ))}
              <text x={tier.x} y={38} textAnchor="middle" className="fill-ink font-mono" fontSize="11" fontWeight="600" letterSpacing="2">
                {tier.label}
              </text>
            </>
          );
          return tier.known ? (
            <g key={tier.id}>{content}</g>
          ) : (
            <motion.g key={tier.id} {...resolve}>
              {content}
            </motion.g>
          );
        })}
      </svg>

      {/* ---------- Portrait (phones) ---------- */}
      <svg
        viewBox="0 0 410 510"
        role="img"
        aria-label="Supplier tiers flowing from Tier-3 down to the OEM plant. SNOE resolves the uncharted upper tiers."
        className="h-auto w-full select-none md:hidden"
      >
        {/* charted / uncharted split */}
        <line x1={10} y1={272} x2={400} y2={272} stroke="var(--hairline)" strokeWidth="1" strokeDasharray="2 6" />
        <motion.g {...resolve}>
          <text x={10} y={20} className="fill-accent-deep font-mono" fontSize="9" letterSpacing="1.5">
            UNCHARTED — RESOLVED BY SNOE
          </text>
        </motion.g>
        <text x={10} y={290} className="fill-ink-faint font-mono" fontSize="8.5" letterSpacing="1.5">
          CHARTED — TODAY&apos;S SYSTEMS
        </text>

        <g fill="none">
          {LINKS.map((l, i) =>
            linkKnown(l) ? (
              <path key={i} d={linkPathV(l)} stroke="var(--ink-soft)" strokeWidth="1.2" opacity="0.6" />
            ) : (
              <motion.path key={i} d={linkPathV(l)} stroke="var(--ink-soft)" strokeWidth="1.1" strokeDasharray="4 5" opacity="0.6" {...resolve} />
            )
          )}
        </g>

        {TIERS.map((tier) => {
          const content = (
            <>
              {tier.mNodes.map((p, i) => (
                <NodeCircle key={i} p={p} known={tier.known} />
              ))}
              <text x={10} y={tier.mY - 28} className="fill-ink font-mono" fontSize="10" fontWeight="600" letterSpacing="1.5">
                {tier.label}
              </text>
            </>
          );
          return tier.known ? (
            <g key={tier.id}>{content}</g>
          ) : (
            <motion.g key={tier.id} {...resolve}>
              {content}
            </motion.g>
          );
        })}

        {/* plant label */}
        <text x={205} y={487} textAnchor="middle" className="fill-ink-faint font-mono" fontSize="9" letterSpacing="1.5">
          FINAL ASSEMBLY
        </text>
      </svg>
    </>
  );
}
