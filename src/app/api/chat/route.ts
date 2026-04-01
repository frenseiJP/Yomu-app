const OPENAI_MODEL = "gpt-4o-mini";

/** モデルが日本語システム文に引きずられないよう、核は英語で記述 */
const BASE_SYSTEM_CORE = `
You are "Yomu", a Japanese learning coach created by founder Sota.
Assume the learner is around JLPT N3 level and often cares about business-appropriate Japanese.
Write in a warm, curious, partner-like tone (explore together; do not grade the learner).

STRICT BANNED SUBSTRINGS (do not output these anywhere: headings, body, bullets, parentheses, mixed scripts):
- 共感
- 回答
- 解説
- 質問

Also avoid corny section titles in any language that mirror those labels (e.g. standalone "Answer", "Explanation", "Question" as headings).

Guidelines:
- If the user asks a direct question, answer it clearly (without using the banned substrings).
- You may add short Japanese examples, quotes, vocabulary, or readings when teaching Japanese.
- Markdown is fine if headings never contain the banned substrings.
- Explain grammar / keigo types (polite, respectful, humble) when helpful, in the OUTPUT LANGUAGE specified above.

The OUTPUT LANGUAGE block at the top of this system message overrides everything else about which language to use for explanations.
`;

const BASE_SYSTEM_JA_EXTRA = `
（日本語UI向けの補足）
- メインの説明・文化メモ・文法の話はすべて自然な日本語で書いてください。
- 必要なら英語・中国語・韓国語を短く添えてもよい。
`;

const JA_TONE_INSTRUCTIONS: Record<string, string> = {
  casual: `
【重要】あなたの返答の文体は「カジュアル」にしてください。
- です・ます調ではなく、タメ口（だよ・だね・〜しよう・〜してね）で話す。
- 友達に話すような、親しみやすくラフな日本語で書く。
`,
  neutral: `
【重要】あなたの返答の文体は「標準」（です・ます調）にしてください。
- 丁寧だが堅くしすぎない、一般的な敬体で書く。
`,
  business: `
【重要】あなたの返答の文体は「ビジネス」にしてください。
- 敬語を丁寧に（です・ます、謙譲語・尊敬語を適宜使い、いただきます・申し上げます・ございます などを自然に含める）。
- ビジネスメールや商談で使える丁寧な日本語で書く。
`,
};

function detectLanguageFromText(text: string): "ja" | "en" | "zh" | "ko" {
  const t = text ?? "";
  if (/[가-힣]/.test(t)) return "ko";
  // ひらがな/カタカナが含まれていれば日本語と判定する（純漢字だけの場合の誤判定を減らす）
  if (/[ぁ-んァ-ン]/.test(t)) return "ja";
  if (/[一-龠]/.test(t)) return "zh";
  if (/[a-zA-Z]/.test(t)) return "en";
  return "ja";
}

function getToneInstruction(
  lang: "ja" | "en" | "zh" | "ko",
  toneKey: string
): string {
  if (lang === "ja") {
    return JA_TONE_INSTRUCTIONS[toneKey] ?? JA_TONE_INSTRUCTIONS.neutral;
  }

  if (toneKey === "casual") {
    return "TONE: Casual / friendly — relaxed wording, not stiff.";
  }
  if (toneKey === "business") {
    return "TONE: Business — polite, professional, clear.";
  }
  return "TONE: Neutral — polite and natural, not overly stiff.";
}

type UiLang = "ja" | "en" | "zh" | "ko";

const UI_LANG_NAME: Record<UiLang, string> = {
  ja: "Japanese",
  en: "English",
  zh: "Simplified Chinese",
  ko: "Korean",
};

function normalizeUiLang(raw: unknown): UiLang | null {
  if (raw === "ja" || raw === "en" || raw === "zh" || raw === "ko") return raw;
  return null;
}

