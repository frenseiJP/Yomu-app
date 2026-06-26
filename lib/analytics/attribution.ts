export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  from?: string;
  landing_path?: string;
};

const STORAGE_KEY = "frensei:attribution:v1";

function readStorage(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Attribution;
  } catch {
    return null;
  }
}

function writeStorage(data: Attribution): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

function pickUtm(search: URLSearchParams): Partial<Attribution> {
  const out: Partial<Attribution> = {};
  for (const key of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ] as const) {
    const v = search.get(key)?.trim();
    if (v) out[key] = v.slice(0, 120);
  }
  const from = search.get("from")?.trim();
  if (from) out.from = from.slice(0, 120);
  return out;
}

/** Capture first-touch attribution from URL + referrer (client only). */
export function captureAttributionFromLocation(): Attribution | null {
  if (typeof window === "undefined") return null;

  const search = new URLSearchParams(window.location.search);
  const incoming = pickUtm(search);
  const hasIncoming = Object.keys(incoming).length > 0;
  const existing = readStorage();

  if (!hasIncoming && existing) return existing;

  const next: Attribution = {
    ...(existing ?? {}),
    ...incoming,
    landing_path: existing?.landing_path ?? window.location.pathname,
  };

  if (!next.referrer && document.referrer) {
    try {
      const refHost = new URL(document.referrer).hostname;
      if (refHost && refHost !== window.location.hostname) {
        next.referrer = refHost.slice(0, 120);
      }
    } catch {
      /* ignore */
    }
  }

  writeStorage(next);
  return next;
}

export function getStoredAttribution(): Attribution | null {
  return readStorage();
}

export function mergeAttributionMetadata(
  metadata?: Record<string, unknown>,
): Record<string, unknown> | undefined {
  const attr = getStoredAttribution();
  if (!attr) return metadata;
  const merged: Record<string, unknown> = { ...(metadata ?? {}) };
  for (const [k, v] of Object.entries(attr)) {
    if (v != null && merged[k] == null) merged[k] = v;
  }
  return Object.keys(merged).length > 0 ? merged : undefined;
}

export function buildPromoUrl(
  path: string,
  params: {
    source: string;
    medium?: string;
    campaign?: string;
    content?: string;
  },
  origin?: string,
): string {
  const base =
    origin?.replace(/\/$/, "") ||
    (typeof window !== "undefined" ? window.location.origin : "https://frensei.jp");
  const url = new URL(path.startsWith("/") ? path : `/${path}`, base);
  url.searchParams.set("utm_source", params.source);
  if (params.medium) url.searchParams.set("utm_medium", params.medium);
  if (params.campaign) url.searchParams.set("utm_campaign", params.campaign);
  if (params.content) url.searchParams.set("utm_content", params.content);
  return url.toString();
}

export function appendUtmToUrl(
  href: string,
  params: { source: string; medium?: string; campaign?: string },
): string {
  try {
    const url = new URL(href, typeof window !== "undefined" ? window.location.origin : "https://frensei.jp");
    if (!url.searchParams.has("utm_source")) url.searchParams.set("utm_source", params.source);
    if (params.medium && !url.searchParams.has("utm_medium")) {
      url.searchParams.set("utm_medium", params.medium);
    }
    if (params.campaign && !url.searchParams.has("utm_campaign")) {
      url.searchParams.set("utm_campaign", params.campaign);
    }
    return url.pathname + url.search + url.hash;
  } catch {
    return href;
  }
}
