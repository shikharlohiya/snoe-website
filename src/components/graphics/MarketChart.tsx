"use client";

// ============================================================
// MarketChart — investor market-sizing figure.
//
// Form: nested circles drawn to area scale (TAM ⊃ SAM ⊃
// year-10 target ⊃ entry target), tangent at the baseline —
// the honest way to show magnitudes spanning $4B → $11M.
// Adjacent-market validation ($183B SCRM, $15B DI) lives in
// separate stat tiles, NOT on the same scale — plotting them
// together would flatten TAM/SAM to invisibility.
//
// Color: ink outlines with direct mono labels; the single
// accent marks SNOE's own targets. All identity is carried by
// labels, never color alone. Figures from the product doc.
// ============================================================

import { motion } from "framer-motion";

const BASE_Y = 402; // shared bottom tangent
const CX = 218;
const R_TAM = 172; // area ∝ $4.0B
const R_SAM = Math.round(R_TAM * Math.sqrt(2.2 / 4)); // $2.2B → 128
const R_Y10 = Math.round(R_TAM * Math.sqrt(0.155 / 4)); // $155M → 34
const R_ENTRY = Math.max(4, Math.round(R_TAM * Math.sqrt(0.011 / 4))); // $11M → 9

type Ring = {
  r: number;
  label: string;
  value: string;
  detail: string;
  accent?: boolean;
  dashed?: boolean;
  labelY: number;
};

const RINGS: Ring[] = [
  {
    r: R_TAM,
    label: "TAM",
    value: "$4B / yr",
    detail: "AI supplier-network optimization, 2025",
    labelY: 78,
  },
  {
    r: R_SAM,
    label: "SAM",
    value: "$2.2B / yr",
    detail: "Multi-tier intelligence & autonomous decisions",
    labelY: 168,
  },
  {
    r: R_Y10,
    label: "YEAR-10 TARGET",
    value: "$110–155M ARR",
    detail: "5–7% of SAM · category leadership",
    accent: true,
    dashed: true,
    labelY: 318,
  },
  {
    r: R_ENTRY,
    label: "ENTRY",
    value: "$7–11M ARR",
    detail: "0.3–0.5% of SAM · lighthouse accounts",
    accent: true,
    labelY: 388,
  },
];

const TILES = [
  {
    id: "ADJACENT MARKET 01",
    value: "$183.25B",
    name: "Supply-chain risk management, 2025",
    note: "The problem space SNOE operates in — growing on geopolitical instability and logistics disruption.",
  },
  {
    id: "ADJACENT MARKET 02",
    value: "$15.22B",
    name: "Decision intelligence, 2024",
    note: "Fastest-growing segment expanding at 15.4% CAGR through 2030.",
  },
];

export default function MarketChart() {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      {/* Nested-circle figure (md+); stacked rows on phones so
          nothing shrinks or scrolls sideways */}
      <div className="crop-marks rounded-2xl border border-hairline bg-paper-raised p-4 sm:p-6">
        <div className="md:hidden">
          <p className="coord-label mb-4">Fig. 02 — Market layers</p>
          <ul className="space-y-4">
            {RINGS.map((ring) => (
              <li key={ring.label} className="flex items-start gap-3 border-b border-hairline pb-4 last:border-b-0 last:pb-0">
                <span
                  aria-hidden
                  className={`mt-1 inline-block h-3.5 w-3.5 shrink-0 rounded-full ${
                    ring.accent
                      ? ring.dashed
                        ? "border-2 border-dashed border-accent-deep"
                        : "bg-accent"
                      : "border-2 border-ink"
                  }`}
                />
                <div>
                  <p className={`font-mono text-[0.6875rem] font-semibold tracking-[0.15em] ${ring.accent ? "text-accent-deep" : "text-ink-faint"}`}>
                    {ring.label}
                  </p>
                  <p className="font-mono text-lg font-semibold text-ink">{ring.value}</p>
                  <p className="text-sm text-ink-soft">{ring.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden md:block">
            <svg
          viewBox="0 0 720 440"
          role="img"
          aria-label="Market sizing drawn to scale: 4 billion dollar TAM contains a 2.2 billion dollar SAM; SNOE's year-10 target of 110 to 155 million ARR and entry target of 7 to 11 million ARR nest inside."
          className="h-auto w-full select-none"
        >
          {RINGS.map((ring, i) => {
            const cy = BASE_Y - ring.r;
            const labelX = 452;
            // leader line from ring's right edge to its label row
            const edgeX = CX + ring.r * 0.72;
            const edgeY = cy - ring.r * 0.55;
            return (
              <motion.g
                key={ring.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.2 }}
              >
                <circle
                  cx={CX}
                  cy={cy}
                  r={ring.r}
                  fill={ring.accent && !ring.dashed ? "var(--accent)" : "none"}
                  stroke={ring.accent ? "var(--accent-deep)" : "var(--ink)"}
                  strokeWidth={ring.accent ? 1.5 : 1.2}
                  strokeDasharray={ring.dashed ? "5 4" : undefined}
                >
                  <title>{`${ring.label} — ${ring.value}`}</title>
                </circle>
                <line
                  x1={ring.r > 40 ? edgeX : CX + ring.r + 4}
                  y1={ring.r > 40 ? edgeY : cy}
                  x2={labelX - 10}
                  y2={ring.labelY + 8}
                  stroke="var(--ink-faint)"
                  strokeWidth="1"
                />
                <text x={labelX} y={ring.labelY} className={`font-mono ${ring.accent ? "fill-accent-deep" : "fill-ink-faint"}`} fontSize="10.5" fontWeight="600" letterSpacing="2">
                  {ring.label}
                </text>
                <text x={labelX} y={ring.labelY + 24} className="font-mono fill-ink" fontSize="19" fontWeight="600">
                  {ring.value}
                </text>
                <text x={labelX} y={ring.labelY + 42} className="fill-ink-soft" fontFamily="var(--font-sans)" fontSize="11.5">
                  {ring.detail}
                </text>
              </motion.g>
            );
          })}

          {/* baseline + scale note */}
          <line x1={30} y1={BASE_Y} x2={690} y2={BASE_Y} stroke="var(--hairline)" strokeWidth="1" />
          <text x={30} y={BASE_Y + 22} className="font-mono fill-ink-faint" fontSize="9" letterSpacing="1.5">
            FIG. 02 — AREAS DRAWN TO SCALE
          </text>
        </svg>
        </div>
      </div>

      {/* Adjacent-market stat tiles (different scale — kept off the figure) */}
      <div className="space-y-6">
        {TILES.map((t) => (
          <div key={t.id} className="rounded-xl border border-hairline bg-paper-raised p-6">
            <p className="coord-label">{t.id}</p>
            <p className="mt-3 font-mono text-[2rem] font-medium tracking-tight text-ink">
              {t.value}
            </p>
            <p className="mt-1 text-sm font-medium text-ink">{t.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t.note}</p>
          </div>
        ))}
        <p className="text-xs italic leading-relaxed text-ink-faint">
          Adjacent markets validate the space; they are not on the figure&apos;s
          scale. Sources: SNOE market analysis, 2025.
        </p>
      </div>
    </div>
  );
}
