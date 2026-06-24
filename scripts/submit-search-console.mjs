#!/usr/bin/env node
/**
 * Open Google Search Console sitemap submission (manual step helper).
 */

import { spawnSync } from "node:child_process";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://frensei.jp").replace(/\/$/, "");
const SITEMAP = `${SITE}/sitemap.xml`;

const urls = [
  "https://search.google.com/search-console",
  `https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent(`sc-domain:${SITE.replace(/^https?:\/\//, "")}`)}`,
];

console.log(`Search Console で次のサイトマップを送信してください:\n  ${SITEMAP}\n`);

if (process.platform === "darwin") {
  for (const url of urls) spawnSync("open", [url], { stdio: "ignore" });
} else if (process.platform === "win32") {
  for (const url of urls) spawnSync("cmd", ["/c", "start", url], { stdio: "ignore" });
} else {
  for (const url of urls) spawnSync("xdg-open", [url], { stdio: "ignore" });
}
