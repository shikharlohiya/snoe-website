"use client";

// ============================================================
// CustomCursor — Replaces the browser default cursor.
//
// Renders two elements:
//   1. A small "dot" that snaps exactly to the mouse position.
//   2. A larger "ring" that follows with a spring lag (smooth).
//
// On hover over links/buttons the ring expands and the dot
// disappears — creates the magnetic "hover" feel.
// ============================================================

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  // Refs to the two cursor DOM elements so we can move them
  // directly via style.transform (avoids React re-renders on
  // every mouse move, which would tank performance).
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Current mouse coordinates
    let mouseX = 0;
    let mouseY = 0;

    // Ring "lagged" position — interpolates toward mouse each frame
    let ringX = 0;
    let ringY = 0;

    // Whether the cursor is hovering a clickable element
    let isHovering = false;

    // Lerp speed: 0 = never moves, 1 = snaps instantly.
    // 0.12 gives a smooth follow-through lag.
    const LERP = 0.12;

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    function onMouseOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, textarea")) {
        isHovering = true;
      }
    }

    function onMouseOut(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, textarea")) {
        isHovering = false;
      }
    }

    // Animation loop — runs every frame via requestAnimationFrame.
    // Moves dot instantly, ring with lerp, and toggles hover classes.
    function tick() {
      const dot  = dotRef.current;
      const ring = ringRef.current;

      if (dot && ring) {
        // Snap dot to exact cursor position
        dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;

        // Lerp the ring position toward the mouse each frame
        ringX += (mouseX - ringX) * LERP;
        ringY += (mouseY - ringY) * LERP;
        ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;

        // Toggle hover state classes
        if (isHovering) {
          ring.classList.add("cursor-hover");
          dot.classList.add("cursor-hover");
        } else {
          ring.classList.remove("cursor-hover");
          dot.classList.remove("cursor-hover");
        }
      }

      requestAnimationFrame(tick);
    }

    // Register listeners and kick off the animation loop
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("mouseout",  onMouseOut);
    const rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mouseout",  onMouseOut);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Small dot — snaps exactly to mouse, hides on hover */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "var(--cyan)",
          pointerEvents: "none",
          zIndex: 99999,
          willChange: "transform",
          transition: "opacity 0.2s, width 0.2s, height 0.2s",
        }}
        className="cursor-dot"
      />

      {/* Larger ring — lags behind mouse, grows on hover */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid rgba(0, 229, 255, 0.5)",
          pointerEvents: "none",
          zIndex: 99998,
          willChange: "transform",
          transition: "width 0.3s, height 0.3s, border-color 0.3s, background 0.3s",
        }}
        className="cursor-ring"
      />

      {/* Hover state: subtle dot grow, ring fades out so it doesn't fight.
          Premium-site style — like Linear / Vercel: minimal, no jumpy ring. */}
      <style>{`
        .cursor-dot.cursor-hover  {
          width: 14px;
          height: 14px;
          margin-left: -3px;
          margin-top:  -3px;
          background: var(--cyan);
          box-shadow: 0 0 14px rgba(0,229,255,0.7);
        }
        .cursor-ring.cursor-hover {
          opacity: 0;
        }
      `}</style>
    </>
  );
}
