// Whitepaper — dossier table of contents + gated download.

import type { Metadata } from "next";

import Reveal from "@/components/ui/Reveal";
import PageHeader from "@/components/ui/PageHeader";
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
      <PageHeader
        eyebrow="Document SNOE-WP-001"
        title="The case for network-aware supplier intelligence."
        lede="A field briefing for supply chain, operations, and finance leaders: why multi-tier supplier networks fail silently, and how an agentic intelligence layer turns geopolitical noise into governed decisions."
      />

      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
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
