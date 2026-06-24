import { readHabitJson, writeHabitJson } from "@/lib/habit/storage";
import {
  EMPTY_ONBOARDING_RESPONSE,
  normalizeOnboardingResponse,
  type OnboardingResponse,
} from "@/lib/onboarding/schema";

const LOCAL_KIND = "onboarding_response_v2";

export function readOnboardingResponse(userId: string): OnboardingResponse {
  const legacy = readHabitJson<{ why: string; hardest: string; minutes: string }>(
    "onboarding_goals_v1",
    userId,
    EMPTY_ONBOARDING_RESPONSE,
  );
  const current = readHabitJson<OnboardingResponse>(LOCAL_KIND, userId, EMPTY_ONBOARDING_RESPONSE);
  if (current.why || current.hardest || current.minutes) {
    return normalizeOnboardingResponse(current);
  }
  if (legacy.why || legacy.hardest || legacy.minutes) {
    return normalizeOnboardingResponse({
      why: legacy.why,
      hardest: legacy.hardest,
      minutes: legacy.minutes,
    });
  }
  return EMPTY_ONBOARDING_RESPONSE;
}

export function writeOnboardingResponse(userId: string, response: OnboardingResponse): void {
  const normalized = normalizeOnboardingResponse({
    ...response,
    answeredAt: response.answeredAt ?? new Date().toISOString(),
  });
  writeHabitJson(LOCAL_KIND, userId, normalized);
  writeHabitJson("onboarding_goals_v1", userId, {
    why: normalized.why,
    hardest: normalized.hardest,
    minutes: normalized.minutes,
  });
}

/** Persist to Supabase when table exists (logged-in users). */
export async function syncOnboardingResponseToSupabase(
  userId: string,
  response: OnboardingResponse,
): Promise<void> {
  if (typeof window === "undefined") return;
  const normalized = normalizeOnboardingResponse(response);
  if (!normalized.why && !normalized.hardest && !normalized.minutes) return;

  try {
    const { createClient } = await import("@/src/utils/supabase/client");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || user.id !== userId) return;

    await supabase.from("user_onboarding_responses").upsert(
      {
        user_id: user.id,
        why_learning: normalized.why || null,
        hardest_area: normalized.hardest || null,
        minutes_per_day: normalized.minutes || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
  } catch {
    /* table may not exist yet in local dev */
  }
}
