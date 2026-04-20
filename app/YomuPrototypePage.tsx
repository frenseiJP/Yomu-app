"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Image as ImageIcon,
  Volume2,
  Sparkles,
  BookOpen,
  Target,
  CheckCircle2,
  MessageCircle,
  Users,
  Settings,
  ClipboardList,
  Compass,
  MoreHorizontal,
  Languages,
  Eye,
  Mail,
  FileText,
  Shield,
  BookmarkPlus,
  ChevronRight,
  Check,
  Globe,
  PanelLeft,
  PlusCircle,
} from "lucide-react";
import { createClient as createAuthClient } from "@/src/utils/supabase/client";
import { isMissingTableError } from "@/src/utils/supabase/schema-errors";
import { getLangClient } from "@/src/utils/i18n/clientLang";
import {
  dateLocaleForLang,
  formatVocabSavedLine,
  formatWeekCheer,
  getPrototypeCopy,
  regionLabelForLang,
  type PrototypeUiText,
} from "@/src/utils/i18n/prototypeCopy";
import type { Lang } from "@/src/utils/i18n/types";
import { useAuthContext } from "@/src/contexts/AuthContext";
import {
  REGION_CHOICES,
  REGION_COOKIE_KEY,
  normalizeRegion,
  type Region,
} from "@/src/utils/region/region";
import {
  getStoredUiTheme,
  setStoredUiTheme,
  type UiTheme,
} from "@/src/utils/theme/theme";
import { isAffiliateBarVisibleForPath } from "@/lib/affiliateVisibility";
import { buildSeasonalProgressState } from "@/lib/progress/seasonal";
import SeasonalProgressCard from "@/components/progress/SeasonalProgressCard";
import {
  buildCoachContext,
  getDueReviews,
  getUserStats,
  recordChatUsed,
  recordMissionCompleted,
  type DueReviews,
  type UserStats,
  activeDaysToWeekDots,
  getProgressSnapshot,
} from "@/lib/habit";
import TodaysRetentionMissionCard from "@/components/habit/TodaysRetentionMissionCard";
import ReviewCard from "@/components/habit/ReviewCard";
import {
  buildRetentionMissionChatOpener,
  getOrCreateRetentionDailyMission,
  markRetentionDailyMissionCompleted,
  type RetentionDailyMissionDay,
} from "@/lib/mission/retentionDaily";
import { isMissionCompleted } from "@/lib/mission/completion";
import {
  applyMissionGrowthOnCompletion,
  buildMissionCompletionCopy,
  computeVisualGrowthStage,
  growthProgressRatio,
  readMissionGrowth,
  type MissionGrowthState,
} from "@/lib/progress/missionGrowth";
import { getCalendarSeason } from "@/lib/progress/seasonal";
import ProgressVisual from "@/components/progress/ProgressVisual";
import MissionRewardToast from "@/components/progress/MissionRewardToast";
import type { ChatMessage as StoredChatMessage, ChatSession as StoredChatSession } from "@/lib/chat/types";
import {
  addAssistantMessage,
  addUserMessage,
  getMessages as getStoredMessages,
  getOrCreateUserId,
  getSessions,
  removeSession,
  startNewChatSession,
} from "@/lib/chat/service";
import SessionDrawer from "@/components/chat/SessionDrawer";
import TopicGuidedLearning from "@/components/topic/TopicGuidedLearning";
import TopicSelector from "@/components/topic/TopicSelector";
import TopicActions from "@/components/topic/TopicActions";
import { buildTopicFeedbackMessage, buildTopicGuideMessage } from "@/components/topic/TopicMessageTemplate";
import {
  TOPIC_PROMPTS,
  generateTopicFeedback,
  listTopicPracticeResultsByUser,
  saveTopicPracticeResult,
} from "@/lib/topic/service";
import type { TopicPrompt, TopicFeedback } from "@/lib/topic/types";
import type { SaveCandidate } from "@/lib/save-candidates/types";
import { guessCorrectedSentence } from "@/lib/save-candidates/guess-correction";
import { recommendCandidatesForMessage, saveCandidateToVocabulary } from "@/lib/save-candidates/service";
import FtuePracticePicker from "@/components/chat/FtuePracticePicker";
import {
  buildFtueCoachMessage,
  fallbackFtueCoachPayload,
  fallbackStructuredCoachPayload,
  parseFtueCoachPayload,
} from "@/lib/ftue/format";
import { migrateFtueIfLegacyUser, readFtuePersist, writeFtuePersist } from "@/lib/ftue/state";
import { ftueEnglishPromptForMode, getFtueFreeOpening, getFtueOpening } from "@/lib/ftue/openers";
import type { FtueCoachPayload, FtuePracticeMode } from "@/lib/ftue/types";

type Role = "user" | "assistant";
type Politeness = "casual" | "neutral" | "business";
type TabView = "home" | "progress" | "chat" | "topic" | "settings" | "more";
type DisplayLangRaw = "ja" | "en" | "ko" | "zh";

const JLPT_LEVELS = ["N5", "N4", "N3", "N2", "N1"] as const;

type ChoiceSheetKind = "language" | "region";

function labelForDisplayLang(
  lang: DisplayLangRaw,
  uiText: Pick<
    PrototypeUiText,
    "selectLangJa" | "selectLangEn" | "selectLangKo" | "selectLangZh"
  >,
): string {
  const m: Record<DisplayLangRaw, string> = {
    ja: uiText.selectLangJa,
    en: uiText.selectLangEn,
    ko: uiText.selectLangKo,
    zh: uiText.selectLangZh,
  };
  return m[lang];
}

/** AI 返信直後に付与する、本文に即した語彙・次の3択 */
type ChatTurnContext = {
  highlightPhrases: { phrase: string; reading: string }[];
  followUps: [string, string, string];
  bestFollowUpIndex: number;
  saveCandidates?: SaveCandidate[];
};

type Message = {
  id: number;
  role: Role;
  baseText: string;
  /** 送信時点のトーン。ストリーム中に UI のトーンを変えても表示が揺れないようにする */
  replyTone?: Politeness;
  culturalNote?: string;
  tipsNote?: string;
  /** 初回ウェルカム・画像デモなど、トーン行を出すテンプレート用 */
  showToneMeta?: boolean;
  /** 初回チャット FTUE のメッセージ（言語切替でウェルカムに戻さない） */
  ftueAnchored?: boolean;
  /** 今日のリテンション・デイリーミッションの開始メッセージ */
  retentionMissionOpener?: boolean;
  createdAt: string;
  chatContext?: ChatTurnContext;
  topicLabel?: string;
  topicFeedback?: {
    topicId: string;
    userAnswer: string;
    correctedAnswer: string;
    explanation: string;
    alternativeExamples: string[];
    otherLearnerExamples?: string[];
    saved?: boolean;
  };
};

function toViewMessages(rows: StoredChatMessage[]): Message[] {
  return rows.map((m, i) => ({
    id: Date.now() + i,
    role: m.role,
    baseText: m.content,
    createdAt: m.createdAt,
  }));
}

/** 単語帳の1件：日本語・かな(表示切替可)・ローマ字・訳(複数)・品詞・例文(AI生成) */
type VocabItem = {
  id: number;
  word: string;
  kana?: string;
  romaji: string;
  translations: string[];
  partOfSpeech?: string;
  exampleSentences: string[];
};

type DailyMission = {
  id: string;
  title: string;
  cultureTip: string;
  keywords: string[];
};

const DAILY_MISSIONS: DailyMission[] = [
  {
    id: "1",
    title: "Ask AI about the origin of “Itadakimasu”",
    cultureTip: "In Japan, expressing gratitude before and after meals is an important custom.",
    keywords: ["Itadakimasu", "origin", "question", "gratitude"],
  },
  {
    id: "2",
    title: "Write one good thing that happened today in polite Japanese",
    cultureTip: "Polite style helps express respect and softens the conversation.",
    keywords: ["today", "good", "thank", "polite"],
  },
  {
    id: "3",
    title: "Ask AI when and to whom “Otsukaresama” is used",
    cultureTip: "“Otsukaresama” is a short phrase to appreciate someone’s effort.",
    keywords: ["Otsukaresama", "when", "who", "use"],
  },
];

function getTodaysMission(): DailyMission {
  const daySeed = new Date().toDateString();
  const idx =
    daySeed.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % DAILY_MISSIONS.length;
  return DAILY_MISSIONS[idx];
}

const BG = "#020617";
const LEGACY_VOCAB_STORAGE_KEY = "yomu_my_vocab";
function vocabStorageKey(userId: string): string {
  return `frensei:vocab:legacy-ui:v1:${userId}`;
}

function migrateVocabItem(v: Record<string, unknown>): VocabItem {
  const id = typeof v.id === "number" ? v.id : Date.now();
  const word = typeof v.word === "string" ? v.word : "";
  const romaji =
    typeof v.romaji === "string"
      ? v.romaji
      : typeof v.meaning === "string"
        ? v.meaning
        : "";
  const kana = typeof v.kana === "string" ? v.kana : undefined;
  const translations = Array.isArray(v.translations)
    ? (v.translations as string[])
    : typeof v.meaning === "string"
      ? [v.meaning]
      : [];
  const partOfSpeech = typeof v.partOfSpeech === "string" ? v.partOfSpeech : undefined;
  const exampleSentences = Array.isArray(v.exampleSentences)
    ? (v.exampleSentences as string[])
    : [];
  return { id, word, kana, romaji, translations, partOfSpeech, exampleSentences };
}

