import type { MetadataRoute } from "next";
import { getAllPhraseSlugs } from "@/lib/learn/phrases";

const BASE = "https://frensei.jp";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const learnPages = getAllPhraseSlugs().map((slug) => ({
    url: `${BASE}/learn/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/learn`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/try`, lastModified: now, changeFrequency: "weekly", priority: 0.88 },
    { url: `${BASE}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/login?intent=signup`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    ...learnPages,
    { url: `${BASE}/topic`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/community`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];
}
