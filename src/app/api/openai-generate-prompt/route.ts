import OpenAI from "openai";
import { consumeRateLimit, getClientIp } from "@/lib/security/rateLimit";
import { getUnauthorizedResponseIfNeeded } from "@/lib/security/authGate";

export const runtime = "nodejs";

const MODEL = "gpt-4o-mini";

const SYSTEM_PROMPT =
  "あなたは日本語教師 Frensei です。臨床心理学の知見を活かし、ユーザーが自己開示しやすく、かつ日本語と英語の両方で答えやすい「今日のお題」を1つ生成してください。";

const USER_PROMPT = `今日のお題を1つ決め、次の2つのキーだけを持つ JSON オブジェクトとして出力してください。
- title_jp: お題の日本語（簡潔に1文）
- title_en: 同じ内容の英語（簡潔に1文）

JSON 以外の説明文やマークダウンは付けないでください。`;

export async function POST(req: Request): Promise<Response> {
  const ip = getClientIp(req);
  const rl = await consumeRateLimit({
    key: `openai_generate_prompt:${ip}`,
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

  const unauthorized = await getUnauthorizedResponseIfNeeded("openai_generate_prompt");
  if (unauthorized) return unauthorized;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "OPENAI_API_KEY が設定されていません。" },
      { status: 500 }
    );
  }

  const client = new OpenAI({ apiKey });

  try {
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
      return Response.json(
        { error: "モデルからの応答が空でした。" },
        { status: 502 }
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return Response.json(
        { error: "JSON の解析に失敗しました。" },
        { status: 502 }
      );
    }

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("title_jp" in parsed) ||
      !("title_en" in parsed)
    ) {
      return Response.json(
        { error: "期待した JSON 形式ではありません。" },
        { status: 502 }
      );
    }

    const title_jp =
      typeof (parsed as { title_jp: unknown }).title_jp === "string"
        ? (parsed as { title_jp: string }).title_jp.trim()
        : "";
    const title_en =
      typeof (parsed as { title_en: unknown }).title_en === "string"
        ? (parsed as { title_en: string }).title_en.trim()
        : "";

    if (!title_jp || !title_en) {
      return Response.json(
        { error: "title_jp と title_en は空でない文字列である必要があります。" },
        { status: 502 }
      );
    }

    return Response.json({ title_jp, title_en });
  } catch (e) {
    return Response.json({ error: "OpenAI API の呼び出しに失敗しました。" }, { status: 502 });
  }
}
