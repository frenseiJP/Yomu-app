#!/usr/bin/env node
/**
 * Pre-release automated checks + manual checklist reminder.
 *
 * Usage:
 *   vercel env pull .env.production.local --environment=production --yes
 *   node scripts/pre-release-check.mjs
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://frensei.jp").replace(/\/$/, "");
const APP = (process.env.NEXT_PUBLIC_APP_URL || "https://app.frensei.jp").replace(/\/$/, "");
const REF = process.env.SUPABASE_PROJECT_REF ?? "jlhxzzhkjuduutyfpwzu";

const checks = [];
const manual = [];

function pass(label, detail) {
  checks.push({ ok: true, label, detail });
}
function fail(label, detail) {
  checks.push({ ok: false, label, detail });
}
function note(label, detail) {
  manual.push({ label, detail });
}

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
    fail("Production env", ".env.production.local がありません — vercel env pull を実行");
  }
}

async function main() {
  console.log("Frensei pre-release check\n");
  loadEnvFile();

  // Domains & LP
  try {
    const lp = await fetch(`${SITE}/`);
    const lpText = await lp.text();
    if (lp.ok && (lpText.includes("Speak Japanese") || lpText.includes("Online Japanese"))) {
      pass("LP (EN)", SITE);
    } else fail("LP (EN)", `HTTP ${lp.status}`);
    if (lpText.includes("G-R9P8FK7T3F")) pass("LP GA4 meta", "G-R9P8FK7T3F");
    else fail("LP GA4 meta", "未検出");
  } catch (e) {
    fail("LP", String(e));
  }

  try {
    const ja = await fetch(`${SITE}/ja/`);
    if (ja.status === 404 || ja.status === 410) pass("LP (JA removed)", `${SITE}/ja/ → HTTP ${ja.status}`);
    else fail("LP (JA removed)", `Expected 404, got HTTP ${ja.status}`);
  } catch (e) {
    fail("LP (JA removed)", String(e));
  }

  try {
    const trial = await fetch(`${SITE}/trial/`);
    if (trial.ok) pass("Trial LP", `${SITE}/trial/`);
    else fail("Trial LP", `HTTP ${trial.status}`);
  } catch (e) {
    fail("Trial LP", String(e));
  }

  // App
  try {
    const health = await fetch(`${APP}/api/auth/health`);
    const h = await health.json();
    if (h.ok) pass("Auth health", h.message || "ok");
    else fail("Auth health", JSON.stringify(h));
  } catch (e) {
    fail("Auth health", String(e));
  }

  try {
    const oauth = await fetch(
      `https://${REF}.supabase.co/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(`${APP}/auth/callback`)}`,
      { redirect: "manual" },
    );
    const loc = oauth.headers.get("location") || "";
    if (oauth.status === 302 && loc.includes("accounts.google.com") && loc.includes("client_id=")) {
      pass("Google OAuth", "Supabase → Google リダイレクト OK");
    } else {
      fail("Google OAuth", `HTTP ${oauth.status}`);
    }
  } catch (e) {
    fail("Google OAuth", String(e));
  }

  const ga4App = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  if (ga4App?.startsWith("G-")) pass("App GA4 env", ga4App);
  else fail("App GA4 env", "NEXT_PUBLIC_GA4_MEASUREMENT_ID 未設定");

  for (const [k, label] of [
    ["REQUIRE_AUTH_FOR_HIGH_COST_AI_ROUTES", "Auth gate (high cost)"],
    ["REQUIRE_AUTH_FOR_VOCAB_ENRICH", "Auth gate (vocab)"],
    ["REQUIRE_AUTH_FOR_OPENAI_GENERATE_PROMPT", "Auth gate (prompt)"],
  ]) {
    const v = process.env[k];
    if (v === "true") pass(label, "true");
    else fail(label, v ? `値=${v}` : "未設定");
  }

  if (
    (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) ||
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
  ) {
    pass("Upstash rate limit", "設定済み");
  } else {
    note("Upstash（推奨）", "UPSTASH_REDIS_REST_URL/TOKEN 未設定 — 高トラフィック前に設定");
  }

  if (process.env.FEEDBACK_SHEETS_WEBHOOK_URL) pass("Feedback webhook", "設定済み");
  else fail("Feedback webhook", "未設定");

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) pass("Service role key", "設定済み");
  else fail("Service role key", "未設定");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const sk = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && sk) {
    try {
      const res = await fetch(`${url}/storage/v1/bucket`, {
        headers: { apikey: sk, Authorization: `Bearer ${sk}` },
      });
      const buckets = await res.json();
      if (Array.isArray(buckets) && buckets.some((b) => b.name === "avatars")) {
        pass("Avatars bucket", "avatars あり");
      } else {
        fail("Avatars bucket", "未作成 — npm run db:avatars");
      }
    } catch (e) {
      fail("Avatars bucket", String(e));
    }
  }

  try {
    const avatarApi = await fetch(`${APP}/api/profile/avatar`, { method: "POST" });
    if (avatarApi.status === 401) pass("Avatar API", "401 without auth（想定どおり）");
    else fail("Avatar API", `HTTP ${avatarApi.status}`);
  } catch (e) {
    fail("Avatar API", String(e));
  }

  // Manual-only items
  note(
    "Google OAuth 本番公開",
    "https://console.cloud.google.com/apis/credentials/consent → アプリを公開（テストユーザー制限を解除）",
  );
  note(
    "GA4 コンバージョン",
    "npm run ga4:conversions → calendly_trial_click を LP・アプリ両方で ON",
  );
  note("Secret ローテーション", "Google Client Secret / Supabase PAT を再発行（チャット露出時）");
  note("SNS bio", "TikTok / Instagram → https://frensei.jp/trial/");
  note("手動 QA", "下記チェックリストをシークレットウィンドウで実施");

  const ok = checks.filter((c) => c.ok).length;
  const ng = checks.filter((c) => !c.ok).length;

  console.log("── Automated ──\n");
  for (const c of checks) {
    console.log(`${c.ok ? "✓" : "✗"} ${c.label}`);
    if (c.detail) console.log(`  ${c.detail}`);
  }
  console.log(`\n${ok} passed, ${ng} failed\n`);

  if (manual.length) {
    console.log("── Manual（あなたの操作）──\n");
    for (const m of manual) {
      console.log(`○ ${m.label}`);
      console.log(`  ${m.detail}`);
    }
    console.log("");
  }

  console.log("── 手動動作確認チェックリスト ──\n");
  const qa = [
    "1. シークレットウィンドウで https://app.frensei.jp/login を開く",
    "2. メールで新規登録 → 確認メール（必要なら）→ ログイン",
    "3. Googleログインも別アカウントで試す",
    "4. オンボーディング: 名前・国籍・写真（任意）を入力",
    "5. 「Quick guide / はじめかた」チュートリアルが表示される",
    "6. チュートリアル完了 or スキップ後、チャットで1文送信",
    "7. 返信から語彙を保存 → Vocabulary に表示される",
    "8. 設定 (/settings) でプロフィール変更が保存される",
    "9. ログアウト → 再ログインでチャット履歴が残る",
    "10. https://frensei.jp と https://frensei.jp/trial/ が LP として表示される",
  ];
  for (const line of qa) console.log(line);

  if (process.platform === "darwin" && ng > 0) {
    console.log("\n→ 失敗項目のダッシュボードを開きます…");
    spawnSync("open", [`https://supabase.com/dashboard/project/${REF}`], { stdio: "ignore" });
  }

  process.exit(ng > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
