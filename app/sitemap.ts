import type { MetadataRoute } from "next";
import { getAllPhraseSlugs } from "@/lib/learn/phrases";
import { getAppUrl } from "@/lib/siteUrl";

const APP = getAppUrl();

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const learnPages = getAllPhraseSlugs().map((slug) => ({
    url: `${APP}/learn/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  return [
    { url: `${APP}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${APP}/learn`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${APP}/try`, lastModified: now, changeFrequency: "weekly", priority: 0.88 },
    { url: `${APP}/trial`, lastModified: now, changeFrequency: "weekly", priority: 0.87 },
    { url: `${APP}/launch`, lastModified: now, changeFrequency: "weekly", priority: 0.86 },
    { url: `${APP}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.55 },
    { url: `${APP}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${APP}/feedback`, lastModified: now, changeFrequency: "monthly", priority: 0.45 },
    ...learnPages,
    { url: `${APP}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${APP}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];
}
