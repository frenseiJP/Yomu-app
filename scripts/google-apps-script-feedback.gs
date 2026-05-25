/**
 * Frensei beta feedback → Google Spreadsheet
 *
 * Setup:
 * 1. Open your spreadsheet → Extensions → Apps Script
 * 2. Replace Code.gs with this file (or merge doGet/doPost)
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Set FEEDBACK_SHEETS_WEBHOOK_URL to the /exec URL in .env.local / Vercel
 */

const SHEET_NAME = "Feedback";

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ ok: true, message: "Frensei feedback webhook is running." }),
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: "missing_body" });
    }

    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet_();

    sheet.appendRow([
      data.createdAt || new Date().toISOString(),
      data.userId || "",
      data.displayName || "",
      data.body || "",
      data.route || "",
      data.source || "feedback_form",
      data.reportContext || "",
    ]);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  const headers = [
    "createdAt",
    "userId",
    "displayName",
    "body",
    "route",
    "source",
    "reportContext",
  ];
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(headers);
    return sheet;
  }
  ensureHeaders_(sheet, headers);
  return sheet;
}

function ensureHeaders_(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    return;
  }
  const existing = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  headers.forEach(function (label, index) {
    if (existing[index] !== label) {
      sheet.getRange(1, index + 1).setValue(label);
    }
  });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
