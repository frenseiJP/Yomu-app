import { buildOpenAiChatSystemPrompt } from "@/lib/chat/openAiChatSystem";
import { consumeRateLimit, getClientIp } from "@/lib/security/rateLimit";

const OPENAI_MODEL = "gpt-4o-mini";
const MAX_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 2_000;
const MAX_TOTAL_CHARS = 10_000;

function clampMessages(raw: unknown): { role: "user" | "assistant"; content: string }[] {
  if (!Array.isArray(raw)) return [];
  const out: { role: "user" | "assistant"; content: string }[] = [];
  let total = 0;
  for (const m of raw) {
    if (!m || typeof m !== "object") continue;
    const role = (m as { role?: unknown }).role;
    const content = (m as { content?: unknown }).content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") continue;
    const c = content.trim().slice(0, MAX_MESSAGE_CHARS);
    if (!c) continue;
    total += c.length;
    if (total > MAX_TOTAL_CHARS) break;
    out.push({ role, content: c });
    if (out.length >= MAX_MESSAGES) break;
  }
  return out;
}

export async function POST(req: Request): Promise<Response> {
  const ip = getClientIp(req);
  const rl = await consumeRateLimit({
    key: `chat_stream:${ip}`,
    limit: 20,
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
    return new Response(
      "OPENAI_API_KEY が未設定です。`.env.local` に OPENAI_API_KEY を追加して再起動してください。",
      { status: 200, headers: { "content-type": "text/plain; charset=utf-8" } }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { messages: rawMessages, tone, language: languageFromClient, coachContext } = body as {
    messages?: unknown;
    tone?: unknown;
    language?: unknown;
    coachContext?: unknown;
  };
  const messages = clampMessages(rawMessages);

  const { systemPrompt } = buildOpenAiChatSystemPrompt({
    languageFromClient,
    tone,
    coachContext,
    messages,
    mode: "freeform_stream",
  });

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
    return new Response("Upstream AI request failed", { status: 502 });
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
                  ? delta.content.map((c: { text?: string }) => c?.text ?? "").join("")
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
                    ? delta.content.map((c: { text?: string }) => c?.text ?? "").join("")
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
