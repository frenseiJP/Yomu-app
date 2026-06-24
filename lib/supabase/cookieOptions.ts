import type { CookieOptions } from "@supabase/ssr";

/** Share auth session across frensei.jp and app.frensei.jp in production. */
export function getSupabaseCookieOptions(): CookieOptions | undefined {
  if (process.env.NODE_ENV !== "production") return undefined;
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  if (site.includes("frensei.jp")) {
    return {
      domain: ".frensei.jp",
      path: "/",
      sameSite: "lax",
      secure: true,
    };
  }
  return undefined;
}
