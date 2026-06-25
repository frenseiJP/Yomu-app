import { cookies } from "next/headers";
import { resolveLanguage } from "@/lib/i18n/resolveLanguage";
import type { Lang } from "./types";

export function getLangServer(): Lang {
  const saved = cookies().get("yomu_lang")?.value ?? null;
  return resolveLanguage({ savedPreference: saved });
}
