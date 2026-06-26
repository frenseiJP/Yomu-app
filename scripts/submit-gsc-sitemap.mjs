#!/usr/bin/env node
/**
 * Submit sitemap to Google Search Console via API.
 * Opens browser once for Search Console OAuth if needed.
 *
 * Usage: node scripts/submit-gsc-sitemap.mjs
 */

import { createServer } from "node:http";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://frensei.jp").replace(/\/$/, "");
const SITEMAP_PATH = "sitemap.xml";
const SITEMAP_URL = `${SITE}/${SITEMAP_PATH}`;
const GSC_SITE = `sc-domain:${new URL(SITE).hostname}`;
const TOKEN_CACHE = join(ROOT, ".gsc-oauth-token.json");
const PORT = 43107;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/oauth2callback`;
const SCOPES = ["https://www.googleapis.com/auth/webmasters"];

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
  if (token?.access_token && token.expiry_date > Date.now() + 60_000) {
    return token.access_token;
  }
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
      res.end("<html><body><p>GSC 認証完了。このタブを閉じてください。</p></body></html>");
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

async function api(accessToken, path, opts = {}) {
  const res = await fetch(`https://www.googleapis.com/webmasters/v3${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
      ...(opts.headers || {}),
    },
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  return { res, json };
}

async function main() {
  console.log(`Google Search Console — sitemap submit\nSite: ${GSC_SITE}\nSitemap: ${SITEMAP_URL}\n`);

  const creds = loadClaspCreds();
  const accessToken = await getAccessToken(creds);

  const sites = await api(accessToken, "/sites");
  if (!sites.res.ok) {
    throw new Error(sites.json?.error?.message || `list sites HTTP ${sites.res.status}`);
  }

  const entries = sites.json?.siteEntry || [];
  const verified = entries.find((s) => s.siteUrl === GSC_SITE || s.siteUrl === `${SITE}/`);
  if (!verified) {
    console.log("登録済みプロパティ:");
    for (const s of entries) console.log(`  - ${s.siteUrl} (${s.permissionLevel})`);
    throw new Error(
      `${GSC_SITE} が未確認です。Search Console で DNS 確認を完了してから再実行してください。`,
    );
  }
  console.log(`✓ プロパティ確認済み: ${verified.siteUrl} (${verified.permissionLevel})`);

  const put = await api(accessToken, `/sites/${encodeURIComponent(GSC_SITE)}/sitemaps/${encodeURIComponent(SITEMAP_URL)}`, {
    method: "PUT",
  });

  if (put.res.ok || put.res.status === 204) {
    console.log(`✓ サイトマップ送信成功: ${SITEMAP_URL}`);
  } else if (put.json?.error?.message?.includes("already exists") || put.res.status === 409) {
    console.log(`✓ サイトマップは既に登録済み: ${SITEMAP_URL}`);
  } else {
    throw new Error(put.json?.error?.message || `submit HTTP ${put.res.status}`);
  }

  const list = await api(accessToken, `/sites/${encodeURIComponent(GSC_SITE)}/sitemaps`);
  if (list.res.ok) {
    const row = (list.json?.sitemap || []).find((s) => s.path?.includes("sitemap"));
    if (row) {
      console.log(`  状態: ${row.lastSubmitted || "—"} / 検出 ${row.contents?.[0]?.indexed ?? "—"} URL`);
    }
  }
}

main().catch((err) => {
  console.error("✗", err.message || err);
  process.exit(1);
});
