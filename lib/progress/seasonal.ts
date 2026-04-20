export type Season = "spring" | "summer" | "autumn" | "winter";

export type SeasonStage = 0 | 1 | 2 | 3 | 4;

export type SeasonalUiLang = "en" | "ja" | "ko" | "zh";

export interface SeasonalProgressState {
  season: Season;
  stage: SeasonStage;
  progressRatio: number;
  streakCount: number;
  activityCount: number;
  /** Soft gradient tokens for the card shell */
  visualTheme: string;
  /** Short emotional headline (emoji ok) */
  momentLine: string;
  /** One gentle sentence — growth as story, not stats */
  storyLine: string;
  /** Nudge to continue */
  encouragementLine: string;
  /** Home row: one line, no numbers */
  homePreviewLine: string;
}

function seasonByMonth(month1to12: number): Season {
  if (month1to12 >= 3 && month1to12 <= 5) return "spring";
  if (month1to12 >= 6 && month1to12 <= 8) return "summer";
  if (month1to12 >= 9 && month1to12 <= 11) return "autumn";
  return "winter";
}

/** Mar–May spring, Jun–Aug summer, Sep–Nov autumn, Dec–Feb winter */
export function getCalendarSeason(now: Date = new Date()): Season {
  return seasonByMonth(now.getMonth() + 1);
}

const VISUAL_THEME: Record<Season, string> = {
  spring: "from-pink-200/35 via-rose-100/20 to-slate-900/95",
  summer: "from-emerald-200/30 via-teal-100/15 to-slate-900/95",
  autumn: "from-amber-200/35 via-orange-100/20 to-slate-900/95",
  winter: "from-sky-200/25 via-indigo-100/12 to-slate-900/95",
};

/** Stage copy: spring = branch→sakura; autumn = green→red; summer/winter = own arcs */
const COPY: Record<
  Season,
  Record<
    SeasonStage,
    Record<
      SeasonalUiLang,
      { moment: string; story: string; cheer: string; home: string }
    >
  >
