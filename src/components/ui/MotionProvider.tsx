"use client";

// Site-wide motion policy. reducedMotion="user" makes framer
// automatically disable transform/layout animations for users
// with prefers-reduced-motion, while keeping opacity fades —
// WITHOUT branching the render tree (branching on
// useReducedMotion() during render causes hydration
// mismatches, since the server can't know the preference).
// Purely decorative infinite animations are hidden via the
// `motion-safe-only` CSS class instead.

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
