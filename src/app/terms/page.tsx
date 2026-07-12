// Terms of Use — standard website terms, kept honest for a
// pre-launch product site.

import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms governing use of the SNOE website and its materials.",
};

const SECTIONS = [
  {
    title: "Use of this site",
    body: [
      "This website presents the Supplier Network Optimization Engine (SNOE) and makes materials such as the whitepaper available for evaluation. You may browse the site and use its materials for internal, non-commercial evaluation purposes.",
    ],
  },
  {
    title: "No offer or advice",
    body: [
      "Content on this site — including market estimates, roadmap targets, and the investor briefing — is provided for general information only. It does not constitute an offer to sell securities, investment advice, or a binding commitment regarding product capabilities or timelines. Forward-looking statements reflect current plans and are subject to change.",
    ],
  },
  {
    title: "Illustrative data",
    body: [
      "Network maps, simulations, and decision traces shown on this site use anonymized, illustrative data. They demonstrate product concepts and do not depict any real company's supply chain.",
    ],
  },
  {
    title: "Intellectual property",
    body: [
      "The SNOE name, site design, text, graphics, and the whitepaper are the property of SNOE. You may share the whitepaper internally within your organization; republication or commercial redistribution requires our written permission.",
    ],
  },
  {
    title: "Disclaimer and liability",
    body: [
      "The site and its materials are provided “as is” without warranties of any kind. To the fullest extent permitted by law, SNOE is not liable for damages arising from use of, or reliance on, this website.",
    ],
  },
  {
    title: "Contact",
    body: [`Questions about these terms: ${SITE.email}`],
  },
];

export default function TermsPage() {
  return (
    <main className="bg-paper">
      <div className="mx-auto max-w-3xl px-6 py-14 md:py-28">
        <p className="coord-label">Document — Legal</p>
        <h1 className="font-display mt-4 text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.1] text-ink">
          Terms of Use
        </h1>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-ink-faint">
          Last updated: July 2026
        </p>

        <div className="mt-8 md:mt-12 space-y-10">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="font-display text-xl font-semibold text-ink">{s.title}</h2>
              {s.body.map((p) => (
                <p key={p} className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
