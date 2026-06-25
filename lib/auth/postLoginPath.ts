/** Paths allowed after OAuth / email auth callback (`next` query). */
const ALLOWED_POST_AUTH_PATHS = new Set([
  "/app",
  "/chat",
  "/onboarding",
  "/vocabulary",
  "/progress",
  "/more",
  "/settings",
  "/feedback",
  "/report",
  "/history",
  "/learn",
]);

export function sanitizePostAuthPath(next: string | null | undefined): string {
  if (!next?.trim()) return "/app";
  const path = next.trim().split("?")[0]?.split("#")[0] ?? "";
  if (!path.startsWith("/") || path.startsWith("//")) return "/app";
  return ALLOWED_POST_AUTH_PATHS.has(path) ? path : "/app";
}
