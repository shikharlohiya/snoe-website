"use client";

// ============================================================
// Footer — Minimal dark footer with nav links and tagline.
// Stays out of the way — the CTA section does the heavy lifting.
// ============================================================

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "3rem 2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
      }}
    >
      {/* Logo + tagline */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: "1.1rem",
            letterSpacing: "0.1em",
            color: "var(--cyan)",
            fontFamily: "var(--font-sans)",
            marginBottom: "0.4rem",
          }}
        >
          SNOE
        </div>
        <div
          style={{
            fontSize: "0.72rem",
            color: "var(--text-muted)",
            letterSpacing: "0.1em",
            fontFamily: "var(--font-mono)",
          }}
        >
          Supplier Network Optimization Engine
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
        {[
          { label: "Problem",  href: "#cost"         },
          { label: "Blindspot", href: "#blindspot"   },
          { label: "How It Works", href: "#how-it-works" },
          { label: "Simulate",  href: "#demo"         },
          { label: "Features",  href: "#features"     },
          { label: "Contact",   href: "#contact"      },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            style={{
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--cyan)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)";
            }}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* Copyright */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          color: "var(--text-muted)",
          letterSpacing: "0.1em",
          textAlign: "center",
        }}
      >
        © {year} SNOE · Agentic AI Supply Chain Intelligence · Internal POC
      </div>
    </footer>
  );
}
