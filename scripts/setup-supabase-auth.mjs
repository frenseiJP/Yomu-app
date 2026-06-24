#!/usr/bin/env node
/**
 * Recreate / reconnect Supabase Auth for Frensei.
 *
 * Usage:
 *   SUPABASE_ACCESS_TOKEN=sbp_xxx node scripts/setup-supabase-auth.mjs
 *   node scripts/setup-supabase-auth.mjs --access-token sbp_xxx
 *
 * Get token: https://supabase.com/dashboard/account/tokens
 */

import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://frensei.jp";
const APP = "https://app.frensei.jp";
const REDIRECTS = [
  `${APP}/auth/callback`,
  `${SITE}/auth/callback`,
  `${APP}/auth/callback?**`,
  `${SITE}/auth/callback?**`,
];

function arg(name) {
  const idx = process.argv.indexOf(name);
  if (idx >= 0) return process.argv[idx + 1];
  return process.env.SUPABASE_ACCESS_TOKEN ?? null;
}

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

async function waitHealthy(token, ref) {
  for (let i = 0; i < 40; i++) {
    const health = await api(token, `/projects/${ref}/health?services=auth`);
    const auth = health?.find?.((h) => h.name === "auth");
    if (auth?.status === "ACTIVE_HEALTHY") return;
    await new Promise((r) => setTimeout(r, 15_000));
  }
  throw new Error("Project auth service did not become healthy in time.");
}

async function main() {
  const token = arg("--access-token");
  if (!token) {
    console.log("SUPABASE_ACCESS_TOKEN が必要です。");
    console.log("1. https://supabase.com/dashboard/account/tokens で PAT 作成");
    console.log("2. node scripts/setup-supabase-auth.mjs --access-token <PAT>\n");
    process.exit(1);
  }

  console.log("Frensei Supabase Auth setup\n");

  let orgs = await api(token, "/organizations");
  let org = orgs?.[0];
  if (!org?.id) {
    console.log("No organization found — creating Frensei…");
    org = await api(token, "/organizations", {
      method: "POST",
      body: JSON.stringify({ name: "Frensei" }),
    });
  }

  const dbPass = `Frensei_${Math.random().toString(36).slice(2, 14)}!9`;
  console.log(`Creating project in org ${org.name}…`);

  const project = await api(token, "/projects", {
    method: "POST",
    body: JSON.stringify({
      organization_id: org.id,
      name: "frensei-yomu",
      db_pass: dbPass,
      region: "ap-northeast-1",
    }),
  });

  const ref = project.id;
  const url = `https://${ref}.supabase.co`;
  console.log(`Project ref: ${ref}`);
  console.log(`Waiting for auth service…`);
  await waitHealthy(token, ref);

  const keys = await api(token, `/projects/${ref}/api-keys`);
  const anon = keys?.find?.((k) => k.name === "anon")?.api_key;
  const service = keys?.find?.((k) => k.name === "service_role")?.api_key;
  if (!anon || !service) throw new Error("Could not fetch API keys.");

  console.log("Configuring auth redirect URLs…");
  await api(token, `/projects/${ref}/config/auth`, {
    method: "PATCH",
    body: JSON.stringify({
      site_url: APP,
      uri_allow_list: REDIRECTS.join(","),
    }),
  });

  const sql = readFileSync(join(ROOT, "supabase/apply-all-migrations.sql"), "utf8");
  console.log("Applying migrations…");
  await api(token, `/projects/${ref}/database/query`, {
    method: "POST",
    body: JSON.stringify({ query: sql }),
  });

  const envUpdates = [
    { name: "NEXT_PUBLIC_SUPABASE_URL", value: url, envs: ["production", "preview", "development"] },
    { name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", value: anon, envs: ["production", "preview", "development"] },
    { name: "SUPABASE_SERVICE_ROLE_KEY", value: service, envs: ["production"] },
  ];

  for (const { name, value, envs } of envUpdates) {
    for (const env of envs) {
      spawnSync("vercel", ["env", "rm", name, env, "--yes"], { cwd: ROOT, stdio: "ignore" });
      spawnSync(
        "vercel",
        ["env", "add", name, env, "--value", value, "--yes", "--force"],
        { cwd: ROOT, stdio: "inherit" },
      );
    }
  }

  console.log("\nRedeploying production…");
  spawnSync("vercel", ["--prod", "--yes"], { cwd: ROOT, stdio: "inherit" });

  console.log("\n✓ Done");
  console.log(`URL: ${url}`);
  console.log(`Dashboard: https://supabase.com/dashboard/project/${ref}/auth/providers`);
  console.log(`Login: ${APP}/login\n`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
