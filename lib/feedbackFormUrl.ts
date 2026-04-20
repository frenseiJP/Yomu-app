/**
 * 感想・フィードバック用 Google フォームなどの URL。
 * 本番では Vercel の Environment Variables で NEXT_PUBLIC_FEEDBACK_FORM_URL を設定可能。
 */
export const FEEDBACK_FORM_URL =
  process.env.NEXT_PUBLIC_FEEDBACK_FORM_URL?.trim() ||
  "あなたのGoogleフォームのURL";

export function isFeedbackFormConfigured(): boolean {
  const u = FEEDBACK_FORM_URL.trim();
  return u.startsWith("http://") || u.startsWith("https://");
}
