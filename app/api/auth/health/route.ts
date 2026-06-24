import { NextResponse } from "next/server";

export async function GET(): Promise<Response> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    return NextResponse.json({
      ok: false,
      reason: "missing_config",
      message: "NEXT_PUBLIC_SUPABASE_URL / ANON_KEY が未設定です。",
    });
  }

  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/auth/v1/health`, {
      headers: { apikey: anonKey },
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });

    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      url,
      message: res.ok ? "ok" : `auth health HTTP ${res.status}`,
    });
  } catch {
    return NextResponse.json({
      ok: false,
      reason: "unreachable",
      url,
      message: "Supabase プロジェクトに接続できません（削除・一時停止の可能性）。",
    });
  }
}
