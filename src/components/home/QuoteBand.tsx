// Mission pull-quote band — teal accent (Everstream style),
// white quote, mid-page.

import Reveal from "@/components/ui/Reveal";
import TealSection from "@/components/ui/TealSection";

export default function QuoteBand() {
  return (
    <TealSection>
      <div className="mx-auto max-w-4xl px-6 py-16 text-center md:py-28">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-white/90">
            <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-[#9BDCF5]" />
            Priority Directive
          </span>
          <blockquote className="font-display mt-8 text-[clamp(1.5rem,3.2vw,2.5rem)] font-semibold leading-[1.3] text-white">
            “Resilience in modern manufacturing depends on understanding
            interconnected supplier networks — not managing isolated chains.”
          </blockquote>
          <p className="mt-8 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-white/70">
            SNOE Vision Statement
          </p>
        </Reveal>
      </div>
    </TealSection>
  );
}
