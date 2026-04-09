import { recordsStorage } from "@/src/features/records/storage";
import { generateRecordId } from "@/src/features/records/storage/helpers";
import type { HabitDailyMission, MissionStore, MissionTask } from "@/lib/habit/types";
import { readHabitJson, writeHabitJson } from "@/lib/habit/storage";
import { todayYmd } from "@/lib/habit/date";

const KIND = "missions_v1";

/** Legacy vocab from YomuPrototypePage localStorage */
const LEGACY_VOCAB_KEY = "yomu_my_vocab";

function readLegacyVocab(): { word: string; meaning: string }[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LEGACY_VOCAB_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as unknown[];
    if (!Array.isArray(arr)) return [];
    return arr
      .map((row) => {
        const o = row as Record<string, unknown>;
        const word = typeof o.word === "string" ? o.word : "";
        const meaning =
          typeof o.romaji === "string"
            ? o.romaji
            : Array.isArray(o.translations) && typeof o.translations[0] === "string"
              ? String(o.translations[0])
              : "";
        return { word, meaning };
      })
      .filter((x) => x.word.length > 0);
  } catch {
    return [];
  }
}

const BEGINNER_TASKS: Omit<MissionTask, "id" | "completed">[] = [
  {
    type: "speak",
    instruction: 'Say 「すみません」 in three different situations (out loud or in chat).',
    relatedWord: "すみません",
  },
  {
    type: "correct",
    instruction: 'Fix this casual line into natural polite Japanese: 「トイレどこ？」',
  },
  {
    type: "create_sentence",
    instruction: "Write one polite question you could use at work or school today.",
  },
];

function newTask(partial: Omit<MissionTask, "id" | "completed">): MissionTask {
  return {
    ...partial,
    id: generateRecordId("mtask"),
    completed: false,
  };
}

function generateTasks(userId: string): MissionTask[] {
  const mistakes = recordsStorage.mistakeLogs.getAllByUser(userId);
  const words = recordsStorage.savedWords.getAllByUser(userId);
  const legacy = readLegacyVocab();

  const tasks: MissionTask[] = [];

  const unreviewedMistake = mistakes.find((m) => !m.reviewed) ?? mistakes[0];
  if (unreviewedMistake) {
    tasks.push(
      newTask({
        type: "correct",
        instruction: `Fix this sentence: ${unreviewedMistake.originalText}`,
        relatedMistakeId: unreviewedMistake.id,
      }),
    );
  }

  const w = words[0] ?? null;
  const lw = legacy[0] ?? null;
  const pickWord = w?.word ?? lw?.word;
  const pickMeaning = w?.meaning ?? lw?.meaning ?? "";
  if (pickWord) {
    tasks.push(
      newTask({
        type: "recall",
        instruction: `Recall and use 「${pickWord}」${pickMeaning ? ` (${pickMeaning})` : ""} in a new sentence.`,
        relatedWord: pickWord,
      }),
    );
  }

  if (tasks.length < 3) {
    tasks.push(
      newTask({
        type: "speak",
        instruction: `Practice saying 「お疲れ様です」 and note one situation where you would use it.`,
        relatedWord: "お疲れ様です",
      }),
    );
  }

  let bi = 0;
  while (tasks.length < 3 && bi < BEGINNER_TASKS.length) {
    const b = BEGINNER_TASKS[bi++];
    if (tasks.some((t) => t.instruction === b.instruction)) continue;
    tasks.push(newTask(b));
  }

  while (tasks.length < 3) {
    tasks.push(
      newTask({
        type: "create_sentence",
        instruction: "Write one sentence about your day in polite Japanese.",
      }),
    );
  }

  return tasks.slice(0, 3);
}

export function getOrCreateDailyMission(userId: string): HabitDailyMission {
  const today = todayYmd();
  const store = readHabitJson<MissionStore>(KIND, userId, { byDate: {} });
  const existing = store.byDate[today];
  // Require exactly 3 tasks so the home UI always shows Task 1–3 reliably.
  if (existing && Array.isArray(existing.tasks) && existing.tasks.length === 3) {
    return existing;
  }

  const mission: HabitDailyMission = {
    id: existing?.id ?? generateRecordId("dmission"),
    userId,
    date: today,
    tasks: generateTasks(userId),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };
  store.byDate[today] = mission;
  writeHabitJson(KIND, userId, store);
  return mission;
}

export function saveDailyMission(userId: string, mission: HabitDailyMission): void {
  const store = readHabitJson<MissionStore>(KIND, userId, { byDate: {} });
  store.byDate[mission.date] = mission;
  writeHabitJson(KIND, userId, store);
}

export function completeMissionTask(
  userId: string,
  missionDate: string,
  taskId: string,
): HabitDailyMission | null {
  const store = readHabitJson<MissionStore>(KIND, userId, { byDate: {} });
  const m = store.byDate[missionDate];
  if (!m) return null;
  const tasks = m.tasks.map((t) => (t.id === taskId ? { ...t, completed: true } : t));
  const next = { ...m, tasks };
  store.byDate[missionDate] = next;
  writeHabitJson(KIND, userId, store);
  return next;
}

/** Auto-complete a speak/recall task if user message mentions relatedWord */
export function tryCompleteMissionFromChat(
  userId: string,
  mission: HabitDailyMission,
  userMessage: string,
): HabitDailyMission {
  const lower = userMessage.toLowerCase();
  let next = mission;
  for (const t of mission.tasks) {
    if (t.completed) continue;
    if (t.type !== "speak" && t.type !== "recall") continue;
    const rw = t.relatedWord?.trim();
    if (!rw) continue;
    if (lower.includes(rw.toLowerCase())) {
      const updated = completeMissionTask(userId, mission.date, t.id);
      if (updated) next = updated;
    }
  }
  return next;
}

export function isMissionFullyComplete(mission: HabitDailyMission): boolean {
  return mission.tasks.length > 0 && mission.tasks.every((t) => t.completed);
}
