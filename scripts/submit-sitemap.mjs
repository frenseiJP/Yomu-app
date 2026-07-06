#!/usr/bin/env node
/**
 * Notify search engines about sitemap updates.
 * Google: deprecated ping — opens Search Console helper + pings Bing.
 */

import { spawnSync } from "node:child_process";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://frensei.jp").replace(/\/$/, "");
const SITEMAP = `${SITE}/sitemap.xml`;

async function main() {
  console.log(`Sitemap: ${SITEMAP}\n`);

  try {
    const sitemap = await fetch(SITEMAP);
    const text = await sitemap.text();
    const count = (text.match(/<loc>/g) || []).length;
    if (!sitemap.ok || count < 1) {
      console.error(`✗ sitemap unreachable or empty (HTTP ${sitemap.status})`);
      process.exit(1);
    }
    console.log(`✓ sitemap reachable (${count} URLs)`);
  } catch (err) {
    console.error("✗ sitemap fetch failed:", err);
    process.exit(1);
  }

  try {
    const bing = await fetch(
      `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP)}`,
    );
    console.log(bing.ok ? "✓ Bing sitemap ping sent" : `✗ Bing ping HTTP ${bing.status}`);
  } catch (err) {
    console.log("✗ Bing ping failed:", String(err));
  }

  const indexNowKey = process.env.INDEXNOW_KEY?.trim();
  if (indexNowKey) {
    try {
      const res = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          host: new URL(SITE).hostname,
          key: indexNowKey,
          keyLocation: `${SITE}/${indexNowKey}.txt`,
          urlList: [SITE, `${SITE}/trial/`],
        }),
      });
      console.log(res.ok || res.status === 202 ? "✓ IndexNow submitted" : `✗ IndexNow HTTP ${res.status}`);
    } catch (err) {
      console.log("✗ IndexNow failed:", String(err));
    }
  } else {
    console.log("○ IndexNow skipped (INDEXNOW_KEY unset)");
  }

  console.log("\nGoogle Search Console:");
  console.log(`  プロパティに ${SITEMAP} を登録`);
  const gsc = `https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent(`sc-domain:${new URL(SITE).hostname}`)}`;
  console.log(`  ${gsc}`);

  if (process.platform === "darwin") {
    spawnSync("open", [gsc], { stdio: "ignore" });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
