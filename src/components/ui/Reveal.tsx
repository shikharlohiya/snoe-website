"use client";

// Subtle scroll-into-view reveal: fade + 12px rise, once.
// Wrap any block that should ease in as the reader reaches it.
// Reduced-motion users get the fade without the rise, handled
// globally by MotionConfig — never branch the tree on it.

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger offset in seconds. */
  delay?: number;
  className?: string;
};

export default function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
