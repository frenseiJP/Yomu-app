import { cookies } from "next/headers";
import {
  EXPLICIT_LANG_COOKIE,
  LANG_POLICY_VERSION,
  resolveLanguage,
} from "@/lib/i18n/resolveLanguage";
import type { Lang } from "./types";

export function getLangServer(): Lang {
  const store = cookies();
  const policyVersion = store.get("yomu_lang_rev")?.value ?? null;
  const saved = store.get("yomu_lang")?.value ?? null;
  const explicit = store.get(EXPLICIT_LANG_COOKIE)?.value === "1";
  return resolveLanguage({
    savedPreference: saved,
    explicitUserChoice: explicit,
    policyVersion,
  });
}
