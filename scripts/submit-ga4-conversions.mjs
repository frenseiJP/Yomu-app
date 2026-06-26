#!/usr/bin/env node
/**
 * Mark GA4 conversion events via Admin API (OAuth).
 * Usage: node scripts/submit-ga4-conversions.mjs
 */

import { createServer } from "node:http";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TOKEN_CACHE = join(ROOT, ".ga4-oauth-token.json");
const PORT = 43108;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/oauth2callback`;
const SCOPES = ["https://www.googleapis.com/auth/analytics.edit"];
const EVENT = "calendly_trial_click";
const TARGET_MEASUREMENT_IDS = new Set([
  process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim() || "G-0BNSXE1JQ8",
  process.env.LP_GA4_MEASUREMENT_ID?.trim() || "G-R9P8FK7T3F",
]);

function loadClaspCreds() {
  const raw = readFileSync(join(homedir(), ".clasprc.json"), "utf8");
  const t = JSON.parse(raw).tokens?.default;
  if (!t?.client_id || !t?.client_secret) throw new Error("Run: npx @google/clasp login");
  return { clientId: t.client_id, clientSecret: t.client_secret };
}

function loadCachedToken() {
  if (!existsSync(TOKEN_CACHE)) return null;
  try {
    return JSON.parse(readFileSync(TOKEN_CACHE, "utf8"));
  } catch {
    return null;
  }
}

function saveToken(token) {
  writeFileSync(TOKEN_CACHE, JSON.stringify(token, null, 2), "utf8");
}

async function refreshAccessToken(creds, token) {
  const body = new URLSearchParams({
    client_id: creds.clientId,
    client_secret: creds.clientSecret,
    refresh_token: token.refresh_token,
    grant_type: "refresh_token",
  });
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.error || `token refresh HTTP ${res.status}`);
  const next = { ...token, access_token: data.access_token, expiry_date: Date.now() + data.expires_in * 1000 };
  saveToken(next);
  return next;
}

async function getAccessToken(creds) {
  let token = loadCachedToken();
  if (token?.access_token && token.expiry_date > Date.now() + 60_000) return token.access_token;
  if (token?.refresh_token) {
    token = await refreshAccessToken(creds, token);
    return token.access_token;
  }

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", creds.clientId);
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", SCOPES.join(" "));
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");

  const code = await new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url || "/", `http://127.0.0.1:${PORT}`);
      if (url.pathname !== "/oauth2callback") {
        res.writeHead(404);
        res.end("not found");
        return;
      }
      const err = url.searchParams.get("error");
      const authCode = url.searchParams.get("code");
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end("<html><body><p>GA4 認証完了。このタブを閉じてください。</p></body></html>");
      server.close();
      if (err) reject(new Error(err));
      else if (!authCode) reject(new Error("missing_code"));
      else resolve(authCode);
    });
    server.listen(PORT, "127.0.0.1", () => {
      console.log("ブラウザで Google 認証を完了してください…");
      if (process.platform === "darwin") spawnSync("open", [authUrl.toString()], { stdio: "ignore" });
      else console.log(authUrl.toString());
    });
    server.on("error", reject);
  });

  const body = new URLSearchParams({
    code,
    client_id: creds.clientId,
    client_secret: creds.clientSecret,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  });
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.error || `token HTTP ${res.status}`);
  const stored = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expiry_date: Date.now() + data.expires_in * 1000,
  };
  saveToken(stored);
  return stored.access_token;
}

async function markConversion(accessToken, propertyId) {
  const res = await fetch(
    `https://analyticsadmin.googleapis.com/v1beta/properties/${propertyId}/conversionEvents`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ eventName: EVENT, countingMethod: "ONCE_PER_EVENT" }),
    },
  );
  const body = await res.json().catch(() => ({}));
  if (res.ok) return { ok: true };
  if (body?.error?.message?.includes("ALREADY_EXISTS")) return { ok: true, existed: true };
  return { ok: false, error: body?.error?.message || `HTTP ${res.status}` };
}

async function main() {
  console.log(`GA4 conversion: ${EVENT}\n`);
  const creds = loadClaspCreds();
  const accessToken = await getAccessToken(creds);

  const res = await fetch("https://analyticsadmin.googleapis.com/v1beta/accountSummaries", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || `accountSummaries HTTP ${res.status}`);

  const matches = [];
  for (const account of data.accountSummaries || []) {
    for (const prop of account.propertySummaries || []) {
      const streams = await fetch(
        `https://analyticsadmin.googleapis.com/v1beta/${prop.property}/dataStreams`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      const streamData = await streams.json();
      if (!streams.ok) continue;
      for (const stream of streamData.dataStreams || []) {
        const mid = stream.webStreamData?.measurementId;
        if (mid && TARGET_MEASUREMENT_IDS.has(mid)) {
          matches.push({ property: prop.property, displayName: prop.displayName, measurementId: mid });
        }
      }
    }
  }

  if (!matches.length) {
    console.log("対象プロパティが見つかりませんでした。探した測定 ID:");
    for (const id of TARGET_MEASUREMENT_IDS) console.log(`  - ${id}`);
    throw new Error("GA4 プロパティ未検出");
  }

  let ok = 0;
  for (const m of matches) {
    const result = await markConversion(accessToken, m.property.replace("properties/", ""));
    if (result.ok) {
      console.log(`✓ ${m.displayName} (${m.measurementId})${result.existed ? " — 既に登録済み" : ""}`);
      ok += 1;
    } else {
      console.log(`✗ ${m.displayName}: ${result.error}`);
    }
  }

  if (!ok) process.exit(1);
}

main().catch((err) => {
  console.error("✗", err.message || err);
  process.exit(1);
});
