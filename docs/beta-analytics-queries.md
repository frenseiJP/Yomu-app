# Beta analytics — example Supabase queries

Events land in `beta_event_logs`. Daily rollups: `beta_event_logs_daily`, `beta_event_logs_route_daily`.

## Tab usage (last 7 days)

```sql
SELECT metadata->>'tab' AS tab, COUNT(*) AS views, COUNT(DISTINCT user_id) AS users
FROM beta_event_logs
WHERE event_type = 'shell_view'
  AND created_at > now() - interval '7 days'
GROUP BY 1
ORDER BY views DESC;
```

## Home CTA clicks

```sql
SELECT metadata->>'cta' AS cta, COUNT(*) AS clicks, COUNT(DISTINCT user_id) AS users
FROM beta_event_logs
WHERE event_type = 'home_cta_click'
  AND created_at > now() - interval '30 days'
GROUP BY 1
ORDER BY clicks DESC;
```

## Scenario funnel

```sql
SELECT
  COUNT(DISTINCT user_id) FILTER (WHERE event_type = 'scenario_started') AS started,
  COUNT(DISTINCT user_id) FILTER (WHERE event_type = 'topic_submit') AS submitted,
  COUNT(DISTINCT user_id) FILTER (WHERE event_type = 'chat_send' AND metadata->>'mode' = 'topic') AS topic_sends
FROM beta_event_logs
WHERE created_at > now() - interval '30 days';
```

## Save funnel (per message)

```sql
SELECT
  COUNT(DISTINCT user_id) FILTER (WHERE event_type = 'save_prompt_shown') AS saw_save,
  COUNT(DISTINCT user_id) FILTER (WHERE event_type = 'save_clicked') AS clicked_save,
  COUNT(DISTINCT user_id) FILTER (WHERE event_type = 'vocabulary_save' AND metadata->>'source' = 'save_candidate') AS saved
FROM beta_event_logs
WHERE created_at > now() - interval '30 days';
```

## Core loop drop-off

```sql
WITH u AS (
  SELECT user_id,
    BOOL_OR(event_type = 'chat_send') AS sent,
    BOOL_OR(event_type = 'coach_correction_received') AS corrected,
    BOOL_OR(event_type = 'save_clicked') AS save_click
  FROM beta_event_logs
  WHERE user_id IS NOT NULL AND created_at > now() - interval '30 days'
  GROUP BY 1
)
SELECT
  COUNT(*) FILTER (WHERE sent) AS sent_users,
  COUNT(*) FILTER (WHERE sent AND corrected) AS corrected_users,
  COUNT(*) FILTER (WHERE sent AND save_click) AS save_click_users
FROM u;
```
