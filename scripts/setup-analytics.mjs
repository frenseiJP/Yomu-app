#!/usr/bin/env node
/**
 * One-shot analytics infrastructure setup.
 *
 * Usage:
 *   node scripts/setup-analytics.mjs --access-token <PAT> --service-role <KEY>
 *
 * Get PAT: https://supabase.com/dashboard/account/tokens
 * Get service_role: Project → Settings → API
 */

import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const PROJECT_REF = "ardvgckclusmzwranpsd";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function arg(name) {
  const idx = process.argv.indexOf(name);
  if (idx >= 0) return process.argv[idx + 1];
  const envName = name.replace(/^--/, "").toUpperCase().replace(/-/g, "_");
  return process.env[envName] ?? null;
}

const accessToken = arg("--access-token") || process.env.SUPABASE_ACCESS_TOKEN;
const serviceRole = arg("--service-role") || process.env.SUPABASE_SERVICE_ROLE_KEY;

async function runSql(query) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`SQL failed (${res.status}): ${text.slice(0, 400)}`);
  return text;
}

async function verifyServiceRole() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || `https://${PROJECT_REF}.supabase.co`;
  const res = await fetch(`${url}/rest/v1/beta_event_logs?select=id&limit=1`, {
    headers: {
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
    },
  });
  if (res.status === 404 || res.status === 406) {
    throw new Error("beta_event_logs table not found — run migrations first.");
  }
  if (!res.ok) throw new Error(`Service role check failed: ${res.status}`);
}

async function main() {
  console.log("Frensei analytics setup\n");

  if (!accessToken) {
    console.log("Missing SUPABASE_ACCESS_TOKEN (Personal Access Token).");
    console.log("1. Open https://supabase.com/dashboard/account/tokens");
    console.log("2. Create token → rerun with --access-token <token>\n");
  } else {
    const sql = readFileSync(join(ROOT, "supabase/apply-all-migrations.sql"), "utf8");
    console.log("Applying migrations via Management API…");
    await runSql(sql);
    console.log("✓ Migrations applied");
  }

  if (!serviceRole) {
    console.log("\nMissing SUPABASE_SERVICE_ROLE_KEY.");
    console.log("Open https://supabase.com/dashboard/project/ardvgckclusmzwranpsd/settings/api");
    console.log("Copy service_role key → rerun with --service-role <key>\n");
  } else {
    console.log("Adding SUPABASE_SERVICE_ROLE_KEY to Vercel production…");
    spawnSync("vercel", ["env", "rm", "SUPABASE_SERVICE_ROLE_KEY", "production", "--yes"], {
      cwd: ROOT,
      stdio: "inherit",
    });
    spawnSync(
      "vercel",
      ["env", "add", "SUPABASE_SERVICE_ROLE_KEY", "production", "--value", serviceRole, "--yes"],
      { cwd: ROOT, stdio: "inherit" },
    );
    process.env.SUPABASE_SERVICE_ROLE_KEY = serviceRole;
    await verifyServiceRole();
    console.log("✓ Service role verified");
    console.log("Redeploying production…");
    spawnSync("vercel", ["--prod", "--yes"], { cwd: ROOT, stdio: "inherit" });
  }

  console.log("\nDashboard: https://app.frensei.jp/admin/analytics");
  console.log("Password: f000e3c1558eb233db4d798f");
  console.log("Sheets fallback: Analytics tab (until Supabase is fully wired)\n");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
