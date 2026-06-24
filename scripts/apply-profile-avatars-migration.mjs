#!/usr/bin/env node
/**
 * Apply profile avatars setup: storage bucket (+ optional SQL via PAT).
 *
 * Usage:
 *   node scripts/apply-profile-avatars-migration.mjs
 *   SUPABASE_ACCESS_TOKEN=sbp_xxx node scripts/apply-profile-avatars-migration.mjs
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REF = process.env.SUPABASE_PROJECT_REF ?? "jlhxzzhkjuduutyfpwzu";

function loadEnv() {
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

async function managementApi(token, path, opts = {}) {
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

async function ensureBucket(url, serviceKey) {
  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
  };
  const list = await fetch(`${url}/storage/v1/bucket`, { headers });
  if (list.ok) {
    const buckets = await list.json();
    if (Array.isArray(buckets) && buckets.some((b) => b.id === "avatars" || b.name === "avatars")) {
      console.log("✓ avatars bucket already exists");
      return;
    }
  }
  const res = await fetch(`${url}/storage/v1/bucket`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      id: "avatars",
      name: "avatars",
      public: true,
      file_size_limit: 5242880,
      allowed_mime_types: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    }),
  });
  const text = await res.text();
  if (!res.ok && !text.includes("already exists")) {
    throw new Error(`bucket create (${res.status}): ${text.slice(0, 200)}`);
  }
  console.log("✓ avatars bucket ready");
}

async function main() {
  loadEnv();
  const token = process.env.SUPABASE_ACCESS_TOKEN?.trim();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  console.log("Profile avatars setup\n");

  if (url && serviceKey) {
    await ensureBucket(url, serviceKey);
    console.log("→ Uploads use POST /api/profile/avatar (service role)");
  } else {
    console.log("⚠ NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 未設定 — bucket 作成スキップ");
  }

  if (token) {
    const sql = readFileSync(
      join(ROOT, "supabase/migrations/20260624120000_profile_avatars.sql"),
      "utf8",
    );
    console.log(`→ Applying SQL policies via Management API (${REF})…`);
    await managementApi(token, `/projects/${REF}/database/query`, {
      method: "POST",
      body: JSON.stringify({ query: sql }),
    });
    console.log("✓ SQL migration applied");
  } else {
    console.log("ℹ SUPABASE_ACCESS_TOKEN なし — SQL ポリシーはスキップ（API 経由アップロードで動作）");
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
