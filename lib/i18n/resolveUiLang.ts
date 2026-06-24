import { cookies } from "next/headers";
import { normalizeUiLang, type UiLang } from "@/lib/chat/openAiChatSystem";

/** Server routes: client body language wins, then yomu_lang cookie, then en. */
export function resolveRequestUiLang(languageFromClient?: unknown): UiLang {
  const fromClient = normalizeUiLang(languageFromClient);
  if (fromClient) return fromClient;

  const cookieLang = cookies().get("yomu_lang")?.value;
  const fromCookie = normalizeUiLang(cookieLang);
  if (fromCookie) return fromCookie;

  return "en";
}
