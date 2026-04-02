import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** App Store / インストール広告などの URL から来た未ログインユーザーを先に /login へ誘導する */
const INSTALL_FROM_VALUES = new Set([
  "app_store",
  "app-store",
  "appstore",
  "download",
]);

function installLandingWantsAuthFirst(url: URL): boolean {
  const q = url.searchParams;
  const from = q.get("from")?.toLowerCase();
  if (from && INSTALL_FROM_VALUES.has(from)) return true;
  const install = q.get("install");
  return install === "1" || install === "true";
}

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie.name, cookie.value);
  });
}

/**
 * Next.js の Edge Middleware 用の Supabase クライアントを作成します。
 * リクエストの Cookie を読み、レスポンスに Cookie を書き込みます。
 */
function createClient(request: NextRequest) {
  const response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return { supabase: null, response };
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  return { supabase, response };
}

/**
 * ミドルウェアでセッションを更新します。
 * トークンのリフレッシュを行い、更新された Cookie をレスポンスに付与します。
 * ログイン済みユーザーが /login にアクセスした場合は /chat へリダイレクトします。
 */
export async function updateSession(request: NextRequest) {
  const { supabase, response } = createClient(request);

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && request.nextUrl.pathname === "/login") {
      const url = request.nextUrl.clone();
      url.pathname = "/chat";
      const redirectResponse = NextResponse.redirect(url);
      copyCookies(response, redirectResponse);
      return redirectResponse;
    }

    if (
      !user &&
      request.nextUrl.pathname === "/" &&
      installLandingWantsAuthFirst(request.nextUrl)
    ) {
      const loginUrl = new URL("/login", request.url);
      const from = request.nextUrl.searchParams.get("from");
      if (from) loginUrl.searchParams.set("from", from);
      else loginUrl.searchParams.set("from", "app_store");
      if (request.nextUrl.searchParams.get("install")) {
        loginUrl.searchParams.set(
          "install",
          request.nextUrl.searchParams.get("install")!,
        );
      }
      if (request.nextUrl.searchParams.get("signup") === "1") {
        loginUrl.searchParams.set("intent", "signup");
      }
      const redirectResponse = NextResponse.redirect(loginUrl);
      copyCookies(response, redirectResponse);
      return redirectResponse;
    }

    if (!user && request.nextUrl.pathname === "/chat") {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return response;
}
