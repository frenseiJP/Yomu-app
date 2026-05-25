CREATE TABLE IF NOT EXISTS public.beta_feedback_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  display_name TEXT NULL,
  body TEXT NOT NULL,
  route TEXT NULL,
  source TEXT NOT NULL DEFAULT 'feedback_form',
  sheets_synced BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_beta_feedback_submissions_created_at
  ON public.beta_feedback_submissions (created_at DESC);

ALTER TABLE public.beta_feedback_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "beta_feedback_submissions_no_direct_access" ON public.beta_feedback_submissions;
CREATE POLICY "beta_feedback_submissions_no_direct_access"
  ON public.beta_feedback_submissions
  FOR ALL
  TO public
  USING (false)
  WITH CHECK (false);

GRANT ALL ON public.beta_feedback_submissions TO service_role;
