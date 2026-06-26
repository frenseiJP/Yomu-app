#!/usr/bin/env node
/**
 * Print UTM-tracked promo links for beta channels.
 * Usage: node scripts/promo-links.mjs
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadSite() {
  try {
    const raw = readFileSync(join(ROOT, ".env.production.local"), "utf8");
    for (const line of raw.split("\n")) {
      if (line.startsWith("NEXT_PUBLIC_SITE_URL=")) {
        return line.split("=")[1].trim().replace(/^"|"$/g, "").replace(/\/$/, "");
      }
    }
  } catch {
    /* ignore */
  }
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://frensei.jp";
}

function link(path, source, medium, campaign = "beta") {
  const base = loadSite();
  const url = new URL(path, base);
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", campaign);
  return url.toString();
}

const channels = [
  ["X / Twitter bio", "/try", "twitter", "bio"],
  ["Instagram bio", "/trial", "instagram", "bio"],
  ["TikTok bio", "/try", "tiktok", "bio"],
  ["Reddit r/LearnJapanese", "/try", "reddit", "learnjapanese"],
  ["Product Hunt", "/launch", "product_hunt", "launch"],
  ["Discord share", "/try", "discord", "community"],
  ["Email signature", "/try", "email", "signature"],
  ["Japanese LP", "/ja", "twitter", "ja_lp"],
  ["Phrase guide SEO", "/learn", "google", "organic"],
];

console.log("Frensei beta promo links\n");
console.log(`Base: ${loadSite()}\n`);

for (const [label, path, source, medium] of channels) {
  console.log(`${label}`);
  console.log(`  ${link(path, source, medium)}\n`);
}

console.log("Share correction links use utm_source=share automatically.");
console.log("Track in Supabase beta_event_logs + GA4.");
