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
echo "→ If Extensions → Apps Script shows「ファイルを開くことができません」:"
echo "  Use STANDALONE setup (works around multi-account / Google bugs):"
echo ""
echo "  1. Create a spreadsheet → copy ID from URL:"
echo "     https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit"
echo "  2. Open https://script.google.com/home in INCOGNITO with ONE Google account"
echo "  3. New project → paste clipboard → set SPREADSHEET_ID at top of Code.gs"
echo "  4. Deploy → New deployment → Web app"
echo "     Execute as: Me | Who has access: Anyone"
echo "  5. Update FEEDBACK_SHEETS_WEBHOOK_URL (.env.local + Vercel)"
echo ""
echo "→ Otherwise (Extensions menu works):"
echo "  1. Spreadsheet → Extensions → Apps Script"
echo "  2. Replace Code.gs with clipboard (leave SPREADSHEET_ID empty)"
echo "  3. Deploy → New deployment → Web app (same settings)"
echo ""

if command -v open >/dev/null 2>&1; then
  echo "→ Opening Apps Script home in your browser..."
  open "https://script.google.com/home"
fi
