export type ShareCorrectionPayload = {
  userText: string;
  correctedSentence: string;
  whyEnglish: string;
  niceLine?: string;
  createdAt: string;
};

export function encodeSharePayload(payload: ShareCorrectionPayload): string {
  const json = JSON.stringify(payload);
  if (typeof Buffer !== "undefined") {
    return Buffer.from(json, "utf8").toString("base64url");
  }
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeSharePayload(token: string): ShareCorrectionPayload | null {
  try {
    const normalized = token.replace(/-/g, "+").replace(/_/g, "/");
    const pad = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
    let json: string;
    if (typeof Buffer !== "undefined") {
      json = Buffer.from(normalized + pad, "base64").toString("utf8");
    } else {
      const binary = atob(normalized + pad);
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      json = new TextDecoder().decode(bytes);
    }
    const parsed = JSON.parse(json) as Record<string, unknown>;
    if (
      typeof parsed.userText !== "string" ||
      typeof parsed.correctedSentence !== "string" ||
      typeof parsed.whyEnglish !== "string" ||
      typeof parsed.createdAt !== "string"
    ) {
      return null;
    }
    return {
      userText: parsed.userText.slice(0, 500),
      correctedSentence: parsed.correctedSentence.slice(0, 500),
      whyEnglish: parsed.whyEnglish.slice(0, 1200),
      niceLine:
        typeof parsed.niceLine === "string" ? parsed.niceLine.slice(0, 300) : undefined,
      createdAt: parsed.createdAt,
    };
  } catch {
    return null;
  }
}

export function buildShareUrl(payload: ShareCorrectionPayload, origin: string): string {
  const token = encodeSharePayload(payload);
  return `${origin.replace(/\/$/, "")}/share/c/${token}`;
}
