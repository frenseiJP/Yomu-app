CREATE TABLE IF NOT EXISTS public.beta_event_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id TEXT NULL,
  session_id TEXT NULL,
  route TEXT NULL,
  metadata JSONB NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_beta_event_logs_created_at
  ON public.beta_event_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_beta_event_logs_event_type
  ON public.beta_event_logs (event_type);

CREATE INDEX IF NOT EXISTS idx_beta_event_logs_user_id
  ON public.beta_event_logs (user_id);

ALTER TABLE public.beta_event_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "beta_event_logs_no_direct_access" ON public.beta_event_logs;
CREATE POLICY "beta_event_logs_no_direct_access"
  ON public.beta_event_logs
  FOR ALL
  TO public
  USING (false)
  WITH CHECK (false);

GRANT ALL ON public.beta_event_logs TO service_role;
