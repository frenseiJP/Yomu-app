"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookMarked,
  MessageSquare,
  Mic2,
  Droplets,
  TrendingUp,
  Calendar,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { createClient } from "@/src/utils/supabase/client";

type SkillDatum = { subject: string; A: number; fullMark: number };

// favorites テーブルの行（取得用）
export type FavoriteRow = {
  id?: string;
  word: string;
  kana?: string | null;
  romaji?: string | null;
  translations?: string[] | null;
  part_of_speech?: string | null;
  example_sentences?: string[] | null;
  type?: string | null;
  created_at?: string | null;
};

// フォールバック用ダミーデータ
const defaultSkillData: SkillDatum[] = [
  { subject: "Vocabulary", A: 80, fullMark: 100 },
  { subject: "Naturalness", A: 65, fullMark: 100 },
  { subject: "Grammar", A: 75, fullMark: 100 },
  { subject: "Speed", A: 90, fullMark: 100 },
];

const defaultTopics = ["Convenience store", "Four seasons", "Keigo basics", "Anime reactions"];

export default function RecordPage() {
  const [month] = useState(new Date().getMonth() + 1);
  const [exp, setExp] = useState(65); // 0-100で成長度（UI用）

  const [favoriteCount, setFavoriteCount] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<FavoriteRow[]>([]);
  const [studyDays, setStudyDays] = useState<number | null>(null);
  const [topics, setTopics] = useState<string[] | null>(null);
  const [skillData, setSkillData] = useState<SkillDatum[]>(defaultSkillData);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setIsLoading(true);
      setHasError(false);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          if (isMounted) {
            setFavoriteCount(0);
            setFavorites([]);
          }
          setStudyDays(null);
          setTopics(defaultTopics);
          setSkillData(defaultSkillData);
          setIsLoading(false);
          return;
        }

        // 1. favorites から件数（ログイン中の user_id で絞り込み）
        const { data: favData, error: favError } = await supabase
          .from("favorites")
          .select("id")
          .eq("user_id", user.id);
        if (favError) throw favError;
        const favCount = favData?.length ?? 0;

        // favorites から最新10件を取得（同上）
        const { data: favList, error: favListError } = await supabase
          .from("favorites")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);
        if (favListError) {
          console.error("データ取得エラー:", favListError.message);
        } else if (isMounted) {
          setFavorites((favList || []) as FavoriteRow[]);
        }

        // 2. study_logs からユニーク日付と topic
        const { data: logs, error: logError } = await supabase
          .from("study_logs")
          .select("created_at, topic");
        if (logError) throw logError;

        const daySet = new Set<string>();
        const topicSet = new Set<string>();
        (logs ?? []).forEach((row: any) => {
          if (row.created_at) {
            const d = new Date(row.created_at);
            const key = d.toISOString().slice(0, 10);
            daySet.add(key);
          }
          if (row.topic) {
            topicSet.add(row.topic as string);
          }
        });

        if (!isMounted) return;

        setFavoriteCount(favCount);
        setStudyDays(daySet.size || null);
        setTopics(
          topicSet.size > 0 ? Array.from(topicSet).slice(0, 20) : defaultTopics
        );

        // スキルデータはシンプルに件数・日数から少しだけダイナミックに
        const vocabScore = Math.min(favCount / 50, 1) * 100;
        const naturalScore = Math.min((daySet.size + 2) / 10, 1) * 100;
        const grammarScore = 60 + Math.min(favCount / 100, 0.4) * 100;
        const speedScore = 90;
        setSkillData([
          { subject: "Vocabulary", A: vocabScore, fullMark: 100 },
          { subject: "Naturalness", A: naturalScore, fullMark: 100 },
          { subject: "Grammar", A: grammarScore, fullMark: 100 },
          { subject: "Speed", A: speedScore, fullMark: 100 },
        ]);
      } catch (e) {
        if (!isMounted) return;
        setHasError(true);
        setFavoriteCount(null);
        setStudyDays(null);
        setTopics(defaultTopics);
        setSkillData(defaultSkillData);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  // 季節に応じたシンボルとカラー
  const getSeasonalInfo = (m: number) => {
    if (m >= 3 && m <= 5)
      return {
        icon: "🌸",
        label: "Cherry blossom",
        color: "from-pink-400 to-rose-300",
        shadow: "shadow-pink-500/20",
      };
    if (m >= 6 && m <= 8)
      return {
        icon: "🌻",
        label: "Sunflower",
        color: "from-yellow-400 to-orange-300",
        shadow: "shadow-yellow-500/20",
      };
    if (m >= 9 && m <= 11)
      return {
        icon: "🍁",
        label: "Autumn leaves",
        color: "from-orange-500 to-red-400",
        shadow: "shadow-orange-500/20",
      };
    return {
      icon: "❄️",
      label: "Winter camellia",
      color: "from-blue-300 to-slate-100",
      shadow: "shadow-blue-500/20",
    };
  };

  const season = getSeasonalInfo(month);

  const learningDaysDisplay =
    studyDays ?? (isLoading ? null : /* fallback */ 0);
  const favoriteCountDisplay =
    favoriteCount ?? (isLoading ? null : /* fallback */ 0);

  return (
    <div className="min-h-screen min-h-[100dvh] overflow-x-hidden bg-[#020617] p-3 pb-24 font-sans text-slate-100 sm:p-4 pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))]">
      {/* 1. デジタル日本庭園セクション (Hero) */}
      <section className="relative mb-6 overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-[#020617] p-5 sm:p-8">
        <div className="flex flex-col items-center justify-center py-10">
          {/* 植物の成長ビジュアル */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={`mb-4 text-6xl filter drop-shadow-2xl sm:text-8xl ${season.shadow}`}
          >
            {season.icon}
          </motion.div>

          {/* 和柄風プログレスサークル */}
          <div className="relative flex items-center justify-center">
            <svg className="h-40 w-40 -rotate-90 transform sm:h-48 sm:w-48">
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-slate-800"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="80"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={502.6}
                initial={{ strokeDashoffset: 502.6 }}
                animate={{
                  strokeDashoffset: 502.6 - (502.6 * exp) / 100,
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`text-pink-400`}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-sm text-slate-400">Growth</span>
              {isLoading ? (
                <div className="mt-1 h-7 w-16 animate-pulse rounded-full bg-slate-800" />
              ) : (
                <span className="text-3xl font-bold">{exp}%</span>
              )}
            </div>
          </div>

          <button
            onClick={() => setExp((prev) => Math.min(100, prev + 5))}
            className="mt-6 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
          >
            <Droplets size={18} /> Water
          </button>
        </div>
      </section>

      {/* 2. Bento Grid セクション */}
      <div className="grid grid-cols-2 gap-4">
        {/* スキル分析タイル */}
        <div className="col-span-2 bg-slate-900/40 border border-slate-800 p-4 rounded-3xl backdrop-blur-md">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-400 mb-2">
            <TrendingUp size={16} /> Skill analysis
          </h3>
          <div className="h-48 w-full">
            {isLoading ? (
              <div className="h-full w-full animate-pulse rounded-2xl bg-slate-900/60" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <Radar
                    name="You"
                    dataKey="A"
                    stroke="#2a5caa"
                    fill="#2a5caa"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* AI褒め言葉タイル */}
        <div className="col-span-2 bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-indigo-400 opacity-20">
            <MessageSquare size={48} />
          </div>
          <p className="text-sm text-indigo-300 font-medium italic">
            “You’re using more natural aizuchi lately—conversations are flowing nicely 🌸”
          </p>
          <div className="mt-2 text-xs text-indigo-400">— AI Frensei</div>
        </div>

        {/* 記録スタッツタイル */}
        <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-3xl">
          <h3 className="text-xs text-slate-400 mb-1">Study days</h3>
          {isLoading ? (
            <div className="mt-1 h-7 w-16 animate-pulse rounded-full bg-slate-800" />
          ) : (
            <div className="text-2xl font-bold flex items-baseline gap-1">
              {learningDaysDisplay}
              <span className="text-xs font-normal text-slate-500">days</span>
            </div>
          )}
          <div className="mt-2 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  i < 3 ? "bg-orange-500" : "bg-slate-700"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 保存したフレーズタイル */}
        <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-3xl">
          <h3 className="text-xs text-slate-400 mb-1">My words / phrases</h3>
          {isLoading ? (
            <div className="mt-1 h-7 w-20 animate-pulse rounded-full bg-slate-800" />
          ) : (
            <div className="text-2xl font-bold flex items-baseline gap-1">
              {favoriteCountDisplay}
              <span className="text-xs font-normal text-slate-500">items</span>
            </div>
          )}
          <div className="mt-2 flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-slate-900" />
            <div className="w-6 h-6 rounded-full bg-indigo-500 border-2 border-slate-900" />
            <div className="w-6 h-6 rounded-full bg-pink-500 border-2 border-slate-900" />
          </div>
        </div>

        {/* 会話トピック履歴 */}
        <div className="col-span-2 bg-slate-900/40 border border-slate-800 p-4 rounded-3xl">
          <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
            <Calendar size={16} /> Conversation trail
          </h3>
          {isLoading && !topics ? (
            <div className="h-10 w-full animate-pulse rounded-2xl bg-slate-800/80" />
          ) : (
            <div className="flex flex-wrap gap-2">
              {(topics ?? defaultTopics).map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300 border border-slate-700"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 音読ログプレースホルダ */}
        <div className="col-span-2 bg-slate-900/40 border border-slate-800 p-4 rounded-3xl flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2">
            <Mic2 size={16} /> Shadowing log (coming soon)
          </h3>
          <div className="space-y-2 text-xs text-slate-300">
            {["2026-03-10", "2026-03-09", "2026-03-08"].map((d) => (
              <div
                key={d}
                className="flex items-center justify-between rounded-xl bg-slate-900/70 px-3 py-2"
              >
                <span className="text-slate-400">
                  {new Date(d).toLocaleDateString("en-US", {
                    month: "numeric",
                    day: "numeric",
                  })}
                </span>
                <div className="flex items-center gap-2 text-slate-500">
                  <span>“Otsukaresama desu, honjitsu no kaigi desu ga…”</span>
                  <button
                    type="button"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-600 bg-slate-900 text-slate-300 text-[10px]"
                    onClick={() => alert("Shadowing log is coming soon")}
                  >
                    ▶
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

