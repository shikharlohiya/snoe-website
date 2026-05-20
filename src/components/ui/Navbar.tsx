"use client";

// ============================================================
// Navbar — Fixed top navigation bar.
//
// Starts fully transparent, adds a frosted-glass background
// once the user scrolls past 60px (useScrolled hook).
// Contains the SNOE logo, nav links, and a "Get Access" CTA.
// ============================================================

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  // Track whether user has scrolled — controls the backdrop blur
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const NAV_LINKS = [
    { label: "Problem",     href: "#cost"         },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Simulate",    href: "#demo"          },
    { label: "Features",    href: "#features"      },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: "0 2rem",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        // Frosted glass only once scrolled
        background: scrolled ? "rgba(5,8,16,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "background 0.3s, backdrop-filter 0.3s, border-color 0.3s",
      }}
    >
      {/* Logo */}
      <a
        href="#hero"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          textDecoration: "none",
        }}
      >
        {/* Animated node icon */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: "2px solid var(--cyan)",
            background: "rgba(0,229,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.7rem",
            color: "var(--cyan)",
            boxShadow: "0 0 12px rgba(0,229,255,0.3)",
          }}
        >
          ⬡
        </div>
        <span
          style={{
            fontWeight: 700,
            fontSize: "1rem",
            letterSpacing: "0.12em",
            color: "var(--text-primary)",
            fontFamily: "var(--font-sans)",
          }}
        >
          SNOE
        </span>
      </a>

      {/* Nav links — hidden on mobile */}
      <nav
        style={{ display: "flex", gap: "2rem" }}
        className="nav-links"
      >
        {NAV_LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            style={{
              fontSize: "0.85rem",
              fontWeight: 500,
              color: "var(--text-secondary)",
              textDecoration: "none",
              letterSpacing: "0.02em",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)";
            }}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* CTA button */}
      <a
        href="#contact"
        style={{
          padding: "0.5rem 1.2rem",
          borderRadius: 6,
          background: "transparent",
          border: "1px solid rgba(0,229,255,0.4)",
          color: "var(--cyan)",
          fontSize: "0.82rem",
          fontWeight: 600,
          textDecoration: "none",
          letterSpacing: "0.03em",
          transition: "background 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,229,255,0.08)";
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 20px rgba(0,229,255,0.2)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
        }}
      >
        Get Access
      </a>

      {/* Hide nav links on mobile */}
      <style>{`
        @media (max-width: 640px) {
          .nav-links { display: none !important; }
        }
      `}</style>
    </motion.header>
  );
}
