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
        "group relative isolate w-full overflow-hidden rounded-xl px-4 py-3.5 text-[13px] font-semibold tracking-wide text-white shadow-sm",
        "bg-blue-600 ring-1 ring-blue-700/20 transition hover:bg-blue-700",
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
