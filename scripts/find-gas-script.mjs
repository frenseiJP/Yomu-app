#!/usr/bin/env node
/** Find Apps Script project IDs for clasp deploy. */
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

function getAccessToken() {
  const raw = readFileSync(join(homedir(), ".clasprc.json"), "utf8");
  const tokens = JSON.parse(raw).tokens?.default;
  return tokens?.access_token ?? null;
}

async function main() {
  const token = getAccessToken();
  if (!token) {
    console.error("Run: npx @google/clasp login");
    process.exit(1);
  }

  const q = encodeURIComponent(
    "mimeType='application/vnd.google-apps.script' and trashed=false",
  );
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,modifiedTime)&pageSize=20&orderBy=modifiedTime desc`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const data = await res.json();
  if (!res.ok) {
    console.error(data.error?.message || `Drive API HTTP ${res.status}`);
    process.exit(1);
  }

  if (!data.files?.length) {
    console.log("No Apps Script projects found.");
    return;
  }

  console.log("Apps Script projects:\n");
  for (const f of data.files) {
    console.log(`- ${f.name}`);
    console.log(`  id: ${f.id}`);
    console.log(`  modified: ${f.modifiedTime}\n`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
