import { createBrowserClient } from "@supabase/ssr";

/**
 * クライアントコンポーネント用の Supabase クライアントを作成します。
 * ブラウザで実行され、セッションは Cookie で管理されます。
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase の URL と Anon Key を設定してください。.env.local に NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY を追加してください。"
    );
  }

  return createBrowserClient(url, anonKey);
}
