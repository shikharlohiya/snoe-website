// Standard inner-page header — a teal band (Everstream style)
// with a mono eyebrow, white headline, and optional lede.

import TealSection from "@/components/ui/TealSection";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  lede?: string;
};

export default function PageHeader({ eyebrow, title, lede }: PageHeaderProps) {
  return (
    <TealSection>
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-white/70">
          {eyebrow}
        </p>
        <h1 className="font-display mt-5 max-w-[22ch] text-[clamp(2.25rem,4.5vw,3.75rem)] font-bold leading-[1.08] text-white">
          {title}
        </h1>
        {lede && (
          <p className="mt-5 max-w-[58ch] text-[1.0625rem] leading-[1.65] text-white/85">
            {lede}
          </p>
        )}
      </div>
    </TealSection>
  );
}
