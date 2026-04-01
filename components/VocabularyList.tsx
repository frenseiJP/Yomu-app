"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookMarked, ChevronRight, Clock } from "lucide-react";
import { createClient } from "@/src/utils/supabase/client";

// 型定義（表示用）
interface FavoriteItem {
  id: string;
  word: string;
  meaning: string;
  example: string;
  level: string; // N1, N2...
  created_at: string;
}

function mapRowToItem(row: Record<string, unknown>): FavoriteItem {
  const meaning =
    typeof row.meaning === "string"
      ? row.meaning
      : Array.isArray(row.translations) && row.translations.length > 0
        ? (row.translations as string[]).join(" / ")
        : "";
  const example =
    typeof row.example === "string"
      ? row.example
      : Array.isArray(row.example_sentences) && row.example_sentences.length > 0
        ? (row.example_sentences as string[])[0]
        : "";
  const created_at = row.created_at
    ? new Date(row.created_at as string).toISOString().slice(0, 10)
    : "";
  return {
    id: (row.id as string) ?? crypto.randomUUID(),
    word: (row.word as string) ?? "",
    meaning,
    example,
    level: "N3",
    created_at,
  };
}

export default function VocabularyList() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      let items: FavoriteItem[] = [];
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from("favorites")
            .select("id, word, meaning, example, translations, example_sentences, created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
          if (!error && data?.length) {
            items = data.map((row) => mapRowToItem(row as Record<string, unknown>));
          }
        }
      } catch {
        // 未ログイン or 環境未設定時は空のまま
      }
      setFavorites(items);
      setLoading(false);
    }

    fetchFavorites();
  }, []);

  return (
    <div className="col-span-2 bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/20">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-400">
          <BookMarked size={16} className="text-wa-ruri" />
          My words & phrases
        </h3>
        <button className="text-xs text-blue-400 hover:underline flex items-center">
          See all <ChevronRight size={14} />
        </button>
      </div>

      <div className="max-h-[300px] overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            Loading…
          </div>
        ) : favorites.length > 0 ? (
          <div className="divide-y divide-slate-800">
            {favorites.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ backgroundColor: "rgba(30, 41, 59, 0.4)" }}
                className="p-4 transition-colors"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white">
                      {item.word}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {item.level}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock size={10} /> {item.created_at}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-2 font-medium">
                  {item.meaning}
                </p>

                <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/50">
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    「{item.example}」
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-sm">
            No saved words yet. Sign in and save words from chat to see them here.
          </div>
        )}
      </div>
    </div>
  );
}
