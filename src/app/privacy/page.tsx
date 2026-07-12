// Privacy Policy — plain-language, matched to what the site
// actually collects (two lead forms + a localStorage flag).

import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How SNOE collects, uses, and protects information submitted through this website.",
};

const SECTIONS = [
  {
    title: "What we collect",
    body: [
      "When you submit the contact form we collect the details you provide: name, work email, company, role, chosen topic, and your message.",
      "When you register to download the whitepaper we collect your name, company, and company email address.",
      "We do not use advertising trackers or analytics cookies. The site stores a single flag in your browser's local storage after whitepaper registration so you aren't asked to register twice; it contains no personal information.",
    ],
  },
  {
    title: "How we use it",
    body: [
      "We use submitted information solely to respond to your inquiry, provide requested materials, and — where you have expressed interest — follow up about SNOE's products, pilots, or investment discussions.",
      "We do not sell or rent personal information to third parties.",
    ],
  },
  {
    title: "Processing and storage",
    body: [
      "Form submissions are transmitted via Web3Forms, a form-delivery service, which relays them to our team by email. Their handling of submission data is governed by their own privacy policy.",
      "We retain inquiry data only as long as needed for the purpose it was submitted, or as required by law.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "You may request access to, correction of, or deletion of the personal information you have submitted to us at any time by writing to the address below. We will respond within a reasonable period.",
    ],
  },
  {
    title: "Changes and contact",
    body: [
      "We may update this policy as the product and website evolve; the date below reflects the latest revision.",
      `Questions or requests: ${SITE.email}`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="bg-paper">
      <div className="mx-auto max-w-3xl px-6 py-14 md:py-28">
        <p className="coord-label">Document — Legal</p>
        <h1 className="font-display mt-4 text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.1] text-ink">
          Privacy Policy
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
