/**
 * Frensei beta feedback → Google Spreadsheet
 *
 * IMPORTANT: Set SPREADSHEET_ID below to the spreadsheet you want to collect feedback in.
 * Copy from URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
 *
 * Deploy → New deployment → Web app
 *   Execute as: Me | Who has access: Anyone
 */

// ← Paste your spreadsheet ID here (required for reliable writes)
const SPREADSHEET_ID = "";

const SHEET_NAME = "Feedback";
const ANALYTICS_SHEET_NAME = "Analytics";

function doGet() {
  try {
    const ss = getSpreadsheet_();
    return jsonResponse({
      ok: true,
      message: "Frensei feedback webhook is running.",
      spreadsheetId: ss.getId(),
      spreadsheetUrl: ss.getUrl(),
      sheetName: SHEET_NAME,
    });
  } catch (err) {
    return jsonResponse({
      ok: false,
      error: String(err),
      hint: "Set SPREADSHEET_ID at the top of Code.gs to your spreadsheet ID.",
    });
  }
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: "missing_body" });
    }

    const data = JSON.parse(e.postData.contents);
    const ss = getSpreadsheet_();

    if (data.source === "analytics_event") {
      const sheet = getOrCreateSheet_(ss, ANALYTICS_SHEET_NAME);
      var parsed = {};
      try {
        parsed = JSON.parse(data.body || "{}");
      } catch (err) {
        parsed = { raw: data.body || "" };
      }
      sheet.appendRow([
        data.createdAt || new Date().toISOString(),
        data.userId || "",
        parsed.eventType || "",
        parsed.sessionId || "",
        data.route || "",
        JSON.stringify(parsed.metadata || parsed.raw || ""),
      ]);
    } else {
      const sheet = getOrCreateSheet_(ss, SHEET_NAME);
      sheet.appendRow([
        data.createdAt || new Date().toISOString(),
        data.userId || "",
        data.displayName || "",
        data.body || "",
        data.route || "",
        data.source || "feedback_form",
        data.reportContext || "",
      ]);
    }

    return jsonResponse({
      ok: true,
      spreadsheetId: ss.getId(),
      spreadsheetUrl: ss.getUrl(),
      sheetName: sheet.getName(),
      row: sheet.getLastRow(),
    });
  } catch (err) {
    return jsonResponse({
      ok: false,
      error: String(err),
      hint: "Set SPREADSHEET_ID at the top of Code.gs to your spreadsheet ID.",
    });
  }
}

function getSpreadsheet_() {
  if (SPREADSHEET_ID) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) return ss;
  } catch (err) {
    // fall through
  }
  throw new Error(
    "SPREADSHEET_ID is not set. Paste your spreadsheet ID into Code.gs (const SPREADSHEET_ID = \"...\").",
  );
}

function getOrCreateSheet_(ss, name) {
  const sheetName = name || SHEET_NAME;
  let sheet = ss.getSheetByName(sheetName);
  const headers =
    sheetName === ANALYTICS_SHEET_NAME
      ? ["createdAt", "userId", "eventType", "sessionId", "route", "metadata"]
      : ["createdAt", "userId", "displayName", "body", "route", "source", "reportContext"];
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
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
