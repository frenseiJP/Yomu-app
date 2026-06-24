"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Send, Share2, Sparkles } from "lucide-react";
import AssistantMessageBody from "@/components/chat/AssistantMessageBody";
import {
  buildSenseiChatMessage,
  fallbackStructuredCoachPayload,
  parseSenseiChatPayload,
} from "@/lib/ftue/format";
import type { FtueCoachPayload } from "@/lib/ftue/types";
import {
  GUEST_CHAT_MAX_TURNS,
  guestTurnsRemaining,
  incrementGuestTurns,
  readGuestTurns,
} from "@/lib/guest/limits";
import { buildChatHistoryMessages } from "@/lib/chat/history";
import { buildShareUrl } from "@/lib/share/encode";
import { logBetaEvent } from "@/lib/analytics/client";
import {
  lastUserPreview,
  savePendingGuestChat,
} from "@/lib/guest/pendingChat";
import { getGuestCopy } from "@/lib/i18n/guestCopy";
import { getLangClient } from "@/src/utils/i18n/clientLang";
import type { Lang } from "@/src/utils/i18n/types";

type ChatLine = {
  id: number;
  role: "user" | "assistant";
  text: string;
  payload?: FtueCoachPayload;
};

type Props = {
  presetPrompt?: string;
  compact?: boolean;
  source?: string;
};

