import type { MetadataRoute } from "next";
import { getAllPhraseSlugs } from "@/lib/learn/phrases";
import { getSiteUrl } from "@/lib/siteUrl";

const BASE = getSiteUrl();

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
    { url: `${BASE}/trial`, lastModified: now, changeFrequency: "weekly", priority: 0.87 },
    { url: `${BASE}/launch`, lastModified: now, changeFrequency: "weekly", priority: 0.86 },
    { url: `${BASE}/ja`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.55 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/feedback`, lastModified: now, changeFrequency: "monthly", priority: 0.45 },
    ...learnPages,
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];
}
