import type { RetentionDailyMission } from "@/lib/mission/retentionDaily";
import type { Lang } from "@/src/utils/i18n/types";

type Localized = { title: string; instruction: string };

const TITLE: Record<string, Record<Lang, string>> = {
  "At a restaurant": {
    en: "At a restaurant",
    ja: "レストランで",
    ko: "레스토랑에서",
    zh: "在餐厅",
  },
  "At a café": {
    en: "At a café",
    ja: "カフェで",
    ko: "카페에서",
    zh: "在咖啡馆",
  },
  "At a convenience store": {
    en: "At a convenience store",
    ja: "コンビニで",
    ko: "편의점에서",
    zh: "在便利店",
  },
  "Asking directions": {
    en: "Asking directions",
    ja: "道を聞く",
    ko: "길 묻기",
    zh: "问路",
  },
  "Late for a meeting": {
    en: "Late for a meeting",
    ja: "会議に遅刻",
    ko: "회의 지각",
    zh: "会议迟到",
  },
  "Apologizing at work": {
    en: "Apologizing at work",
    ja: "仕事でのお詫び",
    ko: "직장에서 사과",
    zh: "工作中的道歉",
  },
  "Small talk": {
    en: "Small talk",
    ja: "ちょっとした会話",
    ko: "가벼운 대화",
    zh: "闲聊",
  },
  "At work": {
    en: "At work",
    ja: "仕事で",
    ko: "직장에서",
    zh: "在工作中",
  },
  "Casual conversation": {
    en: "Casual conversation",
    ja: "カジュアルな会話",
    ko: "캐주얼 대화",
    zh: "日常对话",
  },
  Travel: {
    en: "Travel",
    ja: "旅行",
    ko: "여행",
    zh: "旅行",
  },
  "Ordering / buying": {
    en: "Ordering / buying",
    ja: "注文・買い物",
    ko: "주문·쇼핑",
    zh: "点餐·购物",
  },
  "Asking for help": {
    en: "Asking for help",
    ja: "助けを求める",
    ko: "도움 요청",
    zh: "请求帮助",
  },
};

