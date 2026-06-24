import type { Lang } from "@/src/utils/i18n/types";
import { t } from "@/src/utils/i18n/t";

export function formatAuthErrorMessage(
  err: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  return formatAuthErrorMessageForLang("en", err, fallback);
}

export function formatAuthErrorMessageForLang(
  lang: Lang,
  err: unknown,
  fallback?: string,
): string {
  const fb = fallback ?? (lang === "ja" ? "エラーが発生しました。もう一度お試しください。" : "Something went wrong. Please try again.");
  if (!err) return fb;

  const message =
    typeof err === "string"
      ? err
      : err instanceof Error
        ? err.message
        : typeof (err as { message?: unknown }).message === "string"
          ? String((err as { message: string }).message)
          : fb;

  const lower = message.toLowerCase();
  if (
    lower.includes("failed to fetch") ||
    lower.includes("networkerror") ||
    lower.includes("network request failed") ||
    lower.includes("load failed")
  ) {
    return t(lang, "authErrorNetwork");
  }
  if (lower.includes("invalid login")) {
    return t(lang, "authErrorInvalidLogin");
  }
  if (lower.includes("already registered")) {
    return t(lang, "authErrorAlreadyRegistered");
  }
  if (lower.includes("email not confirmed")) {
    return t(lang, "authErrorEmailNotConfirmed");
  }

  return message;
}
