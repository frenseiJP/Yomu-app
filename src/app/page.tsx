"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Image as ImageIcon,
  Volume2,
  Sparkles,
  BookOpen,
  Target,
  CheckCircle2,
} from "lucide-react";
import { getLangClient } from "@/src/utils/i18n/clientLang";

type Role = "user" | "assistant";
type Politeness = "casual" | "neutral" | "business";

type Message = {
  id: number;
  role: Role;
  baseText: string; // 中立トーンの日本語
  /** 送信時点のトーン（ストリーム中の切り替えで表示が揺れないようにする） */
  replyTone?: Politeness;
  romaji?: string;
  culturalNote?: string;
  politeNote?: string;
  tipsNote?: string;
  createdAt: string;
};

type VocabItem = {
  id: number;
  word: string;
  reading?: string;
  meaning?: string;
};

type KeywordCandidate = {
  word: string;
  meaning: string;
};

type DailyMission = {
  id: string;
  title: string;
  cultureTip: string;
  keywords: string[]; // 投稿に含まれていれば達成とみなす
};

const DAILY_MISSIONS: DailyMission[] = [
  {
    id: "1",
    title: "「いただきます」の由来について、AIに質問してみよう",
    cultureTip: "日本では食事の前後で感謝を伝えるのがマナーです。",
    keywords: ["いただきます", "由来", "質問", "itadakimasu", "意味"],
  },
  {
    id: "2",
    title: "今日あった良いことを、丁寧語（です・ます）で1文書いてみて",
    cultureTip: "丁寧語は相手への敬意を示し、場を和ませます。",
    keywords: ["です", "ます", "今日", "良い", "ありがとう"],
  },
  {
    id: "3",
    title: "「お疲れ様」を誰に・いつ使うか、AIに聞いてみよう",
    cultureTip: "お疲れ様は、共に時間を過ごした相手へのねぎらいの一言です。",
    keywords: ["お疲れ様", "おつかれ", "いつ", "誰に", "otsukaresama"],
  },
];

function getTodaysMission(): DailyMission {
  const daySeed = new Date().toDateString();
  const idx = daySeed.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % DAILY_MISSIONS.length;
  return DAILY_MISSIONS[idx];
}

const BG = "#020617";
const ACCENT = "#155EEF";

const KEYWORD_CANDIDATES: KeywordCandidate[] = [
  { word: "いただきます", meaning: "日本の食事前の感謝のあいさつ" },
  { word: "お疲れ様", meaning: "相手の労をねぎらう一言" },
  {
    word: "よろしくお願いします",
    meaning: "関係の始まりや依頼のときの定番フレーズ",
  },
  { word: "敬語", meaning: "ていねいさや上下関係を表す日本語の仕組み" },
  { word: "桜", meaning: "日本の春を象徴する花" },
];

const INITIAL_ASSISTANT_MESSAGE: Message = {
  id: 1,
  role: "assistant",
  baseText:
    "こんにちは。Yomu です。日本語と、そのうしろにある文化や空気をいっしょに味わいながら学んでいきましょう。まずは気になる日本語やフレーズを送ってみてください。たとえば「いただきます」「お疲れ様」「よろしくお願いします」などです。",
  romaji:
    "Konnichiwa. Yomu desu. Nihongo to, sono ushiro ni aru bunka ya kuuki o issho ni ajiwai nagara manande ikimashou. Mazu wa kininaru nihongo ya fureezu o okutte mite kudasai. Tatoeba ‘itadakimasu’, ‘otsukaresama’, ‘yoroshiku onegaishimasu’ nado desu.",
  culturalNote:
    "In Japanese, everyday phrases often carry layers of cultural meaning—about gratitude, hierarchy, and shared time. We’ll slowly unwrap those layers together.",
  politeNote:
    "This greeting is in standard polite Japanese (丁寧語), natural for first meetings, classes, and most neutral situations.",
  tipsNote:
    "As you read, don’t worry about understanding every word. Focus on the feeling of the sentence first, then zoom into key words you want to remember.",
  createdAt: new Date().toISOString(),
};

