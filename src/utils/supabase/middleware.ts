import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value);
      });
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