export default function GuestTryChat({
  presetPrompt,
  compact = false,
  source = "landing",
}: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const copy = getGuestCopy(lang);
  const [lines, setLines] = useState<ChatLine[]>([
    {
      id: 1,
      role: "assistant",
      text: getGuestCopy("en").welcome,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnsLeft, setTurnsLeft] = useState(GUEST_CHAT_MAX_TURNS);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const presetSentRef = useRef(false);

  useEffect(() => {
    const l = getLangClient();
    setLang(l);
    setLines([{ id: 1, role: "assistant", text: getGuestCopy(l).welcome }]);
    setTurnsLeft(guestTurnsRemaining());
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [lines, loading]);

  useEffect(() => {
    if (!presetPrompt || presetSentRef.current || readGuestTurns() > 0) return;
    presetSentRef.current = true;
    void sendMessage(presetPrompt);
  }, [presetPrompt]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading || turnsLeft <= 0) return;

      setLoading(true);
      setShareUrl(null);
      const userLine: ChatLine = { id: Date.now(), role: "user", text: trimmed };
      const history = buildChatHistoryMessages(
        lines
          .filter((l) => l.role === "user" || l.role === "assistant")
          .map((l) => ({
            role: l.role,
            baseText: l.text,
            senseiPayload: l.payload,
          })),
        trimmed,
      );

      const assistantId = Date.now() + 1;
      setLines((prev) => [
        ...prev,
        userLine,
        { id: assistantId, role: "assistant", text: "" },
      ]);
      setInput("");

      const turn = incrementGuestTurns();
      setTurnsLeft(guestTurnsRemaining());
      void logBetaEvent({
        eventType: "guest_chat_turn",
        route: typeof window !== "undefined" ? window.location.pathname : "/",
        metadata: { turn, source },
      });

      try {
        const guestBody = { messages: history, language: "en" };

        const res = await fetch("/api/chat/guest", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(guestBody),
        });
        const json = (await res.json()) as { ok?: boolean; coach?: unknown; error?: string };
        const payload: FtueCoachPayload =
          json.ok && json.coach && typeof json.coach === "object"
            ? (parseSenseiChatPayload(json.coach, trimmed) ??
              fallbackStructuredCoachPayload(trimmed))
            : fallbackStructuredCoachPayload(trimmed);
        const body = buildSenseiChatMessage(payload, trimmed);

        const nextLines = (prev: ChatLine[]) =>
          prev.map((l) =>
            l.id === assistantId ? { ...l, text: body, payload } : l,
          );
        setLines((prev) => {
          const updated = nextLines(prev);
          savePendingGuestChat(
            updated.map((l) => ({
              role: l.role,
              text: l.text,
              payload: l.payload,
            })),
            source,
          );
          return updated;
        });

        if (payload.replyMode === "correction" && payload.correctedSentence) {
          const url = buildShareUrl(
            {
              userText: trimmed,
              correctedSentence: payload.correctedSentence,
              whyEnglish: payload.whyEnglish,
              niceLine: payload.niceLine,
              createdAt: new Date().toISOString(),
            },
            window.location.origin,
          );
          setShareUrl(url);
        }
      } catch {
        setLines((prev) => [
          ...prev,
          {
            id: Date.now() + 2,
            role: "assistant",
            text: copy.errorGeneric,
          },
        ]);
      } finally {
        setLoading(false);
        if (turn >= GUEST_CHAT_MAX_TURNS) {
          void logBetaEvent({
            eventType: "guest_chat_limit",
            route: typeof window !== "undefined" ? window.location.pathname : "/",
            metadata: { source },
          });
        }
      }
    },
    [lines, loading, turnsLeft, source],
  );

  const copyShare = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 2500);
      void logBetaEvent({
        eventType: "share_copy",
        route: window.location.pathname,
        metadata: { source },
      });
    } catch {
      window.prompt("Copy this link:", shareUrl);
    }
  };

  const atLimit = turnsLeft <= 0;
  const lastPreview = lastUserPreview(
    lines.map((l) => ({ role: l.role, text: l.text, payload: l.payload })),
  );
  const signupHref = `/login?intent=signup&continue=guest${source ? `&from=${encodeURIComponent(source)}` : ""}`;

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border border-pink-500/20 bg-slate-950/80 shadow-[0_0_48px_rgba(236,72,153,0.06)] backdrop-blur-xl ${
        compact ? "max-h-[26rem]" : "max-h-[32rem]"
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-wa-ruri to-wa-asagi text-xs font-bold text-white">
            F
          </div>
          <div>
            <p className="font-wa-serif text-sm font-semibold text-slate-100">{copy.tryTitle}</p>
            <p className="text-[11px] text-slate-500">{copy.turnsLeft(turnsLeft)}</p>
          </div>
        </div>
        <Sparkles className="h-4 w-4 text-pink-400/80" aria-hidden />
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {lines.map((line) => (
          <div
            key={line.id}
            className={`flex ${line.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {line.role === "user" ? (
              <div className="max-w-[88%] rounded-2xl rounded-br-md bg-wa-ruri/90 px-3.5 py-2.5 text-sm text-white">
                {line.text}
              </div>
            ) : (
              <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-yomu-glassBorder bg-yomu-glass px-3.5 py-2.5 text-sm text-slate-100">
                {line.payload ? (
                  <AssistantMessageBody
                    text={line.text}
                    payload={line.payload}
                    renderInline={(t) => t}
                  />
                ) : (
                  line.text
                )}
              </div>
            )}
          </div>
        ))}
        {loading &&
        lines[lines.length - 1]?.role === "assistant" &&
        !lines[lines.length - 1]?.text.trim() ? (
          <div className="flex items-center gap-2 text-[12px] text-slate-400">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-pink-400" />
            {copy.thinking}
          </div>
        ) : null}
        <div ref={bottomRef} />
      </div>

      {shareUrl ? (
        <div className="border-t border-slate-800/80 px-4 py-2">
          <button
            type="button"
            onClick={() => void copyShare()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 py-2 text-[12px] font-medium text-sky-200 hover:bg-sky-500/15"
          >
            <Share2 className="h-3.5 w-3.5" />
            {shareCopied ? copy.shareCopied : copy.shareButton}
          </button>
        </div>
      ) : null}

      {atLimit ? (
        <div className="border-t border-pink-500/20 bg-gradient-to-b from-pink-500/8 to-slate-950/90 px-4 py-4 text-center">
          <p className="text-sm font-semibold text-slate-100">{copy.atLimitTitle}</p>
          {lastPreview ? (
            <p className="mt-2 rounded-xl border border-slate-800/80 bg-slate-900/60 px-3 py-2 text-left text-[12px] text-slate-300">
              <span className="text-slate-500">You asked: </span>
              {lastPreview}
            </p>
          ) : null}
          <p className="mt-2 text-[12px] leading-relaxed text-slate-400">{copy.atLimitBody}</p>
          <Link
            href={signupHref}
            onClick={() => {
              savePendingGuestChat(
                lines.map((l) => ({ role: l.role, text: l.text, payload: l.payload })),
                source,
              );
              void logBetaEvent({
                eventType: "signup_cta_click",
                route: window.location.pathname,
                metadata: { source, trigger: "guest_limit" },
              });
            }}
            className="mt-3 inline-flex w-full justify-center rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg hover:from-pink-400 hover:to-pink-500"
          >
            {copy.atLimitCta}
          </Link>
          <Link
            href="/login"
            className="mt-2 inline-block text-[11px] text-slate-500 underline-offset-2 hover:text-slate-300 hover:underline"
          >
            {copy.signInLink}
          </Link>
        </div>
      ) : (
        <div className="border-t border-slate-800/80">
          {turnsLeft === 1 ? (
            <p className="border-b border-amber-500/15 bg-amber-500/5 px-4 py-2 text-center text-[11px] text-amber-100/90">
              {copy.lastTurnHint}
            </p>
          ) : null}
          <div className="flex items-end gap-2 px-3 py-3">
          <textarea
            rows={1}
            value={input}
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void sendMessage(input);
              }
            }}
            placeholder={copy.placeholder}
            className="max-h-24 min-h-[40px] flex-1 resize-none rounded-xl border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-[14px] text-slate-100 placeholder:text-slate-500 focus:border-pink-500/40 focus:outline-none"
          />
          <button
            type="button"
            disabled={!input.trim() || loading}
            onClick={() => void sendMessage(input)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-wa-ruri text-white disabled:opacity-40"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
          </div>
        </div>
      )}
    </div>
  );
}
