import { cookies, headers } from "next/headers";
import { resolveLanguage } from "@/lib/i18n/resolveLanguage";
import type { Lang } from "./types";

export function getLangServer(): Lang {
  const store = cookies();
  const saved = store.get("yomu_lang")?.value ?? null;
  const accept = headers().get("accept-language");

  return resolveLanguage({
    savedPreference: saved,
    acceptLanguage: accept,
  });
}
