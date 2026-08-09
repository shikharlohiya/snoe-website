// Shared bottom CTA band — teal-blue field (Everstream style)
// with white headline and primary + secondary actions.

import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import TealSection from "@/components/ui/TealSection";

type CtaBandProps = {
  eyebrow?: string;
  title?: string;
  body?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export default function CtaBand({
  eyebrow = "NEXT STEP",
  title = "Request a briefing.",
  body = "Walk through your supplier network with our team — what SNOE would see, simulate, and recommend on day one.",
  primaryLabel = "Request a briefing",
  primaryHref = "/contact",
  secondaryLabel = "Read the whitepaper",
  secondaryHref = "/whitepaper",
}: CtaBandProps) {
  return (
    <TealSection>
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-28">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-white/70">
            {eyebrow}
          </p>
          <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.1] text-white">
            {title}
          </h2>
          <p className="mt-5 max-w-[58ch] text-[1.0625rem] leading-[1.65] text-white/85">
            {body}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button href={primaryHref}>{primaryLabel}</Button>
            <Button href={secondaryHref} variant="outlineLight">
              {secondaryLabel}
            </Button>
          </div>
        </Reveal>
      </div>
    </TealSection>
  );
}
