import { cookies } from "next/headers";
import type { Lang } from "./types";

const ALLOWED: Lang[] = ["ja", "en", "ko", "zh"];

export function getLangServer(): Lang {
  const store = cookies();
  const raw =
    store.get("yomu_lang")?.value ??
    store.get("yomu_first_lang")?.value ??
    "en";
  return ALLOWED.includes(raw as Lang) ? (raw as Lang) : "en";
}

