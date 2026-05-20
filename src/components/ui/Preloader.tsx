"use client";

// ============================================================
// Preloader — shown for ~2.5s on first load.
//
// Visual: The SNOE wordmark assembles from individual letter
// tiles that fade+slide in sequentially, then the entire
// preloader fades out and calls onComplete() so the main
// page can render.
// ============================================================

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  /** Called once the exit animation finishes — triggers page reveal */
  onComplete: () => void;
}

// Letters that animate in one-by-one to spell "SNOE"
const LETTERS = ["S", "N", "O", "E"];

export default function Preloader({ onComplete }: PreloaderProps) {
  // Controls whether the preloader is still visible
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // After 2.4 s start exit — gives letters time to appear + hold
    const timer = setTimeout(() => setVisible(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          key="preloader"
          // Fade the whole overlay out when exiting
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99990,
            backgroundColor: "var(--bg-primary)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
          }}
        >
          {/* ── Letter tiles ── */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {LETTERS.map((letter, i) => (
              <motion.div
                key={letter}
                // Each letter starts invisible and 30px below, then rises in
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                // Stagger: each letter waits 120ms more than the previous
                transition={{ delay: i * 0.12, duration: 0.5, ease: "easeOut" }}
                style={{
                  width: 72,
                  height: 72,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(0,229,255,0.25)",
                  borderRadius: 8,
                  background: "rgba(0,229,255,0.05)",
                  fontSize: "2.2rem",
                  fontWeight: 700,
                  color: "var(--cyan)",
                  letterSpacing: "0.05em",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {letter}
              </motion.div>
            ))}
          </div>

          {/* ── Sub-label that fades in after the letters ── */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Supplier Network Optimization Engine
          </motion.p>

          {/* ── Loading bar that fills across the bottom ── */}
          <motion.div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: 2,
              background: "linear-gradient(90deg, var(--cyan), var(--violet))",
              originX: 0,
            }}
            initial={{ scaleX: 0, width: "100%" }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
