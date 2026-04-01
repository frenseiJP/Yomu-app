export const runtime = "edge";

const CLAUDE_MODEL = "claude-3-5-sonnet-20241022";

const SYSTEM_PROMPT = `あなたは日本語単語帳用のデータを生成するアシスタントです。
入力された日本語の語句について、次のJSONだけを1つ返してください。説明文やマークダウンは不要です。

{
  "kana": "かな・読み（ひらがな/カタカナで。語句がそのまま読む場合は省略可）",
  "translations": ["訳1", "訳2", "..."],
  "partOfSpeech": "品詞（例: 挨拶表現・名詞・動詞・イ形容詞・副詞）",
  "exampleSentences": ["例文1（日本語）", "例文2（日本語）"]
}

ルール:
- translations は設定言語（学習者向けなので英語を1つ以上含める）。複数の意味があればすべて列挙する。
- partOfSpeech は日本語で1つ。
- exampleSentences はその語句を自然に含む日本語の例文を1〜3個。AIが自動作成する。
- 出力は必ず上記JSONのみ。`;

type EnrichResult = {
  kana?: string;
  translations: string[];
  partOfSpeech: string;
  exampleSentences: string[];
};

export async function POST(req: Request): Promise<Response> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: "Missing ANTHROPIC_API_KEY" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  let body: { word: string; romaji?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  const { word, romaji } = body;
  if (!word || typeof word !== "string") {
    return new Response(
      JSON.stringify({ error: "word (string) required" }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  const userPrompt = romaji
    ? `語句: ${word}（ローマ字: ${romaji}）`
    : `語句: ${word}`;

  const payload = {
    model: CLAUDE_MODEL,
    max_tokens: 512,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user" as const, content: userPrompt }],
  };

  const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "messages-2023-12-15",
    },
    body: JSON.stringify(payload),
  });

  if (!anthropicRes.ok) {
    const text = await anthropicRes.text().catch(() => "");
    return new Response(
      JSON.stringify({ error: text || "Claude API error" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }

  const data = await anthropicRes.json();
  const raw =
    data.content?.[0]?.type === "text"
      ? (data.content[0].text as string)?.trim() ?? ""
      : "";

  // JSON ブロックだけ抽出（```json ... ``` や 先頭の { から末尾の } まで）
  let jsonStr = raw;
  const codeBlock = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) jsonStr = codeBlock[1].trim();
  const braceStart = jsonStr.indexOf("{");
  if (braceStart !== -1) {
    let depth = 0;
    let end = -1;
    for (let i = braceStart; i < jsonStr.length; i++) {
      if (jsonStr[i] === "{") depth++;
      if (jsonStr[i] === "}") {
        depth--;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }
    if (end !== -1) jsonStr = jsonStr.slice(braceStart, end + 1);
  }

  let result: EnrichResult;
  try {
    result = JSON.parse(jsonStr) as EnrichResult;
  } catch {
    return new Response(
      JSON.stringify({
        error: "Failed to parse AI response as JSON",
        raw: raw.slice(0, 500),
      }),
      { status: 502, headers: { "content-type": "application/json" } }
    );
  }

  if (!Array.isArray(result.translations)) result.translations = [];
  if (!Array.isArray(result.exampleSentences)) result.exampleSentences = [];
  if (typeof result.partOfSpeech !== "string") result.partOfSpeech = "";

  return new Response(JSON.stringify(result), {
    headers: { "content-type": "application/json" },
  });
}
