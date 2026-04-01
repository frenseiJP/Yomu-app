import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// ビルド時や環境変数未設定時はダミーURLで初期化（createClient は空文字でエラーになるため）
const url = supabaseUrl || "https://placeholder.supabase.co";
const key = supabaseAnonKey || "placeholder-anon-key";

export const supabase: SupabaseClient = createClient(url, key);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

