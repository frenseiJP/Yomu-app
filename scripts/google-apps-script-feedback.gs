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

// Injected by scripts/publish-analytics-gas.sh (matches Vercel ADMIN_ANALYTICS_SECRET)
const ANALYTICS_EXPORT_SECRET = "__ADMIN_ANALYTICS_SECRET__";

const SHEET_NAME = "Feedback";
const ANALYTICS_SHEET_NAME = "Analytics";

function doGet(e) {
  try {
    const action = e && e.parameter ? e.parameter.action : null;
    if (action === "analytics_summary") {
      return jsonResponse(buildAnalyticsSummary_(e));
    }

    const ss = getSpreadsheet_();
    return jsonResponse({
      ok: true,
      message: "Frensei feedback webhook is running.",
      spreadsheetId: ss.getId(),
      spreadsheetUrl: ss.getUrl(),
      sheetName: SHEET_NAME,
      analyticsSheet: ANALYTICS_SHEET_NAME,
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

function buildAnalyticsSummary_(e) {
  const secret = e && e.parameter ? e.parameter.secret : "";
  if (!ANALYTICS_EXPORT_SECRET || ANALYTICS_EXPORT_SECRET.indexOf("__ADMIN_") === 0) {
    return { ok: false, error: "analytics_export_not_configured" };
  }
  if (secret !== ANALYTICS_EXPORT_SECRET) {
    return { ok: false, error: "unauthorized" };
  }

  const days = Number((e && e.parameter && e.parameter.days) || 7);
  const rangeDays = days === 14 || days === 30 ? days : 7;
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - rangeDays);

  const ss = getSpreadsheet_();
  const rows = readAnalyticsSheetRows_(ss, cutoff).concat(readLegacyFeedbackAnalyticsRows_(ss, cutoff));
  return { ok: true, source: "sheets", rangeDays: rangeDays, rows: rows };
}

function readAnalyticsSheetRows_(ss, cutoff) {
  const sheet = ss.getSheetByName(ANALYTICS_SHEET_NAME);
  if (!sheet || sheet.getLastRow() < 2) return [];

  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues();
  const rows = [];
  for (var i = 0; i < values.length; i++) {
    var createdAt = values[i][0];
    if (!createdAt) continue;
    var created = createdAt instanceof Date ? createdAt : new Date(String(createdAt));
    if (isNaN(created.getTime()) || created < cutoff) continue;
    rows.push({
      createdAt: created.toISOString(),
      userId: String(values[i][1] || ""),
      eventType: String(values[i][2] || ""),
      sessionId: String(values[i][3] || ""),
      route: String(values[i][4] || ""),
      metadata: String(values[i][5] || ""),
    });
  }
  return rows;
}

/** Backward compat: old GAS wrote analytics_event rows into Feedback sheet. */
function readLegacyFeedbackAnalyticsRows_(ss, cutoff) {
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet || sheet.getLastRow() < 2) return [];

  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 7).getValues();
  const rows = [];
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][5] || "") !== "analytics_event") continue;
    var createdAt = values[i][0];
    if (!createdAt) continue;
    var created = createdAt instanceof Date ? createdAt : new Date(String(createdAt));
    if (isNaN(created.getTime()) || created < cutoff) continue;
    var parsed = {};
    try {
      parsed = JSON.parse(String(values[i][3] || "{}"));
    } catch (err) {
      parsed = { raw: String(values[i][3] || "") };
    }
    rows.push({
      createdAt: created.toISOString(),
      userId: String(values[i][1] || ""),
      eventType: String(parsed.eventType || ""),
      sessionId: String(parsed.sessionId || ""),
      route: String(values[i][4] || ""),
      metadata: JSON.stringify(parsed.metadata || parsed.raw || ""),
    });
  }
  return rows;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
