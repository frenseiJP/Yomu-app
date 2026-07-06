#!/usr/bin/env node
/**
 * Print UTM-tracked promo links for beta channels.
 * Marketing routes (/try, /trial, /launch, /learn) live on the Next app host.
 *
 * Usage: node scripts/promo-links.mjs
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvValue(key, fallback) {
  try {
    const raw = readFileSync(join(ROOT, ".env.production.local"), "utf8");
    for (const line of raw.split("\n")) {
      if (line.startsWith(`${key}=`)) {
        return line.split("=")[1].trim().replace(/^"|"$/g, "").replace(/\/$/, "");
      }
    }
  } catch {
    /* ignore */
  }
  return process.env[key]?.replace(/\/$/, "") || fallback;
}

const APP = loadEnvValue("NEXT_PUBLIC_APP_URL", "https://app.frensei.jp");
const SITE = loadEnvValue("NEXT_PUBLIC_SITE_URL", "https://frensei.jp");

function link(base, path, source, medium, campaign = "beta") {
  const url = new URL(path, base);
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", campaign);
  return url.toString();
}

const channels = [
  ["X / Twitter bio", APP, "/try", "twitter", "bio"],
  ["Instagram bio", APP, "/trial", "instagram", "bio"],
  ["TikTok bio", APP, "/try", "tiktok", "bio"],
  ["Reddit r/LearnJapanese", APP, "/try", "reddit", "learnjapanese"],
  ["Product Hunt", APP, "/launch", "product_hunt", "launch"],
  ["Discord share", APP, "/try", "discord", "community"],
  ["Email signature", APP, "/try", "email", "signature"],
  ["Japanese social (app)", APP, "/try", "twitter", "ja_app"],
  ["Phrase guide SEO", APP, "/learn", "google", "organic"],
];

console.log("Frensei beta promo links\n");
console.log(`App (attribution + guest try): ${APP}`);
console.log(`Static marketing site: ${SITE}\n`);

for (const [label, base, path, source, medium] of channels) {
  console.log(`${label}`);
  console.log(`  ${link(base, path, source, medium)}\n`);
}

console.log("Share correction links use utm_source=share automatically.");
console.log("Track in Supabase beta_event_logs + GA4.");
