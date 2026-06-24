#!/usr/bin/env node
/**
 * Apply Google OAuth + GA4 when credentials are available.
 * Also copies redirect URIs and opens console tabs on macOS.
 *
 * Usage:
 *   SUPABASE_ACCESS_TOKEN=sbp_xxx \
 *   GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com \
 *   GOOGLE_CLIENT_SECRET=GOCSPX-xxx \
 *   GA4_MEASUREMENT_ID=G-XXXXXXXX \
 *   node scripts/setup-google-services.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOCS = join(ROOT, "..", ".company", "engineering", "docs");
const REF = process.env.SUPABASE_PROJECT_REF ?? "jlhxzzhkjuduutyfpwzu";
const APP = "https://app.frensei.jp";
const SITE = "https://frensei.jp";
const REDIRECT = `https://${REF}.supabase.co/auth/v1/callback`;

async function api(token, path, opts = {}) {
  const res = await fetch(`https://api.supabase.com/v1${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(opts.headers ?? {}),
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${path} (${res.status}): ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

function patchGa4InFile(path, id) {
  let html = readFileSync(path, "utf8");
  html = html.replace(
    /<meta name="ga4-measurement-id" content="[^"]*"/,
    `<meta name="ga4-measurement-id" content="${id}"`,
  );
  writeFileSync(path, html);
}

function openUrls(urls) {
  if (process.platform !== "darwin") return;
  for (const url of urls) spawnSync("open", [url], { stdio: "ignore" });
}

function copyClipboard(text) {
  if (process.platform === "darwin") spawnSync("pbcopy", { input: text });
}

async function main() {
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const ga4 = process.env.GA4_MEASUREMENT_ID?.trim();

  console.log("Frensei Google services setup\n");

  if (clientId && clientSecret && token) {
    console.log("→ Enabling Google OAuth on Supabase…");
    await api(token, `/projects/${REF}/config/auth`, {
      method: "PATCH",
      body: JSON.stringify({
        external_google_enabled: true,
        external_google_client_id: clientId,
        external_google_secret: clientSecret,
      }),
    });
    console.log("✓ Google OAuth enabled");
  } else {
    console.log("Google OAuth: GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / SUPABASE_ACCESS_TOKEN が未設定");
    const clip = [
      "Authorized JavaScript origins:",
      APP,
      SITE,
      "",
      "Authorized redirect URIs:",
      REDIRECT,
    ].join("\n");
    copyClipboard(clip);
    console.log("✓ Redirect URIs copied to clipboard");
    openUrls([
      "https://console.cloud.google.com/apis/credentials/oauthclient",
      `https://supabase.com/dashboard/project/${REF}/auth/providers`,
    ]);
  }

  if (ga4) {
    for (const file of ["index.html", "trial/index.html"]) {
      const p = join(DOCS, file);
      patchGa4InFile(p, ga4);
      console.log(`✓ GA4 ID set in ${file}`);
    }
    console.log("→ Redeploy LP: cd .company/engineering/docs && vercel --prod");
  } else {
    console.log("GA4: GA4_MEASUREMENT_ID 未設定 — analytics.google.com でプロパティ作成後に再実行");
    openUrls(["https://analytics.google.com/analytics/web/provision/#/provision/create"]);
  }

  console.log("\n→ GA4 コンバージョン: npm run ga4:conversions");
  if (process.platform === "darwin") {
    spawnSync("open", ["https://analytics.google.com/analytics/web/"], { stdio: "ignore" });
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
