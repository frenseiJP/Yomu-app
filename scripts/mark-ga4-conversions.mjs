#!/usr/bin/env node
/**
 * Open GA4 Admin to mark calendly_trial_click as a conversion (manual step).
 * GA4 Admin API requires OAuth — this script opens the right console pages.
 */

import { spawnSync } from "node:child_process";

const LP_GA4 = process.env.LP_GA4_MEASUREMENT_ID ?? "G-R9P8FK7T3F";
const APP_GA4 = process.env.APP_GA4_MEASUREMENT_ID ?? "G-0BNSXE1JQ8";

const steps = [
  "1. GA4 → 管理 → データ表示 → イベント",
  "2. calendly_trial_click を見つけて「マークをコンバージョンとして設定」を ON",
  "3. LP プロパティ (" + LP_GA4 + ") とアプリ用プロパティ (" + APP_GA4 + ") それぞれで実施",
];

console.log("GA4 コンバージョン登録（手動）\n");
for (const s of steps) console.log(s);
console.log("\nイベント名: calendly_trial_click");
console.log("発火タイミング: /trial/ および Calendly リンクのクリック時\n");

const urls = [
  "https://analytics.google.com/analytics/web/",
  "https://analytics.google.com/analytics/web/#/p0/reports/explorer",
];

if (process.platform === "darwin") {
  for (const url of urls) spawnSync("open", [url], { stdio: "ignore" });
} else if (process.platform === "win32") {
  for (const url of urls) spawnSync("cmd", ["/c", "start", url], { stdio: "ignore" });
} else {
  for (const url of urls) spawnSync("xdg-open", [url], { stdio: "ignore" });
}
