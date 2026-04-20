# Frensei — Product architecture (MVP)

## Brand promise

**Stop sounding like a textbook. Start sounding natural.**  
Chat-first AI coach for **nuance, politeness, and real-life Japanese** — not grammar drills or dictionary mode.

---

## Implementation plan (phased)

| Phase | Scope | Status |
|-------|--------|--------|
| 1 | Chat-first coaching, FTUE picker, save candidates (correction → phrase → word), chat UI density | In progress / shipped pieces |
| 2 | Daily mission (one/day, real-life, `Start` → chat), mission completion + streak + growth | Shipped |
| 3 | Vocabulary as personal library (types, filters, detail) | Partial (`/vocabulary`, `lib/vocabulary`) |
| 4 | Topic guided practice | Shipped (`TopicGuidedLearning`, `lib/topic`) |
| 5 | Seasonal progress (visual, low numeracy) | Shipped (`SeasonalProgressCard`, `ProgressVisual`, `lib/progress`) |

---

## File structure (MVP)

```
app/
  YomuPrototypePage.tsx      # Shell: tabs Home · Topic · Chat · Progress · More + chat/mission/progress UI
  page.tsx                   # Default shell (home)
  chat/ topic/ progress/ more/ …

components/
  chat/                      # Session drawer, FTUE picker
  habit/                     # Retention mission card, reviews
  progress/                  # ProgressVisual, SeasonalGrowthVisual, MissionRewardToast
  topic/                     # Guided topic flow
  vocabulary/                # Library UI

lib/
  chat/                      # Sessions + messages (userId-scoped localStorage)
  mission/                   # retentionDaily, completion (singular folder name in repo)
  missions/                  # Re-export barrel → `@/lib/missions`
  save-candidates/           # Correction / phrase / word extraction + save
  vocabulary/              # Items + storage
  topic/                     # Prompts + feedback persistence
  progress/                  # Seasonal state, missionGrowth streak
  habit/                     # progress_v1, coach context, reviews
  ftue/                      # First chat gate + FTUE coach API path
```

---

## Data & storage (MVP)

| Concern | Mechanism |
|---------|-----------|
| Anonymous / auth user id | `getOrCreateUserId` + Supabase user when logged in |
| Scope | Keys include `userId` (`frensei:habit:*`, `frensei:chat:v1:*`, etc.) |
| Missions (daily) | `retention_daily_v1` + `getOrCreateRetentionDailyMission` |
| Mission growth / streak | `mission_growth_v1` (`readMissionGrowth`, `applyMissionGrowthOnCompletion`) |
| Chat | `lib/chat/storage` |
| Vocabulary | `frensei_vocabulary_v1` + types in `lib/vocabulary/types` |

---

## Chat coaching contract

- **FTUE / structured path**: `/api/chat/ftue` returns JSON → client renders **Nice / Better / Why / Other ways / Try again**.
- **General chat**: `/api/chat` stream; system prompt encodes Frensei positioning (natural Japanese, no “session over” closings).
- **Save row**: After enrich, up to 3 candidates; UI labels **`[Correction]`**, **`[Useful phrase]`**, **`[Word]`**, **`[Save]`**.

---

## Future migration (Supabase)

1. Replace `readHabitJson` / `getStorage` adapters with Supabase tables: `user_progress`, `daily_missions`, `chat_sessions`, `vocabulary_items`.
2. Keep **DTO shapes** (`RetentionDailyMission`, `VocabularyItem`, `ChatMessage`) stable so UI does not churn.
3. Add `user_id` RLS; keep `getOrCreateUserId` as fallback until auth is mandatory.
4. Move `mission_growth_v1` and `retention_daily_v1` into a single `user_gamification` row or normalized tables.

---

## Navigation (product shell)

Bottom tabs: **Home** · **Topic** · **Chat** · **Progress** · **More**  
`TabView`: `home | progress | chat | topic | settings | more`  
More: links to **Vocabulary**, **Settings**, report/feedback as needed.

---

## Notes

- Affiliate / monetization: `isAffiliateBarVisibleForPath` returns `false` under nav — keep learning surface clean.
- JLPT in coach context for daily mission text defaults to **N3** when building server coach payload without UI state; align later with persisted JLPT from client if required.
- Security rollout guide: see [`docs/security-rollout-checklist.md`](./security-rollout-checklist.md).
