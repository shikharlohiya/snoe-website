// Contact — inquiry form + "field office" card.

import type { Metadata } from "next";

import Reveal from "@/components/ui/Reveal";
import HairlineCard from "@/components/ui/HairlineCard";
import PageHeader from "@/components/ui/PageHeader";
import ContactForm from "@/components/forms/ContactForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Request a SNOE briefing, discuss a pilot, or reach the team — product, partnership, and investor inquiries welcome.",
};

const PROCESS = [
  { step: "01", name: "Briefing", detail: "One hour on your network, exposure, and what SNOE would see." },
  { step: "02", name: "Scoping", detail: "Pick a constrained slice — suppliers, parts, regions — for a pilot." },
  { step: "03", name: "Pilot", detail: "Live data, real events, measured outcomes. Then decide." },
];

export default function ContactPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Transmission — Contact"
        title="Open a channel."
        lede="Product briefings, pilot inquiries, partnerships, or investor questions — send a message and we’ll route it to the right person."
      />

      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <Reveal>
              <ContactForm />
            </Reveal>

            <Reveal delay={0.1}>
              <HairlineCard cropMarks>
                <p className="coord-label">Field Office</p>
                <a
                  href={`mailto:${SITE.email}`}
                  className="mt-3 block break-all font-mono text-sm text-cobalt hover:underline"
                >
                  {SITE.email}
                </a>
                <p className="mt-2 text-sm text-ink-soft">
                  Response within two business days.
                </p>

                <div className="rule-t mt-6 pt-6">
                  <p className="coord-label mb-4">What to expect</p>
                  <ol className="space-y-4">
                    {PROCESS.map((p) => (
                      <li key={p.step} className="flex gap-4">
                        <span className="font-mono text-xs font-semibold text-accent-deep">
                          {p.step}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-ink">{p.name}</p>
                          <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">
                            {p.detail}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <p className="rule-t mt-6 pt-5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-faint">
                  CH-01 · SECURE · 40.7128°N 74.0060°W
                </p>
              </HairlineCard>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
