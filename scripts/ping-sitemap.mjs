const SITE =
  (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://frensei.jp").replace(
    /\/$/,
    "",
  );
const SITEMAP = process.env.SITEMAP_URL ?? `${SITE}/sitemap.xml`;

const endpoints = [
  `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP)}`,
  `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP)}`,
];

for (const url of endpoints) {
  try {
    const res = await fetch(url, { method: "GET" });
    const host = new URL(url).host;
    console.log(`${host}: ${res.status} ${res.statusText}`);
  } catch (err) {
    console.error(`ping failed: ${url}`, err);
  }
}
