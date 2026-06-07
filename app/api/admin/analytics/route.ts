import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/analytics/adminAuth";
import { fetchAnalyticsSummary, type AnalyticsRange } from "@/lib/analytics/queries";

function parseRange(value: string | null): AnalyticsRange {
  const n = Number(value);
  if (n === 14 || n === 30) return n;
  return 7;
}

export async function GET(req: Request): Promise<Response> {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const range = parseRange(url.searchParams.get("days"));
  const summary = await fetchAnalyticsSummary(range);
  return NextResponse.json(summary);
}

export async function POST(req: Request): Promise<Response> {
  const secret = process.env.ADMIN_ANALYTICS_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: "ADMIN_ANALYTICS_SECRET is not configured on the server." },
      { status: 503 },
    );
  }

  let body: { secret?: string } = {};
  try {
    body = (await req.json()) as { secret?: string };
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (body.secret !== secret) {
    return NextResponse.json({ error: "invalid_secret" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("frensei_admin", secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
