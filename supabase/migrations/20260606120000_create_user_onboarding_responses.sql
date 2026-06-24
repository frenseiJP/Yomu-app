-- Frensei: onboarding questionnaire responses (schema only — no payment linkage)
CREATE TABLE IF NOT EXISTS public.user_onboarding_responses (
  user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  why_learning TEXT CHECK (
    why_learning IS NULL OR why_learning IN ('travel', 'work', 'anime', 'living', 'other')
  ),
  hardest_area TEXT CHECK (
    hardest_area IS NULL OR hardest_area IN ('speaking', 'listening', 'grammar', 'vocabulary', 'confidence')
  ),
  minutes_per_day TEXT CHECK (
    minutes_per_day IS NULL OR minutes_per_day IN ('2', '5', '10', '20+')
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.user_onboarding_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_onboarding_responses_own" ON public.user_onboarding_responses;
CREATE POLICY "user_onboarding_responses_own"
  ON public.user_onboarding_responses
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE ON public.user_onboarding_responses TO authenticated;
GRANT ALL ON public.user_onboarding_responses TO service_role;
