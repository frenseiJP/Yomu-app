import { DICTIONARY } from "./dictionary";
import type { Lang } from "./types";

export function t(lang: Lang, key: keyof typeof DICTIONARY["ja"]): string {
  const row = DICTIONARY[lang];
  const value = row[key];
  if (typeof value === "string" && value.length > 0) {
    return value;
  }
  return DICTIONARY.en[key] ?? DICTIONARY.ja[key] ?? String(key);
}

