import { type NextRequest, NextResponse } from "next/server";
import { parseAcceptLanguage } from "@/lib/i18n/resolveLanguage";
import { updateSession } from "@/src/utils/supabase/middleware";

const LANG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const APP_PATH_PREFIXES = ["/app", "/chat", "/vocabulary", "/progress", "/more", "/settings", "/onboarding", "/history"];

function isAppShellPath(pathname: string): boolean {
  return APP_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * Set yomu_lang once from Accept-Language when the user has no saved preference.
 * Does not overwrite an existing cookie (user or prior resolution).
 */
function ensureLanguageCookie(request: NextRequest, response: NextResponse): void {
  if (!isAppShellPath(request.nextUrl.pathname)) return;
  if (request.cookies.get("yomu_lang")?.value) return;

  const lang = parseAcceptLanguage(request.headers.get("accept-language"));
  response.cookies.set("yomu_lang", lang, {
    path: "/",
    maxAge: LANG_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
}

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  ensureLanguageCookie(request, response);

  if (request.nextUrl.pathname === "/home") {
    const url = request.nextUrl.clone();
    url.pathname = "/app";
    const redirectResponse = NextResponse.redirect(url, 301);
    response.cookies.getAll().forEach((c) => {
      redirectResponse.cookies.set(c.name, c.value);
    });
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
