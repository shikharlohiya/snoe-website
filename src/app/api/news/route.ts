// ============================================================
// /api/news — live geopolitical / supply-chain news feed.
//
// Source: GDELT DOC 2.0 (free, no API key). GDELT rate-limits
// to ~1 request / 5s, so the upstream call is cached for 15
// minutes (fetch revalidate) — page loads hit our cache, not
// GDELT. Non-JSON / rate-limit / error responses fall back to
// a curated list so the ticker always has content.
//
// GDELT docs: https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/
// ============================================================

import { NextResponse } from "next/server";

const GDELT_URL = "https://api.gdeltproject.org/api/v2/doc/doc";

// Geopolitical + war + supply-chain focus, English sources.
const QUERY =
  '(sanctions OR tariffs OR "supply chain" OR "trade war" OR geopolitical OR "export controls") sourcelang:english';

type Impact = "high" | "medium" | "low";

export type NewsItem = {
  title: string;
  url: string;
  source: string;
  country: string;
  impact: Impact;
  date: string; // GDELT seendate, e.g. 20251004T120000Z
};

const HIGH = [
  "earthquake", "tsunami", "war", "sanction", "strike", "fire", "explosion",
  "shutdown", "collapse", "crisis", "conflict", "military", "ban", "embargo",
  "flood", "hurricane", "typhoon", "disruption", "shortage", "halt", "block",
  "attack", "blockade", "invasion", "missile",
];
const MED = [
  "tariff", "delay", "tension", "concern", "slowdown", "warning", "dispute",
  "investigation", "recall", "surge", "cost", "uncertainty", "threat", "risk",
  "decline", "curb", "probe", "restrict",
];

function impactOf(title: string): Impact {
  const t = title.toLowerCase();
  if (HIGH.some((k) => t.includes(k))) return "high";
  if (MED.some((k) => t.includes(k))) return "medium";
  return "low";
}

// Keep only genuinely supply-chain / geopolitical / conflict news
// (drops tangential matches like disciplinary "sanctions" or stock
// tips that slip through GDELT's broad term matching).
const RELEVANT = [
  "supply chain", "supplier", "logistics", "shipping", "freight", "cargo",
  "port", "warehouse", "tariff", "trade war", "trade deal", "export control",
  "import", "customs", "embargo", "blockade", "sanction", "semiconductor",
  "chip", "automotive", "manufacturing", "factory", "plant", "production",
  "rare earth", "lithium", "copper", "steel", "aluminum", "oil", "gas",
  "commodit", "shortage", "disruption", "strike", "geopolitic", "conflict",
  "war", "military", "missile", "sea", "canal", "strait", "earthquake",
  "flood", "typhoon", "hurricane", "tension", "ev ", "battery",
];

function isRelevant(title: string): boolean {
  const t = title.toLowerCase();
  return RELEVANT.some((k) => t.includes(k));
}

// Curated fallback (used when GDELT is rate-limited / unreachable).
const FALLBACK: NewsItem[] = [
  { title: "New export controls tighten on advanced semiconductor equipment", url: "", source: "reuters.com", country: "United States", impact: "high", date: "" },
  { title: "Red Sea shipping disruptions push carriers to reroute around Africa", url: "", source: "ft.com", country: "Egypt", impact: "high", date: "" },
  { title: "Fresh tariffs announced on imported EV components and rare earths", url: "", source: "cnbc.com", country: "China", impact: "high", date: "" },
  { title: "Port congestion worsens at major transshipment hubs amid labor action", url: "", source: "supplychaindive.com", country: "Singapore", impact: "medium", date: "" },
  { title: "Taiwan Strait tensions raise concern over chip supply continuity", url: "", source: "bloomberg.com", country: "Taiwan", impact: "high", date: "" },
  { title: "Copper strike risk builds at major South American mining operations", url: "", source: "mining.com", country: "Chile", impact: "medium", date: "" },
  { title: "Germany weighs energy-cost relief for strained industrial base", url: "", source: "politico.eu", country: "Germany", impact: "medium", date: "" },
  { title: "Sanctions package expands restrictions on dual-use goods", url: "", source: "apnews.com", country: "Russia", impact: "high", date: "" },
];

export async function GET() {
  const params = new URLSearchParams({
    query: QUERY,
    mode: "ArtList",
    maxrecords: "40",
    format: "json",
    sort: "DateDesc",
    timespan: "5d",
  });

  try {
    const res = await fetch(`${GDELT_URL}?${params.toString()}`, {
      // Cache the upstream GDELT response for 15 minutes so we never
      // hammer their 1-request/5s limit.
      next: { revalidate: 900 },
      headers: { "User-Agent": "SNOE-Website/1.0 (+https://snoe-ai.com)" },
    });

    const text = await res.text();
    // GDELT returns plain text ("Please limit requests…") when rate-limited.
    if (!res.ok || !text.trim().startsWith("{")) throw new Error("gdelt-unavailable");

    const data = JSON.parse(text) as { articles?: Array<Record<string, string>> };
    const seen = new Set<string>();
    const items: NewsItem[] = [];

    for (const a of data.articles ?? []) {
      const title = (a.title ?? "").trim();
      if (!title) continue;
      const key = title.toLowerCase().slice(0, 60);
      if (seen.has(key)) continue;
      seen.add(key);
      if (!isRelevant(title)) continue;
      items.push({
        title,
        url: a.url ?? "",
        source: a.domain ?? "",
        country: a.sourcecountry ?? "",
        impact: impactOf(title),
        date: a.seendate ?? "",
      });
      if (items.length >= 18) break;
    }

    if (items.length === 0) throw new Error("gdelt-empty");
    return NextResponse.json({ items, live: true });
  } catch {
    return NextResponse.json({ items: FALLBACK, live: false });
  }
}
