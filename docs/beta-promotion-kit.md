# Frensei ベータプロモーションキット

公開ベータの配信に使うリンク・コピー・手順の一覧です。

## 公式リンク（UTM 付きを生成）

```bash
npm run promo:links
```

| 用途 | パス |
|------|------|
| メイン体験（3メッセージ無料） | `/try` |
| Calendly 体験予約 | `/trial` |
| Product Hunt 用 | `/launch` |
| 日本語 LP | `/ja` |
| フレーズガイド SEO | `/learn` |

---

## SNS プロフィール

**英語 bio 例**
```
AI Japanese coach for natural, real-life Japanese — not textbook drills.
Try 3 free messages (no signup) 👇
https://frensei.jp/try?utm_source=twitter&utm_medium=bio&utm_campaign=beta
```

**日本語 bio 例**
```
教科書の日本語から、自然な日本語へ。AIコーチ Frensei（ベータ）
無料3メッセージ体験 👇
https://frensei.jp/ja?utm_source=instagram&utm_medium=bio&utm_campaign=beta
```

---

## X (Twitter) 投稿 — コピペ用

### 投稿 A（英語）
```
Frensei beta is live 🇯🇵

Stop sounding like a textbook. Chat with an AI coach that explains nuance + culture — not just grammar.

✅ 3 free messages, no signup
✅ Save vocab from real chat

Try it: https://frensei.jp/try?utm_source=twitter&utm_medium=post&utm_campaign=beta

Feedback welcome — we're shipping fast.
```

### 投稿 B（日本語）
```
Frensei ベータ公開中 🌸

「教科書の日本語」から一歩進んで、自然な言い回し・敬語・文化まで AI がコーチします。

・登録不要で3メッセージ無料
・気に入ったらアカウント作成

https://frensei.jp/ja?utm_source=twitter&utm_medium=post&utm_campaign=beta

バグ・要望はアプリ内フィードバックから歓迎です。
```

---

## Reddit r/LearnJapanese

**タイトル案**
```
[I made] Frensei — AI coach for natural Japanese (beta, 3 free messages no signup)
```

**本文**
```
Hey everyone — I'm building Frensei, an AI Japanese coach focused on natural phrasing, politeness, and cultural context (not grammar drills).

Public beta: try 3 chat messages without an account:
https://frensei.jp/try?utm_source=reddit&utm_medium=post&utm_campaign=learnjapanese

Would love feedback on what feels unnatural or confusing. Thanks!
```

---

## TikTok / Reels 台本（30秒）

1. **フック（3秒）** 「教科書の『すみません』じゃ足りないとき」
2. **画面** `/try` で英語/母語で質問 → Sensei が自然な日本語 + 理由を返す
3. **CTA** 「3メッセージ無料、リンクはプロフィール」
4. **キャプション** `Natural Japanese coaching · Frensei beta · link in bio`

---

## Product Hunt

1. ローンチURL: `https://frensei.jp/launch?utm_source=product_hunt&utm_medium=launch`
2. **Tagline**: Stop sounding like a textbook. Start sounding natural.
3. **Maker comment 例**:

```
Thanks for checking out Frensei! We're in public beta.

→ Try 3 free chat messages (no signup): /try
→ Book a 15-min intro if you want a walkthrough: /trial

What we're optimizing for: corrections that sound human, with culture explained in plain language.

Roast us in the comments — every bug report goes straight into the next deploy.
```

---

## Discord / コミュニティ

```
Sharing a beta I've been working on — Frensei, an AI Japanese coach (natural phrasing + culture).

Guest try (no account): https://frensei.jp/try?utm_source=discord&utm_medium=community&utm_campaign=beta

Happy to answer questions about the product or Japanese learning in general.
```

---

## 計測の見方

- **GA4**: `calendly_trial_click`, `signup_cta_click`, `guest_chat_limit` をコンバージョンに
- **Supabase**: `docs/beta-analytics-queries.md` の SQL
- **管理画面**: `/admin/analytics`（要 `ADMIN_ANALYTICS_SECRET`）

イベントには `utm_source` / `utm_medium` / `from` が自動付与されます（初回 landing 時に capture）。

---

## 環境変数（Calendly）

`/trial` ページでウィジェットを表示するには Vercel に設定:

```
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/YOUR_HANDLE/30min
```

未設定時はお問い合わせへの案内文が表示されます。

---

## 週次チェックリスト

- [ ] `npm run promo:links` でリンクをコピーして投稿
- [ ] `npm run qa:beta` で本番導線確認
- [ ] フィードバックシート / Supabase を確認
- [ ] 反応の良い投稿を再掲・別言語で展開
