"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookMarked, Sparkles } from "lucide-react";
import { createClient } from "@/src/utils/supabase/client";

export interface Message {
  id: string;
  content: string;
  role: "user" | "ai";
}

export interface SavedWord {
  word: string;
}

const MARKER_SPAN_CLASS =
  "animate-marker bg-gradient-to-r from-pink-500/30 to-pink-500/30 bg-no-repeat bg-[length:0%_100%] transition-[background-size] duration-1000 ease-out p-0.5 rounded-sm";

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export type ChatMessageProps = {
  message: Message;
  savedWords?: SavedWord[];
  onWordSaved?: (word: string) => void;
};

export default function ChatMessage({
  message,
  savedWords = [],
  onWordSaved,
}: ChatMessageProps) {
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedText, setSelectedText] = useState("");
  const [savedHighlightText, setSavedHighlightText] = useState<string | null>(null);
  const supabase = createClient();

  const wordsToHighlight = useMemo(() => {
    const fromSaved = (savedWords ?? []).map((s) => s.word);
    const fromJustSaved = savedHighlightText ? [savedHighlightText] : [];
    const all = [...fromSaved, ...fromJustSaved];
    return [...new Set(all)].sort((a, b) => b.length - a.length);
  }, [savedWords, savedHighlightText]);

  const highlightedContent = useMemo(() => {
    if (message.role === "user" || wordsToHighlight.length === 0) {
      return message.content;
    }
    let content = message.content;
    for (const word of wordsToHighlight) {
      const escaped = escapeRegExp(word);
      const regex = new RegExp(`(${escaped})`, "g");
      const span = `<span class="${MARKER_SPAN_CLASS}" style="background-position: 0 0;">$1</span>`;
      content = content.replace(regex, span);
    }
    return content;
  }, [message.content, message.role, wordsToHighlight]);

  useEffect(() => {
    const markers = document.querySelectorAll(".animate-marker");
    const timer = setTimeout(() => {
      markers.forEach((marker) => {
        (marker as HTMLElement).style.backgroundSize = "100% 100%";
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [highlightedContent]);

  const handleTextSelection = () => {
    if (message.role === "user") return;

    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (selection && text && text.length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setMenuPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 45,
      });
      setSelectedText(text);
    } else {
      setMenuPosition(null);
    }
  };

  const handleSave = async () => {
    if (!selectedText) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("Sign in to save words");
      return;
    }

    const { error } = await supabase.from("favorites").insert([
      {
        user_id: user.id,
        word: selectedText,
        example: message.content,
        created_at: new Date().toISOString(),
      },
    ]);

    if (!error) {
      setMenuPosition(null);
      setSavedHighlightText(selectedText);
      window.getSelection()?.removeAllRanges();
      onWordSaved?.(selectedText);
      alert("Saved to vocabulary! 🌸");
    } else {
      console.error("Save error:", error.message);
      alert("Could not save");
    }
  };

  const isAi = message.role === "ai";
  const showHighlightHtml = isAi && wordsToHighlight.length > 0;

  return (
    <div
      className="group relative border-b border-slate-800 p-4"
      onMouseUp={handleTextSelection}
      onTouchEnd={handleTextSelection}
    >
      <div className="whitespace-pre-wrap font-sans leading-relaxed text-slate-200">
        {showHighlightHtml ? (
          <span dangerouslySetInnerHTML={{ __html: highlightedContent }} />
        ) : (
          message.content
        )}
      </div>

      <AnimatePresence>
        {menuPosition && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "fixed",
              left: menuPosition.x,
              top: menuPosition.y,
              transform: "translateX(-50%)",
              zIndex: 50,
            }}
            className="flex items-center gap-2 rounded-full border border-wa-kinari/30 bg-slate-900 px-3 py-1.5 shadow-2xl backdrop-blur-md"
          >
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 text-xs font-bold text-white transition-colors hover:text-pink-300"
            >
              <BookMarked size={14} className="text-pink-400" />
              Save to vocabulary 🌸
            </button>
            <div className="mx-1 h-3 w-px bg-slate-700" />
            <span title="Ask AI for more detail">
              <Sparkles size={14} className="cursor-help text-blue-400" />
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
