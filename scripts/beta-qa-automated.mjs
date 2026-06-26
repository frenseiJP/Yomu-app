#!/usr/bin/env node
/**
 * Automated beta QA checks (production). Complements manual browser QA.
 *
 * Usage: node scripts/beta-qa-automated.mjs
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { postFeedbackToGoogleSheets } from "../lib/feedback/googleSheets.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://frensei.jp").replace(/\/$/, "");
const APP = (process.env.NEXT_PUBLIC_APP_URL || "https://app.frensei.jp").replace(/\/$/, "");

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

const checks = [];
function pass(label, detail) {
  checks.push({ ok: true, label, detail });
}
function fail(label, detail) {
  checks.push({ ok: false, label, detail });
}

async function fetchText(url, init) {
  const res = await fetch(url, init);
  return { res, text: await res.text() };
}

async function main() {
  loadEnvFile();
  const adminSecret = process.env.ADMIN_ANALYTICS_SECRET?.trim();
  const webhook = process.env.FEEDBACK_SHEETS_WEBHOOK_URL?.trim();

  console.log("Frensei automated beta QA\n");

  // 10. LP pages
  try {
    const { res, text } = await fetchText(`${SITE}/`);
    if (res.ok && (text.includes("Speak Japanese") || text.includes("Online Japanese"))) {
      pass("QA-10a LP (EN)", SITE);
    } else fail("QA-10a LP (EN)", `HTTP ${res.status}`);
  } catch (e) {
    fail("QA-10a LP (EN)", String(e));
  }

  try {
    const { res, text } = await fetchText(`${SITE}/trial/`);
    if (res.ok && text.length > 500) pass("QA-10b Trial LP", `${SITE}/trial/`);
    else fail("QA-10b Trial LP", `HTTP ${res.status}`);
  } catch (e) {
    fail("QA-10b Trial LP", String(e));
  }

  // 1. Login page loads
  try {
    const { res, text } = await fetchText(`${APP}/login`);
    if (res.ok && (text.includes("login") || text.includes("Continue with Google"))) {
      pass("QA-1 Login page", `${APP}/login`);
    } else fail("QA-1 Login page", `HTTP ${res.status}`);
  } catch (e) {
    fail("QA-1 Login page", String(e));
  }

  // OAuth redirect
  try {
    const ref = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
    if (ref) {
      const oauth = await fetch(
        `https://${ref}.supabase.co/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(`${APP}/auth/callback?next=/app`)}`,
        { redirect: "manual" },
      );
      const loc = oauth.headers.get("location") || "";
      if (oauth.status === 302 && loc.includes("accounts.google.com")) {
        pass("QA-3 Google OAuth redirect", "Supabase → Google OK");
      } else {
        fail("QA-3 Google OAuth redirect", `HTTP ${oauth.status}`);
      }
    }
  } catch (e) {
    fail("QA-3 Google OAuth redirect", String(e));
  }

  // Onboarding requires auth (Next.js may return 200 with RSC redirect payload)
  try {
    const { res, text } = await fetchText(`${APP}/onboarding`, { redirect: "manual" });
    const status = res.status;
    const redirectsToLogin =
      (status === 307 || status === 302) && (res.headers.get("location") || "").includes("/login");
    const softRedirect =
      text.includes("NEXT_REDIRECT;replace;/login") ||
      text.includes('content="1;url=/login"');
    if (redirectsToLogin || softRedirect) {
      pass("QA-4 Onboarding auth gate", "unauthenticated → /login");
    } else {
      fail("QA-4 Onboarding auth gate", `HTTP ${status}`);
    }
  } catch (e) {
    fail("QA-4 Onboarding auth gate", String(e));
  }

  // Settings page (English default SSR)
  try {
    const { res, text } = await fetchText(`${APP}/settings`);
    if (res.ok && text.includes('lang="en"')) {
      pass("QA-8 Settings SSR lang", 'html lang="en"');
    } else if (res.ok) {
      pass("QA-8 Settings page", `HTTP ${res.status}`);
    } else {
      fail("QA-8 Settings page", `HTTP ${res.status}`);
    }
  } catch (e) {
    fail("QA-8 Settings page", String(e));
  }

  // Beta badge in app bundle (deployed)
  try {
    const { text: appHtml } = await fetchText(`${APP}/app`);
    const chunks = [...appHtml.matchAll(/\/_next\/static\/chunks\/[^"]+\.js/g)].map((m) => m[0]);
    let found = false;
    for (const chunkPath of chunks.slice(0, 40)) {
      const { text: js } = await fetchText(`${APP}${chunkPath}`);
      if (
        js.includes("getBetaBadgeCopy") ||
        js.includes("BetaBadge") ||
        js.includes("ベータ")
      ) {
        found = true;
        break;
      }
    }
    if (found) pass("QA P1 Beta badge", "beta copy in deployed bundle");
    else fail("QA P1 Beta badge", "beta badge copy not found — redeploy may be pending");
  } catch (e) {
    fail("QA P1 Beta badge", String(e));
  }

  // Beta prompt API
  try {
    const res = await fetch(`${APP}/api/feedback/beta-prompt`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        userId: "qa_automated",
        source: "chat",
        helpful: true,
        message: "automated qa ping",
        route: "/app",
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) pass("QA P0 Beta feedback API", "POST /api/feedback/beta-prompt OK");
    else fail("QA P0 Beta feedback API", data.error || `HTTP ${res.status}`);
  } catch (e) {
    fail("QA P0 Beta feedback API", String(e));
  }

  // GAS webhook via shared client
  if (webhook) {
    try {
      const result = await postFeedbackToGoogleSheets({
        source: "analytics_event",
        userId: "qa_automated",
        body: JSON.stringify({ eventType: "qa_automated_ping", sessionId: "qa" }),
        createdAt: new Date().toISOString(),
        route: "/qa",
      });
      if (result.ok) pass("QA-2 GAS webhook POST", "analytics_event accepted");
      else fail("QA-2 GAS webhook POST", result.reason);
    } catch (e) {
      fail("QA-2 GAS webhook POST", String(e));
    }

    if (adminSecret) {
      let gasOk = false;
      try {
        const url = new URL(webhook);
        url.searchParams.set("action", "analytics_summary");
        url.searchParams.set("days", "7");
        url.searchParams.set("secret", adminSecret);
        const res = await fetch(url.toString(), { redirect: "manual" });
        let text = await res.text();
        if (res.status === 302 || res.status === 303) {
          const loc = res.headers.get("location");
          if (loc) text = await (await fetch(loc)).text();
        }
        const parsed = JSON.parse(text);
        if (parsed.ok && Array.isArray(parsed.rows)) {
          pass("QA GAS analytics export", `${parsed.rows.length} rows`);
          gasOk = true;
        }
      } catch {
        /* try fallback */
      }

      if (!gasOk) {
        try {
          const res = await fetch(`${APP}/api/admin/analytics?days=7`, {
            headers: { Cookie: `frensei_admin=${adminSecret}` },
          });
          const parsed = await res.json();
          if (res.ok && parsed.configured && parsed.totals?.events >= 0) {
            pass(
              "QA GAS analytics export",
              `Supabase fallback OK (${parsed.totals.events} events, ${parsed.totals.uniqueUsers} users)`,
            );
            gasOk = true;
          }
        } catch {
          /* fall through */
        }
      }

      if (!gasOk) {
        fail("QA GAS analytics export", "旧GAS — npm run gas:deploy で再デプロイが必要");
      }
    }
  }

  // Sitemap for Search Console
  try {
    const { res, text } = await fetchText(`${SITE}/sitemap.xml`);
    const count = (text.match(/<loc>/g) || []).length;
    if (res.ok && count >= 1) {
      pass("QA-3 Search Console prep", `sitemap.xml (${count} URLs) — submit in GSC`);
    } else {
      fail("QA-3 Search Console prep", `HTTP ${res.status}`);
    }
  } catch (e) {
    fail("QA-3 Search Console prep", String(e));
  }

  // Upstash env on production (via latest deployment check is indirect)
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    pass("QA-4 Upstash env", "KV_REST_API_* configured for production");
  } else {
    fail("QA-4 Upstash env", "KV_REST_API_* missing from production env pull");
  }

  const ok = checks.filter((c) => c.ok).length;
  const ng = checks.filter((c) => !c.ok).length;

  for (const c of checks) {
    console.log(`${c.ok ? "✓" : "✗"} ${c.label}`);
    if (c.detail) console.log(`  ${c.detail}`);
  }

  console.log(`\n${ok} passed, ${ng} need attention`);
  console.log(
    "\n手動のみ: メール登録・Googleログイン・オンボーディング入力・チャット送信・語彙保存・設定保存・履歴確認",
  );

  process.exit(ng > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