> = {
  spring: {
    0: {
      en: {
        moment: "A quiet branch 🌿",
        story: "Your learning tree is resting, ready for the next gentle step.",
        cheer: "Open the app again — even a tiny visit counts.",
        home: "Your tree is waiting 🌿",
      },
      ja: {
        moment: "静かな枝",
        story: "学びの木は、次の一歩を待っています。",
        cheer: "また開いてみて。短い時間でも十分です。",
        home: "木が待っています 🌿",
      },
      ko: {
        moment: "고요한 가지 🌿",
        story: "다음 작은 걸음을 기다리는 나무 같아요.",
        cheer: "잠깐이라도 열어보면 돼요.",
        home: "나무가 자라나요 🌿",
      },
      zh: {
        moment: "安静的树枝 🌿",
        story: "你的学习之树在休息，等待下一次轻轻迈步。",
        cheer: "再打开看看——片刻也好。",
        home: "小树在生长 🌿",
      },
    },
    1: {
      en: {
        moment: "A bud has appeared 🌱",
        story: "Something small is answering your effort.",
        cheer: "Keep going to see it bloom.",
        home: "Your tree is growing 🌸",
      },
      ja: {
        moment: "つぼみがふくらんだ 🌱",
        story: "小さな変化が、努力に応えはじめています。",
        cheer: "続けてみて。花開くまでそばにいます。",
        home: "木が育っています 🌸",
      },
      ko: {
        moment: "새싹이 보여요 🌱",
        story: "작은 변화가 노력에 답하고 있어요.",
        cheer: "계속하면 꽃이 필 거예요.",
        home: "나무가 자라요 🌸",
      },
      zh: {
        moment: "冒出了新芽 🌱",
        story: "小小的变化正在回应你的努力。",
        cheer: "坚持下去，看它开花。",
        home: "小树在长大 🌸",
      },
    },
    2: {
      en: {
        moment: "Green hope 🍃",
        story: "The bud tightens with color — habits are taking root.",
        cheer: "A little every day paints the branch.",
        home: "Leaves are unfurling 🍃",
      },
      ja: {
        moment: "若葉の気配 🍃",
        story: "色づいたつぼみ。習慣が根をはりはじめています。",
        cheer: "毎日のひと筆が、枝を彩ります。",
        home: "葉がひらき始めました 🍃",
      },
      ko: {
        moment: "연한 잎의 기운 🍃",
        story: "습관이 뿌리내리기 시작했어요.",
        cheer: "매일 조금씩이 가지를 물들여요.",
        home: "잎이 펴져 가요 🍃",
      },
      zh: {
        moment: "新绿的气息 🍃",
        story: "习惯正在悄悄扎根。",
        cheer: "每天一点点，就会染绿枝头。",
        home: "叶子在舒展 🍃",
      },
    },
    3: {
      en: {
        moment: "First petals 🌸",
        story: "Your phrasing is starting to open like cherry blossoms.",
        cheer: "Stay close — fullness is near.",
        home: "Blossoms opening 🌸",
      },
      ja: {
        moment: "花びらがひらく 🌸",
        story: "言い回しが、桜のようにほどけはじめています。",
        cheer: "もうすぐ満開。そばにいてください。",
        home: "花が開きかけています 🌸",
      },
      ko: {
        moment: "첫 꽃잎 🌸",
        story: "표현이 벚꽃처럼 조금씩 피어나요.",
        cheer: "곧 만개에 가까워져요.",
        home: "꽃이 피어가요 🌸",
      },
      zh: {
        moment: "初绽的花瓣 🌸",
        story: "你的表达像樱花一样开始舒展。",
        cheer: "再靠近一点，满开不远了。",
        home: "花苞在绽放 🌸",
      },
    },
    4: {
      en: {
        moment: "Full sakura ✨",
        story: "This season’s care shows — your Japanese is in bloom.",
        cheer: "Rest when you need; the roots remember.",
        home: "In full bloom ✨",
      },
      ja: {
        moment: "満開のさくら ✨",
        story: "この季節の手入れが、あなたの日本語を花開かせました。",
        cheer: "休んでも大丈夫。根は覚えています。",
        home: "満開です ✨",
      },
      ko: {
        moment: "만개한 벚꽃 ✨",
        story: "이번 시즌의 돌봄이 일본어를 피워냈어요.",
        cheer: "쉬어도 괜찮아요. 뿌리는 기억해요.",
        home: "만개했어요 ✨",
      },
      zh: {
        moment: "樱花满开 ✨",
        story: "这一季的用心，让你的日语盛开了。",
        cheer: "累了就休息，根系都记得。",
        home: "满开中 ✨",
      },
    },
  },
  summer: {
    0: {
      en: {
        moment: "Morning shade 🌤️",
        story: "Summer learning starts in small cool moments.",
        cheer: "Dip in when you can.",
        home: "Your canopy is growing 🌿",
      },
      ja: {
        moment: "朝の木陰 🌤️",
        story: "夏の学びは、涼しいひとときから。",
        cheer: "できるときに、そっと寄り添って。",
        home: "木陰が広がっています 🌿",
      },
      ko: { moment: "아침 그늘 🌤️", story: "여름 학습은 시원한 순간부터.", cheer: "될 때 잠깐이라도.", home: "나무가 자라요 🌿" },
      zh: { moment: "清晨树荫 🌤️", story: "夏日的学习从清凉片刻开始。", cheer: "有空就来一会儿。", home: "树荫在生长 🌿" },
    },
    1: {
      en: {
        moment: "Leaves stretch 🌿",
        story: "Energy returns to your routine.",
        cheer: "Let today add one more layer of green.",
        home: "Leaves unfurling 🌿",
      },
      ja: {
        moment: "葉がのびる 🌿",
        story: "ルーティンに、再び力が戻ってきました。",
        cheer: "今日の一層が、緑を増やします。",
        home: "葉がひらいています 🌿",
      },
      ko: { moment: "잎이 뻗어요 🌿", story: "루틴에 다시 힘이 돌아와요.", cheer: "오늘 한 겹 더.", home: "잎이 펴져요 🌿" },
      zh: { moment: "叶子舒展 🌿", story: "节奏里又有了力气。", cheer: "今天再叠一层绿。", home: "叶子在展开 🌿" },
    },
    2: {
      en: {
        moment: "Deep green 🌳",
        story: "Practice stacks like overlapping leaves.",
        cheer: "Thickness is strength.",
        home: "Canopy thickening 🌳",
      },
      ja: {
        moment: "濃い緑 🌳",
        story: "練習が、重なる葉のように積み重なっています。",
        cheer: "厚みが、強さになります。",
        home: "木冠がふくらんでいます 🌳",
      },
      ko: { moment: "짙은 초록 🌳", story: "연습이 잎처럼 겹쳐져요.", cheer: "두꺼워질수록 단단해요.", home: "수관이 무거워져요 🌳" },
      zh: { moment: "深绿 🌳", story: "练习像叶子一层层叠起。", cheer: "厚实就是力量。", home: "树冠在变厚 🌳" },
    },
    3: {
      en: {
        moment: "Bright canopy ☀️",
        story: "You’re catching the rhythm of real use.",
        cheer: "The warm days belong to you.",
        home: "Sun through the leaves ☀️",
      },
      ja: {
        moment: "光る木冠 ☀️",
        story: "実際の使い方のリズムが、つかめてきました。",
        cheer: "あたたかい日々は、あなたのもの。",
        home: "葉すきまの光 ☀️",
      },
      ko: { moment: "빛나는 수관 ☀️", story: "실사용 리듬이 잡혀가요.", cheer: "따뜻한 날은 당신 차지.", home: "잎 사이 햇살 ☀️" },
      zh: { moment: "明亮的树冠 ☀️", story: "真实使用的节奏正在上手。", cheer: "晴朗的日子属于你。", home: "叶间阳光 ☀️" },
    },
    4: {
      en: {
        moment: "Summer full height 🎐",
        story: "Your tree holds the season’s heat as skill.",
        cheer: "Celebrate the shade you grew.",
        home: "Peak summer growth 🎐",
      },
      ja: {
        moment: "夏の盛り 🎐",
        story: "この季節の熱を、実力として抱えています。",
        cheer: "育てた木陰を、味わってください。",
        home: "夏の成長 🎐",
      },
      ko: { moment: "한여름 🎐", story: "열기가 실력이 되었어요.", cheer: "키운 그늘을 즐겨요.", home: "여름의 성장 🎐" },
      zh: { moment: "盛夏 🎐", story: "暑气化作了实力。", cheer: "享受你种下的阴凉。", home: "夏日生长 🎐" },
    },
  },
  autumn: {
    0: {
      en: {
        moment: "Still green 🍃",
        story: "Autumn begins quietly — change is underground first.",
        cheer: "Steady days tint the leaves.",
        home: "Leaves still green 🍃",
      },
      ja: {
        moment: "まだ緑 🍃",
        story: "秋は静かに始まります。変化は土の下から。",
        cheer: "穏やかな日々が、葉を染めます。",
        home: "まだ青葉 🍃",
      },
      ko: { moment: "아직 초록 🍃", story: "가을은 조용히 시작돼요.", cheer: "차분한 하루가 잎을 물들여요.", home: "아직 푸른 잎 🍃" },
      zh: { moment: "仍是绿色 🍃", story: "秋天悄悄开始，变化先在土里。", cheer: "平稳的日子会染叶。", home: "叶子还绿 🍃" },
    },
    1: {
      en: {
        moment: "Turning gold 🟡",
        story: "Yellow lines appear — review and chat leave traces.",
        cheer: "Warmth without rush.",
        home: "Turning yellow 🟡",
      },
      ja: {
        moment: "黄へ 🟡",
        story: "黄の線が入りました。復習と会話のあとが残っています。",
        cheer: "急がず、あたたかく。",
        home: "黄ばみはじめ 🟡",
      },
      ko: { moment: "노랑으로 🟡", story: "복습과 대화의 흔적이에요.", cheer: "서두르지 말고 따뜻하게.", home: "노랗게 물들어요 🟡" },
      zh: { moment: "转向金黄 🟡", story: "复习和对话留下了痕迹。", cheer: "不急，慢慢暖起来。", home: "开始泛黄 🟡" },
    },
    2: {
      en: {
        moment: "Warm orange 🟠",
        story: "Mistakes corrected become autumn glow.",
        cheer: "Each pass deepens the color.",
        home: "Warm orange 🟠",
      },
      ja: {
        moment: "橙 🟠",
        story: "直した間違いが、秋の光になります。",
        cheer: "繰り返すほど、色が深まります。",
        home: "橙色に 🟠",
      },
      ko: { moment: "따뜻한 주황 🟠", story: "고친 실수가 가을빛이에요.", cheer: "한 번 더할수록 짙어져요.", home: "주황빛 🟠" },
      zh: { moment: "暖橙 🟠", story: "改过的错变成了秋光。", cheer: "每多一遍，颜色更深。", home: "暖橙色 🟠" },
    },
    3: {
      en: {
        moment: "Deep amber 🔶",
        story: "Expression choices feel more intentional now.",
        cheer: "You’re walking the red ridge.",
        home: "Deepening red 🔶",
      },
      ja: {
        moment: "深い琥珀 🔶",
        story: "表現の選び方に、意図が宿ってきました。",
        cheer: "赤い尾根を、歩いています。",
        home: "紅が深まる 🔶",
      },
      ko: { moment: "짙은 호박색 🔶", story: "표현 선택에 의도가 생겼어요.", cheer: "붉은 능선을 걷는 중.", home: "붉어져 가요 🔶" },
      zh: { moment: "深琥珀 🔶", story: "选词用语更有心意了。", cheer: "你正走在泛红山脊。", home: "红意渐深 🔶" },
    },
    4: {
      en: {
        moment: "Crimson crown 🔴",
        story: "The season’s work shows in rich, confident tone.",
        cheer: "Let the view stay with you into winter.",
        home: "Crimson peak 🔴",
      },
      ja: {
        moment: "深紅の冠 🔴",
        story: "この季節の積み重ねが、豊かなトーンになりました。",
        cheer: "この景色を、冬まで抱いて。",
        home: "真っ赤に染まる 🔴",
      },
      ko: { moment: "진홍빛 왕관 🔴", story: "이번 시즌이 풍성한 말투가 됐어요.", cheer: "겨울까지 이 풍경을.", home: "붉은 절정 🔴" },
      zh: { moment: "深红冠冕 🔴", story: "这一季的积累化作饱满的语感。", cheer: "把这片景色带进冬天。", home: "红遍枝头 🔴" },
    },
  },
  winter: {
    0: {
      en: {
        moment: "Quiet night ❄️",
        story: "Winter is for consolidation, not pause.",
        cheer: "Small returns still warm the roots.",
        home: "Quiet winter tree ❄️",
      },
      ja: {
        moment: "静かな夜 ❄️",
        story: "冬は休みではなく、定着の季節。",
        cheer: "小さな復帰も、根をあたためます。",
        home: "冬の木 ❄️",
      },
      ko: { moment: "고요한 밤 ❄️", story: "겨울은 멈춤이 아니라 다지기.", cheer: "작은 복귀도 뿌리를 덥혀요.", home: "겨울 나무 ❄️" },
      zh: { moment: "静夜 ❄️", story: "冬天是沉淀，不是停步。", cheer: "小小的回归也能暖根。", home: "冬日之树 ❄️" },
    },
    1: {
      en: {
        moment: "First tracks 👣",
        story: "Each visit leaves a soft print in the snow.",
        cheer: "Rhythm over speed.",
        home: "Footprints in snow 👣",
      },
      ja: {
        moment: "最初の足あと 👣",
        story: "たずねるたび、雪にやさしい跡が残ります。",
        cheer: "速さより、リズムを。",
        home: "雪の足あと 👣",
      },
      ko: { moment: "첫 발자국 👣", story: "방문할 때마다 눈 위 흔적.", cheer: "속도보다 리듬.", home: "눈 위 발자국 👣" },
      zh: { moment: "第一串脚印 👣", story: "每次来都在雪上留下轻轻的印。", cheer: "节奏比速度重要。", home: "雪中足迹 👣" },
    },
    2: {
      en: {
        moment: "Lantern glow 🏮",
        story: "Habit keeps a light on when days are short.",
        cheer: "You’re still here — that matters.",
        home: "A warm light 🏮",
      },
      ja: {
        moment: "灯り 🏮",
        story: "日が短い日も、習慣が灯をともします。",
        cheer: "まだここにいる。それが大切。",
        home: "あたたかい灯 🏮",
      },
      ko: { moment: "등불 🏮", story: "짧은 낮에도 습관이 불을 켜요.", cheer: "여전히 여기 있다는 것.", home: "따뜻한 불빛 🏮" },
      zh: { moment: "灯火 🏮", story: "白昼短时，习惯会点灯。", cheer: "你还在，这就足够。", home: "一盏暖光 🏮" },
    },
    3: {
      en: {
        moment: "Steady frost ✨",
        story: "Clarity grows when the noise thins.",
        cheer: "Ice can be beautiful too.",
        home: "Steady and clear ✨",
      },
      ja: {
        moment: "澄んだ霜 ✨",
        story: "雑音が薄れると、透明感が増していきます。",
        cheer: "氷も、美しい。",
        home: "澄んでいます ✨",
      },
      ko: { moment: "맑은 서리 ✨", story: "소음이 줄면 맑아져요.", cheer: "얼음도 아름다워요.", home: "맑고 단단 ✨" },
      zh: { moment: "清霜 ✨", story: "杂音淡去时，更清晰。", cheer: "冰也可以很美。", home: "清澈坚定 ✨" },
    },
    4: {
      en: {
        moment: "Winter complete 🌟",
        story: "You carried the year; spring will find you stronger.",
        cheer: "Rest is part of the journey.",
        home: "Winter glow 🌟",
      },
      ja: {
        moment: "冬の完成 🌟",
        story: "一年を抱えてきました。春は、もっと強いあなたを迎えます。",
        cheer: "休むことも、旅の一部。",
        home: "冬の光 🌟",
      },
      ko: { moment: "겨울의 완성 🌟", story: "한 해를 안고 왔어요. 봄이 더 단단한 당신을.", cheer: "쉼도 여정의 일부.", home: "겨울의 빛 🌟" },
      zh: { moment: "冬日圆满 🌟", story: "你扛过了一年，春天会遇见更强的你。", cheer: "休息也是旅程。", home: "冬之光 🌟" },
    },
  },
};

