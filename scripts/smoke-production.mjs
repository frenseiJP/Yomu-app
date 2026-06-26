#!/usr/bin/env node
/**
 * Production smoke tests for frensei.jp + app.frensei.jp
 *
 * Usage: node scripts/smoke-production.mjs
 */

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://frensei.jp").replace(/\/$/, "");
const APP = (process.env.NEXT_PUBLIC_APP_URL || "https://app.frensei.jp").replace(/\/$/, "");
const REF = process.env.SUPABASE_PROJECT_REF ?? "jlhxzzhkjuduutyfpwzu";

const results = [];

function ok(label, detail) {
  results.push({ ok: true, label, detail });
}
function bad(label, detail) {
  results.push({ ok: false, label, detail });
}

async function fetchText(url) {
  const res = await fetch(url, { redirect: "follow" });
  const text = await res.text();
  return { res, text };
}

async function main() {
  console.log("Frensei production smoke test\n");

  try {
    const { res, text } = await fetchText(`${SITE}/`);
    if (!res.ok) bad("LP root", `HTTP ${res.status}`);
    else if (text.includes("Speak Japanese") || text.includes("Online Japanese"))
      ok("LP root", `${SITE}/ → 英語LP (HTTP ${res.status})`);
    else if (text.includes("yomu") || text.includes("Frensei App"))
      bad("LP root", "アプリが表示されている可能性 — DNS/alias を確認");
    else ok("LP root", `HTTP ${res.status}`);
  } catch (e) {
    bad("LP root", String(e));
  }

  try {
    const { res, text } = await fetchText(`${SITE}/ja/`);
    if (res.ok && text.includes("教科書の日本語ではなく"))
      ok("Japanese LP", `${SITE}/ja/ (HTTP ${res.status})`);
    else bad("Japanese LP", `HTTP ${res.status} or missing content`);
  } catch (e) {
    bad("Japanese LP", String(e));
  }

  try {
    const { res, text } = await fetchText(`${SITE}/trial/`);
    if (res.ok && (text.includes("calendly") || text.includes("Calendly")))
      ok("Trial LP", `${SITE}/trial/`);
    else bad("Trial LP", `HTTP ${res.status}`);
  } catch (e) {
    bad("Trial LP", String(e));
  }

  try {
    const { res, text } = await fetchText(`${SITE}/frensei-og.png`);
    if (res.ok && res.headers.get("content-type")?.includes("image"))
      ok("OGP image", `${SITE}/frensei-og.png`);
    else bad("OGP image", `HTTP ${res.status}`);
  } catch (e) {
    bad("OGP image", String(e));
  }

  try {
    const { res, text } = await fetchText(`${SITE}/sitemap.xml`);
    const count = (text.match(/<loc>/g) || []).length;
    if (res.ok && count >= 3) ok("Sitemap", `${count} URLs`);
    else bad("Sitemap", `HTTP ${res.status}, ${count} URLs`);
  } catch (e) {
    bad("Sitemap", String(e));
  }

  try {
    const { res, text } = await fetchText(`${APP}/try`);
    if (res.ok && (text.includes("guest") || text.includes("Try") || text.includes("メッセージ")))
      ok("Guest try", `${APP}/try`);
    else bad("Guest try", `HTTP ${res.status}`);
  } catch (e) {
    bad("Guest try", String(e));
  }

  try {
    const { res, text } = await fetchText(`${APP}/launch`);
    if (res.ok && (text.includes("Product Hunt") || text.includes("launch") || text.includes("Frensei")))
      ok("Launch page", `${APP}/launch`);
    else bad("Launch page", `HTTP ${res.status}`);
  } catch (e) {
    bad("Launch page", String(e));
  }

  try {
    const { res, text } = await fetchText(`${APP}/trial`);
    if (res.ok && text.includes("Calendly"))
      ok("App trial page", `${APP}/trial`);
    else bad("App trial page", `HTTP ${res.status}`);
  } catch (e) {
    bad("App trial page", String(e));
  }

  try {
    const { res, text } = await fetchText(`${APP}/`);
    if (res.ok) ok("App root", `${APP}/ (HTTP ${res.status})`);
    else bad("App root", `HTTP ${res.status}`);
  } catch (e) {
    bad("App root", String(e));
  }

  try {
    const res = await fetch(`${APP}/api/auth/health`);
    const data = await res.json();
    if (data.ok) ok("Auth health", data.message || "ok");
    else bad("Auth health", JSON.stringify(data));
  } catch (e) {
    bad("Auth health", String(e));
  }

  try {
    const res = await fetch(`${APP}/login`);
    const html = await res.text();
    if (html.includes("login") || html.includes("Login") || html.includes("ログイン"))
      ok("Login page", `${APP}/login`);
    else bad("Login page", "unexpected response");
  } catch (e) {
    bad("Login page", String(e));
  }

  try {
    const res = await fetch(
      `https://${REF}.supabase.co/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(`${APP}/auth/callback`)}`,
      { redirect: "manual" },
    );
    const loc = res.headers.get("location") || "";
    if (res.status === 302 && loc.includes("accounts.google.com") && loc.includes("client_id=")) {
      ok("Google OAuth", "Supabase → Google リダイレクト OK");
    } else {
      bad("Google OAuth", `HTTP ${res.status}`);
    }
  } catch (e) {
    bad("Google OAuth", String(e));
  }

  const token = process.env.SUPABASE_ACCESS_TOKEN?.trim();
  if (token) {
    try {
      const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query:
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('chat_sessions','vocabulary_items','user_plans');",
        }),
      });
      const rows = await res.json();
      const names = Array.isArray(rows) ? rows.map((r) => r.table_name).sort().join(", ") : "";
      if (names.includes("chat_sessions") && names.includes("vocabulary_items"))
        ok("Learning tables", names);
      else bad("Learning tables", names || "query failed");
    } catch (e) {
      bad("Learning tables", String(e));
    }
  } else {
    ok("Learning tables", "スキップ（PAT なし — pre-release-check で確認）");
  }

  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;

  for (const r of results) {
    console.log(`${r.ok ? "✓" : "✗"} ${r.label}`);
    if (r.detail) console.log(`  ${r.detail}`);
  }
  console.log(`\n${passed} passed, ${failed} need attention`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
