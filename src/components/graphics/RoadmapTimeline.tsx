"use client";

// ============================================================
// RoadmapTimeline — the 4-phase, 0–24-month product roadmap
// drawn as a vertical survey line with station markers.
// The line draws itself as the reader scrolls; each phase card
// carries milestones + success metrics from the product doc.
// ============================================================

import { motion } from "framer-motion";

type Phase = {
  id: string;
  months: string;
  title: string;
  goal: string;
  milestones: string[];
  metrics: string[];
};

const PHASES: Phase[] = [
  {
    id: "PH-1",
    months: "MONTHS 0–6",
    title: "Executive dashboard & supplier visibility",
    goal: "Establish the core data infrastructure and the initial supplier network model.",
    milestones: [
      "Integrate ERP, PLM, SRM, and TMS systems",
      "Ingest geopolitics, tariff, and logistics feeds",
      "Build Tier-1 + inferred Tier-2 knowledge graph",
    ],
    metrics: [
      "≥4 external risk feeds live",
      "Tier-1 coverage 100% · Tier-2 ≥40%",
    ],
  },
  {
    id: "PH-2",
    months: "MONTHS 6–12",
    title: "Risk analytics & multi-tier visibility",
    goal: "Expand into deeper tiers; introduce risk scoring and disruption modeling.",
    milestones: [
      "Extend graph to Tier-2/Tier-3 visibility",
      "Composite supplier risk-scoring engine",
      "Scenario simulation: tariffs, ports, weather",
    ],
    metrics: [
      "Tier-3 visibility ≥25%",
      "Detection latency <30 minutes",
    ],
  },
  {
    id: "PH-3",
    months: "MONTHS 12–18",
    title: "Prescriptive optimization & execution",
    goal: "Move from insight to action with governed, closed-loop recommendations.",
    milestones: [
      "Prescriptive sourcing & routing recommendations",
      "Governed execution into ERP/TMS",
      "Human-in-the-loop approvals + audit trail",
    ],
    metrics: [
      "Recommendation acceptance ≥60%",
      "≥3 pilot customers in production",
    ],
  },
  {
    id: "PH-4",
    months: "MONTHS 18–24",
    title: "Autonomous network optimization",
    goal: "Continuous, self-improving optimization across the full network.",
    milestones: [
      "Tier-N supplier visibility",
      "Reinforcement-learning-based optimization",
      "Autonomous decision loops with human override",
    ],
    metrics: [
      "Autonomous execution ≥30% (governed)",
      "Tier-N visibility ≥60%",
    ],
  },
];

export default function RoadmapTimeline() {
  return (
    <div className="relative">
      {/* survey line */}
      <div className="absolute inset-y-0 left-[7px] w-px md:left-1/2">
        <motion.div
          className="h-full w-full origin-top bg-ink-faint"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-10% 0px -40% 0px" }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />
      </div>

      <div className="space-y-16">
        {PHASES.map((phase, i) => {
          const left = i % 2 === 0;
          return (
            <motion.div
              key={phase.id}
              className="relative md:grid md:grid-cols-2 md:gap-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              {/* station marker */}
              <span className="absolute left-0 top-1.5 h-[15px] w-[15px] border-2 border-ink bg-paper md:left-1/2 md:-translate-x-1/2" />

              <div
                className={
                  left
                    ? "pl-10 md:col-start-1 md:pl-0 md:pr-4 md:text-right"
                    : "pl-10 md:col-start-2 md:pl-4"
                }
              >
                <p className="coord-label">
                  {phase.id} · {phase.months}
                </p>
                <h3 className="font-display mt-2 text-xl font-semibold leading-snug text-ink md:text-2xl">
                  {phase.title}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
                  {phase.goal}
                </p>

                <div
                  className={`mt-5 rounded-xl border border-hairline bg-paper-raised p-5 text-left`}
                >
                  <p className="coord-label">Key Milestones</p>
                  <ul className="mt-2 space-y-1.5">
                    {phase.milestones.map((m) => (
                      <li key={m} className="flex gap-2 text-sm leading-relaxed text-ink-soft">
                        <span className="font-mono text-xs text-ink-faint" aria-hidden>
                          –
                        </span>
                        {m}
                      </li>
                    ))}
                  </ul>
                  <p className="coord-label mt-4">Success Metrics</p>
                  <ul className="mt-2 space-y-1">
                    {phase.metrics.map((m) => (
                      <li key={m} className="font-mono text-[0.75rem] leading-relaxed text-accent-deep">
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
