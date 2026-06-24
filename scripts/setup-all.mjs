#!/usr/bin/env node
/**
 * One-command launcher for remaining manual setup steps.
 *
 * Usage:
 *   npm run setup:all
 *   npm run setup:all -- --access-token <PAT> --service-role <KEY>
 *
 * Opens browser tabs, copies GAS script, and runs analytics:setup when keys are provided.
 */

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROJECT_REF = process.env.SUPABASE_PROJECT_REF ?? "jlhxzzhkjuduutyfpwzu";
const SITE = "https://frensei.jp";
const APP = "https://app.frensei.jp";

const URLS = {
  gas: "https://script.google.com/home",
  supabaseApi: `https://supabase.com/dashboard/project/${PROJECT_REF}/settings/api`,
  supabaseTokens: "https://supabase.com/dashboard/account/tokens",
  supabaseAuth: `https://supabase.com/dashboard/project/${PROJECT_REF}/auth/providers`,
  supabaseUrlConfig: `https://supabase.com/dashboard/project/${PROJECT_REF}/auth/url-configuration`,
  googleOAuth: "https://console.cloud.google.com/apis/credentials",
  searchConsole: "https://search.google.com/search-console",
  analyticsDash: `${APP}/admin/analytics`,
};

function arg(name) {
  const idx = process.argv.indexOf(name);
  if (idx >= 0) return process.argv[idx + 1];
  const envName = name.replace(/^--/, "").toUpperCase().replace(/-/g, "_");
  return process.env[envName] ?? null;
}

function openUrl(url) {
  if (process.platform === "darwin") {
    spawnSync("open", [url], { stdio: "ignore" });
  } else if (process.platform === "win32") {
    spawnSync("cmd", ["/c", "start", url], { stdio: "ignore" });
  } else {
    spawnSync("xdg-open", [url], { stdio: "ignore" });
  }
}

function copyGasScript() {
  const gasFile = join(ROOT, "scripts/google-apps-script-feedback.gs");
  const content = readFileSync(gasFile, "utf8");
  if (process.platform === "darwin") {
    spawnSync("pbcopy", { input: content });
    console.log("✓ GAS スクリプトをクリップボードにコピーしました");
  } else {
    console.log(`GAS ファイル: ${gasFile}`);
  }
}

async function promptIfMissing(name, current) {
  if (current || !process.stdin.isTTY) return current;
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise((resolve) => {
    rl.question(`${name}: `, resolve);
  });
  rl.close();
  return answer.trim() || null;
}

function printChecklist() {
  console.log("\n--- 手順チェックリスト ---\n");

  console.log("1) GAS 再デプロイ（2分）");
  console.log("   - script.google.com で既存プロジェクトを開く");
  console.log("   - Code.gs をクリップボードの内容で置き換え");
  console.log("   - Deploy → Manage deployments → 鉛筆 → New version → Deploy");
  console.log("   - スプレッドシートに「Analytics」シートができることを確認\n");

  console.log("2) Supabase 分析キー（5分）");
  console.log("   - service_role key をコピー");
  console.log("   - 実行: npm run analytics:setup -- --access-token <PAT> --service-role <KEY>");
  console.log("   - または: npm run setup:all -- --access-token ... --service-role ...\n");

  console.log("3) Google OAuth（10分）");
  console.log("   Google Cloud Console:");
  console.log("   - OAuth 2.0 Client ID を作成（Web application）");
  console.log(`   - Authorized redirect URIs: ${APP}/auth/callback`);
  console.log(`   - Authorized JavaScript origins: ${APP}, ${SITE}`);
  console.log("   Supabase → Authentication → Providers → Google:");
  console.log("   - Client ID / Secret を貼り付け、Enable");
  console.log("   Supabase → URL Configuration:");
  console.log(`   - Site URL: ${APP}`);
  console.log(`   - Redirect URLs: ${APP}/auth/callback, ${SITE}/auth/callback\n`);

  console.log("4) Search Console（2分）");
  console.log(`   - プロパティ ${SITE} を開く`);
  console.log(`   - サイトマップ → ${SITE}/sitemap.xml を送信\n`);

  console.log(`管理ダッシュボード: ${URLS.analyticsDash}`);
  console.log("パスワード: f000e3c1558eb233db4d798f\n");
}

async function main() {
  console.log("Frensei セットアップ — 残タスク一括\n");

  copyGasScript();

  const openOnly = process.argv.includes("--no-open");
  if (!openOnly) {
    console.log("\nブラウザで設定画面を開いています…");
    for (const url of Object.values(URLS)) openUrl(url);
  }

  printChecklist();

  let accessToken = arg("--access-token");
  let serviceRole = arg("--service-role");

  accessToken = await promptIfMissing("Supabase PAT (Enter でスキップ)", accessToken);
  serviceRole = await promptIfMissing("service_role key (Enter でスキップ)", serviceRole);

  if (accessToken || serviceRole) {
    const args = ["scripts/setup-analytics.mjs"];
    if (accessToken) args.push("--access-token", accessToken);
    if (serviceRole) args.push("--service-role", serviceRole);
    console.log("\n→ analytics:setup を実行…\n");
    const result = spawnSync("node", args, { cwd: ROOT, stdio: "inherit" });
    if (result.status !== 0) process.exit(result.status ?? 1);
  } else {
    console.log("キー未入力のため analytics:setup はスキップしました。");
    console.log("キーがある場合:");
    console.log("  npm run setup:all -- --access-token <PAT> --service-role <KEY>\n");
  }

  console.log("→ 検証を実行…\n");
  const verify = spawnSync(
    "node",
    ["scripts/verify-setup.mjs"],
    {
      cwd: ROOT,
      stdio: "inherit",
      env: {
        ...process.env,
        FEEDBACK_SHEETS_WEBHOOK_URL:
          process.env.FEEDBACK_SHEETS_WEBHOOK_URL ||
          loadEnvValue("FEEDBACK_SHEETS_WEBHOOK_URL"),
      },
    },
  );
  process.exit(verify.status ?? 0);
}

function loadEnvValue(key) {
  try {
    const raw = readFileSync(join(ROOT, ".env.production.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m && m[1] === key) return m[2].replace(/^"|"$/g, "");
    }
  } catch {
    /* ignore */
  }
  return null;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
