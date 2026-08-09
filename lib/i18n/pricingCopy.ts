import type { Lang } from "@/src/utils/i18n/types";

export type PricingPlan = {
  name: string;
  price: string;
  period: string;
  tag: string | null;
  highlight: boolean;
  bullets: string[];
  href: string | null;
  external?: boolean;
};

export type PricingCopy = {
  title: string;
  subtitle: string;
  lessonNote: string;
  appSection: string;
  lessonSection: string;
  courseSection: string;
  courseNote: string;
  ctaApp: string;
  ctaLesson: string;
  ctaCourse: string;
  back: string;
  plans: {
    free: PricingPlan;
    pro: PricingPlan;
    standard: PricingPlan;
    intensive: PricingPlan;
    course: PricingPlan;
  };
};

const COPY: Record<Lang, PricingCopy> = {
  en: {
    title: "Pricing",
    subtitle: "App, live lessons, and the self-paced video course.",
    lessonNote: "Lesson members get Pro included — no extra $12.99.",
    appSection: "App",
    lessonSection: "Live lessons",
    courseSection: "Video course",
    courseNote: "Bought the course? Open the AI start guide after Gumroad.",
    ctaApp: "Open app",
    ctaLesson: "Book free trial",
    ctaCourse: "See course plans",
    back: "Back to app",
    plans: {
      free: {
        name: "Free",
        price: "$0",
        period: "App basics",
        tag: null,
        highlight: false,
        bullets: ["Limited AI chat", "Scene-based practice", "Daily missions"],
        href: "/try",
      },
      pro: {
        name: "Pro",
        price: "$12.99",
        period: "per month · app only",
        tag: null,
        highlight: true,
        bullets: ["Full AI coach", "Unlimited chat & saves", "Cloud sync"],
        href: "/app",
      },
      standard: {
        name: "Standard",
        price: "$79",
        period: "per month · 50 min × 4",
        tag: "Pro app included",
        highlight: false,
        bullets: ["4 lessons / month", "1-on-1 on Google Meet", "Phrases & role-play"],
        href: "https://frensei.jp/trial/",
        external: true,
      },
      intensive: {
        name: "Intensive",
        price: "$139",
        period: "per month · 50 min × 8",
        tag: "Pro app included",
        highlight: false,
        bullets: ["8 lessons / month", "2× per week pace", "Priority scheduling"],
        href: "https://frensei.jp/trial/",
        external: true,
      },
      course: {
        name: "From Textbook to Tokyo",
        price: "From $0",
        period: "one-time on Gumroad · Free / $49 / $99",
        tag: "TikTok course",
        highlight: true,
        bullets: [
          "4-week video path",
          "Frensei AI practice included (Core/VIP)",
          "Buy on frensei.jp",
        ],
        href: "https://frensei.jp/?utm_source=app&utm_medium=pricing&utm_campaign=home",
        external: true,
      },
    },
  },
  ja: {
    title: "料金",
    subtitle: "アプリ・ライブレッスン・動画講座。",
    lessonNote: "Standard / Intensive には Pro アプリが含まれます（+$12.99 不要）。",
    appSection: "アプリ",
    lessonSection: "ライブレッスン",
    courseSection: "動画講座",
    courseNote: "講座購入後は AI スタートガイドへ。",
    ctaApp: "アプリを開く",
    ctaLesson: "無料体験を予約",
    ctaCourse: "講座プランを見る",
    back: "アプリに戻る",
    plans: {
      free: {
        name: "Free",
        price: "$0",
        period: "基本機能",
        tag: null,
        highlight: false,
        bullets: ["AIチャット（制限あり）", "シーン別練習", "デイリーミッション"],
        href: "/try",
      },
      pro: {
        name: "Pro",
        price: "$12.99",
        period: "月額 · アプリのみ",
        tag: null,
        highlight: true,
        bullets: ["AIコーチフル機能", "チャット・保存無制限", "クラウド同期"],
        href: "/app",
      },
      standard: {
        name: "Standard",
        price: "$79",
        period: "月額 · 50分 × 4",
        tag: "Pro 込み",
        highlight: false,
        bullets: ["月4回レッスン", "Google Meet マンツーマン", "フレーズ・ロールプレイ"],
        href: "https://frensei.jp/trial/",
        external: true,
      },
      intensive: {
        name: "Intensive",
        price: "$139",
        period: "月額 · 50分 × 8",
        tag: "Pro 込み",
        highlight: false,
        bullets: ["月8回レッスン", "週2回ペース", "優先予約"],
        href: "https://frensei.jp/trial/",
        external: true,
      },
      course: {
        name: "From Textbook to Tokyo",
        price: "$0〜",
        period: "Gumroad 買い切り · Free / $49 / $99",
        tag: "動画講座",
        highlight: true,
        bullets: ["4週の動画カリキュラム", "Frensei AI 練習付き（Core/VIP）", "frensei.jp で確認"],
        href: "https://frensei.jp/?utm_source=app&utm_medium=pricing&utm_campaign=home",
        external: true,
      },
    },
  },
  ko: {
    title: "요금제",
    subtitle: "앱, 라이브 레슨, 영상 코스.",
    lessonNote: "Standard / Intensive 에는 Pro 앱이 포함됩니다.",
    appSection: "앱",
    lessonSection: "라이브 레슨",
    courseSection: "영상 코스",
    courseNote: "코스 구매 후 AI 시작 가이드로 이동하세요.",
    ctaApp: "앱 열기",
    ctaLesson: "무료 체험 예약",
    ctaCourse: "코스 요금 보기",
    back: "앱으로 돌아가기",
    plans: {
      free: {
        name: "Free",
        price: "$0",
        period: "기본 기능",
        tag: null,
        highlight: false,
        bullets: ["제한된 AI 채팅", "상황별 연습", "데일리 미션"],
        href: "/try",
      },
      pro: {
        name: "Pro",
        price: "$12.99",
        period: "월 · 앱만",
        tag: null,
        highlight: true,
        bullets: ["전체 AI 코치", "무제한 채팅·저장", "클라우드 동기화"],
        href: "/app",
      },
      standard: {
        name: "Standard",
        price: "$79",
        period: "월 · 50분 × 4",
        tag: "Pro 포함",
        highlight: false,
        bullets: ["월 4회 레슨", "Google Meet 1:1", "표현·롤플레이"],
        href: "https://frensei.jp/trial/",
        external: true,
      },
      intensive: {
        name: "Intensive",
        price: "$139",
        period: "월 · 50분 × 8",
        tag: "Pro 포함",
        highlight: false,
        bullets: ["월 8회 레슨", "주 2회 페이스", "우선 예약"],
        href: "https://frensei.jp/trial/",
        external: true,
      },
      course: {
        name: "From Textbook to Tokyo",
        price: "$0~",
        period: "Gumroad 일회 · Free / $49 / $99",
        tag: "영상 코스",
        highlight: true,
        bullets: ["4주 영상 커리큘럼", "Frensei AI 연습 (Core/VIP)", "frensei.jp 에서 확인"],
        href: "https://frensei.jp/?utm_source=app&utm_medium=pricing&utm_campaign=home",
        external: true,
      },
    },
  },
  zh: {
    title: "定价",
    subtitle: "应用、直播课与视频课程。",
    lessonNote: "Standard / Intensive 已包含 Pro 应用，无需另付 $12.99。",
    appSection: "应用",
    lessonSection: "直播课",
    courseSection: "视频课程",
    courseNote: "购买课程后请打开 AI 上手指南。",
    ctaApp: "打开应用",
    ctaLesson: "预约免费体验",
    ctaCourse: "查看课程方案",
    back: "返回应用",
    plans: {
      free: {
        name: "Free",
        price: "$0",
        period: "基础功能",
        tag: null,
        highlight: false,
        bullets: ["有限 AI 聊天", "场景练习", "每日任务"],
        href: "/try",
      },
      pro: {
        name: "Pro",
        price: "$12.99",
        period: "每月 · 仅应用",
        tag: null,
        highlight: true,
        bullets: ["完整 AI 教练", "无限聊天与保存", "云同步"],
        href: "/app",
      },
      standard: {
        name: "Standard",
        price: "$79",
        period: "每月 · 50分钟 × 4",
        tag: "含 Pro",
        highlight: false,
        bullets: ["每月 4 次课", "Google Meet 一对一", "表达与角色扮演"],
        href: "https://frensei.jp/trial/",
        external: true,
      },
      intensive: {
        name: "Intensive",
        price: "$139",
        period: "每月 · 50分钟 × 8",
        tag: "含 Pro",
        highlight: false,
        bullets: ["每月 8 次课", "每周 2 次节奏", "优先预约"],
        href: "https://frensei.jp/trial/",
        external: true,
      },
      course: {
        name: "From Textbook to Tokyo",
        price: "从 $0",
        period: "Gumroad 一次性 · Free / $49 / $99",
        tag: "视频课",
        highlight: true,
        bullets: ["四周视频路径", "含 Frensei AI 练习（Core/VIP）", "在 frensei.jp 查看"],
        href: "https://frensei.jp/?utm_source=app&utm_medium=pricing&utm_campaign=home",
        external: true,
      },
    },
  },
};

export function getPricingCopy(lang: Lang): PricingCopy {
  return COPY[lang] ?? COPY.en;
}
