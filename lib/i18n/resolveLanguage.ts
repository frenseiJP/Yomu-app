import type { Lang } from "@/src/utils/i18n/types";

const ALLOWED: Lang[] = ["ja", "en", "ko", "zh"];

export function isLang(value: string | null | undefined): value is Lang {
  return !!value && ALLOWED.includes(value as Lang);
}

/** Map BCP-47 tag (en-US, ja-JP, ko-KR, zh-CN, zh-TW) → supported Lang */
export function resolveLangFromBcp47(tag: string): Lang | null {
  const primary = tag.trim().toLowerCase().split("-")[0] ?? "";
  if (primary === "ja") return "ja";
  if (primary === "ko") return "ko";
  if (primary === "zh") return "zh";
  if (primary === "en") return "en";
  return null;
}

/** Parse Accept-Language with q-values — never match substrings like "ko" inside "en-US,ko;q=0.8" incorrectly */
export function parseAcceptLanguage(header: string | null | undefined): Lang {
  if (!header?.trim()) return "en";

  const candidates = header
    .split(",")
    .map((part) => {
      const [rawTag, rawQ] = part.trim().split(";q=");
      const tag = rawTag?.trim() ?? "";
      const q = rawQ ? Number.parseFloat(rawQ) : 1;
      return { tag, q: Number.isFinite(q) ? q : 0 };
    })
    .filter((c) => c.tag.length > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of candidates) {
    const lang = resolveLangFromBcp47(tag);
    if (lang) return lang;
  }
  return "en";
}

export function resolveLangFromBrowserLanguages(languages: readonly string[] | undefined): Lang {
  if (!languages?.length) return "en";
  for (const tag of languages) {
    const lang = resolveLangFromBcp47(tag);
    if (lang) return lang;
  }
  return "en";
}

export type ResolveLanguageInput = {
  /** yomu_lang cookie — user saved display preference */
  savedPreference?: string | null;
  /** localStorage mirror (client only) */
  localPreference?: string | null;
  /** navigator.languages (client only) */
  browserLanguages?: readonly string[];
  /** Accept-Language header (server / middleware) */
  acceptLanguage?: string | null;
};

/**
 * Resolution order:
 * 1. User saved preference (cookie / localStorage)
 * 2. Browser locale
 * 3. Accept-Language
 * 4. English
 */
export function resolveLanguage(input: ResolveLanguageInput): Lang {
  if (isLang(input.savedPreference)) return input.savedPreference;
  if (isLang(input.localPreference)) return input.localPreference;

  if (input.browserLanguages?.length) {
    return resolveLangFromBrowserLanguages(input.browserLanguages);
  }

  if (input.acceptLanguage) {
    return parseAcceptLanguage(input.acceptLanguage);
  }

  return "en";
}

export function htmlLangAttribute(lang: Lang): string {
  return lang === "zh" ? "zh-Hans" : lang;
}
