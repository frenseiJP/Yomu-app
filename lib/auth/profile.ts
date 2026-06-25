import type { SupabaseClient } from "@supabase/supabase-js";

export type ProfileCheckResult = "has_profile" | "missing_profile" | "unknown";

export async function checkUserProfileStatus(
  supabase: SupabaseClient,
  userId: string,
): Promise<ProfileCheckResult> {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("user_id")
      .eq("user_id", userId)
      .limit(1);

    if (error) return "unknown";
    if (!data || data.length === 0) return "missing_profile";
    return "has_profile";
  } catch {
    return "unknown";
  }
}
