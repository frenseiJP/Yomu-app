import type { SupabaseClient } from "@supabase/supabase-js";
import { checkUserProfileStatus } from "@/lib/auth/profile";
import { sanitizePostAuthPath } from "@/lib/auth/postLoginPath";

export async function resolvePostLoginPath(
  supabase: SupabaseClient,
  requestedNext?: string | null,
): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return "/login";

  const profileStatus = await checkUserProfileStatus(supabase, user.id);
  if (profileStatus === "missing_profile") return "/onboarding";

  return sanitizePostAuthPath(requestedNext);
}
