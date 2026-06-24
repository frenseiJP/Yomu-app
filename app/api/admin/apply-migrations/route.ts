import { NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { isAdminAuthorized } from "@/lib/analytics/adminAuth";

const PROJECT_REF = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]
  ?? "jlhxzzhkjuduutyfpwzu";

export async function POST(req: Request): Promise<Response> {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const token = process.env.SUPABASE_ACCESS_TOKEN?.trim();
  if (!token) {
    return NextResponse.json(
      {
        error: "SUPABASE_ACCESS_TOKEN not set on server. Run scripts/setup-analytics.mjs locally.",
      },
      { status: 503 },
    );
  }

  const sql = readFileSync(join(process.cwd(), "supabase/apply-all-migrations.sql"), "utf8");
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });

  const text = await res.text();
  if (!res.ok) {
    return NextResponse.json({ error: text.slice(0, 500) }, { status: 502 });
  }

  return NextResponse.json({ ok: true, result: text.slice(0, 200) });
}
