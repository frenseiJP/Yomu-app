import { type NextRequest, NextResponse } from "next/server";
import {
  EXPLICIT_LANG_COOKIE,
  LANG_POLICY_VERSION,
} from "@/lib/i18n/resolveLanguage";
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

function applyEnglishBaseCookies(response: NextResponse, clearExplicit: boolean): void {
  response.cookies.set("yomu_lang_rev", LANG_POLICY_VERSION, {
    path: "/",
    maxAge: LANG_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
  response.cookies.set("yomu_lang", "en", {
    path: "/",
    maxAge: LANG_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
  if (clearExplicit) {
    response.cookies.set(EXPLICIT_LANG_COOKIE, "", {
      path: "/",
      maxAge: 0,
      sameSite: "lax",
    });
  }
}

/** English default until user saves a language in Settings or onboarding. */
function ensureLanguageCookie(request: NextRequest, response: NextResponse): void {
  if (!isAppShellPath(request.nextUrl.pathname)) return;

  const policyOk = request.cookies.get("yomu_lang_rev")?.value === LANG_POLICY_VERSION;
  if (!policyOk) {
    applyEnglishBaseCookies(response, true);
    return;
  }

  if (request.cookies.get(EXPLICIT_LANG_COOKIE)?.value === "1") return;

  applyEnglishBaseCookies(response, false);
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
