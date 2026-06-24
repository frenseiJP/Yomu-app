import type { Lang } from "./types";

const ALLOWED: Lang[] = ["ja", "en", "ko", "zh"];

export function normalizeDisplayLang(raw: string | null | undefined): Lang {
  return ALLOWED.includes(raw as Lang) ? (raw as Lang) : "en";
}

export function detectBrowserLang(): Lang {
  if (typeof navigator === "undefined") return "en";
  const langs = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  for (const l of langs) {
    const code = (l ?? "").toLowerCase();
    if (code.startsWith("ja")) return "ja";
    if (code.startsWith("ko")) return "ko";
    if (code.startsWith("zh")) return "zh";
    if (code.startsWith("en")) return "en";
  }
  return "en";
}

export function getLangClient(): Lang {
  if (typeof document === "undefined") return "en";
  const read = (name: string) => {
    const target = `${name}=`;
    const found = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(target));
    if (!found) return null;
    return decodeURIComponent(found.slice(target.length));
  };

  const raw =
    read("yomu_lang") ??
    read("yomu_first_lang") ??
    "en";
  return normalizeDisplayLang(raw);
}

