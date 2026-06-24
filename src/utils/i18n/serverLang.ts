import { cookies, headers } from "next/headers";
import type { Lang } from "./types";

const ALLOWED: Lang[] = ["ja", "en", "ko", "zh"];

function normalize(raw: string | null | undefined): Lang {
  if (raw && ALLOWED.includes(raw as Lang)) return raw as Lang;
  return "en";
}

function detectFromAcceptLanguage(header: string | null): Lang {
  if (!header) return "en";
  const lower = header.toLowerCase();
  if (lower.includes("ja")) return "ja";
  if (lower.includes("ko")) return "ko";
  if (lower.includes("zh")) return "zh";
  return "en";
}

export function getLangServer(): Lang {
  const store = cookies();
  const cookieLang = normalize(
    store.get("yomu_lang")?.value ?? store.get("yomu_first_lang")?.value,
  );
  if (store.get("yomu_lang")?.value || store.get("yomu_first_lang")?.value) {
    return cookieLang;
  }
  const accept = headers().get("accept-language");
  return detectFromAcceptLanguage(accept);
}
