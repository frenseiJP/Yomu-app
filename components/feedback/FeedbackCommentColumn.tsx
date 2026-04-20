"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import {
  addFeedbackComment,
  deleteFeedbackComment,
  listFeedbackCommentsByUser,
  type FeedbackCommentItem,
} from "@/lib/feedback/comments";
import { useVocabularyUserId } from "@/lib/vocabulary/useVocabularyUserId";

type Props = {
  lang?: "ja" | "en";
};

function formatToday(lang: "ja" | "en"): string {
  try {
    return new Date().toLocaleDateString(lang === "ja" ? "ja-JP" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function formatCreatedAt(iso: string, lang: "ja" | "en"): string {
  try {
    return new Date(iso).toLocaleString(lang === "ja" ? "ja-JP" : "en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function FeedbackCommentColumn({ lang = "ja" }: Props) {
  const userId = useVocabularyUserId();
  const [mounted, setMounted] = useState(false);
  const [comment, setComment] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [items, setItems] = useState<FeedbackCommentItem[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setItems(listFeedbackCommentsByUser(userId));
  }, [mounted, userId]);

  const todayLine = useMemo(() => (mounted ? formatToday(lang) : ""), [mounted, lang]);

  const canSubmit = comment.trim().length > 0;

  const onSubmit = () => {
    if (!canSubmit) return;
    addFeedbackComment({
      userId,
      displayName,
      body: comment,
    });
    setComment("");
    setItems(listFeedbackCommentsByUser(userId));
  };

  const onDelete = (id: string) => {
    deleteFeedbackComment(id);
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <section className="mt-6 rounded-2xl border border-pink-500/35 bg-gradient-to-b from-pink-950/30 to-slate-950/80 p-5 sm:mt-8 sm:p-6">
      <h2 className="font-wa-serif text-base font-bold text-pink-200 sm:text-lg">
        {lang === "ja" ? "コメント入力欄（アプリ内）" : "In-app comments"}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">
        {lang === "ja"
          ? "メールではなく、このアプリ内にコメントを保存できます。"
          : "Save your comments inside the app (no external mail needed)."}
      </p>

      <div className="mt-4 rounded-xl border border-slate-700/80 bg-slate-900/50 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          {lang === "ja" ? "今日は…" : "Today"}
        </p>
        <p className="mt-1 text-sm text-pink-100/95" suppressHydrationWarning>
          {mounted ? todayLine : lang === "ja" ? "読み込み中…" : "Loading…"}
        </p>
      </div>

      <label className="mt-4 block">
        <span className="text-xs font-medium text-slate-400">
          {lang === "ja" ? "お名前・呼び名（任意）" : "Name or nickname (optional)"}
        </span>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          maxLength={120}
          className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-pink-500/60 focus:outline-none focus:ring-1 focus:ring-pink-500/40"
          placeholder={lang === "ja" ? "未記入でも保存できます" : "Optional"}
          autoComplete="nickname"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-xs font-medium text-slate-400">{lang === "ja" ? "コメント" : "Comment"}</span>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={6}
          maxLength={4000}
          className="mt-1.5 w-full resize-y rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-pink-500/60 focus:outline-none focus:ring-1 focus:ring-pink-500/40"
          placeholder={
            lang === "ja"
              ? "よかった点、分かりにくかった点、バグ、こうしてほしいこと…"
              : "What worked, what confused you, bugs, wishes…"
          }
        />
        <span className="mt-1 block text-right text-[11px] text-slate-500">{comment.length} / 4000</span>
      </label>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={onSubmit}
          className={`inline-flex min-h-[44px] items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
            canSubmit
              ? "bg-pink-500 text-white shadow-[0_12px_36px_rgba(236,72,153,0.35)] hover:bg-pink-400"
              : "cursor-not-allowed bg-slate-800 text-slate-500"
          }`}
        >
          {lang === "ja" ? "アプリ内に保存" : "Save in app"}
        </button>
        {!canSubmit ? (
          <span className="text-xs text-slate-500">
            {lang === "ja" ? "コメントを1文字以上入力してください" : "Enter at least one character"}
          </span>
        ) : null}
      </div>

      <div className="mt-6 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          {lang === "ja" ? "保存済みコメント" : "Saved comments"}
        </p>
        {items.length === 0 ? (
          <p className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-xs text-slate-500">
            {lang === "ja" ? "まだコメントはありません。" : "No comments yet."}
          </p>
        ) : (
          items.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-slate-300">{item.displayName?.trim() || (lang === "ja" ? "匿名" : "Anonymous")}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">{formatCreatedAt(item.createdAt, lang)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="rounded-md border border-slate-700 p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  aria-label={lang === "ja" ? "削除" : "Delete"}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-200">{item.body}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