const INSTRUCTION: Record<string, Record<Lang, string>> = {
  "Order your meal naturally in Japanese.": {
    en: "Order your meal naturally in Japanese.",
    ja: "自然な日本語で食事を注文しましょう。",
    ko: "자연스러운 일본어로 식사를 주문해 보세요.",
    zh: "用自然的日语点餐。",
  },
  "Ask for water with your meal.": {
    en: "Ask for water with your meal.",
    ja: "食事と一緒に水をお願いしましょう。",
    ko: "식사와 함께 물을 요청해 보세요.",
    zh: "用餐时请一杯水。",
  },
  "Ask for the check politely after a casual dinner.": {
    en: "Ask for the check politely after a casual dinner.",
    ja: "カジュアルな食事のあと、丁寧にお会計をお願いしましょう。",
    ko: "가벼운 식사 후 정중하게 계산을 요청해 보세요.",
    zh: "轻松用餐后礼貌地结账。",
  },
  "Say you're allergic to nuts when ordering.": {
    en: "Say you're allergic to nuts when ordering.",
    ja: "注文時にナッツアレルギーがあると伝えましょう。",
    ko: "주문할 때 견과류 알레르기가 있다고 말해 보세요.",
    zh: "点餐时说明对坚果过敏。",
  },
  "Decline the drink politely but warmly (business dinner).": {
    en: "Decline the drink politely but warmly (business dinner).",
    ja: "ビジネス会食で、丁寧かつ温かくお酒を断りましょう。",
    ko: "비즈니스 식사에서 정중하고 따뜻하게 술을 거절해 보세요.",
    zh: "商务晚宴中礼貌而温和地拒绝饮酒。",
  },
  "Say you don’t need a bag politely.": {
    en: "Say you don’t need a bag politely.",
    ja: "丁寧にレジ袋は不要と伝えましょう。",
    ko: "정중하게 봉투는 필요 없다고 말해 보세요.",
    zh: "礼貌地表示不需要袋子。",
  },
  "Ask to heat your bento.": {
    en: "Ask to heat your bento.",
    ja: "お弁当を温めてもらいましょう。",
    ko: "도시락을 데워 달라고 요청해 보세요.",
    zh: "请店员加热便当。",
  },
  "Ask if they have a different size of the same drink.": {
    en: "Ask if they have a different size of the same drink.",
    ja: "同じ飲み物の別サイズがあるか聞きましょう。",
    ko: "같은 음료의 다른 사이즈가 있는지 물어 보세요.",
    zh: "询问同款饮料是否有其他容量。",
  },
  "Ask them to print a receipt for company expenses, briefly.": {
    en: "Ask them to print a receipt for company expenses, briefly.",
    ja: "経費精算用のレシートを簡潔にお願いしましょう。",
    ko: "회사 경비용 영수증을 간단히 요청해 보세요.",
    zh: "简短地请对方打印报销收据。",
  },
  "Ask where the station is in simple Japanese.": {
    en: "Ask where the station is in simple Japanese.",
    ja: "駅の場所をシンプルな日本語で聞きましょう。",
    ko: "역이 어디인지 간단한 일본어로 물어 보세요.",
    zh: "用简单的日语问车站在哪里。",
  },
  "Ask which exit is best for a landmark.": {
    en: "Ask which exit is best for a landmark.",
    ja: "目的地に一番近い出口を聞きましょう。",
    ko: "목적지에 가장 좋은 출구가 어디인지 물어 보세요.",
    zh: "询问去某地最合适的出口。",
  },
  "Ask politely if you're already late and sound natural.": {
    en: "Ask politely if you're already late and sound natural.",
    ja: "遅れているとき、自然で丁寧に道を聞きましょう。",
    ko: "이미 늦었을 때 자연스럽고 정중하게 물어 보세요.",
    zh: "已经迟到时，自然礼貌地问路。",
  },
  "Apologize for being late naturally.": {
    en: "Apologize for being late naturally.",
    ja: "遅刻のお詫びを自然に言いましょう。",
    ko: "지각 사과를 자연스럽게 해 보세요.",
    zh: "自然地道歉迟到。",
  },
  "Apologize briefly and show you'll catch up.": {
    en: "Apologize briefly and show you'll catch up.",
    ja: "簡潔にお詫びし、すぐ取り掛かることを伝えましょう。",
    ko: "짧게 사과하고 바로 따라잡겠다고 말해 보세요.",
    zh: "简短道歉并表示会马上跟上。",
  },
  "Give a short, sincere apology for a small mistake (email tone).": {
    en: "Give a short, sincere apology for a small mistake (email tone).",
    ja: "小さなミスの短く誠実なお詫び（メール調）を書きましょう。",
    ko: "작은 실수에 대한 짧고 진심 어린 사과(이메일 톤)를 해 보세요.",
    zh: "为一个小错误写简短真诚的道歉（邮件语气）。",
  },
  "React to nice weather in a friendly way.": {
    en: "React to nice weather in a friendly way.",
    ja: "いい天気にフレンドリーに反応しましょう。",
    ko: "좋은 날씨에 친근하게 반응해 보세요.",
    zh: "友好地回应好天气。",
  },
  "Ask if someone had a good weekend (neutral-polite).": {
    en: "Ask if someone had a good weekend (neutral-polite).",
    ja: "週末はどうでしたか、と中立的に丁寧に聞きましょう。",
    ko: "주말 잘 보냈는지 중립적으로 정중하게 물어 보세요.",
    zh: "中立礼貌地问对方周末过得如何。",
  },
  "Open a light chat after a long work week (natural, not stiff).": {
    en: "Open a light chat after a long work week (natural, not stiff).",
    ja: "忙しい一週間のあと、自然に軽い会話を始めましょう。",
    ko: "바쁜 한 주 뒤 자연스럽게 가벼운 대화를 시작해 보세요.",
    zh: "忙碌一周后自然地开启轻松聊天。",
  },
  "Ask a coworker for a quick favor politely.": {
    en: "Ask a coworker for a quick favor politely.",
    ja: "同僚にさっとお願いを丁寧にしましょう。",
    ko: "동료에게 짧은 부탁을 정중하게 해 보세요.",
    zh: "礼貌地向同事提出小请求。",
  },
  "Ask to reschedule a short meeting.": {
    en: "Ask to reschedule a short meeting.",
    ja: "短い会議の日程変更をお願いしましょう。",
    ko: "짧은 회의 일정 변경을 요청해 보세요.",
    zh: "请求改期一个短会。",
  },
  "Push back gently on an unrealistic deadline.": {
    en: "Push back gently on an unrealistic deadline.",
    ja: "無理な締切にやんわり伝えましょう。",
    ko: "비현실적인 마감에 부드럽게 의견을 내 보세요.",
    zh: "温和地对不现实的截止日期提出意见。",
  },
  "Invite a friend to get coffee simply.": {
    en: "Invite a friend to get coffee simply.",
    ja: "友だちをシンプルにコーヒーに誘いましょう。",
    ko: "친구를 간단히 커피에 초대해 보세요.",
    zh: "简单地邀请朋友喝咖啡。",
  },
  "Say you’re not sure yet, but you’ll text them.": {
    en: "Say you’re not sure yet, but you’ll text them.",
    ja: "まだわからないが、あとで連絡すると伝えましょう。",
    ko: "아직 모르겠지만 나중에 연락하겠다고 말해 보세요.",
    zh: "表示还不确定，但会稍后联系。",
  },
  "Turn down an invite without hurting feelings.": {
    en: "Turn down an invite without hurting feelings.",
    ja: "相手を傷つけずに誘いを断りましょう。",
    ko: "상대 기분을 상하게 하지 않고 초대를 거절해 보세요.",
    zh: "不伤感情地拒绝邀请。",
  },
  "Ask if this seat is free on a train.": {
    en: "Ask if this seat is free on a train.",
    ja: "電車でこの席が空いているか聞きましょう。",
    ko: "기차에서 이 자리가 비었는지 물어 보세요.",
    zh: "在电车上询问这个座位是否空着。",
  },
  "Ask when the next bus leaves (short).": {
    en: "Ask when the next bus leaves (short).",
    ja: "次のバスの出発時刻を短く聞きましょう。",
    ko: "다음 버스 출발 시간을 짧게 물어 보세요.",
    zh: "简短地问下一班公交车何时出发。",
  },
  "Ask staff to keep your luggage for a few hours.": {
    en: "Ask staff to keep your luggage for a few hours.",
    ja: "数時間荷物を預かってもらいましょう。",
    ko: "몇 시간 동안 짐을 맡아 달라고 요청해 보세요.",
    zh: "请工作人员代为保管行李几小时。",
  },
  "Say you’ll take two of something at a shop.": {
    en: "Say you’ll take two of something at a shop.",
    ja: "お店で2つくださいと言いましょう。",
    ko: "가게에서 두 개 주세요라고 말해 보세요.",
    zh: "在店里说买两个。",
  },
  "Ask if they have it in another color.": {
    en: "Ask if they have it in another color.",
    ja: "別の色があるか聞きましょう。",
    ko: "다른 색상이 있는지 물어 보세요.",
    zh: "询问是否有其他颜色。",
  },
  "Ask for a recommendation between two similar items.": {
    en: "Ask for a recommendation between two similar items.",
    ja: "似た2つからおすすめを聞きましょう。",
    ko: "비슷한 두 가지 중 추천을 물어 보세요.",
    zh: "在两个相似商品间请对方推荐。",
  },
  "Ask someone to speak more slowly.": {
    en: "Ask someone to speak more slowly.",
    ja: "もう少しゆっくり話してもらいましょう。",
    ko: "조금 더 천천히 말해 달라고 요청해 보세요.",
    zh: "请对方说慢一点。",
  },
  "Ask someone to repeat what they said politely.": {
    en: "Ask someone to repeat what they said politely.",
    ja: "丁寧にもう一度言ってもらいましょう。",
    ko: "정중하게 한 번 더 말해 달라고 요청해 보세요.",
    zh: "礼貌地请对方重复一遍。",
  },
  "Ask for help in a busy shop without sounding demanding.": {
    en: "Ask for help in a busy shop without sounding demanding.",
    ja: "忙しいお店で、強く聞こえないように助けを求めましょう。",
    ko: "바쁜 가게에서 요구처럼 들리지 않게 도움을 요청해 보세요.",
    zh: "在忙碌的店里礼貌地请求帮助。",
  },
};

const OPENER: Record<
  Lang,
  { header: string; howToSay: string }
> = {
  en: {
    header: "Today's mission 🇯🇵",
    howToSay: "How would you say this in Japanese?",
  },
  ja: {
    header: "今日のミッション 🇯🇵",
    howToSay: "これを日本語でどう言いますか？",
  },
  ko: {
    header: "오늘의 미션 🇯🇵",
    howToSay: "이것을 일본어로 어떻게 말할까요?",
  },
  zh: {
    header: "今日任务 🇯🇵",
    howToSay: "用日语怎么说？",
  },
};

export function localizeRetentionMission(m: RetentionDailyMission, lang: Lang): Localized {
  const title = TITLE[m.title]?.[lang] ?? m.title;
  const instruction = INSTRUCTION[m.instruction]?.[lang] ?? m.instruction;
  return { title, instruction };
}

export function buildRetentionMissionChatOpener(m: RetentionDailyMission, lang: Lang): string {
  const { instruction } = localizeRetentionMission(m, lang);
  const frame = OPENER[lang] ?? OPENER.en;
  return [frame.header, "", instruction, "", frame.howToSay, "", `“${m.prompt_en}”`].join("\n");
}