function pickLang(lang: SeasonalUiLang): SeasonalUiLang {
  if (lang === "ja" || lang === "ko" || lang === "zh") return lang;
  return "en";
}

export function buildSeasonalProgressState(params: {
  now?: Date;
  streak: number;
  activityCount: number;
  missionDoneCount: number;
  reviewDoneCount: number;
  chatCount: number;
  topicCount: number;
  uiLang?: SeasonalUiLang;
}): SeasonalProgressState {
  const now = params.now ?? new Date();
  const season = getCalendarSeason(now);
  const L = pickLang(params.uiLang ?? "en");

  const weighted =
    Math.min(params.streak, 10) * 2 +
    Math.min(params.activityCount, 7) * 2 +
    Math.min(params.missionDoneCount, 20) +
    Math.min(params.reviewDoneCount, 30) +
    Math.min(params.chatCount, 60) * 0.2 +
    Math.min(params.topicCount, 30) * 0.8;
  const progressRatio = Math.max(0, Math.min(1, weighted / 60));
  const stage = Math.min(4, Math.floor(progressRatio * 5)) as SeasonStage;

  const block = COPY[season][stage][L];
  return {
    season,
    stage,
    progressRatio,
    streakCount: params.streak,
    activityCount: params.activityCount,
    visualTheme: VISUAL_THEME[season],
    momentLine: block.moment,
    storyLine: block.story,
    encouragementLine: block.cheer,
    homePreviewLine: block.home,
  };
}
