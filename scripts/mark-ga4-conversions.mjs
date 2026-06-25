#!/usr/bin/env node
/**
 * Register GA4 conversion events via Admin API when service account credentials exist.
 * Falls back to opening GA4 admin UI.
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const EVENT = "calendly_trial_click";

function loadEnvFile() {
  try {
    const raw = readFileSync(join(ROOT, ".env.production.local"), "utf8");
    for (const line of raw.split("\n")) {
      if (!line || line.startsWith("#")) continue;
      const i = line.indexOf("=");
      if (i < 0) continue;
      const k = line.slice(0, i);
      let v = line.slice(i + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      if (!process.env[k]) process.env[k] = v;
    }
  } catch {
    /* optional */
  }
}

async function markConversion(propertyId, accessToken) {
  const res = await fetch(
    `https://analyticsadmin.googleapis.com/v1beta/properties/${propertyId}/conversionEvents`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        eventName: EVENT,
        countingMethod: "ONCE_PER_EVENT",
      }),
    },
  );
  if (res.ok) return { ok: true };
  const body = await res.json().catch(() => ({}));
  if (body?.error?.message?.includes("ALREADY_EXISTS")) return { ok: true, existed: true };
  return { ok: false, error: body?.error?.message || `HTTP ${res.status}` };
}

async function main() {
  loadEnvFile();

  const lpId = process.env.GA4_LP_PROPERTY_ID?.trim();
  const appId = process.env.GA4_APP_PROPERTY_ID?.trim();
  const token = process.env.GOOGLE_ACCESS_TOKEN?.trim();

  console.log(`GA4 conversion: ${EVENT}\n`);

  if (token && (lpId || appId)) {
    let ok = 0;
    for (const [label, id] of [
      ["LP", lpId],
      ["App", appId],
    ]) {
      if (!id) continue;
      const result = await markConversion(id, token);
      if (result.ok) {
        console.log(`✓ ${label} property (${id})${result.existed ? " — already marked" : ""}`);
        ok += 1;
      } else {
        console.log(`✗ ${label} property: ${result.error}`);
      }
    }
    if (ok > 0) return;
  }

  const lpGa4 = process.env.LP_GA4_MEASUREMENT_ID ?? "G-R9P8FK7T3F";
  const appGa4 = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ?? "G-0BNSXE1JQ8";

  console.log("GA4 Admin API credentials not set — open console manually:\n");
  console.log(`1. LP (${lpGa4}) と App (${appGa4}) の両プロパティ`);
  console.log(`2. 管理 → データ表示 → イベント → ${EVENT}`);
  console.log('3. 「マークをコンバージョンとして設定」を ON\n');
  console.log("API自動化する場合: GA4_LP_PROPERTY_ID, GA4_APP_PROPERTY_ID, GOOGLE_ACCESS_TOKEN を env に設定");

  const urls = ["https://analytics.google.com/analytics/web/"];
  if (process.platform === "darwin") {
    for (const url of urls) spawnSync("open", [url], { stdio: "ignore" });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
