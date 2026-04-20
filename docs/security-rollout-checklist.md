# Security Rollout Checklist

Frensei / Yomu の高コストAIルート向け staged auth-gating と rate limiting の本番切り替え手順。

## 0. 事前確認

- 最新コードがデプロイ済みである
- ログ（APIエラー、429/401件数）を確認できる
- 以下フラグは未設定または `false` の状態で開始する
  - `REQUIRE_AUTH_FOR_VOCAB_ENRICH`
  - `REQUIRE_AUTH_FOR_OPENAI_GENERATE_PROMPT`
  - `REQUIRE_AUTH_FOR_HIGH_COST_AI_ROUTES`

## 1. `REQUIRE_AUTH_FOR_VOCAB_ENRICH=true`

対象: `/api/vocab-enrich`

- 未ログインで呼び出し -> `401 {"error":"Unauthorized"}`
- ログインで呼び出し -> `200`（既存挙動維持）
- 連打時 -> `429` が返る

## 2. `REQUIRE_AUTH_FOR_OPENAI_GENERATE_PROMPT=true`

対象: `/api/openai-generate-prompt`

- 未ログインで呼び出し -> `401 {"error":"Unauthorized"}`
- ログインで呼び出し -> `200`（`title_jp`, `title_en`）
- 連打時 -> `429` が返る

## 3. 統合フラグ `REQUIRE_AUTH_FOR_HIGH_COST_AI_ROUTES=true`

- 個別フラグONで問題ないことを確認してから有効化
- 高コストルートの未認証呼び出しが一貫して `401` になることを確認

## 4. Upstash 有効化（推奨）

共有レート制限に切り替えるため、以下を設定:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

確認:

- 再起動・複数インスタンス環境でも制限が安定
- 429/401 の件数に異常な急増がない

## 5. ロールバック

問題発生時:

1. 該当フラグを `false`（または未設定）へ戻す
2. 再デプロイ
3. 正常系が復帰したことを確認

## 推奨有効化順

1. `REQUIRE_AUTH_FOR_VOCAB_ENRICH=true`
2. `REQUIRE_AUTH_FOR_OPENAI_GENERATE_PROMPT=true`
3. `REQUIRE_AUTH_FOR_HIGH_COST_AI_ROUTES=true`
4. Upstash 設定投入
