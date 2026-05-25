"use client";

import Link from "next/link";

type Props = {
  title: string;
  updatedAt: string;
  preview: string;
  href: string;
  onDelete?: () => void;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60 * 60 * 1000) return "Just now";
  if (diff < 24 * 60 * 60 * 1000) return "Today";
  if (diff < 7 * 24 * 60 * 60 * 1000)
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ChatHistoryItem({ title, updatedAt, preview, href, onDelete }: Props) {
  const previewLine = preview.trim() || "—";

  return (
    <div className="group rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4 transition hover:border-slate-600 hover:bg-slate-900/80">
      <Link href={href} className="block">
        <p className="mb-1 text-xs text-slate-500">{formatDate(updatedAt)}</p>
        <p className="mb-2 line-clamp-1 text-sm font-medium text-slate-100">{title}</p>
        <p className="line-clamp-2 text-xs leading-relaxed text-slate-400">{previewLine}</p>
      </Link>
      {onDelete ? (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onDelete();
          }}
          className="mt-3 text-xs text-slate-500 underline-offset-2 hover:text-red-400 hover:underline"
        >
          Delete
        </button>
      ) : null}
    </div>
  );
}
