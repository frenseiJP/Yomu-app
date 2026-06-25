import { type NextRequest, NextResponse } from "next/server";
import { EXPLICIT_LANG_COOKIE } from "@/lib/i18n/resolveLanguage";
import { updateSession } from "@/src/utils/supabase/middleware";

const LANG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const APP_PATH_PREFIXES = [
  "/",
  "/app",
  "/chat",
  "/vocabulary",
  "/progress",
  "/more",
  "/settings",
  "/onboarding",
  "/history",
  "/login",
  "/terms",
  "/privacy",
  "/contact",
  "/feedback",
  "/learn",
  "/report",
  "/try",
];

function isAppShellPath(pathname: string): boolean {
  return APP_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * Base language is English until the user explicitly saves a language choice.
 */
function ensureLanguageCookie(request: NextRequest, response: NextResponse): void {
  if (!isAppShellPath(request.nextUrl.pathname)) return;
  if (request.cookies.get(EXPLICIT_LANG_COOKIE)?.value === "1") return;

  response.cookies.set("yomu_lang", "en", {
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
