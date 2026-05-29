"use client";

import { useCallback, useState } from "react";
import { Mic, Volume2 } from "lucide-react";
import {
  getSpeechRecognition,
  scorePronunciationAttempt,
  shadowChunksFromSentence,
  speakJapanese,
} from "@/lib/coach/speakingLoop";

type Props = {
  sentence: string;
  compact?: boolean;
  onCheckComplete?: (score: number) => void;
};

export default function SpeakingLoopPanel({ sentence, compact, onCheckComplete }: Props) {
  const chunks = shadowChunksFromSentence(sentence);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [score, setScore] = useState<{ score: number; feedback: string } | null>(null);

  const startListen = useCallback(() => {
    const SR = getSpeechRecognition();
    if (!SR) {
      setScore({
        score: 0,
        feedback: "Voice check needs Chrome or Safari. Use Listen + shadow the chunks.",
      });
      return;
    }
    const rec = new SR();
    rec.lang = "ja-JP";
    rec.continuous = false;
    rec.interimResults = false;
    setListening(true);
    setHeard("");
    rec.onresult = (ev) => {
      const t = ev.results[0]?.[0]?.transcript ?? "";
      setHeard(t);
      const judged = scorePronunciationAttempt(sentence, t);
      setScore(judged);
      onCheckComplete?.(judged.score);
    };
    rec.onerror = () => {
      setListening(false);
      setScore({ score: 0, feedback: "Could not hear you — try again in a quiet place." });
    };
    rec.onend = () => setListening(false);
    rec.start();
  }, [sentence]);

  if (!sentence.trim()) return null;

  return (
    <div
      className={`rounded-xl border border-violet-500/25 bg-violet-500/8 ${
        compact ? "px-2.5 py-2" : "px-3 py-2.5"
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-200/90">
        Say it out loud
      </p>
      <p className="mt-1 text-[11px] text-slate-400">
        Shadow your correction — mouth memory helps it stick.
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {chunks.map((c, i) => (
          <button
            key={`${i}-${c.text.slice(0, 8)}`}
            type="button"
            onClick={() => speakJapanese(c.text)}
            className="rounded-lg border border-slate-700/60 bg-slate-900/50 px-2 py-1 text-[12px] text-slate-100 hover:border-violet-400/40"
          >
            {c.text}
          </button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => speakJapanese(sentence)}
          className="inline-flex min-h-[34px] items-center gap-1 rounded-lg border border-slate-600/50 px-2 py-1 text-[11px] text-slate-200 hover:bg-slate-800/60"
        >
          <Volume2 className="h-3.5 w-3.5" aria-hidden />
          Listen full line
        </button>
        <button
          type="button"
          onClick={startListen}
          disabled={listening}
          className="inline-flex min-h-[34px] items-center gap-1 rounded-lg border border-violet-500/40 bg-violet-500/15 px-2 py-1 text-[11px] font-medium text-violet-100 hover:bg-violet-500/20 disabled:opacity-60"
        >
          <Mic className="h-3.5 w-3.5" aria-hidden />
          {listening ? "Listening…" : "Check pronunciation"}
        </button>
      </div>
      {score ? (
        <p className="mt-2 text-[11px] text-slate-300">
          {score.feedback}
          {heard ? (
            <span className="mt-0.5 block text-slate-500">Heard: {heard}</span>
          ) : null}
          {score.score > 0 ? (
            <span className="mt-0.5 block text-violet-200/90">{score.score}% match</span>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
