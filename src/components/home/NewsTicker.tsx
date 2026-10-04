"use client";

// ============================================================
// NewsTicker — live geopolitical / supply-chain news, auto-
// scrolling vertically. Sits on the right of the teal hero
// band. Pulls from /api/news (cached GDELT).
//
// Click a headline → an inline detail panel opens and the
// auto-scroll PAUSES; close it and scrolling resumes. Pauses
// on hover too. The detail's "Open full article" links out.
// ============================================================

import { useEffect, useState } from "react";

type Impact = "high" | "medium" | "low";
type NewsItem = {
  title: string;
  url: string;
  source: string;
  country: string;
  impact: Impact;
  date: string;
};

// Shown immediately while the live feed loads.
const SEED: NewsItem[] = [
  { title: "New export controls tighten on advanced semiconductor equipment", url: "", source: "reuters.com", country: "United States", impact: "high", date: "" },
  { title: "Red Sea shipping disruptions push carriers to reroute around Africa", url: "", source: "ft.com", country: "Egypt", impact: "high", date: "" },
  { title: "Fresh tariffs announced on imported EV components and rare earths", url: "", source: "cnbc.com", country: "China", impact: "high", date: "" },
  { title: "Port congestion worsens at major transshipment hubs amid labor action", url: "", source: "supplychaindive.com", country: "Singapore", impact: "medium", date: "" },
  { title: "Taiwan Strait tensions raise concern over chip supply continuity", url: "", source: "bloomberg.com", country: "Taiwan", impact: "high", date: "" },
  { title: "Copper strike risk builds at major South American mining operations", url: "", source: "mining.com", country: "Chile", impact: "medium", date: "" },
];

const DOT: Record<Impact, string> = {
  high: "bg-[#FF6B4A]",
  medium: "bg-[#FFC24B]",
  low: "bg-[#79D6A6]",
};

const IMPACT_LABEL: Record<Impact, string> = {
  high: "High risk",
  medium: "Medium risk",
  low: "Low risk",
};

/** GDELT seendate (YYYYMMDDThhmmssZ) → short relative time. */
function ago(seendate: string): string {
  if (!/^\d{8}T\d{6}Z$/.test(seendate)) return "";
  const y = +seendate.slice(0, 4);
  const mo = +seendate.slice(4, 6) - 1;
  const d = +seendate.slice(6, 8);
  const h = +seendate.slice(9, 11);
  const mi = +seendate.slice(11, 13);
  const s = +seendate.slice(13, 15);
  const diff = Date.now() - Date.UTC(y, mo, d, h, mi, s);
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NewsTicker() {
  const [items, setItems] = useState<NewsItem[]>(SEED);
  const [selected, setSelected] = useState<NewsItem | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/news")
      .then((r) => r.json())
      .then((d: { items?: NewsItem[] }) => {
        if (active && d.items && d.items.length) setItems(d.items);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Duplicate once for the seamless -50% loop.
  const loop = [...items, ...items];
  const duration = `${Math.max(28, items.length * 3)}s`;

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/15 bg-white/[0.07] backdrop-blur-sm">
      {/* header */}
      <div className="flex items-center justify-between border-b border-white/15 px-4 py-3">
        <span className="flex items-center gap-2 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF6B4A] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF6B4A]" />
          </span>
          Live Intelligence
        </span>
        <span className="font-mono text-[0.625rem] uppercase tracking-wider text-white/55">
          Global Feed
        </span>
      </div>

      {/* list + detail overlay */}
      <div className="relative h-[320px] lg:h-[420px]">
        {/* scrolling list */}
        <div
          className="h-full overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent, black 7%, black 93%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 7%, black 93%, transparent)",
          }}
        >
          <ul
            className="animate-scroll-up"
            style={{
              ["--scroll-dur" as string]: duration,
              animationPlayState: selected ? "paused" : "running",
            }}
          >
            {loop.map((n, i) => {
              const when = ago(n.date);
              return (
                <li key={i} className="border-b border-white/10 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setSelected(n)}
                    className="flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-white/10"
                  >
                    <span className={`mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full ${DOT[n.impact]}`} />
                    <span className="min-w-0">
                      <span className="block text-[0.8125rem] font-medium leading-snug text-white">
                        {n.title}
                      </span>
                      <span className="mt-1 block truncate font-mono text-[0.625rem] uppercase tracking-wider text-white/55">
                        {n.source || n.country || "Global"}
                        {when ? ` · ${when}` : ""}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* detail panel (opens on click; scroll is paused while open) */}
        {selected && (
          <div className="absolute inset-0 z-10 flex flex-col bg-[#073952]/97 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-white">
                <span className={`inline-block h-2 w-2 rounded-full ${DOT[selected.impact]}`} />
                {IMPACT_LABEL[selected.impact]}
              </span>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close article detail"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              >
                <span aria-hidden className="text-lg leading-none">×</span>
              </button>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto">
              <h3 className="font-display text-[1.0625rem] font-semibold leading-snug text-white">
                {selected.title}
              </h3>
              <p className="mt-3 font-mono text-[0.6875rem] uppercase tracking-wider text-white/60">
                {selected.source || "Global"}
                {selected.country ? ` · ${selected.country}` : ""}
                {ago(selected.date) ? ` · ${ago(selected.date)}` : ""}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-4">
              {selected.url ? (
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-sm bg-white px-4 py-2 text-[0.8125rem] font-semibold text-[#073952] transition-colors hover:bg-white/90"
                >
                  Open full article
                  <span aria-hidden>↗</span>
                </a>
              ) : (
                <span className="text-[0.75rem] italic text-white/50">
                  Source link unavailable
                </span>
              )}
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="font-mono text-[0.6875rem] uppercase tracking-wider text-white/60 transition-colors hover:text-white"
              >
                Back to feed
              </button>
            </div>

            <p className="mt-4 font-mono text-[0.5625rem] uppercase tracking-wider text-white/35">
              Source · GDELT global news monitoring
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
