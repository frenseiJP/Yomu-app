#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
GAS_FILE="$ROOT/scripts/google-apps-script-feedback.gs"

echo "→ Analytics タブ対応版の Apps Script をクリップボードにコピー…"
if command -v pbcopy >/dev/null 2>&1; then
  pbcopy < "$GAS_FILE"
  echo "  ✓ コピー済み。既存の GAS プロジェクトに貼り付け → 新バージョンで再デプロイしてください。"
else
  echo "  ファイル: $GAS_FILE"
fi
echo ""
echo "→ デプロイ後、スプレッドシートに「Analytics」シートが自動作成されます。"
if command -v open >/dev/null 2>&1; then
  open "https://script.google.com/home"
fi
