-- Frensei: run once in Supabase SQL Editor
-- https://supabase.com/dashboard/project/ardvgckclusmzwranpsd/sql/new

-- user_profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Frensei',
  icon TEXT NOT NULL DEFAULT '🌸',
  kokuseki TEXT NOT NULL DEFAULT 'OTHER',
  first_language TEXT NOT NULL DEFAULT 'ja',
  settings_language TEXT NOT NULL DEFAULT 'en',
  native_language TEXT NOT NULL DEFAULT 'en',
  region TEXT NOT NULL DEFAULT 'East Asia',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_profiles_select_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON public.user_profiles;
CREATE POLICY "user_profiles_select_own" ON public.user_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_profiles_insert_own" ON public.user_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_profiles_update_own" ON public.user_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
GRANT ALL ON public.user_profiles TO service_role;

-- beta_event_logs
CREATE TABLE IF NOT EXISTS public.beta_event_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id TEXT NULL,
  session_id TEXT NULL,
  route TEXT NULL,
  metadata JSONB NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_beta_event_logs_created_at ON public.beta_event_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_beta_event_logs_event_type ON public.beta_event_logs (event_type);
CREATE INDEX IF NOT EXISTS idx_beta_event_logs_user_id ON public.beta_event_logs (user_id);
ALTER TABLE public.beta_event_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "beta_event_logs_no_direct_access" ON public.beta_event_logs;
CREATE POLICY "beta_event_logs_no_direct_access" ON public.beta_event_logs FOR ALL TO public USING (false) WITH CHECK (false);
GRANT ALL ON public.beta_event_logs TO service_role;

-- daily views
CREATE OR REPLACE VIEW public.beta_event_logs_daily AS
SELECT date_trunc('day', created_at) AS day, event_type, count(*)::bigint AS event_count, count(DISTINCT user_id)::bigint AS unique_users
FROM public.beta_event_logs GROUP BY 1, 2 ORDER BY 1 DESC, 2 ASC;
GRANT SELECT ON public.beta_event_logs_daily TO service_role;

CREATE OR REPLACE VIEW public.beta_event_logs_route_daily AS
SELECT date_trunc('day', created_at) AS day, COALESCE(NULLIF(route, ''), 'unknown') AS route, event_type, count(*)::bigint AS event_count, count(DISTINCT user_id)::bigint AS unique_users
FROM public.beta_event_logs GROUP BY 1, 2, 3 ORDER BY 1 DESC, 4 DESC;
GRANT SELECT ON public.beta_event_logs_route_daily TO service_role;

-- beta_feedback_submissions
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
CREATE INDEX IF NOT EXISTS idx_beta_feedback_submissions_created_at ON public.beta_feedback_submissions (created_at DESC);
ALTER TABLE public.beta_feedback_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "beta_feedback_submissions_no_direct_access" ON public.beta_feedback_submissions;
CREATE POLICY "beta_feedback_submissions_no_direct_access" ON public.beta_feedback_submissions FOR ALL TO public USING (false) WITH CHECK (false);
GRANT ALL ON public.beta_feedback_submissions TO service_role;
