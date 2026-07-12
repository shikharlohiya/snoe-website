// "The blind spot" — copy on the Tier-N visibility gap beside
// the TierDiagram technical drawing.

import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import TierDiagram from "@/components/graphics/TierDiagram";

export default function BlindspotSection() {
  return (
    <section className="rule-b bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Observation 01 — The Blind Spot"
            title="Your map ends at Tier-1. Your risk doesn't."
            lede="Disruptions start three or four tiers upstream — where traditional systems can't see. SNOE charts the uncharted territory."
          />
        </Reveal>
        <Reveal delay={0.1} className="mt-8 md:mt-14">
          <div className="crop-marks rounded-2xl border border-hairline bg-paper-raised/60 p-3 sm:p-6">
            <TierDiagram />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
