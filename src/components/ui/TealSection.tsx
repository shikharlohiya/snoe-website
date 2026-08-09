// Teal-blue band (Everstream signature) — solid brand teal with
// a depth radial and a faint engineering grid. Reused by the
// page headers, the CTA band, and mid-page accent bands. Text
// inside should be white / white-with-opacity.

import clsx from "clsx";
import type { ReactNode } from "react";

export default function TealSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx("relative overflow-hidden bg-cobalt", className)}>
      {/* depth: darker-teal radial, top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 75% at 88% 0%, rgba(3,84,122,0.5), transparent 60%)",
        }}
      />
      {/* faint white grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, rgba(255,255,255,0.06) 0 1px, transparent 1px 56px), repeating-linear-gradient(to bottom, rgba(255,255,255,0.06) 0 1px, transparent 1px 56px)",
        }}
      />
      <div className="relative">{children}</div>
    </section>
  );
}
