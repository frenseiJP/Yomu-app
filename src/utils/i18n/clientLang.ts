import type { Lang } from "./types";

const ALLOWED: Lang[] = ["ja", "en", "ko", "zh"];

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
  return ALLOWED.includes(raw as Lang) ? (raw as Lang) : "en";
}

