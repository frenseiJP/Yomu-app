import { readHabitJson, writeHabitJson } from "@/lib/habit/storage";
import { todayYmd } from "@/lib/habit/date";

const KIND = "retention_daily_v1";

/** 10 カテゴリ — 日付でローテーション */
export const RETENTION_MISSION_CATEGORIES = [
  "restaurant",
  "convenience",
  "directions",
  "apology",
  "small_talk",
  "work",
  "casual",
  "travel",
  "ordering",
  "help",
] as const;

export type RetentionMissionCategory = (typeof RETENTION_MISSION_CATEGORIES)[number];

export type RetentionDifficultyLabel = "easy" | "medium" | "hard";

export interface RetentionDailyMission {
  title: string;
  instruction: string;
  prompt_en: string;
  difficulty: RetentionDifficultyLabel;
  tags: string[];
  /** 内部用: どのカテゴリから選んだか */
  category: RetentionMissionCategory;
}

export interface RetentionDailyMissionDay {
  date: string;
  mission: RetentionDailyMission;
  completed: boolean;
  completedAt?: string;
}

interface RetentionStore {
  byDate: Record<string, RetentionDailyMissionDay>;
}

type Band = "beginner" | "intermediate" | "advanced";

function fnv1a32(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

export function jlptLevelToBand(jlpt: string): Band {
  const n = jlpt.trim().toUpperCase();
  if (n === "N5" || n === "N4") return "beginner";
  if (n === "N3") return "intermediate";
  return "advanced";
}

function bandToDifficulty(b: Band): RetentionDifficultyLabel {
  if (b === "beginner") return "easy";
  if (b === "intermediate") return "medium";
  return "hard";
}

type PoolRow = Omit<RetentionDailyMission, "difficulty" | "category"> & {
  category: RetentionMissionCategory;
};

/** 各カテゴリ × 難易帯ごとに複数候補（決定的に日次で選択） */
const POOL: Record<RetentionMissionCategory, Record<Band, PoolRow[]>> = {
  restaurant: {
    beginner: [
      {
        title: "At a restaurant",
        instruction: "Order your meal naturally in Japanese.",
        prompt_en: "I'd like this one, please.",
        tags: ["daily", "speaking", "polite"],
        category: "restaurant",
      },
      {
        title: "At a café",
        instruction: "Ask for water with your meal.",
        prompt_en: "Could I get some water, please?",
        tags: ["daily", "polite"],
        category: "restaurant",
      },
    ],
    intermediate: [
      {
        title: "At a restaurant",
        instruction: "Ask for the check politely after a casual dinner.",
        prompt_en: "We're ready to pay whenever you have a moment.",
        tags: ["daily", "polite", "nuance"],
        category: "restaurant",
      },
      {
        title: "At a restaurant",
        instruction: "Say you're allergic to nuts when ordering.",
        prompt_en: "I can't eat nuts — is this dish okay?",
        tags: ["daily", "clear"],
        category: "restaurant",
      },
    ],
    advanced: [
      {
        title: "At a restaurant",
        instruction: "Decline the drink politely but warmly (business dinner).",
        prompt_en: "I'll pass on alcohol tonight — I have an early morning tomorrow.",
        tags: ["business", "tone"],
        category: "restaurant",
      },
    ],
  },
  convenience: {
    beginner: [
      {
        title: "At a convenience store",
        instruction: "Say you don’t need a bag politely.",
        prompt_en: "No bag, please.",
        tags: ["shopping", "daily"],
        category: "convenience",
      },
      {
        title: "At a convenience store",
        instruction: "Ask to heat your bento.",
        prompt_en: "Could you warm this up, please?",
        tags: ["daily", "polite"],
        category: "convenience",
      },
    ],
    intermediate: [
      {
        title: "At a convenience store",
        instruction: "Ask if they have a different size of the same drink.",
        prompt_en: "Do you have this in a larger bottle?",
        tags: ["shopping", "natural"],
        category: "convenience",
      },
    ],
    advanced: [
      {
        title: "At a convenience store",
        instruction: "Ask them to print a receipt for company expenses, briefly.",
        prompt_en: "A receipt for this, please — company card.",
        tags: ["business", "brief"],
        category: "convenience",
      },
    ],
  },
  directions: {
    beginner: [
      {
        title: "Asking directions",
        instruction: "Ask where the station is in simple Japanese.",
        prompt_en: "Where is the station?",
        tags: ["travel", "daily"],
        category: "directions",
      },
    ],
    intermediate: [
      {
        title: "Asking directions",
        instruction: "Ask which exit is best for a landmark.",
        prompt_en: "Which exit should I use for the museum?",
        tags: ["travel", "natural"],
        category: "directions",
      },
    ],
    advanced: [
      {
        title: "Asking directions",
        instruction: "Ask politely if you're already late and sound natural.",
        prompt_en: "Sorry to bother you — is Shinjuku Station this way?",
        tags: ["travel", "tone"],
        category: "directions",
      },
    ],
  },
  apology: {
    beginner: [
      {
        title: "Late for a meeting",
        instruction: "Apologize for being late naturally.",
        prompt_en: "Sorry I'm a bit late.",
        tags: ["apology", "daily"],
        category: "apology",
      },
    ],
    intermediate: [
      {
        title: "Late for a meeting",
        instruction: "Apologize briefly and show you'll catch up.",
        prompt_en: "Sorry I'm late — traffic was rough. I'm ready to jump in.",
        tags: ["apology", "work"],
        category: "apology",
      },
    ],
    advanced: [
      {
        title: "Apologizing at work",
        instruction: "Give a short, sincere apology for a small mistake (email tone).",
        prompt_en: "Sorry about the mix-up on my side — I'll fix it today.",
        tags: ["business", "tone"],
        category: "apology",
      },
    ],
  },
  small_talk: {
    beginner: [
      {
        title: "Small talk",
        instruction: "React to nice weather in a friendly way.",
        prompt_en: "Nice day today!",
        tags: ["casual", "daily"],
        category: "small_talk",
      },
    ],
    intermediate: [
      {
        title: "Small talk",
        instruction: "Ask if someone had a good weekend (neutral-polite).",
        prompt_en: "Did you have a good weekend?",
        tags: ["casual", "polite"],
        category: "small_talk",
      },
    ],
    advanced: [
      {
        title: "Small talk",
        instruction: "Open a light chat after a long work week (natural, not stiff).",
        prompt_en: "That week flew by — any plans for tonight?",
        tags: ["casual", "nuance"],
        category: "small_talk",
      },
    ],
  },
  work: {
    beginner: [
      {
        title: "At work",
        instruction: "Ask a coworker for a quick favor politely.",
        prompt_en: "Could you send me that file when you have a moment?",
        tags: ["work", "polite"],
        category: "work",
      },
    ],
    intermediate: [
      {
        title: "At work",
        instruction: "Ask to reschedule a short meeting.",
        prompt_en: "Could we move our 3pm to 4pm?",
        tags: ["work", "clear"],
        category: "work",
      },
    ],
    advanced: [
      {
        title: "At work",
        instruction: "Push back gently on an unrealistic deadline.",
        prompt_en: "I can deliver A by Friday, but B would need a bit more time.",
        tags: ["business", "tone"],
        category: "work",
      },
    ],
  },
  casual: {
    beginner: [
      {
        title: "Casual conversation",
        instruction: "Invite a friend to get coffee simply.",
        prompt_en: "Want to grab coffee later?",
        tags: ["casual", "friends"],
        category: "casual",
      },
    ],
    intermediate: [
      {
        title: "Casual conversation",
        instruction: "Say you’re not sure yet, but you’ll text them.",
        prompt_en: "Not sure yet — I’ll text you tonight.",
        tags: ["casual", "natural"],
        category: "casual",
      },
    ],
    advanced: [
      {
        title: "Casual conversation",
        instruction: "Turn down an invite without hurting feelings.",
        prompt_en: "I’d love to, but I’m wiped this week — rain check?",
        tags: ["casual", "nuance"],
        category: "casual",
      },
    ],
  },
  travel: {
    beginner: [
      {
        title: "Travel",
        instruction: "Ask if this seat is free on a train.",
        prompt_en: "Is this seat taken?",
        tags: ["travel", "daily"],
        category: "travel",
      },
    ],
    intermediate: [
      {
        title: "Travel",
        instruction: "Ask when the next bus leaves (short).",
        prompt_en: "When is the next bus to the airport?",
        tags: ["travel", "clear"],
        category: "travel",
      },
    ],
    advanced: [
      {
        title: "Travel",
        instruction: "Ask staff to keep your luggage for a few hours.",
        prompt_en: "Could you hold my bag until around 4pm?",
        tags: ["travel", "polite"],
        category: "travel",
      },
    ],
  },
  ordering: {
    beginner: [
      {
        title: "Ordering / buying",
        instruction: "Say you’ll take two of something at a shop.",
        prompt_en: "I'll take two, please.",
        tags: ["shopping", "daily"],
        category: "ordering",
      },
    ],
    intermediate: [
      {
        title: "Ordering / buying",
        instruction: "Ask if they have it in another color.",
        prompt_en: "Do you have this in black?",
        tags: ["shopping", "natural"],
        category: "ordering",
      },
    ],
    advanced: [
      {
        title: "Ordering / buying",
        instruction: "Ask for a recommendation between two similar items.",
        prompt_en: "Between these two, which would you pick for everyday use?",
        tags: ["shopping", "nuance"],
        category: "ordering",
      },
    ],
  },
  help: {
    beginner: [
      {
        title: "Asking for help",
        instruction: "Ask someone to speak more slowly.",
        prompt_en: "Could you speak a little more slowly?",
        tags: ["daily", "learning"],
        category: "help",
      },
    ],
    intermediate: [
      {
        title: "Asking for help",
        instruction: "Ask someone to repeat what they said politely.",
        prompt_en: "Sorry — could you say that one more time?",
        tags: ["daily", "polite"],
        category: "help",
      },
    ],
    advanced: [
      {
        title: "Asking for help",
        instruction: "Ask for help in a busy shop without sounding demanding.",
        prompt_en: "Excuse me — when you have a second, could you help me find this?",
        tags: ["daily", "tone"],
        category: "help",
      },
    ],
  },
};

function pruneStore(store: RetentionStore): RetentionStore {
  const keys = Object.keys(store.byDate).sort();
  if (keys.length <= 21) return { byDate: { ...store.byDate } };
  const next: RetentionStore = { byDate: {} };
  for (const k of keys.slice(-21)) {
    next.byDate[k] = store.byDate[k]!;
  }
  return next;
}

export function pickCategoryForDay(ymd: string, userId: string): RetentionMissionCategory {
  const [y, mo, d] = ymd.split("-").map(Number);
  const day = Math.floor(Date.UTC(y, mo - 1, d) / 86400000);
  const idx = (day + fnv1a32(userId)) % RETENTION_MISSION_CATEGORIES.length;
  return RETENTION_MISSION_CATEGORIES[idx]!;
}

export function generateRetentionDailyMission(
  userId: string,
  ymd: string,
  jlptLevel: string,
): RetentionDailyMission {
  const band = jlptLevelToBand(jlptLevel);
  const category = pickCategoryForDay(ymd, userId);
  const rows = POOL[category][band].length ? POOL[category][band] : POOL[category].beginner;
  const pick = fnv1a32(`${userId}|${ymd}|${category}|${band}`) % rows.length;
  const row = rows[pick]!;
  return {
    title: row.title,
    instruction: row.instruction,
    prompt_en: row.prompt_en,
    difficulty: bandToDifficulty(band),
    tags: row.tags,
    category: row.category,
  };
}

export function getOrCreateRetentionDailyMission(
  userId: string,
  jlptLevel: string,
): RetentionDailyMissionDay {
  const today = todayYmd();
  const store = readHabitJson<RetentionStore>(KIND, userId, { byDate: {} });
  const existing = store.byDate[today];
  if (existing?.mission && existing.date === today) {
    return existing;
  }
  const mission = generateRetentionDailyMission(userId, today, jlptLevel);
  const nextDay: RetentionDailyMissionDay = {
    date: today,
    mission,
    completed: false,
  };
  const pruned = pruneStore(store);
  pruned.byDate[today] = nextDay;
  writeHabitJson(KIND, userId, pruned);
  return nextDay;
}

export function markRetentionDailyMissionCompleted(userId: string): RetentionDailyMissionDay | null {
  const today = todayYmd();
  const store = readHabitJson<RetentionStore>(KIND, userId, { byDate: {} });
  const cur = store.byDate[today];
  if (!cur || cur.completed) return cur ?? null;
  const updated: RetentionDailyMissionDay = {
    ...cur,
    completed: true,
    completedAt: new Date().toISOString(),
  };
  store.byDate[today] = updated;
  writeHabitJson(KIND, userId, store);
  return updated;
}

export function buildRetentionMissionChatOpener(m: RetentionDailyMission): string {
  return [
    "Today's mission 🇯🇵",
    "",
    m.instruction,
    "",
    "How would you say this in Japanese?",
    "",
    `“${m.prompt_en}”`,
  ].join("\n");
}
