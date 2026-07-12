// Mission pull-quote band with a priority stamp.

import Reveal from "@/components/ui/Reveal";
import Stamp from "@/components/ui/Stamp";

export default function QuoteBand() {
  return (
    <section className="rule-b bg-paper bg-graticule">
      <div className="mx-auto max-w-4xl px-6 py-16 text-center md:py-28">
        <Reveal>
          <Stamp>Priority Directive</Stamp>
          <blockquote className="font-display mt-8 text-[clamp(1.5rem,3.2vw,2.5rem)] font-medium leading-[1.3] text-ink">
            “Resilience in modern manufacturing depends on understanding
            interconnected supplier networks — not managing isolated chains.”
          </blockquote>
          <p className="coord-label mt-8">SNOE Vision Statement</p>
        </Reveal>
      </div>
    </section>
  );
}
