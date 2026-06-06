export async function streamChatCompletion(opts: {
  url: string;
  body: unknown;
  signal?: AbortSignal;
  onChunk: (accumulated: string) => void;
}): Promise<string> {
  const res = await fetch(opts.url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(opts.body),
    signal: opts.signal,
  });
  if (!res.ok || !res.body) {
    throw new Error("stream_failed");
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let text = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (!value) continue;
    text += decoder.decode(value, { stream: true });
    opts.onChunk(text);
  }
  return text;
}
