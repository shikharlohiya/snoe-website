// Site footer — hairline rule, four columns, mono coordinate
// flourish on the bottom line. Server component.

import Link from "next/link";
import { FOOTER_LINKS, SITE } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="rule-t bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {/* Wordmark + strapline */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-display text-lg font-semibold text-ink">SNOE</p>
            <p className="mt-2 max-w-[26ch] text-sm leading-relaxed text-ink-soft">
              {SITE.fullName}. Multi-tier supplier intelligence for industrial
              manufacturers.
            </p>
          </div>

          <div>
            <p className="coord-label">Pages</p>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_LINKS.pages.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-ink-soft transition-colors hover:text-ink"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="coord-label">Resources</p>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_LINKS.resources.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-ink-soft transition-colors hover:text-ink"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="coord-label">Contact</p>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-4 block break-all text-sm text-cobalt hover:underline"
            >
              {SITE.email}
            </a>
          </div>
        </div>

        <div className="rule-t mt-12 flex flex-col gap-3 pt-6 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p>© {year} SNOE. All rights reserved.</p>
            {FOOTER_LINKS.legal.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                {label}
              </Link>
            ))}
          </div>
          <p aria-hidden>REF SNOE-WEB-002 · 40.7128°N 74.0060°W</p>
        </div>
      </div>
    </footer>
  );
}
