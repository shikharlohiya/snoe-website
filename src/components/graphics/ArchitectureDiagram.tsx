"use client";

// Compact ink-style architecture flow:
// data sources → knowledge graph → agents → governed decisions.

import { motion } from "framer-motion";

const STAGES = [
  {
    x: 90,
    title: "SIGNALS",
    lines: ["ERP · SRM · TMS", "Geopolitics · Tariffs", "Logistics · Weather"],
  },
  {
    x: 330,
    title: "KNOWLEDGE GRAPH",
    lines: ["Tier-N dependencies", "Disclosed + inferred", "Live risk state"],
  },
  {
    x: 570,
    title: "AGENT LAYER",
    lines: ["4× Monitor", "4× Reasoning", "4× Action"],
  },
  {
    x: 810,
    title: "DECISIONS",
    lines: ["Explainable recs", "Governed execution", "Audit trail"],
  },
];

const BOX_W = 180;

export default function ArchitectureDiagram() {
  return (
    <>
      {/* Portrait (phones): stacked stage cards, no shrunken SVG */}
      <div className="space-y-0 md:hidden">
        {STAGES.map((s, i) => (
          <div key={s.title}>
            <div
              className={`border bg-paper-raised p-4 ${
                i === 1 ? "border-ink" : "border-hairline"
              }`}
            >
              <p className="font-mono text-[0.75rem] font-semibold tracking-[0.15em] text-ink">
                {s.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                {s.lines.join(" · ")}
              </p>
            </div>
            {i < STAGES.length - 1 && (
              <p className="py-1.5 text-center font-mono text-sm text-ink-faint" aria-hidden>
                ↓
              </p>
            )}
          </div>
        ))}
        <p className="pt-3 text-center font-mono text-[0.625rem] uppercase tracking-[0.15em] text-ink-faint">
          Outcomes feed back — continuous learning
        </p>
      </div>

      <svg
      viewBox="0 0 990 240"
      role="img"
      aria-label="Architecture flow: enterprise and external signals feed the supplier knowledge graph, agents operate on the graph, and governed decisions flow to execution systems."
      className="hidden h-auto w-full select-none md:block"
    >
      {STAGES.map((s, i) => (
        <motion.g
          key={s.title}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, delay: i * 0.18 }}
        >
          <rect
            x={s.x - BOX_W / 2}
            y={50}
            width={BOX_W}
            height={140}
            fill="var(--paper-raised)"
            stroke={i === 1 ? "var(--ink)" : "var(--hairline)"}
            strokeWidth={i === 1 ? 1.5 : 1}
          />
          <text x={s.x} y={82} textAnchor="middle" className="fill-ink font-mono" fontSize="12.5" fontWeight="600" letterSpacing="2">
            {s.title}
          </text>
          <line x1={s.x - 55} y1={94} x2={s.x + 55} y2={94} stroke="var(--hairline)" strokeWidth="1" />
          {s.lines.map((l, j) => (
            <text key={l} x={s.x} y={118 + j * 22} textAnchor="middle" className="fill-ink-soft" fontFamily="var(--font-sans)" fontSize="12.5">
              {l}
            </text>
          ))}
        </motion.g>
      ))}

      {/* connectors */}
      {STAGES.slice(0, -1).map((s, i) => (
        <motion.g
          key={`c${i}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, delay: 0.25 + i * 0.18 }}
        >
          <line
            x1={s.x + BOX_W / 2}
            y1={120}
            x2={STAGES[i + 1].x - BOX_W / 2 - 8}
            y2={120}
            stroke="var(--ink-soft)"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            markerEnd="url(#arch-arrow)"
          />
        </motion.g>
      ))}

      {/* feedback loop: decisions → signals */}
      <motion.path
        d="M 810 190 L 810 222 L 90 222 L 90 198"
        fill="none"
        stroke="var(--ink-faint)"
        strokeWidth="1"
        strokeDasharray="2 5"
        markerEnd="url(#arch-arrow)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: 0.9 }}
      />
      <text x={450} y={216} textAnchor="middle" className="fill-ink-faint font-mono" fontSize="9.5" letterSpacing="1.5">
        OUTCOMES FEED BACK — CONTINUOUS LEARNING
      </text>

      <defs>
        <marker id="arch-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 1 L 8 5 L 0 9" fill="none" stroke="var(--ink-soft)" strokeWidth="1.5" />
        </marker>
      </defs>
    </svg>
    </>
  );
}