/** 表示言語を最優先（モデルがユーザー文の言語に引きずられないよう英語で強制） */
function buildOutputLanguageBlock(uiLang: UiLang): string {
  const name = UI_LANG_NAME[uiLang];
  if (uiLang === "ja") {
    return [
      "=== OUTPUT LANGUAGE (HIGHEST PRIORITY) ===",
      "The app UI language is Japanese.",
      "Write your ENTIRE reply (explanations, cultural notes, grammar notes, tips) in natural Japanese.",
      "You may include short non-Japanese glosses only when helpful for learning.",
    ].join("\n");
  }
  return [
    "=== OUTPUT LANGUAGE (HIGHEST PRIORITY) ===",
    `The app UI language is ${name} (${uiLang}).`,
    `You MUST write your ENTIRE reply (all explanations, cultural notes, grammar notes, tips, and meta commentary) in ${name}.`,
    "Japanese may appear ONLY as short examples, quoted phrases, vocabulary items, readings (furigana/romaji), or sample sentences for teaching.",
    "Even if the user writes entirely in Japanese, keep the main teaching explanation in " +
      name +
      "; do not switch the main explanation to Japanese.",
  ].join("\n");
}

export async function POST(req: Request): Promise<Response> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // フロント側はエラー時に何も表示せず return しがちなので、少なくとも本文で理由が分かるようにします。
    return new Response(
      "OPENAI_API_KEY が未設定です。`.env.local` に OPENAI_API_KEY を追加して再起動してください。",
      { status: 200, headers: { "content-type": "text/plain; charset=utf-8" } }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { messages, tone, language: languageFromClient } = body as {
    messages?: unknown;
    tone?: unknown;
    language?: unknown;
  };
  const toneKey =
    typeof tone === "string" && (tone === "casual" || tone === "neutral" || tone === "business")
      ? tone
      : "neutral";

  const lastUserMessage = Array.isArray(messages)
    ? [...messages]
        .reverse()
        .find((m) => m?.role === "user" && typeof m?.content === "string")?.content
    : "";
  const lastUserText = typeof lastUserMessage === "string" ? lastUserMessage : "";
  // アプリの「表示言語」を最優先。未指定時のみ直近ユーザー文から推定。
  const uiLang: UiLang =
    normalizeUiLang(languageFromClient) ?? detectLanguageFromText(lastUserText);

  const toneInstruction = getToneInstruction(uiLang, toneKey);
  const languageBlock = buildOutputLanguageBlock(uiLang);
  const systemPrompt =
    languageBlock +
    "\n\n" +
    toneInstruction +
    "\n\n" +
    BASE_SYSTEM_CORE +
    (uiLang === "ja" ? "\n" + BASE_SYSTEM_JA_EXTRA : "");

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      stream: true,
      temperature: 0.8,
      messages: [
        { role: "system", content: systemPrompt },
        ...(Array.isArray(messages) ? messages : []),
      ],
    }),
  });

  if (!openaiRes.ok || !openaiRes.body) {
    const text = await openaiRes.text().catch(() => "");
    return new Response(
      text || "OpenAI chat completion request failed",
      { status: 500 }
    );
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = openaiRes.body!.getReader();
      let done = false;
      let buffer = "";

      try {
        while (!done) {
          const result = await reader.read();
          done = result.done;
          if (done || !result.value) break;

          const chunk = decoder.decode(result.value, { stream: true });
          buffer += chunk;
          const lines = buffer.split("\n");
          // 最後の行は次の chunk にまたがる可能性があるので保持する
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const data = trimmed.replace(/^data:\s*/, "").trim();
            if (!data || data === "[DONE]") {
              if (data === "[DONE]") {
                controller.close();
                return;
              }
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta;
              const text: unknown =
                typeof delta?.content === "string"
                  ? delta.content
                  : Array.isArray(delta?.content)
                  ? delta.content.map((c: any) => c?.text ?? "").join("")
                  : "";
              if (typeof text === "string" && text) {
                controller.enqueue(encoder.encode(text));
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        // 最後に残ったバッファ（もしあれば）を処理する
        if (buffer) {
          const trimmed = buffer.trim();
          if (trimmed.startsWith("data:")) {
            const data = trimmed.replace(/^data:\s*/, "").trim();
            if (data && data !== "[DONE]") {
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta;
                const text: unknown =
                  typeof delta?.content === "string"
                    ? delta.content
                    : Array.isArray(delta?.content)
                    ? delta.content.map((c: any) => c?.text ?? "").join("")
                    : "";
                if (typeof text === "string" && text) {
                  controller.enqueue(encoder.encode(text));
                }
              } catch {
                // ignore
              }
            }
          }
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}

