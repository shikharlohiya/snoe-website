// Shared button/link. Three variants:
//   solid   — signal-orange fill, the loud CTA
//   outline — subtle border on dark
//   link    — text + arrow, no chrome
// Renders a Next <Link> when `href` is set, else a <button>.

import Link from "next/link";
import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "solid" | "outline" | "link";
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg text-[0.9375rem] font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50";

const VARIANTS = {
  solid:
    "bg-accent px-6 py-3 text-[#12070A] shadow-[0_0_24px_rgba(255,107,44,0.25)] hover:bg-accent-deep hover:shadow-[0_0_32px_rgba(255,107,44,0.35)]",
  outline:
    "border border-hairline bg-white/[0.03] px-6 py-3 text-ink hover:border-ink-faint hover:bg-white/[0.06]",
  link: "text-cobalt underline-offset-4 hover:underline",
};

export default function Button({
  children,
  href,
  variant = "solid",
  className,
  ...rest
}: ButtonProps) {
  const classes = clsx(BASE, VARIANTS[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
        {variant === "link" && <span aria-hidden>→</span>}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
