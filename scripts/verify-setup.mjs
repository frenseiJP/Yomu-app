#!/usr/bin/env node
/**
 * Check production readiness for analytics, GAS, OAuth, and SEO.
 *
 * Usage: node scripts/verify-setup.mjs
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

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

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://frensei.jp").replace(/\/$/, "");
const APP = process.env.NEXT_PUBLIC_APP_URL || "https://app.frensei.jp";
const ADMIN_SECRET = process.env.ADMIN_ANALYTICS_SECRET || "f000e3c1558eb233db4d798f";
const PROJECT_REF = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]
  ?? "jlhxzzhkjuduutyfpwzu";

const checks = [];

function pass(label, detail) {
  checks.push({ ok: true, label, detail });
}

function fail(label, detail) {
  checks.push({ ok: false, label, detail });
}

async function main() {
  loadEnvFile();
  console.log("Frensei setup verification\n");

  try {
    const sitemap = await fetch(`${SITE}/sitemap.xml`);
    if (sitemap.ok) {
      const text = await sitemap.text();
      const count = (text.match(/<loc>/g) || []).length;
      pass("Sitemap", `${SITE}/sitemap.xml (${count} URLs, HTTP ${sitemap.status})`);
    } else {
      fail("Sitemap", `${SITE}/sitemap.xml → HTTP ${sitemap.status}`);
    }
  } catch (err) {
    fail("Sitemap", String(err));
  }

  try {
    const res = await fetch(`${APP}/api/admin/analytics?days=7`, {
      headers: { Authorization: `Bearer ${ADMIN_SECRET}` },
    });
    const data = await res.json();
    if (data.configured) {
      const source =
        data.dataSource === "sheets" ? "Sheets" : data.dataSource === "blob" ? "Vercel Blob" : "Supabase";
      pass("Admin analytics", `${source} (${data.totals?.events ?? 0} events in last 7d)`);
    } else {
      fail(
        "Admin analytics",
        data.error || "SUPABASE_SERVICE_ROLE_KEY / GAS export が未設定",
      );
    }
  } catch (err) {
    fail("Supabase analytics", String(err));
  }

  const webhook = process.env.FEEDBACK_SHEETS_WEBHOOK_URL?.trim();
  if (webhook) {
    try {
      const { postFeedbackToGoogleSheets } = await import("../lib/feedback/googleSheets.ts");
      const result = await postFeedbackToGoogleSheets({
        source: "analytics_event",
        userId: "verify_setup",
        body: JSON.stringify({ eventType: "landing_view", sessionId: "verify_setup" }),
        createdAt: new Date().toISOString(),
        route: "/",
      });
      if (result.ok) {
        pass("GAS webhook", "Analytics イベントの POST 成功（スプレッドシートの Analytics タブを確認）");
      } else {
        fail("GAS webhook", `POST failed: ${result.reason}`);
      }
    } catch (err) {
      fail("GAS webhook", String(err));
    }
  } else {
    fail(
      "GAS webhook",
      "FEEDBACK_SHEETS_WEBHOOK_URL 未設定。vercel env pull .env.production.local で取得して再実行",
    );
  }

  for (const origin of [APP]) {
    try {
      const login = await fetch(`${origin}/login`);
      const html = await login.text();
      const chunk = html.match(/app\/login\/page-[a-f0-9]+\.js/)?.[0];
      if (!chunk) {
        fail(`Login bundle (${origin})`, "login page chunk が見つかりません");
        continue;
      }
      const js = await fetch(`${origin}/_next/static/chunks/${chunk}`);
      const body = await js.text();
      if (body.includes("Continue with Google") || body.includes("signInWithOAuth")) {
        pass(`Google OAuth UI (${origin})`, "ログイン画面にボタンあり");
      } else {
        fail(
          `Google OAuth UI (${origin})`,
          "古いビルドの可能性 — vercel alias で最新デプロイに向けてください",
        );
      }
    } catch (err) {
      fail(`Google OAuth UI (${origin})`, String(err));
    }
  }

  if (webhook) {
    try {
      const url = new URL(webhook);
      url.searchParams.set("action", "analytics_summary");
      url.searchParams.set("days", "7");
      url.searchParams.set("secret", ADMIN_SECRET);
      const res = await fetch(url.toString(), { redirect: "manual" });
      let text = await res.text();
      if (res.status === 302 || res.status === 303) {
        const loc = res.headers.get("location");
        if (loc) text = await (await fetch(loc)).text();
      }
      const parsed = JSON.parse(text);
      if (parsed.ok && Array.isArray(parsed.rows)) {
        pass("GAS analytics export", `${parsed.rows.length} rows (Sheets ダッシュボード連携 OK)`);
      } else {
        fail(
          "GAS analytics export",
          parsed.error || "GAS 再デプロイが必要 — npm run gas:publish",
        );
      }
    } catch (err) {
      fail("GAS analytics export", String(err));
    }
  }

  try {
    const res = await fetch(
      `https://${PROJECT_REF}.supabase.co/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(`${APP}/auth/callback`)}`,
      { redirect: "manual" },
    );
    const loc = res.headers.get("location") || "";
    if (res.status === 302 && loc.includes("accounts.google.com")) {
      pass("Google OAuth backend", "Supabase → Google リダイレクト OK");
    } else {
      fail("Google OAuth backend", `HTTP ${res.status}`);
    }
  } catch (err) {
    fail("Google OAuth backend", String(err));
  }

  fail(
    "Search Console",
    `npm run search-console で送信画面を開き ${SITE}/sitemap.xml を追加`,
  );

  const token = process.env.SUPABASE_ACCESS_TOKEN?.trim();
  if (token) {
    try {
      const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const auth = await res.json();
      if (auth.external_google_enabled && auth.external_google_client_id) {
        const idx = checks.findIndex((c) => c.label === "Google OAuth backend");
        if (idx >= 0) {
          checks[idx] = {
            ok: true,
            label: "Google OAuth backend",
            detail: `有効 (${auth.external_google_client_id.slice(0, 20)}…)`,
          };
        }
      }
    } catch {
      /* keep redirect check result */
    }
  }

  const ok = checks.filter((c) => c.ok).length;
  const ng = checks.filter((c) => !c.ok).length;

  for (const c of checks) {
    console.log(`${c.ok ? "✓" : "✗"} ${c.label}`);
    if (c.detail) console.log(`  ${c.detail}`);
  }

  console.log(`\n${ok} passed, ${ng} need attention`);
  process.exit(ng > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
