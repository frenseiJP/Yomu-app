import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { resolvePostLoginPath } from "@/lib/auth/resolvePostLoginPath";
import { createClient } from "@/src/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next");

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const destination = await resolvePostLoginPath(supabase, next);
      return NextResponse.redirect(`${origin}${destination}`);
    }
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      const destination = await resolvePostLoginPath(supabase, next);
      return NextResponse.redirect(`${origin}${destination}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback`);
}
