#!/usr/bin/env node
/**
 * Weekly analytics summary for terminal / cron.
 * Usage: ADMIN_ANALYTICS_SECRET=xxx node scripts/analytics-report.mjs [days]
 * Or:    node scripts/analytics-report.mjs 7  (uses .env.local via vercel env pull)
 */

const days = Number(process.argv[2] || 7);
const base = process.env.ANALYTICS_BASE_URL || "https://app.frensei.jp";
const secret = process.env.ADMIN_ANALYTICS_SECRET;

if (!secret) {
  console.error("ADMIN_ANALYTICS_SECRET is required.");
  process.exit(1);
}

const res = await fetch(`${base}/api/admin/analytics?days=${days}`, {
  headers: { Authorization: `Bearer ${secret}` },
});

if (!res.ok) {
  console.error(`Request failed: ${res.status}`);
  process.exit(1);
}

const data = await res.json();
if (data.error) {
  console.error("Error:", data.error);
}

console.log(`\n=== Frensei Analytics (${data.rangeDays} days) ===\n`);
console.log(`Events: ${data.totals.events} | Unique users: ${data.totals.uniqueUsers} | Registered: ${data.totals.registeredUsers ?? "?"}\n`);

console.log("--- Funnel ---");
for (const [k, v] of Object.entries(data.funnel)) {
  console.log(`  ${k}: ${v}`);
}

console.log("\n--- Tab usage ---");
for (const t of data.tabUsage) console.log(`  ${t.tab}: ${t.count}`);

console.log("\n--- Top events ---");
for (const e of data.eventBreakdown.slice(0, 10)) {
  console.log(`  ${e.event_type}: ${e.count}`);
}

if (data.recentFeedback?.length) {
  console.log("\n--- Recent feedback ---");
  for (const f of data.recentFeedback.slice(0, 5)) {
    console.log(`  [${f.created_at}] ${f.body.slice(0, 120)}`);
  }
}

console.log("");
