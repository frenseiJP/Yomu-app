"use client";

import { useEffect } from "react";

type Props = {
  line1: string;
  line2: string;
  onDismiss: () => void;
  /** ms */
  duration?: number;
};

/** ミッション完了のマイクロ報酬（控えめ・短時間） */
export default function MissionRewardToast({ line1, line2, onDismiss, duration = 5200 }: Props) {
  useEffect(() => {
    const t = window.setTimeout(onDismiss, duration);
    return () => window.clearTimeout(t);
  }, [duration, onDismiss]);

  return (
    <div
      role="status"
      className="pointer-events-none fixed bottom-[calc(88px+env(safe-area-inset-bottom,0px))] left-1/2 z-[280] w-[min(92vw,20rem)] -translate-x-1/2 opacity-95 transition-opacity duration-300"
    >
      <div className="rounded-2xl border border-emerald-500/40 bg-slate-950/95 px-4 py-3 text-center shadow-2xl backdrop-blur-xl">
        <p className="text-[12px] font-medium text-emerald-100">{line1}</p>
        <p className="mt-1 text-[11px] text-emerald-200/90">{line2}</p>
      </div>
    </div>
  );
}
