"use client";

// ============================================================
// LoopDiagram — the agentic Sense → Reason → Simulate → Act
// loop drawn as four numbered stations on a circular survey
// path. Arcs draw themselves in sequence on scroll; the loop
// closes back into Sense (continuous operation).
// ============================================================

import { motion } from "framer-motion";

const CX = 380;
const CY = 260;
const R = 175;

const STATIONS = [
  { id: "01", name: "Sense", angle: -90, blurb: "Ingest ERP, logistics, and geopolitical signals" },
  { id: "02", name: "Reason", angle: 0, blurb: "Propagate risk across the knowledge graph" },
  { id: "03", name: "Simulate", angle: 90, blurb: "Stress-test scenarios and trade-offs" },
  { id: "04", name: "Act", angle: 180, blurb: "Recommend or execute governed actions" },
];

function pos(angleDeg: number, radius = R) {
  const a = (angleDeg * Math.PI) / 180;
  // Round to 2dp — full float precision differs between server
  // and client at the last digit and trips hydration warnings.
  return {
    x: Math.round((CX + radius * Math.cos(a)) * 100) / 100,
    y: Math.round((CY + radius * Math.sin(a)) * 100) / 100,
  };
}

/** Quarter arc from one station to the next (clockwise), with a gap for markers. */
function arcPath(fromAngle: number): string {
  const pad = 14; // degrees of breathing room around the station dots
  const a = pos(fromAngle + pad);
  const b = pos(fromAngle + 90 - pad);
  return `M ${a.x} ${a.y} A ${R} ${R} 0 0 1 ${b.x} ${b.y}`;
}

export default function LoopDiagram() {
  return (
    <svg
      viewBox="0 0 760 520"
      role="img"
      aria-label="Circular diagram of the continuous agentic loop: sense, reason, simulate, act."
      className="mx-auto h-auto w-full max-w-[620px] select-none"
    >
      {/* center compass mark */}
      <circle cx={CX} cy={CY} r="3" fill="var(--ink)" />
      <circle cx={CX} cy={CY} r="26" fill="none" stroke="var(--hairline)" strokeWidth="1" />
      <text x={CX} y={CY + 58} textAnchor="middle" className="fill-ink-faint font-mono" fontSize="11" letterSpacing="2">
        CONTINUOUS
      </text>
      <text x={CX} y={CY + 74} textAnchor="middle" className="fill-ink-faint font-mono" fontSize="11" letterSpacing="2">
        OPERATION
      </text>

      {/* arcs */}
      {STATIONS.map((s, i) => (
        <motion.path
          key={s.id}
          d={arcPath(s.angle)}
          fill="none"
          stroke="var(--ink-soft)"
          strokeWidth="1.3"
          markerEnd="url(#loop-arrow)"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.3 + i * 0.45, ease: "easeInOut" }}
        />
      ))}

      <defs>
        <marker id="loop-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 1 L 8 5 L 0 9" fill="none" stroke="var(--ink-soft)" strokeWidth="1.5" />
        </marker>
      </defs>

      {/* stations */}
      {STATIONS.map((s, i) => {
        const p = pos(s.angle);
        // push labels outward from the circle
        const lx = CX + (R + 52) * Math.cos((s.angle * Math.PI) / 180);
        const ly = CY + (R + 52) * Math.sin((s.angle * Math.PI) / 180);
        return (
          <motion.g
            key={s.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.45 }}
          >
            <circle cx={p.x} cy={p.y} r="20" fill="var(--paper-raised)" stroke="var(--ink)" strokeWidth="1.5" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" className="fill-ink font-mono" fontSize="13" fontWeight="600">
              {s.id}
            </text>
            <text x={lx} y={ly - 4} textAnchor="middle" className="font-display fill-ink" fontSize="24" fontWeight="600">
              {s.name}
            </text>
            <text x={lx} y={ly + 16} textAnchor="middle" className="fill-ink-faint font-mono" fontSize="11" letterSpacing="0.5">
              {s.blurb}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}
