"use client";

import { useState } from "react";
import type { MistakeReviewEntry, WordReviewEntry } from "@/lib/habit/types";
import type { PrototypeUiText } from "@/src/utils/i18n/prototypeCopy";
import {
  applyMistakeReviewResult,
  applyWordReviewResult,
} from "@/lib/habit/review";
import { recordReviewDone } from "@/lib/habit/progress";

type Props = {
  userId: string;
  words: WordReviewEntry[];
  mistakes: MistakeReviewEntry[];
  ui: PrototypeUiText;
  isLightTheme: boolean;
  onUpdated: () => void;
  onOpenChat: (prefill: string) => void;
};

export default function ReviewCard({
  userId,
  words,
  mistakes,
  ui,
  isLightTheme,
  onUpdated,
  onOpenChat,
}: Props) {
  const total = words.length + mistakes.length;
  const [tab, setTab] = useState<"word" | "mistake">(words.length ? "word" : "mistake");
  const word = words[0];
  const mistake = mistakes[0];

  if (total === 0) return null;

  const card = isLightTheme
    ? "rounded-2xl border border-amber-200/80 bg-amber-50/90 p-4 shadow-sm"
    : "rounded-2xl border border-amber-500/30 bg-amber-950/25 p-4 backdrop-blur-xl";
  const title = isLightTheme ? "text-neutral-900" : "text-amber-100";
  const body = isLightTheme ? "text-neutral-700" : "text-amber-100/90";

  const handleWord = (success: boolean) => {
    if (!word) return;
    applyWordReviewResult(userId, word.id, success);
    recordReviewDone(userId, { success, isMistake: false });
    onUpdated();
  };

  const handleMistake = (success: boolean) => {
    if (!mistake) return;
    applyMistakeReviewResult(userId, mistake.id, success);
    recordReviewDone(userId, { success, isMistake: true });
    onUpdated();
  };

  const reviewLine = ui.habitReviewCount.replace("{n}", String(total));

  return (
    <section className={card}>
      <p className={`text-sm font-semibold ${title}`}>{ui.habitReviewTitle}</p>
      <p className={`mt-1 text-[13px] ${body}`}>{reviewLine}</p>

      <div className="mt-3 flex gap-2">
        {words.length > 0 && (
          <button
            type="button"
            onClick={() => setTab("word")}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              tab === "word"
                ? "bg-wa-ruri text-white"
                : isLightTheme
                  ? "bg-white text-neutral-600 ring-1 ring-neutral-200"
                  : "bg-slate-800 text-slate-300"
            }`}
          >
            {ui.habitWordsLine.split(" ")[0] ?? "Word"}
          </button>
        )}
        {mistakes.length > 0 && (
          <button
            type="button"
            onClick={() => setTab("mistake")}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              tab === "mistake"
                ? "bg-wa-ruri text-white"
                : isLightTheme
                  ? "bg-white text-neutral-600 ring-1 ring-neutral-200"
                  : "bg-slate-800 text-slate-300"
            }`}
          >
            Fix
          </button>
        )}
      </div>

      {tab === "word" && word && (
        <div className="mt-3">
          <p className={`text-[12px] ${body}`}>{ui.habitReviewWordPrompt}</p>
          <p className={`mt-2 font-wa-serif text-lg font-semibold ${title}`}>{word.word}</p>
          <p className={`mt-1 text-[11px] opacity-80 ${body}`}>{word.meaningHint}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleWord(true)}
              className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-medium text-white"
            >
              {ui.habitGotIt}
            </button>
            <button
              type="button"
              onClick={() => handleWord(false)}
              className="rounded-xl border border-white/20 px-3 py-2 text-xs font-medium text-slate-200"
            >
              {ui.habitAgain}
            </button>
            <button
              type="button"
              onClick={() =>
                onOpenChat(
                  `${ui.habitReviewWordPrompt}\n\n「${word.word}」 — ${word.meaningHint}`,
                )
              }
              className="rounded-xl border border-wa-ruri/50 bg-wa-ruri/15 px-3 py-2 text-xs font-medium text-slate-100"
            >
              {ui.habitReviewNow}
            </button>
          </div>
        </div>
      )}

      {tab === "mistake" && mistake && (
        <div className="mt-3">
          <p className={`text-[12px] ${body}`}>{ui.habitReviewMistakePrompt}</p>
          <p className={`mt-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2 font-mono text-sm ${title}`}>
            {mistake.originalText}
          </p>
          <p className={`mt-2 text-[11px] opacity-80 ${body}`}>
            → {mistake.correctedText}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleMistake(true)}
              className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-medium text-white"
            >
              {ui.habitGotIt}
            </button>
            <button
              type="button"
              onClick={() => handleMistake(false)}
              className="rounded-xl border border-white/20 px-3 py-2 text-xs font-medium text-slate-200"
            >
              {ui.habitAgain}
            </button>
            <button
              type="button"
              onClick={() =>
                onOpenChat(
                  `${ui.habitReviewMistakePrompt}\n${mistake.originalText}\n\n(Model answer hint: ${mistake.correctedText})`,
                )
              }
              className="rounded-xl border border-wa-ruri/50 bg-wa-ruri/15 px-3 py-2 text-xs font-medium text-slate-100"
            >
              {ui.habitReviewNow}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
