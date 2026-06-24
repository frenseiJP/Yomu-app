/** Onboarding questionnaire — data model only (UI may exist separately). */

export const ONBOARDING_WHY_OPTIONS = [
  "travel",
  "work",
  "anime",
  "living",
  "other",
] as const;

export const ONBOARDING_HARDEST_OPTIONS = [
  "speaking",
  "listening",
  "grammar",
  "vocabulary",
  "confidence",
] as const;

export const ONBOARDING_MINUTES_OPTIONS = ["2", "5", "10", "20+"] as const;

export type OnboardingWhy = (typeof ONBOARDING_WHY_OPTIONS)[number];
export type OnboardingHardest = (typeof ONBOARDING_HARDEST_OPTIONS)[number];
export type OnboardingMinutes = (typeof ONBOARDING_MINUTES_OPTIONS)[number];

export type OnboardingResponse = {
  why: OnboardingWhy | "";
  hardest: OnboardingHardest | "";
  minutes: OnboardingMinutes | "";
  answeredAt?: string;
};

export const EMPTY_ONBOARDING_RESPONSE: OnboardingResponse = {
  why: "",
  hardest: "",
  minutes: "",
};

export function isOnboardingWhy(value: string): value is OnboardingWhy {
  return (ONBOARDING_WHY_OPTIONS as readonly string[]).includes(value);
}

export function isOnboardingHardest(value: string): value is OnboardingHardest {
  return (ONBOARDING_HARDEST_OPTIONS as readonly string[]).includes(value);
}

export function isOnboardingMinutes(value: string): value is OnboardingMinutes {
  return (ONBOARDING_MINUTES_OPTIONS as readonly string[]).includes(value);
}

export function normalizeOnboardingResponse(
  raw: { why?: string; hardest?: string; minutes?: string; answeredAt?: string },
): OnboardingResponse {
  return {
    why: raw.why && isOnboardingWhy(raw.why) ? raw.why : "",
    hardest: raw.hardest && isOnboardingHardest(raw.hardest) ? raw.hardest : "",
    minutes: raw.minutes && isOnboardingMinutes(raw.minutes) ? raw.minutes : "",
    answeredAt: raw.answeredAt,
  };
}