function formatTime(dateIso: string) {
  const d = new Date(dateIso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function detectLanguage(text: string): "ja" | "en" | "other" {
  if (/[ぁ-んァ-ン一-龠]/.test(text)) return "ja";
  const latin = text.match(/[a-zA-Z]/g)?.length ?? 0;
  if (latin > 0) return "en";
  return "other";
}

// 非AI: 簡単なトーン変換のシミュレーション
function applyPoliteness(text: string, level: Politeness): string {
  if (level === "neutral") return text;
  if (level === "casual") {
    return text
      .replace("です。", "だよ。")
      .replace(/ください。/g, "ね。")
      .replace(/ましょう。/g, "よう。") + " （カジュアル）";
  }
  // business
  return (
    "恐れ入りますが、" +
    text
      .replace("です。", "でございます。")
      .replace(/ください。/g, "いただけますと幸いです。")
      .replace(/ましょう。/g, "まいりましょう。") +
    " （ビジネス）"
  );
}

// 簡易ふりがな: 代表的な単語だけ辞書で対応
const FURIGANA_DICTIONARY: Record<string, string> = {
  "日本語": "にほんご",
  "文化": "ぶんか",
  "空気": "くうき",
  "いただきます": "いただきます",
  "お疲れ様": "おつかれさま",
  "よろしくお願いします": "よろしくおねがいします",
  "桜": "さくら",
};

function withFurigana(text: string): JSX.Element {
  const entries = Object.entries(FURIGANA_DICTIONARY);
  if (entries.length === 0) return <>{text}</>;

  // 単純に辞書のキーで分割しながら <ruby> を挿入
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

export default function YomuPrototypePage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_ASSISTANT_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [politeness, setPoliteness] = useState<Politeness>("neutral");
  const [furiganaOn, setFuriganaOn] = useState(true);
  const [vocab, setVocab] = useState<VocabItem[]>([]);
  const [imageName, setImageName] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // メッセージ送信後・ストリーミング中も最新メッセージまで自動スクロール
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
    return () => cancelAnimationFrame(timer);
  }, [messages, isTyping, politeness]);

  const controllerRef = useRef<AbortController | null>(null);
  const politenessRef = useRef<Politeness>("neutral");

  useEffect(() => {
    politenessRef.current = politeness;
  }, [politeness]);

  const isLoading = isTyping;
  const canSend = input.trim().length > 0 && !isLoading;

  function buildClaudeMessages(userText: string) {
    const history = messages.slice(-6).map((m) => ({
      role: m.role,
      content: m.baseText,
    }));
    return [
      ...history,
      {
        role: "user",
        content: userText,
      },
    ];
  }

  const handleSend = async (raw: string) => {
    const text = raw.trim();
    // 空メッセージは送信不可
    if (!text || isTyping) return;

    const now = new Date().toISOString();
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      baseText: text,
      createdAt: now,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    if (!missionCompleted && messageMatchesMission(text)) {
      setMissionCompleted(true);
      const dayIndex = new Date().getDay();
      setStreakDays((prev) => {
        const next = [...prev];
        next[dayIndex] = true;
        return next;
      });
    }

    // 既存のストリームがあれば中断
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    const controller = new AbortController();
    controllerRef.current = controller;

    const toneAtSend = politenessRef.current;

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

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: buildClaudeMessages(text),
          tone: toneAtSend,
          language: getLangClient(),
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        setIsTyping(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let accumulated = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (!value) continue;
        const chunk = decoder.decode(value);
        accumulated += chunk;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  baseText: accumulated,
                  replyTone: toneAtSend,
                }
              : m,
          ),
        );
      }
    } catch (e) {
      // 通信エラー時もタイピング状態を解除
    } finally {
      setIsTyping(false);
      controllerRef.current = null;
    }
  };

  const handleImageSelect = (file: File) => {
    const name = file.name || "uploaded image";
    setImageName(name);
    const now = new Date().toISOString();
    const systemMsg: Message = {
      id: Date.now(),
      role: "assistant",
      baseText:
        "この画像にうつっている物について、日本語の名称・マナー・文化的な背景をいっしょに整理してみましょう。まずは、どこで使われていそうか想像してみてください。",
      romaji:
        "Kono gazou ni utsutte iru mono ni tsuite, Nihongo no meishou, mana, bunkateki na haikei o issho ni seiri shite mimashou. Mazu wa, doko de tsukawarete isou ka souzou shite mite kudasai.",
      culturalNote:
        "In a full version, the AI would describe the object's name, how it is used politely in Japan, and any manners related to gifting, receiving, or displaying it.",
      politeNote:
        "This guidance stays in polite instructional Japanese, suitable for a learning setting.",
      tipsNote:
        "Try describing the image yourself in simple Japanese first, even if it feels broken. That activates your intuition before reading the AI's explanation.",
      createdAt: now,
    };
    setMessages((prev) => [...prev, systemMsg]);
  };

  const handleAddVocab = (word: string, meaning?: string) => {
    setVocab((prev) => {
      if (prev.some((v) => v.word === word)) return prev;
      return [{ id: Date.now(), word, meaning }, ...prev];
    });
  };

  const speak = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const uttr = new SpeechSynthesisUtterance(text);
    uttr.lang = "ja-JP";
    window.speechSynthesis.speak(uttr);
  };

  const todaysMission = useMemo(() => getTodaysMission(), []);
  const [missionCompleted, setMissionCompleted] = useState(false);
  const [streakDays, setStreakDays] = useState<boolean[]>([false, false, false, false, false, false, false]);

  function messageMatchesMission(text: string): boolean {
    const lower = text.toLowerCase().replace(/\s/g, "");
    return todaysMission.keywords.some((k) => lower.includes(k.toLowerCase().replace(/\s/g, ""))) || text.length >= 8;
  }

  return (
    <div className="min-h-screen bg-yomu-bg text-slate-100 antialiased" style={{ background: BG }}>
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-6 lg:px-8 lg:py-8">
        {/* ヘッダー */}
        <header className="mb-6 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-wa-ruri to-wa-asagi text-sm font-bold text-white shadow-glass">
              読
            </div>
            <div>
              <p className="font-wa-serif text-base font-semibold tracking-tight text-slate-50">
                Yomu — 日本文化AIコーチ
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                世界一「空気ごと」学べる日本語アプリのプロトタイプ
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="btn-wa-hover btn-wa-hover-ruri flex items-center gap-2 rounded-full border border-yomu-glassBorder bg-yomu-glass px-4 py-2 text-[11px] text-slate-300 shadow-glass backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Claude 3.5 Sonnet · mock</span>
            </div>
          </div>
        </header>

        {/* メインレイアウト */}
        <div className="flex flex-1 gap-6 rounded-3xl border border-yomu-glassBorder bg-yomu-glass p-4 shadow-glass backdrop-blur-xl lg:p-6">
          {/* サイドバー：Glassmorphism */}
          <aside className="glass-panel hidden w-72 flex-shrink-0 flex-col gap-5 rounded-2xl border border-yomu-glassBorder pr-5 sm:flex">
            {/* Daily Mission */}
            <section
              className={
                missionCompleted
                  ? "rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-5 shadow-glass backdrop-blur-xl"
                  : "rounded-2xl border border-yomu-glassBorder bg-yomu-glass p-5 shadow-glass backdrop-blur-xl"
              }
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-wa-ruri" />
                  <Sparkles className="h-3.5 w-3.5 text-wa-kinari/90" />
                </div>
                <span className="font-wa-serif text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  Daily Mission
                </span>
              </div>
              {missionCompleted ? (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2.5 text-emerald-300">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Completed!</span>
                </div>
              ) : (
                <p className="font-wa-serif text-[13px] leading-relaxed text-slate-100">
                  {todaysMission.title}
                </p>
              )}
              <p className="mt-3 flex items-start gap-1.5 text-[11px] text-slate-400">
                <span className="mt-0.5">💡</span>
                <span className="font-medium text-slate-500">Culture Tip:</span>{" "}
                {todaysMission.cultureTip}
              </p>
              <div className="mt-4 flex items-center gap-1.5">
                <span className="text-[10px] text-slate-500">今週</span>
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className={
                      streakDays[i]
                        ? "h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]"
                        : "h-2 w-2 rounded-full bg-slate-700/80"
                    }
                    title={i === new Date().getDay() ? "今日" : `Day ${i + 1}`}
                  />
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-yomu-glassBorder bg-yomu-glass p-5 shadow-glass backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-wa-ruri" />
                  <h2 className="font-wa-serif text-xs font-semibold tracking-[0.16em] text-slate-400">
                    MY VOCAB
                  </h2>
                </div>
                <span className="text-[10px] text-slate-500">
                  {vocab.length} words
                </span>
              </div>
              {vocab.length === 0 ? (
                <p className="text-[11px] leading-relaxed text-slate-500">
                  チャット内の気になる単語をタップすると、この単語帳に
                  <span className="text-sky-400"> ワンタップ保存</span>
                  されます。
                </p>
              ) : (
                <ul className="mt-2 space-y-2.5 text-sm">
                  {vocab.slice(0, 8).map((v) => (
                    <li
                      key={v.id}
                      className="flex items-center justify-between rounded-xl border border-yomu-glassBorder bg-yomu-glass/80 px-3.5 py-2.5 backdrop-blur-sm"
                    >
                      <div>
                        <p className="text-[13px] font-medium text-slate-50">
                          {v.word}
                        </p>
                        {v.meaning && (
                          <p className="text-[11px] text-slate-500">
                            {v.meaning}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-2xl border border-yomu-glassBorder bg-yomu-glass p-5 shadow-glass backdrop-blur-xl">
              <p className="font-wa-serif mb-1.5 text-[11px] font-semibold tracking-[0.16em] text-slate-400">
                THIS WEEK IN JAPAN
              </p>
              <p className="font-wa-serif mb-1.5 text-sm font-medium text-slate-50">
                夜の花見「夜桜」
              </p>
              <p className="text-[11px] leading-relaxed text-slate-400">
                昼とはちがう顔を見せる、夜の桜。提灯の光と人のざわめきの中で、
                「いただきます」や「お疲れ様」がどんな空気を生むのかを感じてみましょう。
              </p>
            </section>
          </aside>

          {/* チャットエリア */}
          <section className="glass-panel flex min-h-[520px] flex-1 flex-col rounded-2xl p-4 sm:p-5 lg:p-6">
            {/* 上部コントロールバー */}
            <div className="mb-5 flex flex-col gap-3 border-b border-yomu-glassBorder pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="font-wa-serif text-sm font-medium text-slate-100">
                  日本語チャット · Cultural Coach
                </p>
                <p className="text-[11px] text-slate-500">
                  ふりがな · 丁寧さ · 文化解説 · 単語帳 · 音声を一つの画面で。
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {/* Furigana toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">ふりがな</span>
                  <button
                    type="button"
                    onClick={() => setFuriganaOn((v) => !v)}
                    className={`btn-wa-hover btn-wa-hover-ruri flex h-6 w-11 items-center rounded-full border px-0.5 transition ${
                      furiganaOn
                        ? "border-wa-ruri bg-wa-ruri/30"
                        : "border-slate-600 bg-slate-900"
                    }`}
                  >
                    <span
                      className={`inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-semibold text-slate-900 shadow-sm transition ${
                        furiganaOn ? "translate-x-4" : "translate-x-0"
                      }`}
                    >
                      あ
                    </span>
                  </button>
                </div>

                {/* Politeness slider (3-state) */}
                <div className="btn-wa-hover flex flex-wrap items-center gap-2 rounded-full border border-yomu-glassBorder bg-yomu-glass px-1.5 py-1 text-[11px] backdrop-blur-sm">
                  <span className="hidden text-slate-500 sm:inline">話し方</span>
                  {(
                    [
                      ["casual", "友だちみたいに", "くだけた言い回し"],
                      ["neutral", "ふつうの丁寧", "です・ます"],
                      ["business", "お仕事向け", "より改まった表現"],
                    ] as [Politeness, string, string][]
                  ).map(([value, main, hint]) => (
                    <button
                      key={value}
                      type="button"
                      aria-label={`${main}。${hint}`}
                      onClick={() => setPoliteness(value)}
                      className={`btn-wa-hover-ruri rounded-full px-2.5 py-1.5 transition ${
                        politeness === value
                          ? "bg-slate-100 text-slate-900"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="flex flex-col items-center gap-0.5 leading-tight">
                        <span className="text-[10px] font-medium">{main}</span>
                        <span className="text-[9px] font-normal opacity-70">{hint}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* メッセージリスト */}
            <div className="flex-1 space-y-5 overflow-y-auto pr-1 text-[13px] leading-relaxed">
              {messages.map((msg) => {
                const isAssistant = msg.role === "assistant";
                const toneForMessage = isAssistant
                  ? (msg.replyTone ?? politeness)
                  : politeness;
                const displayText = isAssistant
                  ? applyPoliteness(msg.baseText, toneForMessage)
                  : msg.baseText;

                return (
                  <div
                    key={msg.id}
                    className="msg-enter flex flex-col gap-1"
                    style={{
                      alignItems: isAssistant ? "flex-start" : "flex-end",
                    }}
                  >
                    {isAssistant && (
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 text-[10px] font-bold text-white">
                          読
                        </div>
                        <span className="text-[11px] text-slate-500">
                          Yomu · {formatTime(msg.createdAt)}
                        </span>
                        <button
                          type="button"
                          onClick={() => speak(msg.baseText)}
                          className="btn-wa-hover btn-wa-hover-ruri ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-yomu-glassBorder bg-yomu-glass text-slate-300 hover:border-wa-ruri hover:text-slate-50"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}

                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-3 shadow-glass ${
                        isAssistant
                          ? "rounded-bl-sm border border-yomu-glassBorder bg-yomu-glass text-slate-100 backdrop-blur-sm"
                          : "rounded-br-sm bg-gradient-to-br from-wa-ruri to-wa-asagi text-slate-50 shadow-glass"
                      }`}
                    >
                      {isAssistant ? (
                        <p>
                          {furiganaOn ? withFurigana(displayText) : displayText}
                        </p>
                      ) : (
                        <p>{displayText}</p>
                      )}

                      {isAssistant && msg.romaji && (
                        <p className="mt-2 text-[11px] text-slate-500">
                          {msg.romaji}
                        </p>
                      )}

                      {isAssistant && (
                        <div className="mt-4 space-y-2.5 rounded-xl border border-yomu-glassBorder bg-yomu-glass/80 p-3.5 text-[11px] backdrop-blur-sm">
                          {msg.culturalNote && (
                            <div className="flex gap-2 text-slate-300">
                              <span className="mt-0.5 text-sky-400">
                                <Sparkles className="h-3 w-3" />
                              </span>
                              <p>{msg.culturalNote}</p>
                            </div>
                          )}
                          {msg.politeNote && (
                            <p className="text-slate-400">
                              <span className="font-semibold text-slate-300">
                                Politeness:
                              </span>{" "}
                              {msg.politeNote}
                            </p>
                          )}
                          {msg.tipsNote && (
                            <p className="text-slate-400">
                              <span className="font-semibold text-slate-300">
                                Tip:
                              </span>{" "}
                              {msg.tipsNote}
                            </p>
                          )}

                          {/* Smart Cards: 代表的な単語をワンタップ保存 */}
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {["いただきます", "お疲れ様", "よろしくお願いします"].map(
                              (w) => (
                                <button
                                  key={w}
                                  type="button"
                                  onClick={() => handleAddVocab(w)}
                                  className="btn-wa-hover rounded-full border border-yomu-glassBorder bg-yomu-glass px-3 py-1.5 text-[10px] text-slate-300 hover:border-wa-akane hover:text-slate-100"
                                >
                                  {w}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="msg-enter flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 text-[10px] font-bold text-white">
                    読
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl border border-slate-800/80 bg-slate-900/90 px-3 py-1.5">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* 下部: サジェスト + 入力（Glassmorphism） */}
            <div className="mt-5 space-y-4">
              <div className="flex flex-wrap gap-3 text-[11px]">
                {["『いただきます』の本当の意味", "『お疲れ様』を英語で説明して", "敬語とタメ口のちがい"]
                  .slice(0, 3)
                  .map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleSend(s)}
                      className="btn-wa-hover btn-wa-hover-ruri rounded-full border border-yomu-glassBorder bg-yomu-glass px-4 py-2 text-slate-300 backdrop-blur-sm hover:border-wa-ruri/50 hover:text-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {s}
                    </button>
                  ))}
              </div>

              <div className="glass-input flex items-end gap-3 rounded-2xl px-4 py-3 shadow-glass">
                <button
                  type="button"
                  className="btn-wa-hover btn-wa-hover-ruri flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-yomu-glassBorder bg-yomu-glass text-slate-300 hover:border-wa-ruri hover:text-slate-50"
                  onClick={() => {
                    // ダミーの input を動かす代わりに、名前だけ変化させる
                    const fakeFile = new File([""], "hanami-photo.jpg");
                    handleImageSelect(fakeFile);
                  }}
                >
                  <ImageIcon className="h-4 w-4" />
                </button>
                <div className="flex-1">
                  <textarea
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (input.trim()) handleSend(input);
                      }
                    }}
                    placeholder="日本語や、知りたい日本語表現（英語・韓国語・中国語での質問でもOK）を入力してください…"
                    className="max-h-32 w-full resize-none border-0 bg-transparent text-[13px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-0"
                  />
                  {imageName && (
                    <p className="mt-1 text-[11px] text-slate-500">
                      画像プレースホルダ: {imageName}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  disabled={!canSend}
                  onClick={() => handleSend(input)}
                  aria-busy={isLoading}
                  className="btn-wa-hover btn-wa-hover-ruri flex h-9 min-w-[80px] items-center justify-center gap-2 rounded-xl bg-wa-ruri px-4 text-[12px] font-medium text-slate-50 shadow-glass transition hover:bg-wa-asagi disabled:cursor-not-allowed disabled:bg-wa-hai/50 disabled:text-slate-400"
                >
                  {isLoading ? "送信中…" : "送信"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* アニメーションなどのスタイル */}
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
