// Investors — market sizing, business model, targets, and
// competitive position. Figures from the product document.

import type { Metadata } from "next";

import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import PageHeader from "@/components/ui/PageHeader";
import CtaBand from "@/components/ui/CtaBand";
import MarketChart from "@/components/graphics/MarketChart";

export const metadata: Metadata = {
  title: "Investor Briefing",
  description:
    "The SNOE investment case: a ~$4B TAM inside the $183B supply-chain risk management market, an enterprise SaaS model with pilot-first motion, and a defensible multi-tier data moat.",
};

const NEAR_TERM = [
  ["MVP in production", "≤ 9 months"],
  ["Lighthouse customers", "2–3 signed pilots"],
  ["Pilot-to-paid conversion", "≥ 50%"],
  ["ERP integrations proven", "≥ 2 platforms"],
  ["ARR run-rate", "$7–11M (0.3–0.5% SAM)"],
];

const LONG_TERM = [
  ["SAM capture by year 10", "5–7%"],
  ["ARR at scale", "$110–155M"],
  ["Net revenue retention", "> 125%"],
  ["Tier-3/4 coverage", "Majority of accounts"],
  ["Regional presence", "≥ 3 major regions"],
];

// From the competitive analysis worksheet — ● strength, — weak/absent.
const COMPETITORS = ["SNOE", "Resilinc", "Everstream", "Interos", "Coupa"];
const COMPARISON: { capability: string; marks: boolean[] }[] = [
  { capability: "Geopolitical awareness (wars, sanctions, policy)", marks: [true, true, true, false, false] },
  { capability: "Tariff & trade-policy intelligence", marks: [true, false, true, false, false] },
  { capability: "Logistics route disruption (ports, canals, weather)", marks: [true, true, true, false, false] },
  { capability: "Signal → action closed loop", marks: [true, false, false, false, false] },
  { capability: "Optimization under volatility", marks: [true, false, false, false, true] },
  { capability: "Executive decision readiness", marks: [true, true, false, false, false] },
  { capability: "Vendor agnostic", marks: [true, true, true, true, false] },
];

const MODEL = [
  {
    step: "01 — PILOT",
    title: "Constrained scope, real data",
    body: "A paid pilot on a subset of suppliers, parts, and regions. Modular pricing lowers the barrier through conservative procurement cycles.",
  },
  {
    step: "02 — PRODUCTION",
    title: "Value-based enterprise SaaS",
    body: "Pricing aligned to supplier network size, geographic footprint, and agent usage — anchored to downtime avoided and expediting costs saved.",
  },
  {
    step: "03 — EXPAND",
    title: "Land and deepen",
    body: "Inventory, working capital, ESG, and network-redesign analytics expand ARR per customer; anonymized disruption data compounds the moat.",
  },
];

export default function InvestorsPage() {
  return (
    <main>
      {/* Header */}
      <PageHeader
        eyebrow="Investor Briefing"
        title="A category being forced into existence."
        lede="Geopolitical volatility is structural, not cyclical. Boards now own supply-chain resilience, and the systems of record can’t answer their questions. SNOE sits at the intersection of supply-chain risk management and decision intelligence — with an agentic, multi-tier approach incumbents don’t have."
      />

      {/* Market */}
      <section className="rule-b bg-bone">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="Survey — Market"
              title="The opportunity, drawn to scale."
            />
          </Reveal>
          <Reveal delay={0.1} className="mt-8 md:mt-12">
            <MarketChart />
          </Reveal>
        </div>
      </section>

      {/* Business model */}
      <section className="rule-b bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="Operating Model"
              title="Pilot-first enterprise SaaS."
              lede="B2B enterprise SaaS with value-based pricing. The start-up phase concentrates on product, data integration, and pilot readiness — building toward paid pilots with OEMs and Tier-1 suppliers."
            />
          </Reveal>
          <div className="mt-8 md:mt-12 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline md:grid-cols-3">
            {MODEL.map((m) => (
              <div key={m.step} className="bg-paper-raised p-7">
                <p className="coord-label">{m.step}</p>
                <h3 className="font-display mt-3 text-lg font-semibold text-ink">
                  {m.title}
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                  {m.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Targets */}
      <section className="rule-b bg-paper bg-graticule">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-28">
          <Reveal>
            <SectionHeading eyebrow="Flight Plan" title="Targets on record." />
          </Reveal>
          <div className="mt-8 md:mt-12 grid gap-10 md:grid-cols-2">
            {[
              { label: "NEAR TERM — 0–24 MONTHS", rows: NEAR_TERM },
              { label: "LONG TERM — 3–10 YEARS", rows: LONG_TERM },
            ].map((block) => (
              <Reveal key={block.label}>
                <div className="overflow-hidden rounded-xl border border-hairline bg-paper-raised">
                  <p className="coord-label border-b border-hairline px-5 py-3">
                    {block.label}
                  </p>
                  <dl>
                    {block.rows.map(([k, v]) => (
                      <div
                        key={k}
                        className="flex items-baseline justify-between gap-4 border-b border-hairline px-5 py-3.5 last:border-b-0"
                      >
                        <dt className="text-sm text-ink-soft">{k}</dt>
                        <dd className="text-right font-mono text-sm font-medium text-ink">
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Competitive position */}
      <section className="rule-b bg-bone">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="Reconnaissance"
              title="Where incumbents stop."
              lede="Visibility platforms alert; planning suites re-plan on a cadence. None close the loop from geopolitical signal to executed, multi-tier decision."
            />
          </Reveal>
          <Reveal delay={0.1} className="mt-8 md:mt-12">
            <div className="overflow-x-auto rounded-xl border border-hairline bg-paper-raised">
              <table className="w-full min-w-[680px] border-collapse text-left">
                <thead>
                  <tr className="border-b-2 border-ink">
                    <th className="px-5 py-4 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-ink-faint">
                      Capability
                    </th>
                    {COMPETITORS.map((c, i) => (
                      <th
                        key={c}
                        className={`px-4 py-4 text-center font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.15em] ${
                          i === 0 ? "bg-accent-wash/50 text-accent-deep" : "text-ink-faint"
                        }`}
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row) => (
                    <tr key={row.capability} className="border-b border-hairline last:border-b-0">
                      <td className="px-5 py-3.5 text-sm text-ink">{row.capability}</td>
                      {row.marks.map((mark, i) => (
                        <td
                          key={i}
                          className={`px-4 py-3.5 text-center font-mono text-sm ${
                            i === 0 ? "bg-accent-wash/50" : ""
                          }`}
                        >
                          {mark ? (
                            <span className={i === 0 ? "text-accent-deep" : "text-ink"} aria-label="strength">
                              ●
                            </span>
                          ) : (
                            <span className="text-ink-faint" aria-label="weak or absent">
                              —
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs italic text-ink-faint">
              From SNOE&apos;s competitive analysis; ● indicates assessed
              strength on the capability, — weak or indirect coverage.
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand
        eyebrow="Contact"
        title="Request the investor memo."
        body="Full market analysis, roadmap economics, and pilot pipeline — available under NDA."
        primaryLabel="Contact us"
        primaryHref="/contact"
        secondaryLabel="Read the whitepaper"
        secondaryHref="/whitepaper"
      />
    </main>
  );
}
