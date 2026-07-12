// Six capability cards with technical index codes — one line
// each; depth lives on /solutions.

import Link from "next/link";
import HairlineCard from "@/components/ui/HairlineCard";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

const CAPABILITIES = [
  {
    code: "CAP-01",
    name: "Multi-tier knowledge graph",
    body: "A living map of every tier — disclosed and inferred.",
  },
  {
    code: "CAP-02",
    name: "Agentic AI response",
    body: "Twelve agents that monitor, reason, and act.",
  },
  {
    code: "CAP-03",
    name: "Scenario simulation",
    body: "Rehearse tariff shocks and port closures before they happen.",
  },
  {
    code: "CAP-04",
    name: "Multi-objective optimization",
    body: "Cost, service, and resilience traded off explicitly.",
  },
  {
    code: "CAP-05",
    name: "Executive explainability",
    body: "Every recommendation carries its rationale and audit trail.",
  },
  {
    code: "CAP-06",
    name: "ERP-agnostic overlay",
    body: "Deploys over your existing systems. No rip-and-replace.",
  },
];

export default function CapabilitiesGrid() {
  return (
    <section className="rule-b bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Capabilities Index"
            title="What the engine does."
          />
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-14 md:gap-6 lg:grid-cols-3">
          {CAPABILITIES.map((c, i) => (
            <Reveal key={c.code} delay={(i % 3) * 0.08}>
              <HairlineCard cropMarks className="h-full transition-colors hover:border-ink-faint">
                <p className="coord-label">{c.code}</p>
                <h3 className="font-display mt-2 text-lg font-semibold leading-snug text-ink md:mt-3">
                  {c.name}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
                  {c.body}
                </p>
              </HairlineCard>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 md:mt-10">
          <Link
            href="/solutions"
            className="font-mono text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-ink underline-offset-4 hover:text-accent-deep hover:underline"
          >
            Explore the full platform →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
