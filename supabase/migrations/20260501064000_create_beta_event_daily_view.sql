CREATE OR REPLACE VIEW public.beta_event_logs_daily AS
SELECT
  date_trunc('day', created_at) AS day,
  event_type,
  count(*)::bigint AS event_count,
  count(DISTINCT user_id)::bigint AS unique_users
FROM public.beta_event_logs
GROUP BY 1, 2
ORDER BY 1 DESC, 2 ASC;

GRANT SELECT ON public.beta_event_logs_daily TO service_role;
