#!/usr/bin/env node
/**
 * Deploy feedback/analytics GAS via clasp when credentials are available.
 *
 * Requires:
 *   GAS_SCRIPT_ID in .env.production.local or env
 *   clasp login (once): npx @google/clasp login
 *
 * Usage: node scripts/deploy-gas.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GAS_SRC = join(ROOT, "scripts/google-apps-script-feedback.gs");
const GAS_DIR = join(ROOT, ".gas-deploy");
const GAS_APP = join(GAS_DIR, "appsscript.json");

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

function resolveSecret() {
  return (
    process.env.ADMIN_ANALYTICS_SECRET?.trim() ||
    "f000e3c1558eb233db4d798f"
  );
}

function resolveScriptId() {
  return (
    process.env.GAS_SCRIPT_ID?.trim() ||
    process.env.GOOGLE_APPS_SCRIPT_ID?.trim() ||
    "MUvEyRWXKLMAS1MxjrlCcpfYpiytys1ko"
  );
}

function prepareGasProject(secret, scriptId) {
  mkdirSync(GAS_DIR, { recursive: true });
  const raw = readFileSync(GAS_SRC, "utf8");
  const code = raw.replace(/__ADMIN_ANALYTICS_SECRET__/g, secret);
  writeFileSync(join(GAS_DIR, "Code.gs"), code, "utf8");
  writeFileSync(
    join(GAS_DIR, ".clasp.json"),
    JSON.stringify({ scriptId, rootDir: "." }, null, 2),
    "utf8",
  );
  writeFileSync(
    GAS_APP,
    JSON.stringify(
      {
        timeZone: "Asia/Tokyo",
        dependencies: {},
        exceptionLogging: "STACKDRIVER",
        runtimeVersion: "V8",
        webapp: {
          executeAs: "USER_DEPLOYING",
          access: "ANYONE",
        },
      },
      null,
      2,
    ),
    "utf8",
  );
}

async function verifyWebhook(webhook, secret) {
  const url = new URL(webhook);
  url.searchParams.set("action", "analytics_summary");
  url.searchParams.set("days", "7");
  url.searchParams.set("secret", secret);
  const res = await fetch(url.toString(), { redirect: "manual" });
  let text = await res.text();
  if (res.status === 302 || res.status === 303) {
    const loc = res.headers.get("location");
    if (loc) text = await (await fetch(loc)).text();
  }
  try {
    const parsed = JSON.parse(text);
    return parsed.ok && Array.isArray(parsed.rows);
  } catch {
    return false;
  }
}

async function main() {
  loadEnvFile();
  const secret = resolveSecret();
  const scriptId = resolveScriptId();
  const webhook = process.env.FEEDBACK_SHEETS_WEBHOOK_URL?.trim();

  console.log("Frensei GAS deploy\n");
  prepareGasProject(secret, scriptId);

  const claspBin = join(ROOT, "node_modules", ".bin", "clasp");
  let claspCmd = claspBin;
  try {
    readFileSync(claspBin);
  } catch {
    claspCmd = "npx";
  }

  const pushArgs =
    claspCmd === "npx"
      ? ["--yes", "@google/clasp", "push", "-f"]
      : ["push", "-f"];

  const push = spawnSync(claspCmd, pushArgs, {
    cwd: GAS_DIR,
    stdio: "inherit",
    env: { ...process.env, npm_config_cache: "/tmp/npm-cache-frensei" },
  });

  if (push.status !== 0) {
    console.log("\n✗ clasp push failed");
    console.log("  1. https://script.google.com/home/usersettings → Google Apps Script API を ON");
    console.log("  2. npx @google/clasp login");
    console.log(`  3. GAS_SCRIPT_ID を .env.production.local に設定して再実行`);
    console.log(`  Prepared sources: ${GAS_DIR}/Code.gs`);
    process.exit(1);
  }

  const deployArgs =
    claspCmd === "npx"
      ? ["--yes", "@google/clasp", "deploy", "--description", `beta-${new Date().toISOString().slice(0, 10)}`]
      : ["deploy", "--description", `beta-${new Date().toISOString().slice(0, 10)}`];

  const deploy = spawnSync(claspCmd, deployArgs, {
    cwd: GAS_DIR,
    stdio: "inherit",
    env: { ...process.env, npm_config_cache: "/tmp/npm-cache-frensei" },
  });

  if (deploy.status !== 0) {
    console.log("\n⚠ push OK but deploy failed — create new deployment in GAS UI");
    process.exit(1);
  }

  if (webhook) {
    const ok = await verifyWebhook(webhook, secret);
    console.log(ok ? "\n✓ analytics_summary verified" : "\n✗ analytics_summary still failing — check deployment URL");
    process.exit(ok ? 0 : 1);
  }

  console.log("\n✓ GAS deployed (webhook verify skipped — no FEEDBACK_SHEETS_WEBHOOK_URL)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
