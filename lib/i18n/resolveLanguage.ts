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

export const EXPLICIT_LANG_COOKIE = "yomu_lang_user";

/** Bump when default-language policy changes — forces one-time reset to English. */
export const LANG_POLICY_VERSION = "4";

export type ResolveLanguageInput = {
  /** yomu_lang cookie — user saved display language */
  savedPreference?: string | null;
  /** When true, honor savedPreference (user saved in Settings / onboarding) */
  explicitUserChoice?: boolean;
  /** Must match LANG_POLICY_VERSION or fall back to English */
  policyVersion?: string | null;
};

/**
 * English is the base language.
 * ja / ko / zh apply only after the user explicitly saves a language choice.
 */
export function resolveLanguage(input: ResolveLanguageInput): Lang {
  if (input.policyVersion !== LANG_POLICY_VERSION) return "en";
  if (!input.explicitUserChoice) return "en";
  const raw = input.savedPreference;
  if (isLang(raw)) return raw;
  return "en";
}

export function htmlLangAttribute(lang: Lang): string {
  return lang === "zh" ? "zh-Hans" : lang;
}
