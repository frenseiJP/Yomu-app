import {
  EXPLICIT_LANG_COOKIE,
  resolveLanguage,
  resolveLangFromBrowserLanguages,
} from "@/lib/i18n/resolveLanguage";
import type { Lang } from "./types";

const ALLOWED: Lang[] = ["ja", "en", "ko", "zh"];

export function normalizeDisplayLang(raw: string | null | undefined): Lang {
  return ALLOWED.includes(raw as Lang) ? (raw as Lang) : "en";
}

/** @deprecated use resolveLangFromBrowserLanguages from resolveLanguage */
export function detectBrowserLang(): Lang {
  if (typeof navigator === "undefined") return "en";
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
  return resolveLangFromBrowserLanguages(langs);
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const target = `${name}=`;
  const found = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(target));
  if (!found) return null;
  return decodeURIComponent(found.slice(target.length));
}

export function getLangClient(): Lang {
  if (typeof document === "undefined") return "en";

  return resolveLanguage({
    savedPreference: readCookie("yomu_lang"),
    explicitUserChoice: readCookie(EXPLICIT_LANG_COOKIE) === "1",
  });
}
