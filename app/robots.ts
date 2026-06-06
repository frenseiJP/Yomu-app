import type { MetadataRoute } from "next";

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
        "/share/",
      ],
    },
    sitemap: "https://frensei.jp/sitemap.xml",
  };
}
