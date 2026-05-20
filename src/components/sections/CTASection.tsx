"use client";

// ============================================================
// CTA Section — "Stop Reacting. Start Anticipating."
//
// Full-width dark section with:
//   • A large pulsing network graph in the background (CSS only,
//     no extra Three.js instance needed — just SVG).
//   • The main headline + sub-copy.
//   • Two CTAs: primary (request access) and secondary (view docs).
//   • A row of social-proof metrics pulled from the product doc.
// ============================================================

import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Globe } from "lucide-react";

// Trust metrics shown below the CTA buttons
const TRUST_METRICS = [
  { icon: <Zap size={14} />,    value: "< 30 min", label: "Detection to alert" },
  { icon: <Globe size={14} />,  value: "Tier-N",   label: "Full chain depth"   },
  { icon: <Shield size={14} />, value: "98%",       label: "Audit compliance"   },
];

export default function CTASection() {
  return (
    <section
      id="contact"
      style={{
        position: "relative",
        padding: "clamp(5rem, 12vw, 10rem) clamp(1rem, 4vw, 2rem)",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Background: large faint network SVG — static, no perf cost */}
      <svg
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.04,
          pointerEvents: "none",
        }}
        viewBox="0 0 800 400"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Rough network of lines — just decorative */}
        {[
          [100,200,400,100],[400,100,700,200],[700,200,600,350],
          [600,350,300,350],[300,350,100,200],[400,100,300,350],
          [400,100,600,350],[100,200,200,50],[700,200,750,80],
          [200,50,400,100],[750,80,700,200],[300,350,150,380],
          [600,350,680,390],[150,380,100,200],[680,390,700,200],
        ].map(([x1,y1,x2,y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#00e5ff" strokeWidth="1" />
        ))}
        {/* Node circles */}
        {[
          [100,200],[400,100],[700,200],[600,350],[300,350],
          [200,50],[750,80],[150,380],[680,390],
        ].map(([cx,cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={i === 1 ? 8 : 5}
            fill="#00e5ff" />
        ))}
      </svg>

      {/* Radial gradient for depth */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(0,229,255,0.06) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 700,
          margin: "0 auto",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        {/* Label */}
        <motion.span
          className="text-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Ready to See Your Full Network?
        </motion.span>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
          }}
        >
          Stop Reacting.{" "}
          <span
            style={{
              color: "var(--cyan)",
              textShadow: "0 0 40px rgba(0,229,255,0.4)",
            }}
          >
            Start Anticipating.
          </span>
        </motion.h2>

        {/* Sub-copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          style={{
            fontSize: "1rem",
            color: "var(--text-secondary)",
            lineHeight: 1.8,
            maxWidth: 540,
          }}
        >
          Join manufacturers who have moved from reactive firefighting to proactive,
          self-optimizing supplier network governance. Pilot-first. ERP-agnostic.
          Production-ready in 90 days.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}
        >
          {/* Primary */}
          <a
            href="mailto:snoetech@gmail.com"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "1rem 2rem",
              borderRadius: 8,
              background: "var(--cyan)",
              color: "#050810",
              fontWeight: 700,
              fontSize: "0.95rem",
              textDecoration: "none",
              boxShadow: "0 0 40px rgba(0,229,255,0.4)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 60px rgba(0,229,255,0.6)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 40px rgba(0,229,255,0.4)";
            }}
          >
            Request Early Access
            <ArrowRight size={18} />
          </a>

          {/* Secondary */}
          <a
            href="#how-it-works"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "1rem 2rem",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.12)",
              color: "var(--text-primary)",
              fontWeight: 600,
              fontSize: "0.95rem",
              textDecoration: "none",
              background: "rgba(255,255,255,0.03)",
              transition: "border-color 0.2s, background 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,229,255,0.35)";
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,229,255,0.04)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.12)";
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.03)";
            }}
          >
            How It Works
          </a>
        </motion.div>

        {/* Trust metrics — wraps to multiple rows on small screens */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{
            display: "flex",
            gap: "clamp(1.25rem, 5vw, 2.5rem)",
            flexWrap: "wrap",
            rowGap: "1rem",
            justifyContent: "center",
            paddingTop: "1.5rem",
            marginTop: "0.5rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            width: "100%",
          }}
        >
          {TRUST_METRICS.map((m) => (
            <div
              key={m.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ color: "var(--cyan)" }}>{m.icon}</span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                {m.value}
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {m.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
