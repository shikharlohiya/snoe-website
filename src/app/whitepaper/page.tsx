// Whitepaper — dossier table of contents + gated download.

import type { Metadata } from "next";

import Reveal from "@/components/ui/Reveal";
import WhitepaperGate from "@/components/forms/WhitepaperGate";

export const metadata: Metadata = {
  title: "Whitepaper — Multi-Tier Supply Chain Intelligence",
  description:
    "The SNOE whitepaper: why supplier networks fail silently, the agentic architecture that fixes it, market analysis, and the 24-month roadmap. Free download with company-email registration.",
};

const CHAPTERS = [
  { no: "01", title: "Executive Summary", page: "02" },
  { no: "02", title: "The Problem — Networks That Fail Silently", page: "03" },
  { no: "03", title: "The SNOE Approach — Sense, Reason, Simulate, Act", page: "04" },
  { no: "04", title: "Architecture & the Twelve Agents", page: "05" },
  { no: "05", title: "Market — TAM, SAM, and Adjacent Validation", page: "07" },
  { no: "06", title: "Roadmap — 0 to 24 Months", page: "08" },
  { no: "07", title: "Business Model & Engagement", page: "09" },
];

export default function WhitepaperPage() {
  return (
    <main>
      <section className="bg-paper bg-graticule">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-28">
          <Reveal>
            <p className="coord-label">Document SNOE-WP-001</p>
            <h1 className="font-display mt-5 max-w-[22ch] text-[clamp(2.25rem,4.5vw,3.75rem)] font-medium leading-[1.08] text-ink">
              The case for network-aware supplier intelligence.
            </h1>
            <p className="mt-6 max-w-[60ch] text-[1.0625rem] leading-[1.65] text-ink-soft">
              A field briefing for supply chain, operations, and finance
              leaders: why multi-tier supplier networks fail silently, and how
              an agentic intelligence layer turns geopolitical noise into
              governed decisions.
            </p>
          </Reveal>

          <div className="mt-8 md:mt-14 grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            {/* Dossier contents */}
            <Reveal>
              <div className="overflow-hidden rounded-xl border border-hairline bg-paper-raised">
                <p className="coord-label border-b border-hairline px-6 py-4">
                  Contents
                </p>
                <ol>
                  {CHAPTERS.map((ch) => (
                    <li
                      key={ch.no}
                      className="flex items-baseline gap-5 border-b border-hairline px-6 py-4 last:border-b-0"
                    >
                      <span className="font-mono text-xs font-medium text-accent-deep">
                        {ch.no}
                      </span>
                      <span className="font-display flex-1 text-[1.0625rem] font-medium text-ink">
                        {ch.title}
                      </span>
                      <span className="font-mono text-xs text-ink-faint">
                        p.{ch.page}
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="px-6 py-4 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-faint">
                  9 pages · A4 · Agent roster & market analysis included
                </p>
              </div>
            </Reveal>

            {/* Registration gate */}
            <Reveal delay={0.1}>
              <WhitepaperGate />
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
