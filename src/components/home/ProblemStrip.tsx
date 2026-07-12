// Situation-report band: the stakes, in four counted stats.
// Figures sourced from the SNOE product development document.

import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Stat from "@/components/ui/Stat";

const STATS = [
  {
    value: 1,
    label: "tier visible to traditional ERP systems",
  },
  {
    value: 4,
    suffix: "+",
    label: "tiers upstream, where shocks actually start",
  },
  {
    value: 183,
    prefix: "$",
    suffix: "B",
    label: "supply-chain risk management market, 2025",
  },
  {
    value: 30,
    prefix: "<",
    suffix: " min",
    label: "SNOE detection target — not days or weeks",
  },
];

export default function ProblemStrip() {
  return (
    <section className="rule-b bg-bone">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="Situation Report"
            title="Built for a world where supply chains break weekly."
            lede="Sanctions, tariffs, and port congestion now decide production continuity — and most systems find out after the impact lands."
          />
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 md:mt-14 md:gap-x-8 md:gap-y-12 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <Stat {...s} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
