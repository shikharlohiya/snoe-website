// Standard section opener: mono coordinate eyebrow, serif
// headline, optional one-paragraph lede.

import clsx from "clsx";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  lede?: string;
  /** Center the block (default left-aligned). */
  centered?: boolean;
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  lede,
  centered = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={clsx(centered && "text-center", className)}>
      <p className="coord-label">{eyebrow}</p>
      <h2 className="font-display mt-4 text-[clamp(1.6rem,3vw,2.5rem)] font-medium leading-[1.15] text-ink">
        {title}
      </h2>
      {lede && (
        <p
          className={clsx(
            "mt-5 max-w-[62ch] text-[1.0625rem] leading-[1.65] text-ink-soft",
            centered && "mx-auto"
          )}
        >
          {lede}
        </p>
      )}
    </div>
  );
}
