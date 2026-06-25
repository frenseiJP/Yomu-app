#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
GAS_FILE="$ROOT/scripts/google-apps-script-feedback.gs"
TMP_FILE="$(mktemp)"

SECRET="${ADMIN_ANALYTICS_SECRET:-}"
if [[ -z "$SECRET" && -f "$ROOT/.env.production.local" ]]; then
  SECRET="$(grep '^ADMIN_ANALYTICS_SECRET=' "$ROOT/.env.production.local" | cut -d= -f2- | tr -d '"' || true)"
fi
if [[ -z "$SECRET" ]]; then
  SECRET="f000e3c1558eb233db4d798f"
fi

sed "s/__ADMIN_ANALYTICS_SECRET__/${SECRET}/g" "$GAS_FILE" > "$TMP_FILE"

echo "→ Analytics タブ + ダッシュボード連携版の Apps Script をクリップボードにコピー…"
if command -v pbcopy >/dev/null 2>&1; then
  pbcopy < "$TMP_FILE"
  echo "  ✓ コピー済み。既存の GAS プロジェクトに貼り付け → 新バージョンで再デプロイしてください。"
else
  echo "  一時ファイル: $TMP_FILE"
fi

if [[ -x "$ROOT/node_modules/.bin/clasp" ]]; then
  echo ""
  echo "→ clasp 自動デプロイを試行…"
  if node "$ROOT/scripts/deploy-gas.mjs"; then
    echo "  ✓ GAS 自動デプロイ完了"
    rm -f "$TMP_FILE"
    exit 0
  fi
  echo "  ○ 自動デプロイ不可 — script.google.com/home/usersettings で「Google Apps Script API」を ON にして npm run gas:deploy"
fi
rm -f "$TMP_FILE"

echo ""
echo "→ デプロイ後の確認:"
echo "  curl \"<WEBHOOK_URL>?action=analytics_summary&days=7&secret=<ADMIN_SECRET>\""
echo ""
if command -v open >/dev/null 2>&1; then
  open "https://script.google.com/home"
fi
