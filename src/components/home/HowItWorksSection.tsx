// The agentic loop — LoopDiagram beside step-by-step copy.
// The diagram is desktop-only; on phones the four steps carry
// the story on their own (less scroll, no shrunken SVG).

import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import LoopDiagram from "@/components/graphics/LoopDiagram";

const STEPS = [
  {
    id: "01",
    name: "Sense",
    body: "Agents ingest enterprise data and external intelligence — sanctions, tariffs, ports, weather.",
  },
  {
    id: "02",
    name: "Reason",
    body: "Events map onto the knowledge graph, tracing impact to the exact plants at risk.",
  },
  {
    id: "03",
    name: "Simulate",
    body: "Scenarios are stress-tested against cost, lead time, and service before anything moves.",
  },
  {
    id: "04",
    name: "Act",
    body: "Explainable recommendations — or governed execution — with humans in the loop.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="rule-b bg-bone">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Method of Operation"
            title="A closed loop, not a dashboard."
            lede="Visibility tools stop at alerts. SNOE runs a continuous cycle from signal to governed decision."
          />
        </Reveal>

        <div className="mt-8 grid items-center gap-8 md:mt-14 md:gap-12 lg:grid-cols-2">
          <Reveal className="hidden lg:block">
            <LoopDiagram />
          </Reveal>

          <div className="space-y-6 md:space-y-8">
            {STEPS.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.08}>
                <div className="flex gap-5">
                  <span className="font-mono text-sm font-medium text-accent-deep">
                    {s.id}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink">
                      {s.name}
                    </h3>
                    <p className="mt-1.5 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-soft">
                      {s.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
