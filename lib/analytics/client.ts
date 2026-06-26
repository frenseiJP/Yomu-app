"use client";

import type { BetaEventInput } from "@/lib/analytics/types";
import { mergeAttributionMetadata } from "@/lib/analytics/attribution";

const SESSION_KEY = "frensei:beta:session_id:v1";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const generated =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    window.sessionStorage.setItem(SESSION_KEY, generated);
    return generated;
  } catch {
    return "unknown";
  }
}

function sanitizeMetadata(
  input: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  if (!input) return undefined;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input)) {
    if (v == null) continue;
    if (typeof v === "string") out[k] = v.slice(0, 200);
    else if (typeof v === "number" || typeof v === "boolean") out[k] = v;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function emitGa4Event(eventType: string, metadata?: Record<string, unknown>): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventType, metadata ?? {});
}

export async function logBetaEvent(input: BetaEventInput): Promise<void> {
  const metadata = sanitizeMetadata(mergeAttributionMetadata(input.metadata));

  emitGa4Event(input.eventType, metadata);

  try {
    await fetch("/api/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        eventType: input.eventType,
        userId: input.userId,
        sessionId: input.sessionId ?? getOrCreateSessionId(),
        route: input.route,
        metadata,
      }),
    });
  } catch {
    // Fail silently by design.
  }
}
