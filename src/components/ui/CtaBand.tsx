// Shared bottom CTA band — bone field with contour lines,
// serif headline, primary + secondary actions.

import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

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
    <section className="rule-t bg-bone bg-contours">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-32">
        <Reveal className="max-w-2xl">
          <p className="coord-label">{eyebrow}</p>
          <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.1] text-ink">
            {title}
          </h2>
          <p className="mt-5 max-w-[58ch] text-[1.0625rem] leading-[1.65] text-ink-soft">
            {body}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button href={primaryHref}>{primaryLabel}</Button>
            <Button href={secondaryHref} variant="outline">
              {secondaryLabel}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
