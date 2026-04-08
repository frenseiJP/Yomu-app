"use client";

import { useEffect, useRef } from "react";

type Props = {
  value: string;
  setValue: (v: string) => void;
  onSend: () => void;
  loading: boolean;
  placeholder: string;
};

export default function ChatInput({ value, setValue, onSend, loading, placeholder }: Props) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div className="glass-input flex items-end gap-2 rounded-2xl px-3 py-2.5 shadow-glass">
      <textarea
        ref={ref}
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!loading && value.trim()) onSend();
          }
        }}
        placeholder={placeholder}
        className="max-h-32 w-full resize-none border-0 bg-transparent text-[13px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-0"
      />
      <button
        type="button"
        disabled={loading || !value.trim()}
        onClick={onSend}
        className="min-h-[42px] min-w-[74px] rounded-xl bg-wa-ruri px-3 text-xs font-medium text-white disabled:cursor-not-allowed disabled:bg-wa-hai/50"
      >
        {loading ? "..." : "Send"}
      </button>
    </div>
  );
}
