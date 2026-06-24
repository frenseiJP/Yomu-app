#!/usr/bin/env node
/**
 * Apply learning-data migration to the current Supabase project.
 *
 * Usage:
 *   SUPABASE_ACCESS_TOKEN=sbp_xxx node scripts/apply-learning-migration.mjs
 *   node scripts/apply-learning-migration.mjs --access-token sbp_xxx --ref jlhxzzhkjuduutyfpwzu
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

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

async function main() {
  const token = arg("--access-token");
  const ref =
    process.argv.includes("--ref")
      ? process.argv[process.argv.indexOf("--ref") + 1]
      : process.env.SUPABASE_PROJECT_REF ?? "jlhxzzhkjuduutyfpwzu";

  if (!token) {
    console.error("SUPABASE_ACCESS_TOKEN が必要です。");
    process.exit(1);
  }

  const sql = readFileSync(
    join(ROOT, "supabase/migrations/20260623120000_create_user_learning_data.sql"),
    "utf8",
  );

  console.log(`Applying learning-data migration to ${ref}…`);
  await api(token, `/projects/${ref}/database/query`, {
    method: "POST",
    body: JSON.stringify({ query: sql }),
  });
  console.log("✓ Migration applied");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
