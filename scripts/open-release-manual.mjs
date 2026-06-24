#!/usr/bin/env node
/** Open browser tabs for manual release tasks (macOS). */

import { spawnSync } from "node:child_process";

const REF = "jlhxzzhkjuduutyfpwzu";
const urls = [
  `https://console.cloud.google.com/apis/credentials/consent`,
  "https://analytics.google.com/analytics/web/",
  `https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent("sc-domain:frensei.jp")}`,
  `https://supabase.com/dashboard/project/${REF}/auth/url-configuration`,
];

console.log("手動タスク用のブラウザタブを開きます…\n");
for (const url of urls) console.log(`  ${url}`);

if (process.platform === "darwin") {
  for (const url of urls) spawnSync("open", [url], { stdio: "ignore" });
} else {
  console.log("\n上記 URL をブラウザで開いてください。");
}

console.log("\nGA4: calendly_trial_click をコンバージョンに設定");
console.log("OAuth: アプリを「本番」公開");
console.log("Search Console: https://frensei.jp/sitemap.xml を送信");
