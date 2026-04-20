"use client";

import { useEffect, useRef, useState } from "react";
import type { FtuePracticeMode } from "@/lib/ftue/types";

type Props = {
  onPick: (mode: FtuePracticeMode) => void;
  /** 無操作 2 秒後に natural を自動選択 */
  autoSelectMs?: number;
};

export default function FtuePracticePicker({ onPick, autoSelectMs = 2000 }: Props) {
  const [highlight, setHighlight] = useState<"natural" | "daily" | "free">("natural");
  const pickedRef = useRef(false);
  const onPickRef = useRef(onPick);
  onPickRef.current = onPick;

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (pickedRef.current) return;
      pickedRef.current = true;
      onPickRef.current("natural");
    }, autoSelectMs);
    return () => window.clearTimeout(t);
  }, [autoSelectMs]);

  const pick = (mode: FtuePracticeMode) => {
    if (pickedRef.current) return;
    pickedRef.current = true;
    onPick(mode);
  };

  const btnClass = (key: "natural" | "daily" | "free") =>
    [
      "w-full rounded-2xl border px-4 py-3.5 text-left text-[13px] font-medium transition",
      highlight === key
        ? "border-wa-ruri/70 bg-wa-ruri/20 text-slate-50 ring-1 ring-wa-ruri/40"
        : "border-slate-700/80 bg-slate-900/70 text-slate-200 hover:border-slate-600 hover:bg-slate-800/80",
    ].join(" ");

  return (
    <div className="mb-3 space-y-3 rounded-2xl border border-slate-800/60 bg-slate-950/80 p-3 shadow-inner sm:p-4">
      <p className="text-center font-wa-serif text-[15px] font-semibold text-slate-50">
        What do you want to practice?
      </p>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className={btnClass("natural")}
          onMouseEnter={() => setHighlight("natural")}
          onFocus={() => setHighlight("natural")}
          onClick={() => pick("natural")}
        >
          <span className="block">Speak naturally</span>
          <span className="mt-0.5 block text-[11px] font-normal text-slate-300/90">
            Recommended first
          </span>
        </button>
        <button
          type="button"
          className={btnClass("daily")}
          onMouseEnter={() => setHighlight("daily")}
          onFocus={() => setHighlight("daily")}
          onClick={() => pick("daily")}
        >
          Daily situation
        </button>
        <button
          type="button"
          className={btnClass("free")}
          onMouseEnter={() => setHighlight("free")}
          onFocus={() => setHighlight("free")}
          onClick={() => pick("free")}
        >
          Free chat
        </button>
      </div>
    </div>
  );
}
