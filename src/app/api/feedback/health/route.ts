import { NextResponse } from "next/server";
import { isFeedbackSheetsConfigured, postFeedbackToGoogleSheets } from "@/lib/feedback/googleSheets";

/** Quick check: GET = webhook doGet, POST with ?probe=1 = dry-run doPost (optional). */
export async function GET(): Promise<Response> {
  if (!isFeedbackSheetsConfigured()) {
    return NextResponse.json({
      configured: false,
      ready: false,
      hint: "Set FEEDBACK_SHEETS_WEBHOOK_URL on Vercel (Production) to your Apps Script /exec URL.",
    });
  }

  const url = process.env.FEEDBACK_SHEETS_WEBHOOK_URL!.trim();
  try {
    const res = await fetch(url, { method: "GET", redirect: "follow", cache: "no-store" });
    const text = await res.text();
    try {
      const parsed = JSON.parse(text) as { ok?: boolean; message?: string };
      if (parsed.ok === true) {
        return NextResponse.json({
          configured: true,
          ready: true,
          message: parsed.message ?? "Webhook is running.",
        });
      }
    } catch {
      // fallthrough
    }
    return NextResponse.json({
      configured: true,
      ready: false,
      hint:
        "Apps Script returned an error page. Open the /exec URL in a browser — you should see JSON with ok:true. Redeploy the web app after pasting scripts/google-apps-script-feedback.gs.",
    });
  } catch {
    return NextResponse.json({
      configured: true,
      ready: false,
      hint: "Could not reach the webhook URL.",
    });
  }
}

export async function POST(req: Request): Promise<Response> {
  const url = new URL(req.url);
  if (url.searchParams.get("probe") !== "1") {
    return NextResponse.json({ error: "use ?probe=1" }, { status: 400 });
  }

  if (!isFeedbackSheetsConfigured()) {
    return NextResponse.json({ configured: false, writeOk: false }, { status: 503 });
  }

  const result = await postFeedbackToGoogleSheets({
    source: "feedback_form",
    userId: "health_probe",
    displayName: "Health check",
    body: `[probe] ${new Date().toISOString()}`,
    createdAt: new Date().toISOString(),
    route: "/api/feedback/health",
  });

  return NextResponse.json({
    configured: true,
    writeOk: result.ok,
    hint: result.ok
      ? "A test row should appear on the Feedback sheet."
      : result.reason === "script_error"
        ? "doPost is missing or the deployment URL is outdated."
        : "Webhook request failed.",
  });
}
