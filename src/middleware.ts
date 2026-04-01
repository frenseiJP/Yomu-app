import { type NextRequest } from "next/server";
import { updateSession } from "@/src/utils/supabase/middleware";

/**
 * Supabase Auth のセッションをリフレッシュするため、
 * 該当するルートで updateSession を実行します。
 */
const LANG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  // 新規登録後のオンボーディング: 言語クッキーが無い場合は英語を既定にする
  if (request.nextUrl.pathname === "/onboarding") {
    if (!request.cookies.get("yomu_lang")?.value) {
      response.cookies.set("yomu_lang", "en", {
        path: "/",
        maxAge: LANG_COOKIE_MAX_AGE,
        sameSite: "lax",
      });
    }
    if (!request.cookies.get("yomu_first_lang")?.value) {
      response.cookies.set("yomu_first_lang", "en", {
        path: "/",
        maxAge: LANG_COOKIE_MAX_AGE,
        sameSite: "lax",
      });
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * 以下のパスを除くすべてのリクエストでミドルウェアを実行します。
     * - _next/static (静的ファイル)
     * - _next/image (画像最適化)
     * - favicon.ico
     * - 画像などの静的アセット
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
