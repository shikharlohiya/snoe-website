import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

const ROUTES = ["", "/solutions", "/about", "/whitepaper", "/investors", "/contact", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
