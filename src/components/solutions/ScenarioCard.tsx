"use client";

// ============================================================
// ScenarioCard — interactive disruption simulation.
// Three preset scenarios; selecting one plays a mono "trace"
// readout: event → propagation across tiers → recommended
// actions. All data anonymized and illustrative.
// ============================================================

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

type TraceLine = {
  t: string; // timestamp-ish label
  kind: "event" | "propagation" | "action";
  text: string;
};

type Scenario = {
  id: string;
  name: string;
  summary: string;
  trace: TraceLine[];
};

const SCENARIOS: Scenario[] = [
  {
    id: "port",
    name: "Port closure",
    summary: "A major transshipment hub suspends operations for 12 days.",
    trace: [
      { t: "T+00:00", kind: "event", text: "Transshipment port suspends operations — 12-day estimate" },
      { t: "T+00:02", kind: "propagation", text: "Graph trace: 3 Tier-2 lanes and 14 in-transit POs exposed" },
      { t: "T+00:07", kind: "propagation", text: "Assembly-line impact window: day 16–23, two programs" },
      { t: "T+00:11", kind: "action", text: "RECOMMEND — reroute 8 POs via alternate hub (+2.1 days)" },
      { t: "T+00:12", kind: "action", text: "Rationale attached · awaiting planner approval" },
    ],
  },
  {
    id: "tariff",
    name: "Tariff shock",
    summary: "A 25% tariff lands on Tier-2 semiconductor imports.",
    trace: [
      { t: "T+00:00", kind: "event", text: "New 25% tariff on semiconductor imports — effective in 30 days" },
      { t: "T+00:01", kind: "propagation", text: "Regulation parsed; 2 HS codes matched to 96 active parts" },
      { t: "T+00:05", kind: "propagation", text: "Landed-cost impact: +$3.4M annualized across 2 programs" },
      { t: "T+00:13", kind: "action", text: "RECOMMEND — shift 40% volume to alternate fab (−25% tariff)" },
      { t: "T+00:14", kind: "action", text: "1,000 simulation runs · P95 savings $2.6M" },
    ],
  },
  {
    id: "insolvency",
    name: "Supplier insolvency",
    summary: "A Tier-3 casting supplier shows acute distress signals.",
    trace: [
      { t: "T+00:00", kind: "event", text: "Tier-3 casting supplier: distress signals detected" },
      { t: "T+00:03", kind: "propagation", text: "Health score 82 → 41; insolvency probability 68%" },
      { t: "T+00:09", kind: "propagation", text: "Hidden dependency inferred — feeds 2 Tier-2 suppliers" },
      { t: "T+00:14", kind: "action", text: "RECOMMEND — dual-source at alternate foundry (11-week lead)" },
      { t: "T+00:15", kind: "action", text: "Watchlist escalated · CFO exposure brief generated" },
    ],
  },
];

const KIND_STYLE: Record<TraceLine["kind"], string> = {
  event: "text-accent-deep",
  propagation: "text-ink-soft",
  action: "text-ink",
};

const KIND_TAG: Record<TraceLine["kind"], string> = {
  event: "EVENT",
  propagation: "TRACE",
  action: "ACT",
};

export default function ScenarioCard() {
  const [active, setActive] = useState(SCENARIOS[0]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      {/* Scenario selector */}
      <div className="space-y-3">
        {SCENARIOS.map((s) => {
          const isActive = s.id === active.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(s)}
              aria-pressed={isActive}
              className={clsx(
                "block w-full rounded-xl border p-5 text-left transition-colors",
                isActive
                  ? "border-ink bg-paper-raised"
                  : "border-hairline bg-transparent hover:border-ink-faint"
              )}
            >
              <span className="coord-label">
                SIM-{String(SCENARIOS.indexOf(s) + 1).padStart(2, "0")}
              </span>
              <span className="font-display mt-1 block text-lg font-semibold text-ink">
                {s.name}
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                {s.summary}
              </span>
            </button>
          );
        })}
        <p className="pt-2 text-xs italic leading-relaxed text-ink-faint">
          Illustrative simulation on an anonymized network. In production, SNOE
          runs these against your live supplier graph.
        </p>
      </div>

      {/* Trace readout */}
      <div className="crop-marks rounded-xl border border-hairline bg-paper-raised">
        <div className="flex items-center justify-between border-b border-hairline px-5 py-3">
          <span className="coord-label">Decision Trace — {active.name}</span>
          <span className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-widest text-accent-deep">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
            Live
          </span>
        </div>
        <AnimatePresence mode="wait">
          <motion.ol
            key={active.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-4 px-5 py-6"
          >
            {active.trace.map((line, i) => (
              <motion.li
                key={`${active.id}-${i}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.35, duration: 0.3 }}
                className="grid grid-cols-[3.5rem_2.75rem_1fr] items-baseline gap-3 font-mono text-[0.8125rem] leading-relaxed"
              >
                <span className="text-ink-faint">{line.t}</span>
                <span
                  className={clsx(
                    "text-[0.625rem] font-semibold tracking-widest",
                    line.kind === "event" ? "text-accent" : "text-ink-faint"
                  )}
                >
                  {KIND_TAG[line.kind]}
                </span>
                <span className={KIND_STYLE[line.kind]}>{line.text}</span>
              </motion.li>
            ))}
          </motion.ol>
        </AnimatePresence>
      </div>
    </div>
  );
}
