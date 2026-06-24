-- Frensei: run once in Supabase SQL Editor
-- https://supabase.com/dashboard/project/jlhxzzhkjuduutyfpwzu/sql/new

-- user_profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Frensei',
  icon TEXT NOT NULL DEFAULT 'default',
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

-- user learning data (chat, vocabulary, plans) — see migrations/20260623120000_create_user_learning_data.sql
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_updated ON public.chat_sessions (user_id, updated_at DESC);
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES public.chat_sessions (id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL DEFAULT '',
  meta JSONB NULL,
  created_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON public.chat_messages (session_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON public.chat_messages (user_id);
CREATE TABLE IF NOT EXISTS public.vocabulary_items (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_vocabulary_items_user_updated ON public.vocabulary_items (user_id, updated_at DESC);
CREATE TABLE IF NOT EXISTS public.user_plans (
  user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  chat_messages_today INT NOT NULL DEFAULT 0,
  chat_day DATE NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "chat_sessions_own" ON public.chat_sessions;
CREATE POLICY "chat_sessions_own" ON public.chat_sessions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "chat_messages_own" ON public.chat_messages;
CREATE POLICY "chat_messages_own" ON public.chat_messages FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "vocabulary_items_own" ON public.vocabulary_items;
CREATE POLICY "vocabulary_items_own" ON public.vocabulary_items FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "user_plans_own" ON public.user_plans;
CREATE POLICY "user_plans_own" ON public.user_plans FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "user_plans_insert_own" ON public.user_plans;
CREATE POLICY "user_plans_insert_own" ON public.user_plans FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "user_plans_update_own" ON public.user_plans;
CREATE POLICY "user_plans_update_own" ON public.user_plans FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_messages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vocabulary_items TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_plans TO authenticated;
GRANT ALL ON public.chat_sessions TO service_role;
GRANT ALL ON public.chat_messages TO service_role;
GRANT ALL ON public.vocabulary_items TO service_role;
GRANT ALL ON public.user_plans TO service_role;
