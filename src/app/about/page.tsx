// About — mission, why now, roadmap, operating principles.

import type { Metadata } from "next";

import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import HairlineCard from "@/components/ui/HairlineCard";
import Stamp from "@/components/ui/Stamp";
import PageHeader from "@/components/ui/PageHeader";
import CtaBand from "@/components/ui/CtaBand";
import RoadmapTimeline from "@/components/graphics/RoadmapTimeline";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why SNOE exists: the mission to make supplier networks resilient, the conditions that demand it, and the 24-month roadmap from executive visibility to autonomous optimization.",
};

const OBSERVATIONS = [
  {
    id: "OBSERVATION 01",
    title: "Geopolitics moved onto the factory floor.",
    body: "World events now decide supplier reliability — yet they appear nowhere in an ERP.",
  },
  {
    id: "OBSERVATION 02",
    title: "Tariffs rewrite sourcing math overnight.",
    body: "Most organizations discover the impact in next quarter's variance report — after the window to act has closed.",
  },
  {
    id: "OBSERVATION 03",
    title: "The chain is actually a network.",
    body: "Tier-1-focused planning is structurally blind to where disruptions start — three or four tiers upstream.",
  },
];

const PRINCIPLES = [
  {
    code: "PR-01",
    name: "Pilot-first",
    body: "Modular, pilot-first engagements over enterprise big-bang deployments. Prove value on a constrained scope, then expand.",
  },
  {
    code: "PR-02",
    name: "Overlay, not rip-and-replace",
    body: "ERP-agnostic by design. SNOE connects through APIs and event streams and coexists with the systems you already run.",
  },
  {
    code: "PR-03",
    name: "Explainability before autonomy",
    body: "Agents earn autonomy gradually — every recommendation is explainable and auditable first, automated only under explicit governance.",
  },
];

export default function AboutPage() {
  return (
    <main>
      {/* Mission */}
      <PageHeader
        eyebrow="Mission Brief — About SNOE"
        title="Supplier networks that anticipate, instead of react."
        lede="SNOE gives manufacturers faster, more resilient supplier decisions — explainable AI intelligence for the people who own continuity."
      />

      {/* Why now */}
      <section className="rule-b bg-bone">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-28">
          <Reveal>
            <SectionHeading eyebrow="Field Notes" title="Why now." />
          </Reveal>
          <div className="mt-8 md:mt-12 grid gap-10 md:grid-cols-3">
            {OBSERVATIONS.map((o, i) => (
              <Reveal key={o.id} delay={i * 0.08}>
                <p className="coord-label">{o.id}</p>
                <h3 className="font-display mt-3 text-lg font-semibold leading-snug text-ink">
                  {o.title}
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                  {o.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Vision pull quote */}
      <section className="rule-b bg-paper">
        <div className="mx-auto max-w-4xl px-6 py-14 text-center md:py-24">
          <Reveal>
            <Stamp tone="ink">The Vision</Stamp>
            <blockquote className="font-display mt-7 text-[clamp(1.4rem,2.8vw,2.1rem)] font-medium leading-[1.35] text-ink">
              An autonomous, network-centric intelligence layer that lets
              industrial manufacturers anticipate geopolitical shocks, shifting
              trade regimes, and supplier instability — across every tier of
              their global ecosystems.
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* Roadmap */}
      <section className="rule-b bg-paper bg-graticule">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-32">
          <Reveal>
            <SectionHeading
              eyebrow="Expedition Plan — 0 to 24 Months"
              title="The roadmap."
              lede="Four phases, each de-risking the next: from data foundations and executive visibility to fully governed autonomous optimization."
              centered
            />
          </Reveal>
          <div className="mt-10 md:mt-16">
            <RoadmapTimeline />
          </div>
        </div>
      </section>

      {/* Operating principles */}
      <section className="rule-b bg-bone">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="Standing Orders"
              title="How we operate."
            />
          </Reveal>
          <div className="mt-8 md:mt-12 grid gap-6 md:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.code} delay={i * 0.08}>
                <HairlineCard cropMarks className="h-full">
                  <p className="coord-label">{p.code}</p>
                  <h3 className="font-display mt-3 text-lg font-semibold text-ink">
                    {p.name}
                  </h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                    {p.body}
                  </p>
                </HairlineCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
