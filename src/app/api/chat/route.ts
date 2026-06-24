import { clampChatMessages } from "@/lib/chat/clampMessages";
import {
  buildOpenAiChatSystemPrompt,
  SENSEI_CHAT_TEMPERATURE,
} from "@/lib/chat/openAiChatSystem";
import { consumeRateLimit, getClientIp } from "@/lib/security/rateLimit";
import { logBetaEventServer } from "@/lib/analytics/server";

const OPENAI_MODEL = "gpt-4o-mini";
const MAX_REQUEST_BODY_BYTES = 50_000;

async function parseJsonBodyWithLimit(req: Request): Promise<unknown | null> {
  const raw = await req.text().catch(() => "");
  if (raw.length > MAX_REQUEST_BODY_BYTES) return null;
  if (!raw.trim()) return {};
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return {};
  }
}

export async function POST(req: Request): Promise<Response> {
  const ip = getClientIp(req);
  const rl = await consumeRateLimit({
    key: `chat_stream:${ip}`,
    limit: 20,
    windowMs: 60_000,
  });
  if (!rl.ok) {
    await logBetaEventServer({
      eventType: "api_rate_limited",
      route: "/api/chat",
      metadata: { status: 429 },
    });
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

  const body = await parseJsonBodyWithLimit(req);
  if (body === null) {
    await logBetaEventServer({
      eventType: "api_payload_too_large",
      route: "/api/chat",
      metadata: { status: 413, limitBytes: MAX_REQUEST_BODY_BYTES },
    });
    return Response.json({ error: "Payload too large" }, { status: 413 });
  }
  const { messages: rawMessages, tone, language: languageFromClient, coachContext } = body as {
    messages?: unknown;
    tone?: unknown;
    language?: unknown;
    coachContext?: unknown;
  };
  const messages = clampChatMessages(rawMessages);

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
      temperature: SENSEI_CHAT_TEMPERATURE,
      messages: [
        { role: "system", content: systemPrompt },
        ...(Array.isArray(messages) ? messages : []),
      ],
    }),
  });

  if (!openaiRes.ok || !openaiRes.body) {
    await logBetaEventServer({
      eventType: "api_error",
      route: "/api/chat",
      metadata: { status: 502, reason: "openai_upstream_failed" },
    });
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
