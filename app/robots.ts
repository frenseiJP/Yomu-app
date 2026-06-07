import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/onboarding",
        "/login",
        "/chat",
        "/app",
        "/vocabulary",
        "/progress",
        "/more",
        "/history",
        "/settings",
        "/admin",
        "/share/",
      ],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
