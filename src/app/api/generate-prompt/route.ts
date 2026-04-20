import OpenAI from "openai";
import { createClient } from "@/src/utils/supabase/server";
import { consumeRateLimit, getClientIp } from "@/lib/security/rateLimit";

export const runtime = "nodejs";

const MODEL = "gpt-4o-mini";

const SYSTEM_PROMPT =
  "あなたは日本語教師 Frensei です。臨床心理学の知見を活かし、ユーザーが自己開示しやすく、かつ日本語と英語の両方で答えやすい「今日のお題」を1つ生成してください。";

const USER_PROMPT = `次の2キーだけを持つ JSON オブジェクトを返してください。説明文やコードフェンスは不要です。

{"title_jp":"...","title_en":"..."}`;

type PromptPayload = {
  title_jp: string;
  title_en: string;
  scheduled_date: string;
};

async function generatePromptWithOpenAI(apiKey: string): Promise<{
  title_jp: string;
  title_en: string;
}> {
  const client = new OpenAI({ apiKey });

  const completion = await client.chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: USER_PROMPT },
    ],
    temperature: 0.8,
  });

  const raw = completion.choices[0]?.message?.content?.trim();
  if (!raw) {
    throw new Error("OpenAI response was empty");
  }

  const parsed = JSON.parse(raw) as { title_jp?: unknown; title_en?: unknown };
  const title_jp = typeof parsed.title_jp === "string" ? parsed.title_jp.trim() : "";
  const title_en = typeof parsed.title_en === "string" ? parsed.title_en.trim() : "";

  if (!title_jp || !title_en) {
    throw new Error("OpenAI response JSON is invalid");
  }

  return { title_jp, title_en };
}

export async function POST(req: Request): Promise<Response> {
  const ip = getClientIp(req);
  const rl = await consumeRateLimit({
    key: `generate_prompt:${ip}`,
    limit: 8,
    windowMs: 60_000,
  });
  if (!rl.ok) {
    return Response.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { "retry-after": String(rl.retryAfterSec) },
      },
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "OPENAI_API_KEY is missing" }, { status: 500 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let title_jp = "";
  let title_en = "";

  try {
    const generated = await generatePromptWithOpenAI(apiKey);
    title_jp = generated.title_jp;
    title_en = generated.title_en;
  } catch (error) {
    console.error("OpenAI prompt generation failed:", error);
    return Response.json({ error: "Failed to generate prompt with OpenAI" }, { status: 500 });
  }

  const scheduled_date = new Date().toISOString().split("T")[0];

  const payload: PromptPayload = {
    title_jp,
    title_en,
    scheduled_date,
  };

  const { data, error } = await supabase
    .from("prompts")
    .upsert(payload, { onConflict: "scheduled_date" })
    .select()
    .single();

  if (error) {
    console.error("Supabase upsert to prompts failed:", error);
    return Response.json({ error: "Failed to save prompt" }, { status: 500 });
  }

  return Response.json(data);
}
