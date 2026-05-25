import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function saveFeedbackToSupabase(input: {
  userId: string;
  displayName?: string;
  body: string;
  route?: string;
  source?: string;
  sheetsSynced: boolean;
}): Promise<boolean> {
  try {
    const supabase = getAdminClient();
    if (!supabase) return false;
    const { error } = await supabase.from("beta_feedback_submissions").insert({
      user_id: input.userId,
      display_name: input.displayName ?? null,
      body: input.body,
      route: input.route ?? "/feedback",
      source: input.source ?? "feedback_form",
      sheets_synced: input.sheetsSynced,
    });
    return !error;
  } catch {
    return false;
  }
}
