// Solutions — the platform: architecture, agent roster,
// scenario simulation, optimization, and target buyers.

import type { Metadata } from "next";

import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import HairlineCard from "@/components/ui/HairlineCard";
import PageHeader from "@/components/ui/PageHeader";
import CtaBand from "@/components/ui/CtaBand";
import ArchitectureDiagram from "@/components/graphics/ArchitectureDiagram";
import AgentRoster from "@/components/solutions/AgentRoster";
import ScenarioCard from "@/components/solutions/ScenarioCard";

export const metadata: Metadata = {
  title: "The Platform",
  description:
    "How SNOE works: a multi-tier supplier knowledge graph, twelve specialized AI agents, scenario simulation, and governed execution — deployed as an ERP-agnostic overlay.",
};

const INDUSTRIES = [
  "Automotive OEMs",
  "EV manufacturers",
  "Aerospace primes",
  "Industrial equipment",
  "Electronics manufacturers",
  "Tier-1/2/3 suppliers",
];

const BUYERS = [
  { role: "COO", concern: "Operational continuity and downtime avoided" },
  { role: "CSCO", concern: "Network resilience and supplier performance" },
  { role: "CFO", concern: "Cost exposure, working capital, tariff impact" },
  { role: "CRO", concern: "Governance, compliance, and auditable decisions" },
];

export default function SolutionsPage() {
  return (
    <main>
      {/* Page header */}
      <PageHeader
        eyebrow="Technical Dossier — The Platform"
        title="One graph. Twelve agents. Governed decisions."
        lede="An intelligence overlay on your existing systems — a living graph of your supplier network, staffed by autonomous agents, closing the loop from shock to decision."
      />

      {/* Architecture */}
      <section className="rule-b bg-bone">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="System Schematic"
              title="From signal to decision."
              lede="Enterprise data and external intelligence flow into the supplier knowledge graph. Agents operate on the graph; decisions flow out to sourcing and logistics systems — and outcomes feed back in."
            />
          </Reveal>
          <Reveal delay={0.1} className="mt-8 md:mt-12">
            <div className="crop-marks rounded-2xl border border-hairline bg-paper p-4 sm:p-8">
              <ArchitectureDiagram />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Agent roster */}
      <AgentRoster />

      {/* Scenario simulation */}
      <section className="rule-b bg-bone">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="Simulation Deck"
              title="Rehearse the disruption before it happens."
              lede="Select a scenario to watch the engine trace impact through an anonymized network and produce governed recommendations."
            />
          </Reveal>
          <Reveal delay={0.1} className="mt-8 md:mt-12">
            <ScenarioCard />
          </Reveal>
        </div>
      </section>

      {/* Optimization + explainability */}
      <section className="rule-b bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-28">
          <div className="grid gap-10 md:grid-cols-2">
            <Reveal>
              <HairlineCard cropMarks className="h-full">
                <p className="coord-label">Trade-off Engine</p>
                <h3 className="font-display mt-3 text-xl font-semibold text-ink">
                  Optimization under volatility
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                  Every recommendation balances cost, lead time, service, and
                  resilience as explicit objectives — linear and mixed-integer
                  programming for the trade-offs, reinforcement learning for
                  policies that improve with every disruption the network
                  survives.
                </p>
                <p className="mt-4 font-mono text-[0.6875rem] uppercase tracking-wider text-ink-faint">
                  LP / MIP · Genetic algorithms · RL policy evaluation
                </p>
              </HairlineCard>
            </Reveal>
            <Reveal delay={0.08}>
              <HairlineCard cropMarks className="h-full">
                <p className="coord-label">Trust Layer</p>
                <h3 className="font-display mt-3 text-xl font-semibold text-ink">
                  Explainable to the board
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                  No black boxes. Each action carries a natural-language
                  rationale, the signals that triggered it, the alternatives
                  considered, and a full audit trail — so executives can
                  approve with confidence and compliance can reconstruct any
                  decision.
                </p>
                <p className="mt-4 font-mono text-[0.6875rem] uppercase tracking-wider text-ink-faint">
                  SHAP · Feature importance · Decision narratives
                </p>
              </HairlineCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="rule-b bg-paper bg-graticule">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="Field of Operation"
              title="Built for complex, exposed networks."
              lede="Organizations that depend on thousands of suppliers across multiple tiers, regions, and regulatory regimes."
            />
          </Reveal>
          <div className="mt-8 md:mt-12 grid gap-12 md:grid-cols-2">
            <Reveal>
              <p className="coord-label mb-5">Industries</p>
              <ul className="space-y-3">
                {INDUSTRIES.map((ind) => (
                  <li
                    key={ind}
                    className="flex items-baseline gap-3 border-b border-hairline pb-3 text-[1rem] text-ink"
                  >
                    <span className="font-mono text-xs text-accent-deep" aria-hidden>
                      ▸
                    </span>
                    {ind}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="coord-label mb-5">Executive Owners</p>
              <ul className="space-y-3">
                {BUYERS.map((b) => (
                  <li key={b.role} className="border-b border-hairline pb-3">
                    <span className="font-mono text-sm font-semibold text-ink">
                      {b.role}
                    </span>
                    <span className="ml-3 text-sm text-ink-soft">{b.concern}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBand
        title="See it on your network."
        body="A briefing takes an hour: your tiers, your exposure, and what the agents would have caught last quarter."
      />
    </main>
  );
}
