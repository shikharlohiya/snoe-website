// Badge pill: mono uppercase label with a glowing dot —
// enterprise "live product" chrome.

import clsx from "clsx";

type StampProps = {
  children: string;
  /** "accent" = signal orange, "ink" = neutral. */
  tone?: "accent" | "ink";
  className?: string;
};

export default function Stamp({ children, tone = "accent", className }: StampProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.16em]",
        tone === "accent"
          ? "border-accent/40 bg-accent-wash text-accent-deep"
          : "border-hairline bg-white/[0.03] text-ink-soft",
        className
      )}
    >
      <span
        aria-hidden
        className={clsx(
          "inline-block h-1.5 w-1.5 rounded-full",
          tone === "accent" ? "bg-accent" : "bg-ink-faint"
        )}
      />
      {children}
    </span>
  );
}
