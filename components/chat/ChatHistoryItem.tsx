"use client";

import Link from "next/link";
import { mkt } from "@/lib/ui/appTheme";

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
    <div className={`group p-4 transition hover:border-blue-200 hover:shadow-md ${mkt.card}`}>
      <Link href={href} className="block">
        <p className={`mb-1 text-xs ${mkt.faint}`}>{formatDate(updatedAt)}</p>
        <p className={`mb-2 line-clamp-1 text-sm font-medium ${mkt.heading}`}>{title}</p>
        <p className={`line-clamp-2 text-xs leading-relaxed ${mkt.muted}`}>{previewLine}</p>
      </Link>
      {onDelete ? (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onDelete();
          }}
          className="mt-3 text-xs text-slate-500 underline-offset-2 hover:text-red-600 hover:underline"
        >
          Delete
        </button>
      ) : null}
    </div>
  );
}
