"use client";

// Stat tile: mono number that counts up when scrolled into
// view, serif-ish caption beneath. Prefix/suffix stay static
// ("$", "B", "%", "+") — only the number animates.

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";

type StatProps = {
  value: number;
  /** Decimal places shown while counting. */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

export default function Stat({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  label,
}: StatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();

  const count = useMotionValue(0);
  const display = useTransform(count, (v) => v.toFixed(decimals));

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, { duration: 1.4, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, reduceMotion, count, value]);

  return (
    <div ref={ref}>
      <p className="font-mono text-[clamp(1.9rem,3.5vw,2.75rem)] font-medium tracking-tight text-ink">
        {prefix}
        <motion.span>{display}</motion.span>
        {suffix}
      </p>
      <p className="mt-2 max-w-[28ch] text-[0.9375rem] leading-snug text-ink-soft">
        {label}
      </p>
    </div>
  );
}
