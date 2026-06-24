#!/usr/bin/env node
/**
 * Enable Google OAuth on the Frensei Supabase project.
 *
 * Prerequisites:
 *   1. Google Cloud Console → OAuth client (Web)
 *   2. Authorized redirect URI:
 *      https://<PROJECT_REF>.supabase.co/auth/v1/callback
 *
 * Usage:
 *   GOOGLE_CLIENT_ID=xxx GOOGLE_CLIENT_SECRET=yyy \
 *   SUPABASE_ACCESS_TOKEN=sbp_zzz \
 *   node scripts/setup-google-oauth.mjs --ref jlhxzzhkjuduutyfpwzu
 */

function arg(name) {
  const idx = process.argv.indexOf(name);
  if (idx >= 0) return process.argv[idx + 1];
  return null;
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
  const token = process.env.SUPABASE_ACCESS_TOKEN ?? arg("--access-token");
  const ref = arg("--ref") ?? process.env.SUPABASE_PROJECT_REF ?? "jlhxzzhkjuduutyfpwzu";
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!token || !clientId || !clientSecret) {
    console.log("Required env vars:");
    console.log("  SUPABASE_ACCESS_TOKEN");
    console.log("  GOOGLE_CLIENT_ID");
    console.log("  GOOGLE_CLIENT_SECRET");
    console.log("\nOptional: --ref <project_ref>");
    process.exit(1);
  }

  await api(token, `/projects/${ref}/config/auth`, {
    method: "PATCH",
    body: JSON.stringify({
      external_google_enabled: true,
      external_google_client_id: clientId,
      external_google_secret: clientSecret,
    }),
  });

  console.log("✓ Google OAuth enabled");
  console.log(`Dashboard: https://supabase.com/dashboard/project/${ref}/auth/providers`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
