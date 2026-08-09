import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Note: /investors is intentionally excluded — the page is hidden from
// the public site (moved to _investors/, un-routed).
const ROUTES = ["", "/solutions", "/about", "/whitepaper", "/contact", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
