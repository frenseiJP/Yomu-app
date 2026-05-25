#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
GAS_FILE="$ROOT/scripts/google-apps-script-feedback.gs"

echo "→ Copying Apps Script to clipboard..."
if command -v pbcopy >/dev/null 2>&1; then
  pbcopy < "$GAS_FILE"
  echo "  ✓ Copied. Paste into Apps Script (Cmd+V)."
else
  echo "  ! pbcopy not found. Open: $GAS_FILE"
fi

echo ""
echo "→ Next steps in Google Apps Script:"
echo "  1. Open your spreadsheet → Extensions → Apps Script"
echo "  2. Replace Code.gs with the clipboard contents"
echo "  3. Deploy → New deployment → Web app"
echo "     Execute as: Me | Who has access: Anyone"
echo "  4. If the /exec URL changes, update FEEDBACK_SHEETS_WEBHOOK_URL"
echo ""

if command -v open >/dev/null 2>&1; then
  echo "→ Opening Apps Script home in your browser..."
  open "https://script.google.com/home"
fi
