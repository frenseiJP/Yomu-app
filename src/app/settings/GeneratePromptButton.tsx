"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

type Props = {
  buttonLabel: string;
  loadingLabel: string;
  successMessage: string;
  errorMessage: string;
};

export default function GeneratePromptButton({
  buttonLabel,
  loadingLabel,
  successMessage,
  errorMessage,
}: Props) {
  const [pending, setPending] = useState(false);

  async function handleClick() {
    if (pending) return;
    setPending(true);
    try {
      const res = await fetch("/api/generate-prompt", {
        method: "POST",
        credentials: "include",
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        window.alert(data.error ?? errorMessage);
        return;
      }
      window.alert(successMessage);
    } catch {
      window.alert(errorMessage);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={handleClick}
      className={[
        "group relative isolate w-full overflow-hidden rounded-2xl px-4 py-3.5 text-[13px] font-semibold tracking-wide text-white shadow-[0_12px_40px_rgba(99,102,241,0.35),inset_0_1px_0_rgba(255,255,255,0.35)]",
        "bg-gradient-to-br from-indigo-400 via-violet-500 to-fuchsia-500 ring-1 ring-white/25 transition",
        "before:pointer-events-none before:absolute before:inset-0 before:-translate-x-full before:skew-x-12 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:opacity-0 before:transition before:duration-700 hover:before:translate-x-full hover:before:opacity-100",
        "hover:brightness-110 active:scale-[0.99]",
        "disabled:pointer-events-none disabled:opacity-60",
      ].join(" ")}
    >
      <span className="relative z-10 inline-flex w-full items-center justify-center gap-2">
        <Sparkles className="h-4 w-4 shrink-0 text-white/95 drop-shadow-sm" />
        {pending ? loadingLabel : buttonLabel}
      </span>
    </button>
  );
}