// HomeView: 継続意欲を高めるヒーローセクション
function HomeView(props: {
  todaysMission: DailyMission;
  missionCompleted: boolean;
  streakDays: boolean[];
  vocab: VocabItem[];
  uiText: {
    dailyMission: string;
    thisWeek: string;
    askInChat: string;
    recentWords: string;
    noRecentWords: string;
  };
}) {
  const { todaysMission, missionCompleted, streakDays, vocab, uiText } = props;
  const completedCount = streakDays.filter(Boolean).length;
  const streakPercent = Math.min(1, completedCount / 7);

  const containerVariants = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
  };

  return (
    <motion.section
      className="mb-3 space-y-3 sm:mb-4 sm:space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* 和柄ストリーク：円形プログレス */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800/50 bg-slate-950/40 px-4 py-3 backdrop-blur-xl sm:px-5 sm:py-4"
      >
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 sm:h-20 sm:w-20">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(#22c55e ${streakPercent * 360}deg, rgba(15,23,42,0.9) 0deg)`,
              }}
            />
            <div className="absolute inset-1 rounded-full bg-slate-950/90 backdrop-blur-xl" />
            <div className="relative flex h-full w-full flex-col items-center justify-center">
              <span className="font-wa-serif text-xl font-bold text-slate-50 sm:text-2xl">
                {completedCount}
              </span>
              <span className="text-[10px] text-slate-400 sm:text-[11px]">day streak</span>
            </div>
          </div>
          <div>
            <p className="font-wa-serif text-xs font-medium text-slate-200 sm:text-sm">
              Pattern streak
            </p>
            <p className="text-[10px] text-slate-500 sm:text-[11px]">
              Complete missions 7 days in a row to unlock a special badge.
            </p>
          </div>
        </div>
        <div className="hidden text-right sm:block">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
            THIS WEEK
          </p>
          <p className="text-xs font-semibold text-slate-200">
            {completedCount} / 7 days
          </p>
        </div>
      </motion.div>

      {/* Daily Mission フローティングカード */}
      <motion.div
        variants={itemVariants}
        className="relative z-[1] mx-auto w-full max-w-xl rounded-3xl border border-slate-800/50 bg-slate-950/70 px-4 py-4 shadow-[0_22px_80px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:px-6 sm:py-5"
      >
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-wa-ruri" />
            <Sparkles className="h-3.5 w-3.5 text-wa-kinari/90" />
            <span className="font-wa-serif text-[11px] font-semibold tracking-[0.18em] text-slate-400">{uiText.dailyMission}</span>
          </div>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] ${
              missionCompleted
                ? "bg-emerald-500/15 text-emerald-300"
                : "bg-slate-900/80 text-slate-400"
            }`}
          >
            {missionCompleted ? "Completed" : "Today"}
          </span>
        </div>
        <p className="font-wa-serif text-[13px] leading-relaxed text-slate-50 sm:text-sm">
          {todaysMission.title}
        </p>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
          {todaysMission.cultureTip}
        </p>
      </motion.div>

      {/* Recent Vocab カルーセル */}
      <motion.div
        variants={itemVariants}
        className="space-y-2 rounded-2xl border border-slate-800/50 bg-slate-950/40 px-3 py-3 backdrop-blur-xl sm:px-4 sm:py-4"
      >
        <div className="flex items-center justify-between">
          <p className="font-wa-serif text-xs font-semibold text-slate-200">
            {uiText.recentWords}
          </p>
          <span className="text-[10px] text-slate-500">
            <span className="font-bold text-slate-100">{vocab.length}</span> words
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 text-[11px] sm:gap-3">
          {vocab.length === 0 ? (
            <p className="text-[11px] text-slate-500">
              {uiText.noRecentWords}
            </p>
          ) : (
            vocab.slice(0, 12).map((v) => (
              <div
                key={v.id}
                className="min-w-[120px] rounded-2xl border border-slate-800/70 bg-slate-950/80 px-3 py-2.5 shadow-sm shadow-black/40"
              >
                <p className="text-[13px] font-bold text-slate-50">{v.word}</p>
                {v.kana && (
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {v.kana}
                  </p>
                )}
                <p className="mt-0.5 text-[10px] text-slate-500">{v.romaji}</p>
                {v.translations[0] && (
                  <p className="mt-1 line-clamp-2 text-[10px] text-slate-300">
                    {v.translations.slice(0, 2).join(" / ")}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.section>
  );
}

function buildWelcomeMessage(lang: Lang): Message {
  const { uiText } = getPrototypeCopy(lang);
  return {
    id: 1,
    role: "assistant",
    baseText: uiText.chatWelcomeBody,
    culturalNote: uiText.chatWelcomeCulturalNote,
    tipsNote: uiText.chatWelcomeTipsNote,
    showToneMeta: true,
    createdAt: new Date().toISOString(),
  };
}

function formatTime(dateIso: string) {
  const d = new Date(dateIso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatSaveCandidateHeading(c: SaveCandidate): string {
  if (c.type === "correction") return "[Correction]";
  if (c.type === "phrase") return "[Useful phrase]";
  return "[Word]";
}

function applyPoliteness(text: string, level: Politeness): string {
  if (level === "neutral") return text;
  if (level === "casual") {
    return (
      text
        .replace("です。", "だよ。")
        .replace(/ください。/g, "ね。")
        .replace(/ましょう。/g, "よう。")
    );
  }
  return (
    "If I may, " +
    text
      .replace("です。", "でございます。")
      .replace(/ください。/g, "いただけますと幸いです。")
      .replace(/ましょう。/g, "まいりましょう。")
  );
}

const FURIGANA_DICTIONARY: Record<string, string> = {
  日本語: "にほんご",
  文化: "ぶんか",
  空気: "くうき",
  桜: "さくら",
};

/** 本文中の重要フレーズの直後に（読み）を付ける用。ヘボン式ローマ字・長い順でマッチ */
const PHRASE_READINGS: [string, string][] = [
  ["よろしくお願いします", "yoroshiku onegaishimasu"],
  ["いただきます", "Itadakimasu"],
  ["お疲れ様", "Otsukaresama"],
  ["おつかれさま", "Otsukaresama"],
  ["日本語", "nihongo"],
  ["文化", "bunka"],
  ["空気", "kuuki"],
  ["桜", "sakura"],
];

/** フォロー3択の正解位置をランダム化（画面上で位置と正解が固定されないようにする） */
function shuffleFollowUps(
  texts: [string, string, string],
  bestFollowUpIndex: number
): { items: [string, string, string]; bestIdx: number } {
  const safeBest = Math.min(2, Math.max(0, bestFollowUpIndex));
  const entries = texts.map((t, i) => ({ t, isBest: i === safeBest }));
  for (let i = entries.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [entries[i], entries[j]] = [entries[j], entries[i]];
  }
  return {
    items: entries.map((e) => e.t) as [string, string, string],
    bestIdx: entries.findIndex((e) => e.isBest),
  };
}

function withFurigana(text: string): JSX.Element {
  const entries = Object.entries(FURIGANA_DICTIONARY);
  if (entries.length === 0) return <>{text}</>;
  let fragments: (string | JSX.Element)[] = [text];
  for (const [kanji, reading] of entries) {
    const next: (string | JSX.Element)[] = [];
    fragments.forEach((frag, idx) => {
      if (typeof frag !== "string") {
        next.push(frag);
        return;
      }
      const parts = frag.split(kanji);
      parts.forEach((p, i) => {
        if (p) next.push(p);
        if (i < parts.length - 1) {
          next.push(
            <ruby key={`${kanji}-${idx}-${i}`}>
              {kanji}
              <rt>{reading}</rt>
            </ruby>
          );
        }
      });
    });
    fragments = next;
  }
  return <>{fragments}</>;
}

/** 本文を「単語」（読み）で区切り、単語タップでメニューを開くコールバックを呼ぶ */
function renderMessageWithVocab(
  text: string,
  furiganaOn: boolean,
  onWordTap: (phrase: string, reading: string) => void,
  extraPhrasePairs: [string, string][] = []
): JSX.Element {
  type Segment = { type: "text"; value: string } | { type: "vocab"; phrase: string; reading: string };
  const seen = new Set<string>();
  const merged: [string, string][] = [];
  for (const [p, r] of [...extraPhrasePairs, ...PHRASE_READINGS]) {
    const key = p.trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    merged.push([p, r]);
  }
  merged.sort((a, b) => b[0].length - a[0].length);

  const segments: Segment[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    let found = false;
    for (const [phrase, reading] of merged) {
      const idx = remaining.indexOf(phrase);
      if (idx !== -1) {
        if (idx > 0) segments.push({ type: "text", value: remaining.slice(0, idx) });
        segments.push({ type: "vocab", phrase, reading });
        remaining = remaining.slice(idx + phrase.length);
        found = true;
        break;
      }
    }
    if (!found) {
      segments.push({ type: "text", value: remaining });
      break;
    }
  }

  return (
    <>
      {segments.map((seg, i) =>
        seg.type === "text" ? (
          <span key={i}>{furiganaOn ? withFurigana(seg.value) : seg.value}</span>
        ) : (
          <button
            key={i}
            type="button"
            onClick={() => onWordTap(seg.phrase, seg.reading)}
            className="rounded px-0.5 font-medium text-slate-100 underline decoration-wa-ruri/50 underline-offset-2 hover:decoration-wa-ruri hover:bg-wa-ruri/10"
          >
            「{seg.phrase}」（{seg.reading}）
          </button>
        )
      )}
    </>
  );
}

/** プロトタイプ設定保存用。部分 upsert だと display_name 等が NULL になり DB エラーになるため、既存行は update のみ。 */
type ProfileLangAuthUser = {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
};

type ProfileLangPatch = {
  settings_language: string;
  native_language: string;
  region: string;
  /** 未指定なら update 時は first_language 列を触らない */
  first_language?: "ja" | "en";
};

function formatProfileSaveError(err: unknown): string {
  if (err && typeof err === "object") {
    const o = err as { message?: string; details?: string; hint?: string };
    const parts = [o.message, o.details, o.hint].filter(
      (s): s is string => typeof s === "string" && s.length > 0
    );
    if (parts.length) return parts.join("\n");
  }
  if (err instanceof Error) return err.message;
  return String(err);
}

async function saveUserProfileLanguageSettings(
  supabase: ReturnType<typeof createAuthClient>,
  user: ProfileLangAuthUser,
  patch: ProfileLangPatch
): Promise<{ error: unknown | null; dbUnavailable?: boolean }> {
  const { data: existing, error: readErr } = await supabase
    .from("user_profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (readErr) {
    if (isMissingTableError(readErr, "user_profiles")) {
      console.warn("[user_profiles] table missing; saving cookies only.");
      return { error: null, dbUnavailable: true };
    }
    console.error("[user_profiles] read before save failed:", readErr);
    return { error: readErr };
  }

  if (existing) {
    const updateFields: Record<string, string> = {
      settings_language: patch.settings_language,
      native_language: patch.native_language,
      region: patch.region,
    };
    if (patch.first_language !== undefined) {
      updateFields.first_language = patch.first_language;
    }
    const { error } = await supabase
      .from("user_profiles")
      .update(updateFields)
      .eq("user_id", user.id);
    if (error) {
      if (isMissingTableError(error, "user_profiles")) {
        return { error: null, dbUnavailable: true };
      }
      console.error("[user_profiles] update failed:", error);
    }
    return { error };
  }

  const displayName =
    (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name.trim()) ||
    user.email?.split("@")[0] ||
    "Yomu";

  const firstLang = patch.first_language ?? "ja";

  const { error } = await supabase.from("user_profiles").insert({
    user_id: user.id,
    display_name: displayName,
    icon: "🌸",
    kokuseki: "OTHER",
    first_language: firstLang,
    settings_language: patch.settings_language,
    native_language: patch.native_language,
    region: patch.region,
  });
  if (error) {
    if (isMissingTableError(error, "user_profiles")) {
      return { error: null, dbUnavailable: true };
    }
    console.error("[user_profiles] insert failed:", error);
  }
  return { error };
}

type YomuPrototypePageProps = {
  initialView?: TabView;
  /** /chat などに埋め込むとき true。高さを親に合わせる */
  embedded?: boolean;
};

export default function YomuPrototypePage({ initialView = "home", embedded = false }: YomuPrototypePageProps = {}) {
  const pathname = usePathname() || "";
  const affiliateBarVisible = isAffiliateBarVisibleForPath(pathname);
  /** 下部タブをアフィリエイトバーより上に置く＋本文の余白 */
  const mainBottomPadding = affiliateBarVisible
    ? "calc(72px + 60px + env(safe-area-inset-bottom, 0px))"
    : "72px";

  const [messages, setMessages] = useState<Message[]>(() => [
    buildWelcomeMessage(getLangClient()),
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [politeness, setPoliteness] = useState<Politeness>("casual");
  const [furiganaOn, setFuriganaOn] = useState(true);
  const [chatSettingsOpen, setChatSettingsOpen] = useState(false);
  const [jlptLevel, setJlptLevel] = useState<(typeof JLPT_LEVELS)[number]>("N3");
  const [showTranslations, setShowTranslations] = useState(true);
  const [speechRate, setSpeechRate] = useState(1);
  type NativeLanguage = "en" | "zh" | "ko" | "vi";
  const { region: authRegion, setRegion: setAuthRegion } = useAuthContext();
  const [profileSettingsLoading, setProfileSettingsLoading] = useState(false);
  const [appLang, setAppLang] = useState<DisplayLangRaw>(() => {
    if (typeof document === "undefined") return "en";
    const target = "yomu_lang=";
    const found = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(target));
    if (!found) return getLangClient() as unknown as DisplayLangRaw;
    const raw = decodeURIComponent(found.slice(target.length));
    return raw === "ja" || raw === "en" || raw === "ko" || raw === "zh"
      ? raw
      : "en";
  });
  const [uiTheme, setUiTheme] = useState<UiTheme>("dark");
  const [draftDisplayLanguage, setDraftDisplayLanguage] = useState<DisplayLangRaw>(appLang);
  const [draftFirstLanguage, setDraftFirstLanguage] = useState<"ja" | "en">("en");
  const [draftNativeLanguage, setDraftNativeLanguage] = useState<NativeLanguage>("en");
  const [draftRegion, setDraftRegion] = useState<Region>(authRegion);
  const [choiceSheet, setChoiceSheet] = useState<ChoiceSheetKind | null>(null);
  const [regionChoiceApplyImmediate, setRegionChoiceApplyImmediate] = useState(false);
  const [vocab, setVocab] = useState<VocabItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(LEGACY_VOCAB_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown[];
      return (parsed || []).map((v) => migrateVocabItem(v as Record<string, unknown>));
    } catch {
      return [];
    }
  });
  const [vocabKanaVisible, setVocabKanaVisible] = useState(true);
  const [imageName, setImageName] = useState<string | null>(null);
  const [vocabMenu, setVocabMenu] = useState<{ phrase: string; reading: string } | null>(null);
  const [vocabAdding, setVocabAdding] = useState(false);
  const [contextLoadingId, setContextLoadingId] = useState<number | null>(null);
  const [followUpFeedback, setFollowUpFeedback] = useState<null | "nice" | "ok">(null);
  const [currentTopic, setCurrentTopic] = useState("");
  const [activeView, setActiveView] = useState<TabView>(initialView);
  const [sessionDrawerOpen, setSessionDrawerOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState<StoredChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [topicSelectorMode, setTopicSelectorMode] = useState<"entry" | "topic_list" | "hidden">("entry");
  const [activeTopicPrompt, setActiveTopicPrompt] = useState<TopicPrompt | null>(null);
  const [habitUserId, setHabitUserId] = useState("guest");
  const [reportFabPos, setReportFabPos] = useState<{ x: number; y: number } | null>(null);
  const [retentionMissionDay, setRetentionMissionDay] = useState<RetentionDailyMissionDay | null>(null);
  const [retentionRewardBanner, setRetentionRewardBanner] = useState<string | null>(null);
  const [retentionMissionChatOpen, setRetentionMissionChatOpen] = useState(false);
  const retentionMissionFinalizedRef = useRef(false);
  const [missionGrowth, setMissionGrowth] = useState<MissionGrowthState>({
    totalCompleted: 0,
    currentStreak: 0,
    lastActiveDate: "",
  });
  const [missionMicroToast, setMissionMicroToast] = useState<{ l1: string; l2: string } | null>(null);
  const [ftueShowPicker, setFtueShowPicker] = useState(false);
  const [ftueCoachActive, setFtueCoachActive] = useState(false);
  const [ftuePracticeKind, setFtuePracticeKind] = useState<FtuePracticeMode>("natural");
  const ftueCoachingAttemptRef = useRef(0);
  const ftueFreePathRef = useRef(false);
  const [dueReviews, setDueReviews] = useState<DueReviews>({ words: [], mistakes: [] });
  const [stats, setStats] = useState<UserStats>({
    streak: 0,
    totalWords: 0,
    totalMistakes: 0,
    totalSessions: 0,
    mistakesFixed: 0,
    totalTopicPractices: 0,
  });
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const politenessRef = useRef<Politeness>("casual");
  const reportFabRef = useRef<HTMLButtonElement | null>(null);
  const reportFabDraggingRef = useRef(false);
  const reportFabMovedRef = useRef(false);
  const reportFabPressTimerRef = useRef<number | null>(null);
  const reportFabPointerOffsetRef = useRef({ x: 0, y: 0 });
  const { settingsText, uiText } = useMemo(
    () => getPrototypeCopy(appLang as Lang),
    [appLang],
  );

  const refreshHabitData = useCallback((userId: string) => {
    const rDay = getOrCreateRetentionDailyMission(userId, jlptLevel);
    setMissionGrowth(readMissionGrowth(userId));
    const r = getDueReviews(userId);
    const s = getUserStats(userId);
    setRetentionMissionDay(rDay);
    setDueReviews(r);
    setStats(s);
    const p = getProgressSnapshot(userId);
    setStreakDays(activeDaysToWeekDots(p.activeDays));
    setMissionCompleted(Boolean(rDay.completed));
  }, [jlptLevel]);

  const refreshChatSessions = useCallback((userId: string) => {
    migrateFtueIfLegacyUser(userId);
    const ftueP = readFtuePersist();
    const rows = getSessions(userId);
    setChatSessions(rows);
    if (rows.length === 0) {
      const created = startNewChatSession(userId);
      setChatSessions([created]);
      setCurrentSessionId(created.id);
      if (!ftueP.pickerDone && !ftueP.firstLearningCompleted) {
        setFtueShowPicker(true);
        setMessages([]);
        setTopicSelectorMode("entry");
      } else {
        setMessages([buildWelcomeMessage(appLang as Lang)]);
      }
      return;
    }
    if (!currentSessionId || !rows.some((s) => s.id === currentSessionId)) {
      const sid = rows[0].id;
      setCurrentSessionId(sid);
      const ms = getStoredMessages(userId, sid);
      if (!ftueP.pickerDone && !ftueP.firstLearningCompleted && ms.length === 0) {
        setFtueShowPicker(true);
        setMessages([]);
      } else {
        setMessages(ms.length ? toViewMessages(ms) : [buildWelcomeMessage(appLang as Lang)]);
      }
      setTopicSelectorMode(ms.length > 0 ? "hidden" : "entry");
    }
  }, [appLang, currentSessionId]);

  const dateLocale = useMemo(
    () => dateLocaleForLang(appLang as Lang),
    [appLang],
  );
  const isLightTheme = uiTheme === "light";

  const clampReportFabPos = useCallback((x: number, y: number) => {
    if (typeof window === "undefined") return { x, y };
    const size = 52;
    const margin = 8;
    const maxX = Math.max(margin, window.innerWidth - size - margin);
    const maxY = Math.max(margin, window.innerHeight - size - margin);
    return {
      x: Math.min(maxX, Math.max(margin, x)),
      y: Math.min(maxY, Math.max(margin, y)),
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const htmlLang =
      appLang === "ja" ? "ja" : appLang === "ko" ? "ko" : appLang === "zh" ? "zh" : "en";
    document.documentElement.lang = htmlLang;
  }, [appLang]);

  useEffect(() => {
    setUiTheme(getStoredUiTheme());
  }, []);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const localUid = getOrCreateUserId();
        const supabase = createAuthClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const uid = user?.id ?? localUid;
        if (!mounted) return;
        setHabitUserId(uid);
        refreshHabitData(uid);
        refreshChatSessions(uid);
      } catch {
        if (!mounted) return;
        const uid = getOrCreateUserId();
        setHabitUserId(uid);
        refreshHabitData(uid);
        refreshChatSessions(uid);
      }
    };
    void init();
    return () => {
      mounted = false;
    };
  }, [refreshHabitData, refreshChatSessions]);

  useEffect(() => {
    setStoredUiTheme(uiTheme);
  }, [uiTheme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const initX = window.innerWidth - 64;
    const initY = window.innerHeight - 170;
    setReportFabPos(clampReportFabPos(initX, initY));
  }, [clampReportFabPos]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => {
      setReportFabPos((prev) => {
        if (!prev) return prev;
        return clampReportFabPos(prev.x, prev.y);
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clampReportFabPos]);

  useEffect(() => {
    if (activeView !== "chat") return;
    migrateFtueIfLegacyUser(habitUserId);
    const p = readFtuePersist();
    if (p.pickerDone || p.firstLearningCompleted) setFtueShowPicker(false);
  }, [activeView, habitUserId]);

  useEffect(() => {
    if (activeView !== "chat") return;
    setMessages((prev) => {
      if (prev.some((m) => m.role === "user")) return prev;
      if (prev.some((m) => m.ftueAnchored)) return prev;
      if (ftueShowPicker && prev.length === 0) return prev;
      return [buildWelcomeMessage(appLang as Lang)];
    });
  }, [appLang, ftueShowPicker, activeView]);

  useEffect(() => {
    politenessRef.current = politeness;
  }, [politeness]);

  useEffect(() => {
    if (!choiceSheet) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setChoiceSheet(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [choiceSheet]);

  useEffect(() => {
    return () => {
      if (reportFabPressTimerRef.current) {
        window.clearTimeout(reportFabPressTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const syncLangFromCookie = () => {
      const next = getLangClient() as DisplayLangRaw;
      setAppLang(next);
      setDraftDisplayLanguage(next);
    };
    const onLangChanged = (event: Event) => {
      const custom = event as CustomEvent<{ lang?: DisplayLangRaw }>;
      const next = custom.detail?.lang ?? (getLangClient() as DisplayLangRaw);
      setAppLang(next);
      setDraftDisplayLanguage(next);
    };
    window.addEventListener("yomu:lang-changed", onLangChanged as EventListener);
    document.addEventListener("visibilitychange", syncLangFromCookie);
    window.addEventListener("focus", syncLangFromCookie);
    return () => {
      window.removeEventListener("yomu:lang-changed", onLangChanged as EventListener);
      document.removeEventListener("visibilitychange", syncLangFromCookie);
      window.removeEventListener("focus", syncLangFromCookie);
    };
  }, []);

  const saveWord = async (word: string, meaning: string, example: string) => {
    const authSupabase = createAuthClient();
    const {
      data: { user },
    } = await authSupabase.auth.getUser();
    if (!user) {
      alert(uiText.alertSignInVocab);
      return;
    }
    const { error } = await authSupabase.from("favorites").insert([
      {
        user_id: user.id,
        word,
        meaning,
        example,
        level: "N3",
        topic: currentTopic || "chat",
      },
    ]);
    if (error) {
      alert(uiText.alertCouldNotSaveWord);
    } else {
      alert(uiText.alertAddedVocab);
    }
  };

  const setCookie = (name: string, value: string) => {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
  };
  const notifyLangChanged = (nextLang: DisplayLangRaw) => {
    window.dispatchEvent(new CustomEvent("yomu:lang-changed", { detail: { lang: nextLang } }));
  };

  const readCookie = (name: string): string | null => {
    const target = `${name}=`;
    const found = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(target));
    if (!found) return null;
    return decodeURIComponent(found.slice(target.length));
  };

  // 設定タブを開いたとき、user_profiles から地域/言語の現在値を読み込む
  useEffect(() => {
    if (activeView !== "settings") return;

    let aborted = false;
    const fetchProfile = async () => {
      setProfileSettingsLoading(true);
      try {
        const supabase = createAuthClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error: profileErr } = await supabase
          .from("user_profiles")
          .select("native_language, settings_language, region, first_language")
          .eq("user_id", user.id)
          .limit(1);

        if (aborted) return;

        if (profileErr && isMissingTableError(profileErr, "user_profiles")) {
          const cLang = readCookie("yomu_lang");
          const nextLang: DisplayLangRaw =
            cLang === "ja" || cLang === "en" || cLang === "ko" || cLang === "zh"
              ? cLang
              : (getLangClient() as DisplayLangRaw);
          const cf = readCookie("yomu_first_lang");
          const nextFirstLang: "ja" | "en" = cf === "en" ? "en" : "ja";
          const cReg = readCookie(REGION_COOKIE_KEY);
          const nextRegion = normalizeRegion(cReg);

          setDraftDisplayLanguage(nextLang);
          setAppLang(nextLang);
          setDraftFirstLanguage(nextFirstLang);
          setDraftRegion(nextRegion);
          setAuthRegion(nextRegion);
          setCookie("yomu_lang", nextLang);
          setCookie(REGION_COOKIE_KEY, nextRegion);
          return;
        }

        if (profileErr) {
          console.warn("[user_profiles] fetch settings:", profileErr);
        }

        const row = data?.[0];
        const rawLang = row?.settings_language;
        const nextLang: DisplayLangRaw =
          rawLang === "ja" || rawLang === "en" || rawLang === "ko" || rawLang === "zh"
            ? rawLang
            : "ja";

        const nextFirstLang: "ja" | "en" =
          row?.first_language === "en" ? "en" : "ja";

        const nextNative: NativeLanguage =
          row?.native_language === "en" ||
          row?.native_language === "zh" ||
          row?.native_language === "ko" ||
          row?.native_language === "vi"
            ? row.native_language
            : "en";

        const nextRegion = normalizeRegion(row?.region);

        setDraftDisplayLanguage(nextLang);
        setAppLang(nextLang);
        setDraftFirstLanguage(nextFirstLang);
        setDraftNativeLanguage(nextNative);
        setDraftRegion(nextRegion);
        setAuthRegion(nextRegion);

        // 他ページに即時反映させるため cookie も更新
        setCookie("yomu_lang", nextLang);
        setCookie(REGION_COOKIE_KEY, nextRegion);
      } catch {
        // profile は任意のため、失敗しても画面自体は表示続行
      } finally {
        if (!aborted) setProfileSettingsLoading(false);
      }
    };

    fetchProfile();
    return () => {
      aborted = true;
    };
  }, [activeView, setAuthRegion]);

  const handleSaveProfileSettings = async () => {
    setProfileSettingsLoading(true);
    try {
      const supabase = createAuthClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert(uiText.alertSignInSettings);
        return;
      }

      const { error, dbUnavailable } = await saveUserProfileLanguageSettings(
        supabase,
        user,
        {
          settings_language: draftDisplayLanguage,
          native_language: draftNativeLanguage,
          region: draftRegion,
          first_language: draftFirstLanguage,
        }
      );

      if (error) {
        console.error("handleSaveProfileSettings:", error);
        alert(
          `Could not save. Please try again.\n\n${formatProfileSaveError(error)}`
        );
        return;
      }

      setCookie("yomu_lang", draftDisplayLanguage);
      setCookie(REGION_COOKIE_KEY, draftRegion);
      setAuthRegion(draftRegion);
      setAppLang(draftDisplayLanguage);
      notifyLangChanged(draftDisplayLanguage);

      if (dbUnavailable) {
        alert(
          "このブラウザには保存しました（クッキー）。クラウドへ同期するには、Supabase の SQL Editor で supabase/migrations/20260401120000_create_user_profiles.sql を実行して user_profiles テーブルを作成してください。"
        );
        return;
      }

      alert(uiText.alertSettingsSaved);
    } catch (err) {
      console.error("handleSaveProfileSettings unexpected:", err);
      alert(
        `Could not save. Please try again.\n\n${formatProfileSaveError(err)}`
      );
    } finally {
      setProfileSettingsLoading(false);
    }
  };

  const handleQuickRegionChange = (nextRegion: Region) => {
    setDraftRegion(nextRegion);
    setAuthRegion(nextRegion);
    setCookie(REGION_COOKIE_KEY, nextRegion);
  };

  const handleResetToFirstLanguage = async () => {
    setProfileSettingsLoading(true);
    try {
      const supabase = createAuthClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert(uiText.alertSignInReset);
        return;
      }

      const cookieFirst = readCookie("yomu_first_lang");
      const nextLang: "ja" | "en" =
        cookieFirst === "en" ? "en" : draftFirstLanguage;

      const { data: row, error: readErr } = await supabase
        .from("user_profiles")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (readErr) {
        if (isMissingTableError(readErr, "user_profiles")) {
          setDraftDisplayLanguage(nextLang);
          setAppLang(nextLang);
          setCookie("yomu_lang", nextLang);
          notifyLangChanged(nextLang);
          alert(
            "表示言語をこのブラウザ用にリセットしました。クラウド同期には user_profiles テーブルが必要です（supabase/migrations の SQL を実行）。"
          );
          return;
        }
        console.error("handleResetToFirstLanguage read:", readErr);
        alert(`Reset failed.\n\n${formatProfileSaveError(readErr)}`);
        return;
      }

      if (row) {
        const { error } = await supabase
          .from("user_profiles")
          .update({ settings_language: nextLang })
          .eq("user_id", user.id);
        if (error) {
          if (isMissingTableError(error, "user_profiles")) {
            setDraftDisplayLanguage(nextLang);
            setAppLang(nextLang);
            setCookie("yomu_lang", nextLang);
            notifyLangChanged(nextLang);
            alert(
              "表示言語をこのブラウザ用にリセットしました。クラウド同期には user_profiles テーブルが必要です。"
            );
            return;
          }
          console.error("handleResetToFirstLanguage update:", error);
          alert(`Reset failed.\n\n${formatProfileSaveError(error)}`);
          return;
        }
      } else {
        const displayName =
          (typeof user.user_metadata?.full_name === "string" &&
            user.user_metadata.full_name.trim()) ||
          user.email?.split("@")[0] ||
          "Yomu";
        const { error } = await supabase.from("user_profiles").insert({
          user_id: user.id,
          display_name: displayName,
          icon: "🌸",
          kokuseki: "OTHER",
          first_language: draftFirstLanguage,
          settings_language: nextLang,
          native_language: draftNativeLanguage,
          region: draftRegion,
        });
        if (error) {
          if (isMissingTableError(error, "user_profiles")) {
            setDraftDisplayLanguage(nextLang);
            setAppLang(nextLang);
            setCookie("yomu_lang", nextLang);
            notifyLangChanged(nextLang);
            alert(
              "表示言語をこのブラウザ用にリセットしました。クラウド同期には user_profiles テーブルが必要です。"
            );
            return;
          }
          console.error("handleResetToFirstLanguage insert:", error);
          alert(`Reset failed.\n\n${formatProfileSaveError(error)}`);
          return;
        }
      }

      setDraftDisplayLanguage(nextLang);
      setCookie("yomu_lang", nextLang);
      setAppLang(nextLang);
      notifyLangChanged(nextLang);

      alert(uiText.alertDisplayResetOk);
    } catch (err) {
      console.error("handleResetToFirstLanguage unexpected:", err);
      alert(`Reset failed.\n\n${formatProfileSaveError(err)}`);
    } finally {
      setProfileSettingsLoading(false);
    }
  };

  const handleLogout = async () => {
    setProfileSettingsLoading(true);
    try {
      const supabase = createAuthClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    } finally {
      setProfileSettingsLoading(false);
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    if (!habitUserId || typeof window === "undefined") return;
    try {
      const scopedRaw = window.localStorage.getItem(vocabStorageKey(habitUserId));
      if (scopedRaw) {
        const parsed = JSON.parse(scopedRaw) as unknown[];
        setVocab((parsed || []).map((v) => migrateVocabItem(v as Record<string, unknown>)));
        return;
      }
      // legacy key から userId スコープへ 1 回だけ移行
      const legacyRaw = window.localStorage.getItem(LEGACY_VOCAB_STORAGE_KEY);
      if (!legacyRaw) return;
      window.localStorage.setItem(vocabStorageKey(habitUserId), legacyRaw);
      const parsed = JSON.parse(legacyRaw) as unknown[];
      setVocab((parsed || []).map((v) => migrateVocabItem(v as Record<string, unknown>)));
    } catch {
      /* ignore */
    }
  }, [habitUserId]);

  useEffect(() => {
    if (!habitUserId || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(vocabStorageKey(habitUserId), JSON.stringify(vocab));
    } catch {
      /* ignore */
    }
  }, [vocab, habitUserId]);

  const todaysMission = useMemo(() => getTodaysMission(), []);
  const [missionCompleted, setMissionCompleted] = useState(false);
  const [streakDays, setStreakDays] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  function messageMatchesMission(text: string): boolean {
    const lower = text.toLowerCase().replace(/\s/g, "");
    return (
      todaysMission.keywords.some((k) =>
        lower.includes(k.toLowerCase().replace(/\s/g, ""))
      ) || text.length >= 8
    );
  }

  const missionGrowthVisual = useMemo(() => {
    const season = getCalendarSeason();
    const stage = computeVisualGrowthStage(missionGrowth.totalCompleted, missionGrowth.currentStreak);
    return {
      season,
      stage,
      progressRatio: growthProgressRatio(missionGrowth.totalCompleted, stage),
    };
  }, [missionGrowth]);

  const dismissMissionToast = useCallback(() => setMissionMicroToast(null), []);

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
    return () => cancelAnimationFrame(timer);
  }, [messages, isTyping, politeness]);

  useEffect(() => {
    if (!retentionMissionChatOpen) return;
    if (!retentionMissionDay || retentionMissionDay.completed) return;
    if (retentionMissionFinalizedRef.current) return;
    if (!isMissionCompleted(messages)) return;
    retentionMissionFinalizedRef.current = true;
    const updated = markRetentionDailyMissionCompleted(habitUserId);
    if (updated) setRetentionMissionDay(updated);
    recordMissionCompleted(habitUserId);
    const grown = applyMissionGrowthOnCompletion(habitUserId);
    setMissionGrowth(grown);
    const season = getCalendarSeason();
    const copy = buildMissionCompletionCopy(season);
    setRetentionRewardBanner(copy.banner);
    window.setTimeout(() => setRetentionRewardBanner(null), 10000);
    setMissionMicroToast({ l1: copy.microLine1, l2: copy.microLine2 });
    setMissionCompleted(true);
    setRetentionMissionChatOpen(false);
    void refreshHabitData(habitUserId);
  }, [messages, retentionMissionChatOpen, retentionMissionDay, habitUserId, refreshHabitData]);

  const controllerRef = useRef<AbortController | null>(null);
  const isLoading = isTyping;
  const canSend = input.trim().length > 0 && !isLoading && !ftueShowPicker;

  const latestFollowUpContext = useMemo((): ChatTurnContext | null => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (
        m.role === "assistant" &&
        m.chatContext &&
        m.chatContext.followUps?.length === 3
      ) {
        return m.chatContext;
      }
    }
    return null;
  }, [messages]);

  const lastAssistantMessageId = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant") return messages[i].id;
    }
    return null;
  }, [messages]);

  const enrichChatContext = useCallback(
    async (
      assistantId: number,
      assistantText: string,
      userText: string,
      opts?: { correctedSentence?: string },
    ) => {
      setContextLoadingId(assistantId);
      const defaults = getPrototypeCopy(appLang as Lang).uiText;
      try {
        const res = await fetch("/api/chat/context", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            assistantText,
            userText,
            language: appLang,
          }),
        });
        const data = (await res.json()) as Record<string, unknown>;
        if (!res.ok) throw new Error();

        const rawFollow = Array.isArray(data.followUps)
          ? (data.followUps as unknown[])
              .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
              .map((s) => s.trim())
          : [];
        const tripletInput: [string, string, string] = [
          rawFollow[0] || defaults.quickPrompt1,
          rawFollow[1] || defaults.quickPrompt2,
          rawFollow[2] || defaults.quickPrompt3,
        ];
        const rawBest =
          typeof data.bestFollowUpIndex === "number"
            ? Math.round(data.bestFollowUpIndex)
            : 0;
        const shuffled = shuffleFollowUps(tripletInput, rawBest);

        const hpRaw = Array.isArray(data.highlightPhrases) ? data.highlightPhrases : [];
        const normalizedHp = hpRaw
          .filter(
            (x): x is { phrase: string; reading?: string } =>
              !!x &&
              typeof x === "object" &&
              typeof (x as { phrase?: unknown }).phrase === "string",
          )
          .map((x) => ({
            phrase: String(x.phrase).trim(),
            reading:
              typeof x.reading === "string" && x.reading.trim()
                ? x.reading.trim()
                : String(x.phrase).trim(),
          }))
          .filter((x) => x.phrase.length > 0);

        const saveCandidates = recommendCandidatesForMessage(
          {
            aiMessageContent: assistantText,
            userMessageContent: userText,
            correctedSentence:
              opts?.correctedSentence?.trim() ||
              guessCorrectedSentence(userText, assistantText),
            messageId: String(assistantId),
            sessionId: currentSessionId ?? undefined,
          },
          habitUserId,
        );

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  chatContext: {
                    highlightPhrases: normalizedHp,
                    followUps: shuffled.items,
                    bestFollowUpIndex: shuffled.bestIdx,
                    saveCandidates,
                  },
                }
              : m,
          ),
        );
      } catch {
        /* 文脈付与に失敗しても会話本文はそのまま */
      } finally {
        setContextLoadingId((id) => (id === assistantId ? null : id));
      }
    },
    [appLang, currentSessionId, habitUserId],
  );

  const beginFtue = useCallback(
    (mode: FtuePracticeMode) => {
      writeFtuePersist({ pickerDone: true });
      setFtueShowPicker(false);
      setTopicSelectorMode("hidden");
      const uid = habitUserId;
      let sid = currentSessionId;
      if (!sid) {
        const created = startNewChatSession(uid);
        sid = created.id;
        setCurrentSessionId(created.id);
        setChatSessions(getSessions(uid));
      }
      const nowIso = new Date().toISOString();
      const toneAt = politenessRef.current;
      if (mode === "free") {
        setFtueCoachActive(false);
        setFtuePracticeKind("free");
        ftueFreePathRef.current = true;
        ftueCoachingAttemptRef.current = 0;
        const line = getFtueFreeOpening();
        addAssistantMessage(uid, sid, line);
        setChatSessions(getSessions(uid));
        setMessages([
          {
            id: Date.now(),
            role: "assistant",
            baseText: line,
            createdAt: nowIso,
            replyTone: toneAt,
            ftueAnchored: true,
          },
        ]);
        return;
      }
      setFtuePracticeKind(mode);
      setFtueCoachActive(true);
      ftueFreePathRef.current = false;
      ftueCoachingAttemptRef.current = 0;
      const opening = getFtueOpening(mode);
      addAssistantMessage(uid, sid, opening);
      setChatSessions(getSessions(uid));
      setMessages([
        {
          id: Date.now(),
          role: "assistant",
          baseText: opening,
          createdAt: nowIso,
          replyTone: toneAt,
          ftueAnchored: true,
        },
      ]);
    },
    [currentSessionId, habitUserId],
  );

  function buildClaudeMessages(userText: string) {
    const history = messages.slice(-6).map((m) => ({
      role: m.role,
      content: m.baseText,
    }));
    return [...history, { role: "user" as const, content: userText }];
  }

  const handleSend = async (
    raw: string,
    opts?: { preserveFollowUpFeedback?: boolean },
  ) => {
    const text = raw.trim();
    if (!text || isTyping) return;
    let sessionId = currentSessionId;
    if (!sessionId) {
      const created = startNewChatSession(habitUserId, text);
      sessionId = created.id;
      setCurrentSessionId(created.id);
      setChatSessions(getSessions(habitUserId));
    }

    if (!opts?.preserveFollowUpFeedback) setFollowUpFeedback(null);
    const toneAtSend = politenessRef.current;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      baseText: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    recordChatUsed(habitUserId);
    addUserMessage(habitUserId, sessionId, text);
    setInput("");
    setIsTyping(true);
    setTopicSelectorMode("hidden");

    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    const assistantId = Date.now() + 1;
    const assistantNow = new Date().toISOString();
    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: "assistant",
        baseText: "",
        replyTone: toneAtSend,
        createdAt: assistantNow,
      },
    ]);

    const fetchErrText = getPrototypeCopy(appLang as Lang).uiText.chatFetchError;
    let accumulated = "";

    const coachingFtue = ftueCoachActive && ftuePracticeKind !== "free";
    if (coachingFtue) {
      ftueCoachingAttemptRef.current += 1;
      const showMicro = ftueCoachingAttemptRef.current >= 2;
      try {
        const historyForFtue = [...messages, userMsg]
          .filter((m) => (m.role === "user" || m.role === "assistant") && m.baseText.trim())
          .filter((m) => !m.showToneMeta)
          .slice(0, -1)
          .map((m) => ({ role: m.role, content: m.baseText.trim() }));

        const res = await fetch("/api/chat/ftue", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            userSentence: text,
            promptEnglish: ftueEnglishPromptForMode(ftuePracticeKind as "natural" | "daily"),
            language: appLang,
            history: historyForFtue,
          }),
          signal: controller.signal,
        });
        const json = (await res.json()) as {
          ok?: boolean;
          coach?: unknown;
        };
        const payload: FtueCoachPayload =
          json.ok && json.coach && typeof json.coach === "object"
            ? (parseFtueCoachPayload(json.coach) ?? fallbackFtueCoachPayload(text))
            : fallbackFtueCoachPayload(text);
        const core = buildFtueCoachMessage(payload);
        const body = showMicro
          ? "Nice improvement 👍\nYou sound more natural already.\n\n" + core
          : core;
        addAssistantMessage(habitUserId, sessionId, body);
        setChatSessions(getSessions(habitUserId));
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, baseText: body, replyTone: toneAtSend, ftueAnchored: true }
              : m,
          ),
        );
        void enrichChatContext(assistantId, body, text, {
          correctedSentence: payload.correctedSentence,
        });
        const p0 = readFtuePersist();
        if (!p0.firstLearningCompleted) {
          writeFtuePersist({ firstLearningCompleted: true });
        }
        refreshHabitData(habitUserId);
      } catch {
        const payload = fallbackFtueCoachPayload(text);
        const core = buildFtueCoachMessage(payload);
        const body = showMicro
          ? "Nice improvement 👍\nYou sound more natural already.\n\n" + core
          : core;
        addAssistantMessage(habitUserId, sessionId, body);
        setChatSessions(getSessions(habitUserId));
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, baseText: body, replyTone: toneAtSend, ftueAnchored: true }
              : m,
          ),
        );
        void enrichChatContext(assistantId, body, text, {
          correctedSentence: payload.correctedSentence,
        });
        const p0 = readFtuePersist();
        if (!p0.firstLearningCompleted) {
          writeFtuePersist({ firstLearningCompleted: true });
        }
        refreshHabitData(habitUserId);
      } finally {
        setIsTyping(false);
        controllerRef.current = null;
      }
      return;
    }

    // Topic Practice mode: generate structured coaching feedback inside chat.
    if (activeTopicPrompt) {
      try {
        const feedback: TopicFeedback = await generateTopicFeedback(
          activeTopicPrompt,
          text,
          appLang as "ja" | "en" | "ko" | "zh",
        );
        const topicMessage = buildTopicFeedbackMessage(feedback);
        addAssistantMessage(habitUserId, sessionId, topicMessage);
        setChatSessions(getSessions(habitUserId));
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  baseText: topicMessage,
                  topicLabel: "Topic Practice",
                  topicFeedback: {
                    topicId: activeTopicPrompt.id,
                    userAnswer: text,
                    correctedAnswer: feedback.correctedAnswer,
                    explanation: feedback.explanation,
                    alternativeExamples: feedback.alternativeExamples,
                    otherLearnerExamples: feedback.otherLearnerExamples,
                  },
                }
              : m,
          ),
        );
      } catch {
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, baseText: fetchErrText } : m)),
        );
      } finally {
        setIsTyping(false);
        controllerRef.current = null;
        refreshHabitData(habitUserId);
      }
      return;
    }
    try {
      const res = await fetch("/api/chat/structured", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: buildClaudeMessages(text),
          tone: toneAtSend,
          language: appLang,
          coachContext: buildCoachContext(habitUserId),
        }),
        signal: controller.signal,
      });

      const json = (await res.json()) as {
        ok?: boolean;
        coach?: unknown;
      };
      const payload: FtueCoachPayload =
        json.ok && json.coach && typeof json.coach === "object"
          ? (parseFtueCoachPayload(json.coach) ?? fallbackStructuredCoachPayload(text))
          : fallbackStructuredCoachPayload(text);
      const body = buildFtueCoachMessage(payload);
      accumulated = body;
      addAssistantMessage(habitUserId, sessionId, body);
      setChatSessions(getSessions(habitUserId));
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, baseText: body, replyTone: toneAtSend } : m,
        ),
      );
      void enrichChatContext(assistantId, body, text, {
        correctedSentence: payload.correctedSentence,
      });
      if (ftueFreePathRef.current) {
        const pp = readFtuePersist();
        if (!pp.firstLearningCompleted) {
          writeFtuePersist({ firstLearningCompleted: true });
        }
        ftueFreePathRef.current = false;
      }
    } catch {
      addAssistantMessage(habitUserId, sessionId, fetchErrText);
      setChatSessions(getSessions(habitUserId));
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, baseText: fetchErrText } : m)),
      );
    } finally {
      setIsTyping(false);
      controllerRef.current = null;
    }
    refreshHabitData(habitUserId);
  };

  const handleQuickSend = (prompt: string, choiceIndex: number) => {
    if (
      latestFollowUpContext &&
      typeof latestFollowUpContext.bestFollowUpIndex === "number"
    ) {
      setFollowUpFeedback(
        choiceIndex === latestFollowUpContext.bestFollowUpIndex ? "nice" : "ok",
      );
      window.setTimeout(() => setFollowUpFeedback(null), 4500);
    }
    void handleSend(prompt, { preserveFollowUpFeedback: true });
  };

  const openSession = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId);
    setRetentionMissionChatOpen(false);
    setFtueCoachActive(false);
    ftueFreePathRef.current = false;
    const p = readFtuePersist();
    const rows = getStoredMessages(habitUserId, sessionId);
    if (!p.pickerDone && !p.firstLearningCompleted && rows.length === 0) {
      setFtueShowPicker(true);
      setMessages([]);
    } else {
      setMessages(rows.length ? toViewMessages(rows) : [buildWelcomeMessage(appLang as Lang)]);
    }
    setTopicSelectorMode(rows.length > 0 ? "hidden" : "entry");
    setActiveTopicPrompt(null);
    setSessionDrawerOpen(false);
    setActiveView("chat");
  }, [appLang, habitUserId]);

  const startRetentionDailyMissionChat = useCallback(() => {
    if (!retentionMissionDay) return;
    retentionMissionFinalizedRef.current = false;
    setRetentionMissionChatOpen(true);
    const uid = habitUserId;
    const c = startNewChatSession(uid, retentionMissionDay.mission.title);
    const sid = c.id;
    setCurrentSessionId(sid);
    setChatSessions(getSessions(uid));
    setFtueCoachActive(false);
    ftueFreePathRef.current = false;
    setFtueShowPicker(false);
    setTopicSelectorMode("hidden");
    setActiveTopicPrompt(null);
    const opener = buildRetentionMissionChatOpener(retentionMissionDay.mission);
    addAssistantMessage(uid, sid, opener);
    setChatSessions(getSessions(uid));
    const nowIso = new Date().toISOString();
    const toneAt = politenessRef.current;
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        baseText: opener,
        createdAt: nowIso,
        replyTone: toneAt,
        retentionMissionOpener: true,
        ftueAnchored: true,
      },
    ]);
    setActiveView("chat");
    setSessionDrawerOpen(false);
    setInput("");
  }, [habitUserId, retentionMissionDay]);

  const createNewSession = useCallback((prefill?: string) => {
    setRetentionMissionChatOpen(false);
    const s = startNewChatSession(habitUserId, prefill);
    setCurrentSessionId(s.id);
    setChatSessions(getSessions(habitUserId));
    setFtueCoachActive(false);
    ftueFreePathRef.current = false;
    const p = readFtuePersist();
    if (!p.pickerDone && !p.firstLearningCompleted) {
      setFtueShowPicker(true);
      setMessages([]);
    } else {
      setMessages([buildWelcomeMessage(appLang as Lang)]);
    }
    setTopicSelectorMode("entry");
    setActiveTopicPrompt(null);
    setInput(prefill ?? "");
    setSessionDrawerOpen(false);
    setActiveView("chat");
  }, [appLang, habitUserId]);

  const deleteSessionById = useCallback((sessionId: string) => {
    removeSession(habitUserId, sessionId);
    const rows = getSessions(habitUserId);
    setChatSessions(rows);
    if (currentSessionId === sessionId) {
      if (rows[0]) {
        openSession(rows[0].id);
      } else {
        createNewSession();
      }
    }
  }, [createNewSession, currentSessionId, habitUserId, openSession]);

  const handleImageSelect = (file: File) => {
    const { uiText: chatUi } = getPrototypeCopy(appLang as Lang);
    setImageName(file.name || chatUi.imageFileFallback);
    const now = new Date().toISOString();
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "assistant",
        baseText: chatUi.chatImageBody,
        culturalNote: chatUi.chatImageCulturalNote,
        tipsNote: chatUi.chatImageTipsNote,
        showToneMeta: true,
        createdAt: now,
      },
    ]);
  };

  const handleAddVocab = async (word: string, romaji: string) => {
    if (vocab.some((v) => v.word === word)) {
      setVocabMenu(null);
      return;
    }
    setVocabAdding(true);
    try {
      const res = await fetch("/api/vocab-enrich", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ word, romaji }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setVocab((prev) => [
          {
            id: Date.now(),
            word,
            romaji,
            translations: [],
            exampleSentences: [],
          },
          ...prev,
        ]);
        return;
      }
      const item: VocabItem = {
        id: Date.now(),
        word,
        kana: data.kana,
        romaji,
        translations: Array.isArray(data.translations) ? data.translations : [],
        partOfSpeech: data.partOfSpeech,
        exampleSentences: Array.isArray(data.exampleSentences) ? data.exampleSentences : [],
      };
      setVocab((prev) => [item, ...prev]);

      await saveWord(
        item.word,
        item.translations[0] ?? "",
        item.exampleSentences[0] ?? ""
      );
    } finally {
      setVocabAdding(false);
    }
  };

  const speak = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const uttr = new SpeechSynthesisUtterance(text);
    uttr.lang = "ja-JP";
    uttr.rate = speechRate;
    window.speechSynthesis.speak(uttr);
  };

  const toggleSpeak = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      return;
    }
    speak(text);
  };


  // Record画面用：4軸スキルチャート用の値と座標
  const vocabScore = Math.min(vocab.length / 20, 1); // 語彙
  const naturalScore = Math.min((streakDays.filter(Boolean).length + 2) / 7, 1); // 自然さ
  const grammarScore = 0.6 + Math.min(vocab.length / 50, 0.4); // 文法
  const speedScore = Math.min(speechRate / 1.2, 1); // 速度（読み上げ設定からのイメージ）

  const skillRadarPoints = (() => {
    const center = 64;
    const radius = 40;
    const toPoint = (value: number, deg: number) => {
      const rad = (deg * Math.PI) / 180;
      return {
        x: center + Math.cos(rad) * radius * value,
        y: center + Math.sin(rad) * radius * value,
      };
    };
    const pts = [
      toPoint(vocabScore, -90), // 語彙
      toPoint(naturalScore, 0), // 自然さ
      toPoint(grammarScore, 90), // 文法
      toPoint(speedScore, 180), // 速度
    ];
    return pts.map((p) => `${p.x},${p.y}`).join(" ");
  })();

  const recentTopicResults = useMemo(
    () => listTopicPracticeResultsByUser(habitUserId).slice(0, 3),
    [habitUserId, stats.totalTopicPractices],
  );
  const seasonalState = useMemo(
    () =>
      buildSeasonalProgressState({
        streak: stats.streak,
        activityCount: streakDays.filter(Boolean).length,
        missionDoneCount: getProgressSnapshot(habitUserId).missionsCompletedCount,
        reviewDoneCount: getProgressSnapshot(habitUserId).reviewsCompletedCount,
        chatCount: getProgressSnapshot(habitUserId).totalChatMessages,
        topicCount: stats.totalTopicPractices,
        uiLang: appLang === "ja" || appLang === "ko" || appLang === "zh" ? appLang : "en",
      }),
    [appLang, habitUserId, stats, streakDays],
  );

  return (
    <div
      className={`relative flex w-full max-w-[100vw] flex-col overflow-x-hidden overflow-y-hidden antialiased ${isLightTheme ? "frensei-theme-light bg-white text-neutral-900" : "bg-yomu-bg text-slate-100"} ${embedded ? "min-h-0 min-h-[200px] flex-1" : "h-[100dvh] max-h-[100dvh] sm:h-screen sm:max-h-none"}`}
      style={{ background: isLightTheme ? "#ffffff" : BG }}
    >
      {/* メインエリア: ビューに応じて mission / record / chat を表示 */}
      <main
        className="relative z-0 min-h-0 flex-1 overflow-x-hidden flex flex-col overflow-hidden"
        style={{ paddingBottom: mainBottomPadding }}
      >
        {/* 初回・Daily Mission: 全画面表示 */}
        {activeView === "home" && (
          <div className="mx-auto flex min-h-0 w-full max-w-lg flex-1 flex-col overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
            {retentionMissionDay ? (
              <div className="space-y-3 pb-4">
                <div className="space-y-2">
                  <ProgressVisual
                    season={missionGrowthVisual.season}
                    stage={missionGrowthVisual.stage}
                    progressRatio={missionGrowthVisual.progressRatio}
                    isLightTheme={isLightTheme}
                  />
                  <p
                    className={`text-center font-wa-serif text-sm leading-snug ${
                      isLightTheme ? "text-neutral-800" : "text-slate-100"
                    }`}
                  >
                    {missionGrowth.currentStreak > 0
                      ? `You're on a ${missionGrowth.currentStreak}-day streak 🔥`
                      : "Your streak starts with today's small step 🔥"}
                  </p>
                </div>
                <TodaysRetentionMissionCard
                  day={retentionMissionDay}
                  isLightTheme={isLightTheme}
                  onStart={() => startRetentionDailyMissionChat()}
                />
                <SeasonalProgressCard
                  state={seasonalState}
                  compact
                  isLightTheme={isLightTheme}
                  onOpenProgress={() => setActiveView("progress")}
                />
                <ReviewCard
                  userId={habitUserId}
                  words={dueReviews.words}
                  mistakes={dueReviews.mistakes}
                  ui={uiText}
                  isLightTheme={isLightTheme}
                  onUpdated={() => refreshHabitData(habitUserId)}
                  onOpenChat={(prefill) => createNewSession(prefill)}
                />
              </div>
            ) : null}
          </div>
        )}

        {/* Progress: seasonal growth journey */}
        {activeView === "progress" && (
          <div className="mx-auto flex h-full max-w-5xl flex-1 flex-col overflow-y-auto px-4 py-6 sm:gap-6 sm:px-6 sm:py-8 lg:px-8">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="font-wa-serif text-lg font-semibold text-slate-50 sm:text-xl">
                  Progress
                </h1>
                <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">
                  A gentle season for your words — no scores, just growth.
                </p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-2 rounded-full border border-yomu-glassBorder bg-yomu-glass px-2 py-1.5 text-[11px] backdrop-blur-sm sm:py-1">
                <span className="text-slate-500">{uiText.jlptLevelTitle}</span>
                <select
                  value={jlptLevel}
                  onChange={(e) =>
                    setJlptLevel(e.target.value as (typeof JLPT_LEVELS)[number])
                  }
                  className="max-w-[5.5rem] rounded-full border border-slate-700 bg-slate-900/80 px-2 py-1 text-[11px] text-slate-100 focus:outline-none focus:ring-1 focus:ring-wa-ruri"
                  aria-label={uiText.jlptLevelTitle}
                >
                  {JLPT_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </header>

            <SeasonalProgressCard state={seasonalState} isLightTheme={isLightTheme} />

            <section className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800/70 bg-slate-950/80 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Topic Practice
                </p>
                {recentTopicResults.length === 0 ? (
                  <p className="mt-2 text-[12px] text-slate-400">
                    まだ Topic Practice の保存がありません。
                  </p>
                ) : (
                  <ul className="mt-2 space-y-1.5">
                    {recentTopicResults.map((r) => (
                      <li key={r.id} className="rounded-lg bg-slate-900/60 px-2.5 py-2 text-[12px] text-slate-300">
                        <p className="line-clamp-1 text-slate-100">{r.userAnswer}</p>
                        <p className="mt-1 line-clamp-1 text-[11px] text-slate-500">{r.correctedAnswer}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-2xl border border-slate-800/70 bg-slate-950/80 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Vocabulary / Review
                </p>
                <p className="mt-2 text-[13px] text-slate-300">
                  Due reviews: {dueReviews.words.length + dueReviews.mistakes.length}
                </p>
                <p className="mt-1 text-[12px] text-slate-400">
                  Quick access to your personal learning library.
                </p>
                <Link
                  href="/vocabulary"
                  className="mt-3 inline-flex rounded-xl bg-wa-ruri px-3 py-2 text-xs font-medium text-white hover:bg-wa-ruri/90"
                >
                  Open Vocabulary
                </Link>
              </div>
            </section>

            {vocab.length === 0 && !missionCompleted ? (
              // Empty state
              <section className="flex flex-1 items-center justify-center rounded-2xl border border-slate-800/60 bg-slate-950/80 p-6 text-center shadow-glass backdrop-blur-xl sm:p-10">
                <div className="mx-auto max-w-md space-y-4">
                  <p className="font-wa-serif text-base font-semibold text-slate-50 sm:text-lg">
                    {uiText.recordEmptyTitle}
                  </p>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {uiText.recordEmptyBody}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveView("chat")}
                    className="btn-wa-hover btn-wa-hover-ruri mt-2 inline-flex items-center justify-center rounded-xl border border-wa-ruri/60 bg-wa-ruri/20 px-4 py-2.5 text-sm font-medium text-slate-100 shadow-glass hover:bg-wa-ruri/30"
                  >
                    {uiText.recordEmptyCta}
                  </button>
                </div>
              </section>
            ) : (
              <>
                {/* Stats Section: 和柄プログレス + スキルレーダーチャート */}
                <section className="grid gap-4 rounded-3xl border border-slate-800/70 bg-slate-950/90 p-4 shadow-glass backdrop-blur-xl sm:grid-cols-3 sm:gap-5 sm:p-5">
                  {/* 和柄ストリーク：円形プログレス */}
                  <div className="flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative h-24 w-24 sm:h-28 sm:w-28">
                        <div
                          className="absolute inset-0 rounded-full border border-slate-800/80 bg-slate-950/80"
                          style={{
                            background: `conic-gradient(#facc15 ${
                              (streakDays.filter(Boolean).length / 7) * 360
                            }deg, rgba(15,23,42,1) 0deg)`,
                          }}
                        />
                        <div className="absolute inset-[7px] rounded-full bg-slate-950 flex flex-col items-center justify-center text-xs text-slate-300">
                          <span className="font-wa-serif text-[11px] text-slate-400">
                            {uiText.patternStreakLabel}
                          </span>
                          <span className="font-wa-serif text-xl font-semibold text-slate-50">
                            {streakDays.filter(Boolean).length}
                          </span>
                          <span className="text-[10px] text-slate-500">{uiText.daysShort}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {uiText.studiedThisWeekCaption}
                      </p>
                    </div>
                  </div>

                  {/* 4軸スキルレーダーチャート */}
                  <div className="sm:col-span-2 space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {uiText.skillChartTitle}
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <svg
                        viewBox="0 0 128 128"
                        className="h-32 w-32 flex-shrink-0 text-slate-600"
                      >
                        {/* レーダーのガイド */}
                        <circle
                          cx="64"
                          cy="64"
                          r="40"
                          className="fill-slate-900/40 stroke-slate-700/60"
                          strokeDasharray="4 4"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="26"
                          className="fill-transparent stroke-slate-700/50"
                          strokeDasharray="4 4"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="14"
                          className="fill-transparent stroke-slate-700/40"
                          strokeDasharray="4 4"
                        />
                        {/* 軸 */}
                        <line x1="64" y1="16" x2="64" y2="112" className="stroke-slate-700/60" />
                        <line x1="16" y1="64" x2="112" y2="64" className="stroke-slate-700/60" />
                        {/* 値ポリゴン */}
                        <polygon
                          points={skillRadarPoints}
                          className="fill-wa-ruri/30 stroke-wa-asagi/80"
                        />
                      </svg>
                      <div className="grid flex-1 grid-cols-2 gap-2 text-[11px] text-slate-300">
                        <div className="rounded-xl bg-slate-900/60 p-2">
                          <p className="font-wa-serif text-[11px] text-slate-200">
                            {uiText.skillVocabTitle}
                          </p>
                          <p className="mt-1 text-[10px] text-slate-400">
                            {uiText.skillVocabDesc}
                          </p>
                        </div>
                        <div className="rounded-xl bg-slate-900/60 p-2">
                          <p className="font-wa-serif text-[11px] text-slate-200">
                            {uiText.skillNaturalTitle}
                          </p>
                          <p className="mt-1 text-[10px] text-slate-400">
                            {uiText.skillNaturalDesc}
                          </p>
                        </div>
                        <div className="rounded-xl bg-slate-900/60 p-2">
                          <p className="font-wa-serif text-[11px] text-slate-200">
                            {uiText.skillGrammarTitle}
                          </p>
                          <p className="mt-1 text-[10px] text-slate-400">
                            {uiText.skillGrammarDesc}
                          </p>
                        </div>
                        <div className="rounded-xl bg-slate-900/60 p-2">
                          <p className="font-wa-serif text-[11px] text-slate-200">
                            {uiText.skillPaceTitle}
                          </p>
                          <p className="mt-1 text-[10px] text-slate-400">
                            {uiText.skillPaceDesc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Vocabulary Section: My単語帳ギャラリー */}
                <section className="space-y-3 rounded-2xl border border-slate-800/60 bg-slate-950/80 p-4 shadow-glass backdrop-blur-xl sm:p-5">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {uiText.myVocabularyHeading}
                    </p>
                    <span className="text-[11px] text-slate-400">
                      {formatVocabSavedLine(uiText, vocab.length)}
                    </span>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-1 text-sm">
                    {vocab.slice(0, 12).map((v) => (
                      <div
                        key={v.id}
                        className="min-w-[160px] max-w-[200px] flex-1 rounded-xl border border-slate-800/80 bg-slate-900/70 px-3 py-2.5 shadow-glass backdrop-blur-md"
                      >
                        <div className="mb-1 flex items-center justify-between gap-1">
                          <p className="truncate text-[13px] font-medium text-slate-50">
                            {v.word}
                          </p>
                          <span className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] font-semibold text-wa-asagi border border-slate-700/80">
                            JLPT {jlptLevel}
                          </span>
                        </div>
                        {v.translations[0] && (
                          <p className="truncate text-[11px] text-slate-300">
                            {v.translations[0]}
                          </p>
                        )}
                        {v.romaji && (
                          <p className="text-[10px] text-slate-500">{v.romaji}</p>
                        )}
                        <p className="mt-1 text-[10px] text-slate-500">
                          {uiText.savedOnPrefix}{" "}
                          {new Date(v.id).toLocaleDateString(dateLocale, {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        {v.exampleSentences[0] && (
                          <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-slate-400">
                            「{v.exampleSentences[0]}」
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* AI Insight Card: 今週の褒め言葉 */}
                <section className="rounded-2xl border border-slate-800/60 bg-slate-950/80 p-4 shadow-glass backdrop-blur-xl sm:p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {uiText.weekCheerTitle}
                  </p>
                  <div className="mt-3 rounded-2xl border border-wa-kinari/20 bg-gradient-to-br from-slate-900/80 via-slate-950/80 to-slate-900/60 px-4 py-3 text-[13px] leading-relaxed text-slate-100 shadow-glass">
                    <p>{formatWeekCheer(uiText, vocab.length)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveView("chat")}
                    className="btn-wa-hover btn-wa-hover-ruri mt-4 inline-flex items-center justify-center rounded-xl border border-wa-ruri/50 bg-wa-ruri/20 px-4 py-2.5 text-[12px] font-medium text-slate-100"
                  >
                    {uiText.reflectWeekInChat}
                  </button>
                </section>
              </>
            )}
          </div>
        )}

        {activeView === "topic" && (
          <TopicGuidedLearning
            userId={habitUserId}
            appLang={appLang}
            isLightTheme={isLightTheme}
            onPracticeSaved={() => refreshHabitData(habitUserId)}
          />
        )}

        {activeView === "more" && (
          <div className="mx-auto flex h-full w-full max-w-3xl flex-1 flex-col gap-3 overflow-y-auto px-4 py-6">
            <h1 className="font-wa-serif text-lg font-semibold text-slate-50">More</h1>
            <Link
              href="/vocabulary"
              className="block rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-left hover:border-slate-700"
            >
              <p className="text-sm text-slate-100">Vocabulary</p>
              <p className="mt-0.5 text-xs text-slate-400">Your personal learning library</p>
            </Link>
            <Link
              href="/report"
              className="block rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-left hover:border-slate-700"
            >
              <p className="text-sm text-slate-100">Report</p>
              <p className="mt-0.5 text-xs text-slate-400">学習のまとめ。ベータのご意見送付先への導線もあります。</p>
            </Link>
            <Link
              href="/feedback"
              className="block rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-left hover:border-slate-700"
            >
              <p className="text-sm text-slate-100">ご意見・感想（ベータ）</p>
              <p className="mt-0.5 text-xs text-slate-400">不具合・要望・よかった点を専用ページから</p>
            </Link>
            <button
              type="button"
              onClick={() => setActiveView("settings")}
              className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-left"
            >
              <p className="text-sm text-slate-100">Settings</p>
              <p className="mt-0.5 text-xs text-slate-400">Language, tone, region and app preferences</p>
            </button>
          </div>
        )}

        {/* 設定: 表示やトーンの調整 */}
        {activeView === "settings" && (
          <div className="mx-auto flex h-full max-w-3xl flex-1 flex-col overflow-y-auto px-4 py-6 sm:gap-6 sm:px-6 sm:py-8 lg:px-8">
            <header className="mb-1">
              <h1 className={`font-wa-serif text-lg font-semibold sm:text-xl ${isLightTheme ? "text-neutral-900" : "text-slate-50"}`}>
                {settingsText.title}
              </h1>
              <p className={`mt-1 text-[11px] sm:text-xs ${isLightTheme ? "text-neutral-600" : "text-slate-400"}`}>
                {settingsText.subtitle}
              </p>
            </header>

            {/* 表示 / 言語 / 地域設定 */}
            <section className={`space-y-2 rounded-2xl p-3 backdrop-blur-xl sm:p-4 ${isLightTheme ? "border border-neutral-200 bg-white shadow-sm" : "border border-slate-800/70 bg-slate-950/80 shadow-glass"}`}>
              <p className={`px-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${isLightTheme ? "text-neutral-500" : "text-slate-500"}`}>
                {settingsText.section}
              </p>

              <div className={`space-y-3 rounded-2xl p-1.5 ${isLightTheme ? "bg-neutral-50" : "bg-slate-900/40"}`}>
                <div className={`rounded-xl px-3 py-2.5 ${isLightTheme ? "border border-neutral-200 bg-white" : "bg-slate-900/50"}`}>
                  <p className={`text-sm font-medium ${isLightTheme ? "text-neutral-900" : "text-slate-50"}`}>{settingsText.appearance}</p>
                  <p className={`mt-0.5 text-[11px] ${isLightTheme ? "text-neutral-600" : "text-slate-400"}`}>{settingsText.appearanceDesc}</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setUiTheme("dark")}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${uiTheme === "dark" ? "bg-neutral-900 text-white" : isLightTheme ? "border border-neutral-300 bg-white text-neutral-700" : "bg-slate-800/70 text-slate-300"}`}
                    >
                      {settingsText.themeDark}
                    </button>
                    <button
                      type="button"
                      onClick={() => setUiTheme("light")}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${uiTheme === "light" ? "bg-neutral-900 text-white" : isLightTheme ? "border border-neutral-300 bg-white text-neutral-700" : "bg-slate-800/70 text-slate-300"}`}
                    >
                      {settingsText.themeLight}
                    </button>
                  </div>
                </div>
                {profileSettingsLoading ? (
                  <p className={`px-3 py-4 text-[12px] ${isLightTheme ? "text-neutral-600" : "text-slate-400"}`}>
                    {uiText.loadingProfileSettings}
                  </p>
                ) : (
                  <>
                    {/* 表示言語（タップでシート） */}
                    <button
                      type="button"
                      onClick={() => setChoiceSheet("language")}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                        isLightTheme
                          ? "border border-neutral-200 bg-[#f8f7f4] hover:bg-[#f3f1ed]"
                          : "bg-slate-900/50 hover:bg-slate-800/50"
                      }`}
                    >
                      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${
                        isLightTheme ? "bg-[#f0eee8] text-neutral-700" : "bg-slate-800/80 text-slate-200"
                      }`}>
                        <Languages className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium ${isLightTheme ? "text-neutral-900" : "text-slate-50"}`}>{settingsText.basicLanguage}</p>
                        <p className={`text-[11px] ${isLightTheme ? "text-neutral-600" : "text-slate-400"}`}>{settingsText.basicLanguageDesc}</p>
                      </div>
                      <span className={`flex max-w-[45%] flex-shrink-0 items-center gap-1 text-xs ${isLightTheme ? "text-neutral-700" : "text-slate-200"}`}>
                        <span className="truncate">
                          {labelForDisplayLang(draftDisplayLanguage, uiText)}
                        </span>
                        <ChevronRight className={`h-4 w-4 flex-shrink-0 ${isLightTheme ? "text-neutral-500" : "text-slate-500"}`} aria-hidden />
                      </span>
                    </button>

                    {/* 地域（タップでシート） */}
                    <button
                      type="button"
                      onClick={() => {
                        setRegionChoiceApplyImmediate(false);
                        setChoiceSheet("region");
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                        isLightTheme
                          ? "border border-neutral-200 bg-[#f8f7f4] hover:bg-[#f3f1ed]"
                          : "bg-slate-900/50 hover:bg-slate-800/50"
                      }`}
                    >
                      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${
                        isLightTheme ? "bg-[#f0eee8] text-neutral-700" : "bg-slate-800/80 text-slate-200"
                      }`}>
                        <Globe className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium ${isLightTheme ? "text-neutral-900" : "text-slate-50"}`}>{settingsText.region}</p>
                        <p className={`text-[11px] ${isLightTheme ? "text-neutral-600" : "text-slate-400"}`}>{settingsText.regionDesc}</p>
                      </div>
                      <span className={`flex max-w-[45%] flex-shrink-0 items-center gap-1 text-xs ${isLightTheme ? "text-neutral-700" : "text-slate-200"}`}>
                        <span className="truncate">
                          {regionLabelForLang(draftRegion, appLang as Lang)}
                        </span>
                        <ChevronRight className={`h-4 w-4 flex-shrink-0 ${isLightTheme ? "text-neutral-500" : "text-slate-500"}`} aria-hidden />
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveProfileSettings}
                      className="btn-wa-hover-ruri inline-flex w-full items-center justify-center rounded-2xl bg-pink-500/90 px-4 py-3 text-[12px] font-medium text-white shadow-[0_18px_60px_rgba(236,72,153,0.25)] transition hover:bg-pink-400"
                      disabled={profileSettingsLoading}
                    >
                      {settingsText.save}
                    </button>

                  </>
                )}
              </div>
            </section>

            {/* 学習設定 */}
            <section className={`space-y-2 rounded-2xl p-3 backdrop-blur-xl sm:p-4 ${isLightTheme ? "border border-neutral-200 bg-white shadow-sm" : "border border-slate-800/70 bg-slate-950/80 shadow-glass"}`}>
              <p className={`px-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${isLightTheme ? "text-neutral-500" : "text-slate-500"}`}>
                {uiText.learningSectionTitle}
              </p>
              <div className={`space-y-1 rounded-2xl p-1.5 ${isLightTheme ? "bg-[#f8f7f4]" : "bg-slate-900/40"}`}>
                {/* ふりがな表示 */}
                <div className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${isLightTheme ? "border border-neutral-200 bg-white" : "bg-slate-900/50"}`}>
                  <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${isLightTheme ? "bg-[#f0eee8] text-neutral-700" : "bg-slate-800/80 text-slate-200"}`}>
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${isLightTheme ? "text-neutral-900" : "text-slate-50"}`}>{uiText.furigana}</p>
                    <p className={`text-[11px] ${isLightTheme ? "text-neutral-600" : "text-slate-400"}`}>
                      {uiText.furiganaSettingDesc}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFuriganaOn((v) => !v)}
                    className={`flex h-6 w-11 items-center rounded-full border px-0.5 transition ${
                      furiganaOn ? "border-wa-ruri bg-wa-ruri/40" : "border-slate-600 bg-slate-900"
                    }`}
                    aria-label={uiText.toggleFuriganaAria}
                  >
                    <span
                      className={`block h-4 w-4 rounded-full bg-white shadow-sm transition ${
                        furiganaOn ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* 翻訳表示 */}
                <div className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${isLightTheme ? "border border-neutral-200 bg-white" : "bg-slate-900/50"}`}>
                  <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${isLightTheme ? "bg-[#f0eee8] text-neutral-700" : "bg-slate-800/80 text-slate-200"}`}>
                    <Eye className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${isLightTheme ? "text-neutral-900" : "text-slate-50"}`}>
                      {uiText.showTranslationsTitle}
                    </p>
                    <p className={`text-[11px] ${isLightTheme ? "text-neutral-600" : "text-slate-400"}`}>
                      {uiText.showTranslationsDesc}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowTranslations((v) => !v)}
                    className={`flex h-6 w-11 items-center rounded-full border px-0.5 transition ${
                      showTranslations
                        ? "border-wa-ruri bg-wa-ruri/40"
                        : "border-slate-600 bg-slate-900"
                    }`}
                    aria-label={uiText.toggleTranslationsAria}
                  >
                    <span
                      className={`block h-4 w-4 rounded-full bg-white shadow-sm transition ${
                        showTranslations ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </section>

            {/* 音声設定 */}
            <section className={`space-y-2 rounded-2xl p-3 backdrop-blur-xl sm:p-4 ${isLightTheme ? "border border-neutral-200 bg-white shadow-sm" : "border border-slate-800/70 bg-slate-950/80 shadow-glass"}`}>
              <p className={`px-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${isLightTheme ? "text-neutral-500" : "text-slate-500"}`}>
                {uiText.voiceSectionTitle}
              </p>
              <div className={`rounded-2xl p-1.5 ${isLightTheme ? "bg-[#f8f7f4]" : "bg-slate-900/40"}`}>
                <div className={`flex items-center gap-3 rounded-xl px-3 py-3 ${isLightTheme ? "border border-neutral-200 bg-white" : "bg-slate-900/50"}`}>
                  <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${isLightTheme ? "bg-[#f0eee8] text-neutral-700" : "bg-slate-800/80 text-slate-200"}`}>
                    <Volume2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${isLightTheme ? "text-neutral-900" : "text-slate-50"}`}>{uiText.speechRateTitle}</p>
                    <p className={`text-[11px] ${isLightTheme ? "text-neutral-600" : "text-slate-400"}`}>
                      {uiText.speechRateDesc}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`text-[10px] ${isLightTheme ? "text-neutral-500" : "text-slate-500"}`}>{uiText.slower}</span>
                      <input
                        type="range"
                        min={0.6}
                        max={1.4}
                        step={0.1}
                        value={speechRate}
                        onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                        className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-slate-800 accent-wa-ruri"
                      />
                      <span className={`text-[10px] ${isLightTheme ? "text-neutral-500" : "text-slate-500"}`}>{uiText.faster}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* アプリについて */}
            <section className={`space-y-2 rounded-2xl p-3 backdrop-blur-xl sm:p-4 ${isLightTheme ? "border border-neutral-200 bg-white shadow-sm" : "border border-slate-800/70 bg-slate-950/80 shadow-glass"}`}>
              <p className={`px-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${isLightTheme ? "text-neutral-500" : "text-slate-500"}`}>
                {uiText.aboutSectionTitle}
              </p>
              <div className={`divide-y rounded-2xl ${isLightTheme ? "divide-neutral-200 bg-[#f8f7f4]" : "divide-slate-800/80 bg-slate-900/40"}`}>
                <a
                  href="mailto:support@yomu-app.example.com"
                  className={`flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-left ${
                    isLightTheme ? "hover:bg-[#f3f1ed] active:bg-[#eeece6]" : "hover:bg-slate-900/80 active:bg-slate-800/80"
                  }`}
                >
                  <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${isLightTheme ? "bg-[#f0eee8] text-neutral-700" : "bg-slate-800/80 text-slate-200"}`}>
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${isLightTheme ? "text-neutral-900" : "text-slate-50"}`}>{uiText.contactTitle}</p>
                    <p className={`text-[11px] ${isLightTheme ? "text-neutral-600" : "text-slate-400"}`}>
                      {uiText.contactDesc}
                    </p>
                  </div>
                </a>
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-left ${
                    isLightTheme ? "hover:bg-[#f3f1ed] active:bg-[#eeece6]" : "hover:bg-slate-900/80 active:bg-slate-800/80"
                  }`}
                >
                  <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${isLightTheme ? "bg-[#f0eee8] text-neutral-700" : "bg-slate-800/80 text-slate-200"}`}>
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${isLightTheme ? "text-neutral-900" : "text-slate-50"}`}>{uiText.termsTitle}</p>
                    <p className={`text-[11px] ${isLightTheme ? "text-neutral-600" : "text-slate-400"}`}>
                      {uiText.termsDesc}
                    </p>
                  </div>
                </a>
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-left ${
                    isLightTheme ? "hover:bg-[#f3f1ed] active:bg-[#eeece6]" : "hover:bg-slate-900/80 active:bg-slate-800/80"
                  }`}
                >
                  <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${isLightTheme ? "bg-[#f0eee8] text-neutral-700" : "bg-slate-800/80 text-slate-200"}`}>
                    <Shield className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${isLightTheme ? "text-neutral-900" : "text-slate-50"}`}>{uiText.privacyTitle}</p>
                    <p className={`text-[11px] ${isLightTheme ? "text-neutral-600" : "text-slate-400"}`}>
                      {uiText.privacyDesc}
                    </p>
                  </div>
                </a>
              </div>
            </section>
          </div>
        )}

        {/* チャット: 入力欄は常に画面下部に固定、ログのみスクロール */}
        {activeView === "chat" && (
          <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col gap-1 px-1 py-1 sm:gap-1.5 sm:px-2 sm:py-1.5">
            {retentionRewardBanner ? (
              <div
                role="status"
                className="flex-shrink-0 whitespace-pre-line rounded-xl border border-emerald-500/45 bg-emerald-950/55 px-3 py-2.5 text-center text-[12px] leading-snug text-emerald-50"
              >
                {retentionRewardBanner}
              </div>
            ) : null}
            <header className="flex flex-shrink-0 items-center justify-between gap-1.5 border-b border-slate-800/20 pb-1">
              <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5">
                <button
                  type="button"
                  onClick={() => setSessionDrawerOpen(true)}
                  className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-900/50 text-slate-300"
                  aria-label="Open sessions"
                >
                  <PanelLeft className="h-4 w-4" />
                </button>
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-wa-ruri to-wa-asagi text-[11px] font-bold text-white sm:h-9 sm:w-9 sm:text-xs">
                  F
                </div>
                <p className="font-wa-serif hidden min-w-0 flex-1 truncate text-[13px] font-semibold text-slate-50 sm:block sm:text-sm">
                  {chatSessions.find((s) => s.id === currentSessionId)?.title ?? uiText.japaneseChat}
                </p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => setChatSettingsOpen((v) => !v)}
                  className={`inline-flex h-9 min-h-[44px] items-center gap-1.5 rounded-lg border px-2.5 text-slate-200 transition sm:min-h-0 ${
                    chatSettingsOpen
                      ? "border-wa-ruri/60 bg-wa-ruri/15 text-wa-asagi"
                      : "border-slate-700/80 bg-slate-900/50 hover:border-slate-600"
                  }`}
                  aria-expanded={chatSettingsOpen}
                  aria-label="Chat settings: furigana, tone, JLPT, region"
                  title="Furigana, tone, JLPT, region"
                >
                  <Settings className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="text-[10px] font-medium leading-tight sm:text-[11px]">Settings</span>
                </button>
                <button
                  type="button"
                  onClick={() => createNewSession()}
                  className="inline-flex h-9 min-h-[44px] w-9 min-w-[44px] items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/50 text-slate-200 hover:border-slate-600 sm:min-h-9 sm:min-w-9"
                  aria-label="New chat"
                  title="New chat"
                >
                  <PlusCircle className="h-4 w-4" />
                </button>
              </div>
            </header>

            <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-800/20 bg-slate-950/20 p-1 backdrop-blur-sm sm:rounded-2xl sm:p-1.5">
            {chatSettingsOpen ? (
            <div className="mb-1 flex flex-shrink-0 flex-col gap-2 rounded-lg border border-slate-700/45 bg-slate-900/35 p-1.5 sm:mb-1.5 sm:rounded-xl sm:p-2">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">{uiText.furigana}</span>
                  <button
                    type="button"
                    onClick={() => setFuriganaOn((v) => !v)}
                    className={`btn-wa-hover btn-wa-hover-ruri flex h-8 w-12 items-center rounded-full border px-0.5 transition sm:h-6 sm:w-11 ${
                      furiganaOn ? "border-wa-ruri bg-wa-ruri/30" : "border-slate-600 bg-slate-900"
                    }`}
                    aria-label={furiganaOn ? uiText.ariaFuriganaOff : uiText.ariaFuriganaOn}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full bg-white shadow-sm transition sm:h-4 sm:w-4 ${
                        furiganaOn ? "translate-x-4 sm:translate-x-4" : "translate-x-0.5 sm:translate-x-0"
                      }`}
                      aria-hidden
                    />
                  </button>
                </div>
                <div
                  className="btn-wa-hover flex touch-manipulation items-center gap-1 rounded-full border border-yomu-glassBorder bg-yomu-glass px-1.5 py-1 text-[11px] backdrop-blur-sm"
                  role="tablist"
                  aria-label={uiText.ariaReplyTone}
                >
                  <span className="hidden text-slate-500 sm:inline">{uiText.tone}</span>
                  {(
                    [
                      ["casual", uiText.casual, uiText.casualHint],
                      ["neutral", uiText.neutral, uiText.neutralHint],
                      ["business", uiText.business, uiText.businessHint],
                    ] as [Politeness, string, string][]
                  ).map(([value, main, hint]) => (
                    <button
                      key={value}
                      type="button"
                      role="tab"
                      aria-selected={politeness === value}
                      aria-label={`${main}. ${hint}`}
                      onClick={() => setPoliteness(value)}
                      className={`btn-wa-hover-ruri min-h-[44px] min-w-[76px] touch-manipulation rounded-full px-3 py-2 text-[10px] font-medium transition selection:none sm:min-h-[36px] sm:min-w-0 sm:px-3 sm:py-1.5 ${
                        politeness === value
                          ? "bg-slate-100 text-slate-900 ring-1 ring-slate-400/30"
                          : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                      }`}
                    >
                      <span className="flex flex-col items-center gap-0.5 leading-tight">
                        <span>{main}</span>
                        <span className="text-[9px] font-normal opacity-70">{hint}</span>
                      </span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1 rounded-full border border-yomu-glassBorder bg-yomu-glass px-2 py-1 text-[11px] backdrop-blur-sm">
                  <span className="hidden text-slate-500 sm:inline">JLPT</span>
                  <select
                    value={jlptLevel}
                    onChange={(e) =>
                      setJlptLevel(e.target.value as (typeof JLPT_LEVELS)[number])
                    }
                    className="max-w-[4.5rem] rounded-full border border-slate-700 bg-slate-900/80 px-2 py-1 text-[11px] text-slate-100 focus:outline-none focus:ring-1 focus:ring-wa-ruri"
                    aria-label={uiText.jlptLevelTitle}
                  >
                    {JLPT_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setRegionChoiceApplyImmediate(true);
                    setChoiceSheet("region");
                  }}
                  className="btn-wa-hover flex max-w-[11rem] items-center gap-1 rounded-full border border-yomu-glassBorder bg-yomu-glass px-2 py-1.5 text-[11px] backdrop-blur-sm sm:py-1"
                  aria-label={uiText.region}
                >
                  <Globe className="h-3.5 w-3.5 flex-shrink-0 text-slate-500" aria-hidden />
                  <span className="hidden text-slate-500 sm:inline">{uiText.region}</span>
                  <span className="min-w-0 truncate text-slate-100">
                    {regionLabelForLang(draftRegion, appLang as Lang)}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-slate-500" aria-hidden />
                </button>
              </div>
            </div>
            ) : null}

            <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto overflow-x-hidden px-0.5 pb-[6rem] pt-0.5 text-[14px] leading-relaxed sm:space-y-3 sm:pb-28">
              {messages.map((msg) => {
                const isAssistant = msg.role === "assistant";
                const toneForMessage = isAssistant
                  ? (msg.replyTone ?? politeness)
                  : politeness;
                const displayText = isAssistant
                  ? appLang === "ja"
                    ? applyPoliteness(msg.baseText, toneForMessage)
                    : msg.baseText
                  : msg.baseText;
                const hasMetaStrip =
                  isAssistant &&
                  Boolean(msg.culturalNote || msg.showToneMeta || msg.tipsNote);
                const saveList = msg.chatContext?.saveCandidates ?? [];
                const hasSaves = isAssistant && saveList.length > 0;
                return (
                  <div
                    key={msg.id}
                    className="msg-enter flex flex-col gap-1"
                    style={{
                      alignItems: isAssistant ? "flex-start" : "flex-end",
                    }}
                  >
                    {isAssistant && (
                      <div className="flex max-w-[min(100%,40rem)] items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-wa-ruri to-wa-asagi text-[10px] font-bold text-white">
                          F
                        </div>
                        <span className="text-[11px] text-slate-500">
                          Frensei · {formatTime(msg.createdAt)}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleSpeak(msg.baseText)}
                          className="btn-wa-hover btn-wa-hover-ruri ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-700/50 bg-slate-900/40 text-slate-300 hover:border-wa-ruri hover:text-slate-50"
                          aria-label={uiText.ariaPlayAudio}
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                    {isAssistant ? (
                      <div className="flex w-full max-w-[min(100%,40rem)] flex-col gap-2">
                        <div
                          className={`rounded-2xl px-3 py-2.5 sm:px-3.5 sm:py-2.5 ${
                            "rounded-bl-md border border-slate-700/45 bg-slate-800/50 text-slate-100 shadow-sm"
                          }`}
                        >
                          {msg.topicLabel ? (
                            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-300/90">
                              {msg.topicLabel}
                            </p>
                          ) : null}
                          <p className="inline break-words">
                            {renderMessageWithVocab(
                              displayText,
                              furiganaOn,
                              (phrase, reading) => setVocabMenu({ phrase, reading }),
                              (msg.chatContext?.highlightPhrases ?? []).map(
                                (p) => [p.phrase, p.reading] as [string, string],
                              ),
                            )}
                          </p>
                          {msg.topicFeedback ? (
                            <div className="mt-3 border-t border-slate-700/40 pt-2">
                              <TopicActions
                                saved={Boolean(msg.topicFeedback.saved)}
                                onSave={() => {
                                  if (!currentSessionId) return;
                                  saveTopicPracticeResult(
                                    habitUserId,
                                    currentSessionId,
                                    msg.topicFeedback!.topicId,
                                    {
                                      correctedAnswer: msg.topicFeedback!.correctedAnswer,
                                      explanation: msg.topicFeedback!.explanation,
                                      alternativeExamples: msg.topicFeedback!.alternativeExamples,
                                      encouragement: "Saved. Keep going at your pace.",
                                      otherLearnerExamples: msg.topicFeedback!.otherLearnerExamples ?? [],
                                    },
                                    msg.topicFeedback!.userAnswer,
                                  );
                                  setMessages((prev) =>
                                    prev.map((m2) =>
                                      m2.id === msg.id && m2.topicFeedback
                                        ? {
                                            ...m2,
                                            topicFeedback: { ...m2.topicFeedback, saved: true },
                                          }
                                        : m2,
                                    ),
                                  );
                                }}
                                onTryAgain={() => {
                                  if (!activeTopicPrompt) return;
                                  setInput("");
                                  setMessages((prev) => [
                                    ...prev,
                                    {
                                      id: Date.now() + 99,
                                      role: "assistant",
                                      baseText: `Try one more for the same topic 👇\n${activeTopicPrompt.prompt}`,
                                      createdAt: new Date().toISOString(),
                                      topicLabel: "Topic Practice",
                                    },
                                  ]);
                                }}
                              />
                            </div>
                          ) : null}
                        </div>
                        {hasMetaStrip ? (
                          <div className="space-y-1.5 rounded-xl border border-slate-800/50 bg-slate-900/35 px-3 py-2 text-[11px] text-slate-400">
                            {msg.culturalNote && (
                              <div className="flex gap-2 text-slate-300">
                                <span className="mt-0.5 shrink-0 text-sky-400">
                                  <Sparkles className="h-3 w-3" />
                                </span>
                                <p>{msg.culturalNote}</p>
                              </div>
                            )}
                            {msg.showToneMeta && (
                              <p>
                                <span className="font-semibold text-slate-300">
                                  {uiText.tone}:
                                </span>{" "}
                                {toneForMessage === "casual"
                                  ? `${uiText.casual} · ${uiText.casualHint}`
                                  : toneForMessage === "business"
                                    ? `${uiText.business} · ${uiText.businessHint}`
                                    : `${uiText.neutral} · ${uiText.neutralHint}`}
                              </p>
                            )}
                            {msg.tipsNote && (
                              <p>
                                <span className="font-semibold text-slate-300">{uiText.tipLabel}</span>{" "}
                                {msg.tipsNote}
                              </p>
                            )}
                          </div>
                        ) : null}
                        {hasSaves ? (
                          <div className="space-y-2 border-t border-slate-800/35 pt-2">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                              Recommended to save
                            </p>
                            {saveList.map((cand) => (
                              <div
                                key={cand.id}
                                className="rounded-lg border border-slate-700/50 bg-slate-900/45 px-2.5 py-2"
                              >
                                <p className="text-[10px] font-semibold text-slate-400">
                                  {formatSaveCandidateHeading(cand)}
                                </p>
                                <p className="mt-1 text-[13px] font-medium leading-snug text-slate-50">
                                  {cand.primaryText}
                                </p>
                                {cand.secondaryText ? (
                                  <p className="mt-1 text-[11px] text-slate-400">{cand.secondaryText}</p>
                                ) : null}
                                {cand.explanation ? (
                                  <p className="mt-0.5 text-[11px] text-slate-500">{cand.explanation}</p>
                                ) : null}
                                <button
                                  type="button"
                                  disabled={cand.alreadySaved}
                                  onClick={() => {
                                    saveCandidateToVocabulary(cand, habitUserId);
                                    setMessages((prev) =>
                                      prev.map((m2) =>
                                        m2.id === msg.id && m2.chatContext?.saveCandidates
                                          ? {
                                              ...m2,
                                              chatContext: {
                                                ...m2.chatContext,
                                                saveCandidates: m2.chatContext.saveCandidates.map((c2) =>
                                                  c2.id === cand.id ? { ...c2, alreadySaved: true } : c2,
                                                ),
                                              },
                                            }
                                          : m2,
                                      ),
                                    );
                                  }}
                                  className="mt-2 rounded-md border border-wa-ruri/45 bg-wa-ruri/15 px-2.5 py-1.5 text-[11px] font-semibold text-slate-100 disabled:border-slate-700/80 disabled:bg-slate-800/60 disabled:text-slate-500"
                                >
                                  {cand.alreadySaved ? "Saved" : "[Save]"}
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <div
                        className={
                          "w-fit max-w-[min(88%,24rem)] rounded-2xl rounded-br-md border border-wa-ruri/35 bg-wa-ruri/20 px-3 py-2.5 text-slate-50 shadow-sm sm:max-w-[min(85%,26rem)]"
                        }
                      >
                        <p className="break-words">{displayText}</p>
                      </div>
                    )}
                  </div>
                );
              })}
              {isTyping && (
                <div className="msg-enter flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-wa-ruri to-wa-asagi text-[10px] font-bold text-white">
                    F
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl border border-yomu-glassBorder bg-yomu-glass px-3 py-1.5">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="relative flex flex-shrink-0 flex-col pb-safe pt-2">
              {ftueShowPicker ? <FtuePracticePicker onPick={beginFtue} /> : null}
              {topicSelectorMode !== "hidden" && !ftueShowPicker ? (
                <TopicSelector
                  mode={topicSelectorMode === "topic_list" ? "topic_list" : "entry"}
                  topics={TOPIC_PROMPTS}
                  showContinueLast={chatSessions.length > 1}
                  onDailyMission={() => setActiveView("home")}
                  onTopicPractice={() => setTopicSelectorMode("topic_list")}
                  onFreeChat={() => {
                    setTopicSelectorMode("hidden");
                    setActiveTopicPrompt(null);
                  }}
                  onContinueLast={() => {
                    const next = chatSessions.find((s) => s.id !== currentSessionId) ?? chatSessions[0];
                    if (next) openSession(next.id);
                  }}
                  onSelectTopic={(topic) => {
                    setActiveTopicPrompt(topic);
                    setTopicSelectorMode("hidden");
                    const guide = buildTopicGuideMessage(topic);
                    let sid = currentSessionId;
                    if (!sid) {
                      const created = startNewChatSession(habitUserId, "Topic Practice");
                      sid = created.id;
                      setCurrentSessionId(created.id);
                      setChatSessions(getSessions(habitUserId));
                    }
                    addAssistantMessage(habitUserId, sid, guide);
                    setChatSessions(getSessions(habitUserId));
                    setMessages((prev) => [
                      ...prev,
                      {
                        id: Date.now() + 77,
                        role: "assistant",
                        baseText: guide,
                        createdAt: new Date().toISOString(),
                        topicLabel: "Topic Practice",
                      },
                    ]);
                  }}
                />
              ) : null}
              <div className="absolute inset-x-1.5 bottom-1.5 z-10 flex items-end gap-2 rounded-2xl border border-slate-700/55 bg-slate-950/95 px-2.5 py-2 shadow-lg backdrop-blur-md sm:inset-x-2 sm:bottom-2 sm:gap-2.5 sm:px-3 sm:py-2.5">
                <button
                  type="button"
                  className="btn-wa-hover btn-wa-hover-ruri flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-slate-700/50 bg-slate-900/60 text-slate-300 hover:border-wa-ruri hover:text-slate-50 sm:h-10 sm:w-10"
                  onClick={() =>
                    handleImageSelect(new File([""], "hanami-photo.jpg"))
                  }
                  aria-label={uiText.attachImageAria}
                >
                  <ImageIcon className="h-4 w-4" />
                </button>
                <div className="flex-1">
                  <textarea
                    rows={1}
                    value={input}
                    disabled={ftueShowPicker}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (input.trim() && !ftueShowPicker) handleSend(input);
                      }
                    }}
                    placeholder={uiText.inputPlaceholder}
                    className="max-h-32 w-full resize-none border-0 bg-transparent text-[13px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {imageName && (
                    <p className="mt-1 text-[11px] text-slate-500">
                      {uiText.imagePlaceholderLabel} {imageName}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  disabled={!canSend}
                  onClick={() => handleSend(input)}
                  aria-busy={isLoading}
                  className="btn-wa-hover btn-wa-hover-ruri flex h-11 min-h-[44px] min-w-[80px] items-center justify-center gap-2 rounded-xl bg-wa-ruri px-4 text-[12px] font-medium text-slate-50 shadow-glass transition hover:bg-wa-asagi disabled:cursor-not-allowed disabled:bg-wa-hai/50 disabled:text-slate-400 sm:h-9"
                >
                  {isLoading ? uiText.sending : uiText.send}
                </button>
              </div>
            </div>
          </section>
          </div>
        )}

      </main>

      {missionMicroToast ? (
        <MissionRewardToast
          line1={missionMicroToast.l1}
          line2={missionMicroToast.l2}
          onDismiss={dismissMissionToast}
        />
      ) : null}

      {/* 言語・地域: タップで開くボトムシート（一覧を1画面に並べない） */}
      {choiceSheet && (
        <div className="fixed inset-0 z-[260] flex flex-col justify-end sm:items-center sm:justify-center sm:p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label={uiText.ariaClose}
            onClick={() => setChoiceSheet(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="yomu-choice-sheet-title"
            className="relative z-10 flex max-h-[min(85dvh,32rem)] w-full flex-col rounded-t-2xl border border-slate-800/80 bg-slate-950 shadow-2xl sm:max-w-md sm:rounded-2xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-800/70 px-4 py-3">
              <h2
                id="yomu-choice-sheet-title"
                className="font-wa-serif text-base font-semibold text-slate-50"
              >
                {choiceSheet === "language"
                  ? settingsText.chooseLanguageTitle
                  : settingsText.chooseRegionTitle}
              </h2>
              <button
                type="button"
                onClick={() => setChoiceSheet(null)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
              >
                {uiText.cancel}
              </button>
            </div>
            <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 pb-safe sm:pb-2">
              {choiceSheet === "language"
                ? (["ja", "en", "ko", "zh"] as const).map((code) => {
                    const selected = draftDisplayLanguage === code;
                    return (
                      <li key={code}>
                        <button
                          type="button"
                          onClick={() => {
                            setDraftDisplayLanguage(code);
                            setChoiceSheet(null);
                          }}
                          className={[
                            "flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-left text-sm transition sm:py-3",
                            selected
                              ? "bg-pink-500/15 text-white ring-1 ring-pink-500/40"
                              : "text-slate-200 hover:bg-slate-800/80",
                          ].join(" ")}
                        >
                          <span>{labelForDisplayLang(code, uiText)}</span>
                          {selected ? (
                            <Check className="h-4 w-4 flex-shrink-0 text-pink-400" aria-hidden />
                          ) : null}
                        </button>
                      </li>
                    );
                  })
                : REGION_CHOICES.map((r) => {
                    const selected = draftRegion === r.value;
                    return (
                      <li key={r.value}>
                        <button
                          type="button"
                          onClick={() => {
                            if (regionChoiceApplyImmediate) {
                              handleQuickRegionChange(r.value);
                            } else {
                              setDraftRegion(r.value);
                            }
                            setChoiceSheet(null);
                          }}
                          className={[
                            "flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-left text-sm transition sm:py-3",
                            selected
                              ? "bg-pink-500/15 text-white ring-1 ring-pink-500/40"
                              : "text-slate-200 hover:bg-slate-800/80",
                          ].join(" ")}
                        >
                          <span className="truncate">
                            {regionLabelForLang(r.value, appLang as Lang)}
                          </span>
                          {selected ? (
                            <Check className="h-4 w-4 flex-shrink-0 text-pink-400" aria-hidden />
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
            </ul>
          </div>
        </div>
      )}

      <SessionDrawer
        open={sessionDrawerOpen}
        sessions={chatSessions}
        activeId={currentSessionId}
        onClose={() => setSessionDrawerOpen(false)}
        onNewChat={() => createNewSession()}
        onOpenSession={openSession}
        onDeleteSession={deleteSessionById}
      />

      {/* 画面下部固定メニューバー（タップで確実に反応するよう pointer-events-auto と onPointerDown を使用） */}
      <nav
        className={`fixed left-0 right-0 z-[960] isolate border-t border-slate-800/60 bg-slate-950 backdrop-blur-xl pb-safe pointer-events-auto ${
          affiliateBarVisible
            ? "bottom-[calc(60px+env(safe-area-inset-bottom,0px))]"
            : "bottom-0"
        }`}
        style={{ paddingTop: "10px" }}
        aria-label={uiText.ariaMainMenu}
      >
        <div className="mx-auto flex max-w-3xl items-end justify-around gap-0.5 px-2 sm:gap-1 sm:px-3">
          {/* ホーム（Daily Mission） */}
          <motion.button
            type="button"
            onClick={() => setActiveView("home")}
            onPointerDown={() => setActiveView("home")}
            className={`flex min-h-[48px] min-w-0 flex-1 cursor-pointer touch-manipulation flex-col items-center justify-center gap-0.5 text-[10px] font-medium sm:min-h-[52px] sm:text-[11px] ${
              activeView === "home" ? "text-wa-ruri" : "text-slate-500 hover:text-slate-300"
            }`}
            animate={activeView === "home" ? { y: -2, scale: 1.05 } : { y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
          >
            <Target className="h-5 w-5 sm:h-5 sm:w-5 pointer-events-none" />
            <span className="pointer-events-none">{uiText.home}</span>
          </motion.button>

          {/* Topic */}
          <motion.button
            type="button"
            onClick={() => setActiveView("topic")}
            onPointerDown={() => setActiveView("topic")}
            className={`flex min-h-[48px] min-w-0 flex-1 cursor-pointer touch-manipulation flex-col items-center justify-center gap-0.5 text-[10px] font-medium sm:min-h-[52px] sm:text-[11px] ${
              activeView === "topic" ? "text-wa-ruri" : "text-slate-500 hover:text-slate-300"
            }`}
            animate={activeView === "topic" ? { y: -2, scale: 1.05 } : { y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
          >
            <Compass className="h-5 w-5 sm:h-5 sm:w-5 pointer-events-none" />
            <span className="pointer-events-none">Topic</span>
          </motion.button>

          {/* 中央：チャット（強調） */}
          <motion.button
            type="button"
            onClick={() => setActiveView("chat")}
            onPointerDown={() => setActiveView("chat")}
            className="relative flex min-h-[56px] min-w-0 flex-1 cursor-pointer touch-manipulation flex-col items-center justify-center sm:min-h-[64px]"
            animate={
              activeView === "chat"
                ? { y: -6, scale: 1.12 }
                : { y: -4, scale: 1.0 }
            }
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
          >
            <motion.div
              className="pointer-events-none flex items-center justify-center rounded-full bg-gradient-to-br from-wa-ruri to-wa-asagi p-3 shadow-glass ring-2 ring-wa-asagi/60"
              animate={
                activeView === "chat"
                  ? {
                      scale: 1,
                      boxShadow: "0 12px 40px rgba(56, 189, 248, 0.25)",
                    }
                  : {
                      scale: [1, 1.06, 1],
                      boxShadow: [
                        "0 8px 24px rgba(236, 72, 153, 0.35)",
                        "0 10px 32px rgba(125, 211, 252, 0.4)",
                        "0 8px 24px rgba(236, 72, 153, 0.35)",
                      ],
                    }
              }
              transition={
                activeView === "chat"
                  ? { duration: 0.25 }
                  : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
              }
            >
              <MessageCircle className="h-5 w-5 text-slate-50 sm:h-5 sm:w-5" />
            </motion.div>
            <span
              className={`pointer-events-none mt-0.5 text-[9px] font-semibold leading-tight sm:mt-1 sm:text-[11px] ${
                activeView === "chat" ? "text-wa-asagi" : "text-slate-300"
              }`}
            >
              {uiText.chat}
            </span>
          </motion.button>

          {/* Progress */}
          <motion.button
            type="button"
            onClick={() => setActiveView("progress")}
            onPointerDown={() => setActiveView("progress")}
            className={`flex min-h-[48px] min-w-0 flex-1 cursor-pointer touch-manipulation flex-col items-center justify-center gap-0.5 text-[10px] font-medium sm:min-h-[52px] sm:text-[11px] ${
              activeView === "progress" ? "text-wa-ruri" : "text-slate-500 hover:text-slate-300"
            }`}
            animate={activeView === "progress" ? { y: -2, scale: 1.05 } : { y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
          >
            <ClipboardList className="h-5 w-5 sm:h-5 sm:w-5 pointer-events-none" />
            <span className="pointer-events-none">Progress</span>
          </motion.button>

          {/* More */}
          <motion.button
            type="button"
            onClick={() => setActiveView("more")}
            onPointerDown={() => setActiveView("more")}
            className={`flex min-h-[48px] min-w-0 flex-1 cursor-pointer touch-manipulation flex-col items-center justify-center gap-0.5 text-[10px] font-medium sm:min-h-[52px] sm:text-[11px] ${
              activeView === "more" ? "text-wa-ruri" : "text-slate-500 hover:text-slate-300"
            }`}
            animate={activeView === "more" ? { y: -2, scale: 1.05 } : { y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
          >
            <MoreHorizontal className="h-5 w-5 sm:h-5 sm:w-5 pointer-events-none" />
            <span className="pointer-events-none">More</span>
          </motion.button>
        </div>
      </nav>

      {/* Report quick button: tap to open, long-press to move */}
      {!embedded && reportFabPos ? (
        <button
          ref={reportFabRef}
          type="button"
          aria-label="Open report"
          title="Report（長押しで移動）"
          onPointerDown={(e) => {
            if (!reportFabRef.current) return;
            reportFabMovedRef.current = false;
            reportFabDraggingRef.current = false;
            const rect = reportFabRef.current.getBoundingClientRect();
            reportFabPointerOffsetRef.current = {
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            };
            if (reportFabPressTimerRef.current) {
              window.clearTimeout(reportFabPressTimerRef.current);
            }
            reportFabPressTimerRef.current = window.setTimeout(() => {
              reportFabDraggingRef.current = true;
            }, 320);
          }}
          onPointerMove={(e) => {
            if (!reportFabDraggingRef.current) return;
            const next = clampReportFabPos(
              e.clientX - reportFabPointerOffsetRef.current.x,
              e.clientY - reportFabPointerOffsetRef.current.y,
            );
            reportFabMovedRef.current = true;
            setReportFabPos(next);
          }}
          onPointerUp={() => {
            if (reportFabPressTimerRef.current) {
              window.clearTimeout(reportFabPressTimerRef.current);
              reportFabPressTimerRef.current = null;
            }
            if (reportFabDraggingRef.current) {
              reportFabDraggingRef.current = false;
              return;
            }
            if (!reportFabMovedRef.current) {
              window.location.href = "/report";
            }
          }}
          onPointerCancel={() => {
            if (reportFabPressTimerRef.current) {
              window.clearTimeout(reportFabPressTimerRef.current);
              reportFabPressTimerRef.current = null;
            }
            reportFabDraggingRef.current = false;
          }}
          className="fixed z-[980] flex h-[52px] w-[52px] touch-none items-center justify-center rounded-full bg-gradient-to-br from-wa-ruri to-wa-asagi text-white shadow-[0_10px_28px_rgba(42,92,170,0.45)] ring-2 ring-wa-asagi/70 active:scale-95"
          style={{
            left: reportFabPos.x,
            top: reportFabPos.y,
          }}
        >
          <FileText className="h-5 w-5" />
        </button>
      ) : null}

      {/* 単語タップ時：「単語帳に追加する」メニュー */}
      {vocabMenu && (
        <>
          <button
            type="button"
            aria-label={uiText.ariaClose}
            className="fixed inset-0 z-[210] bg-black/50 backdrop-blur-sm"
            onClick={() => setVocabMenu(null)}
          />
          <div className="fixed left-4 right-4 top-1/2 z-[220] max-w-sm -translate-y-1/2 rounded-2xl border border-yomu-glassBorder bg-yomu-glass p-4 shadow-glass backdrop-blur-xl sm:left-1/2 sm:right-auto sm:w-[calc(100%-2rem)] sm:-translate-x-1/2">
            <p className="mb-3 text-[13px] text-slate-200">
              “{vocabMenu.phrase}” ({vocabMenu.reading})
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setVocabMenu(null)}
                className="flex-1 rounded-xl border border-slate-600 bg-transparent py-3 text-[12px] font-medium text-slate-400 hover:bg-slate-800/50 sm:py-2.5"
              >
                {uiText.cancel}
              </button>
              <button
                type="button"
                disabled={vocabAdding}
                onClick={async () => {
                  await handleAddVocab(vocabMenu.phrase, vocabMenu.reading);
                  setVocabMenu(null);
                }}
                className="btn-wa-hover-ruri flex-1 rounded-xl bg-wa-ruri py-3 text-[12px] font-medium text-slate-50 hover:bg-wa-asagi disabled:opacity-60 sm:py-2.5"
              >
                {vocabAdding ? uiText.addingToVocabulary : uiText.addToVocabulary}
              </button>
            </div>
          </div>
        </>
      )}

      <style suppressHydrationWarning>{`
        .msg-enter { animation: fadeUp .25s ease-out; }
        .dot { width:6px;height:6px;border-radius:9999px;background:#94a3b8;display:inline-block; }
        .dot:nth-child(1){animation:blink 1.2s ease 0s infinite}
        .dot:nth-child(2){animation:blink 1.2s ease .2s infinite}
        .dot:nth-child(3){animation:blink 1.2s ease .4s infinite}
        @keyframes fadeUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes blink { 0%,100%{opacity:.3} 50%{opacity:1} }
      `}</style>
    </div>
  );
}
