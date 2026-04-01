import type { Region } from "@/src/utils/region/region";
import type { Lang } from "./types";

/** ホーム（YomuPrototypePage）の表示文言。appLang / yomu_lang と同期させる */
export type PrototypeSettingsText = {
  title: string;
  subtitle: string;
  section: string;
  basicLanguage: string;
  basicLanguageDesc: string;
  region: string;
  regionDesc: string;
  /** タップで開くピッカーの見出し */
  chooseLanguageTitle: string;
  chooseRegionTitle: string;
  save: string;
  reset: string;
};

export type PrototypeUiText = {
  home: string;
  community: string;
  chat: string;
  record: string;
  settings: string;
  dailyMission: string;
  thisWeek: string;
  askInChat: string;
  japaneseChat: string;
  coachLine: string;
  featureLine: string;
  furigana: string;
  tone: string;
  casual: string;
  casualHint: string;
  neutral: string;
  neutralHint: string;
  business: string;
  businessHint: string;
  sending: string;
  send: string;
  inputPlaceholder: string;
  region: string;
  /** 地域の値（cookie/API）に対応する表示名・表示言語で切り替え */
  regionEastAsia: string;
  regionSoutheastAsia: string;
  regionSouthAsia: string;
  regionCentralWestAsia: string;
  regionNorthAmerica: string;
  regionEurope: string;
  regionOceania: string;
  regionLatinAmerica: string;
  regionMiddleEastAfrica: string;
  recentWords: string;
  noRecentWords: string;
  missionCompleted: string;
  streakToday: string;
  /** 例: EN "Day {n}" / JA "第{n}日" */
  streakDayOtherTemplate: string;
  growthLogTitle: string;
  growthLogSubtitle: string;
  recordEmptyTitle: string;
  recordEmptyBody: string;
  recordEmptyCta: string;
  patternStreakLabel: string;
  daysShort: string;
  studiedThisWeekCaption: string;
  skillChartTitle: string;
  skillVocabTitle: string;
  skillVocabDesc: string;
  skillNaturalTitle: string;
  skillNaturalDesc: string;
  skillGrammarTitle: string;
  skillGrammarDesc: string;
  skillPaceTitle: string;
  skillPaceDesc: string;
  myVocabularyHeading: string;
  vocabSavedLine: string;
  savedOnPrefix: string;
  weekCheerTitle: string;
  weekCheerTemplate: string;
  weekCheerWordOne: string;
  weekCheerWordMany: string;
  reflectWeekInChat: string;
  communitySubtitle: string;
  newPostBadge: string;
  signedInOnly: string;
  communityLabelJa: string;
  communityLabelEn: string;
  communityPlaceholderJa: string;
  communityPlaceholderEn: string;
  communityFormFooterHint: string;
  post: string;
  posting: string;
  loadingPosts: string;
  noPostsYet: string;
  communityLoadError: string;
  communityPostError: string;
  loadingProfileSettings: string;
  selectLangJa: string;
  selectLangEn: string;
  selectLangKo: string;
  selectLangZh: string;
  learningSectionTitle: string;
  furiganaSettingDesc: string;
  toggleFuriganaAria: string;
  jlptLevelTitle: string;
  jlptLevelDesc: string;
  showTranslationsTitle: string;
  showTranslationsDesc: string;
  toggleTranslationsAria: string;
  voiceSectionTitle: string;
  speechRateTitle: string;
  speechRateDesc: string;
  slower: string;
  faster: string;
  aboutSectionTitle: string;
  contactTitle: string;
  contactDesc: string;
  termsTitle: string;
  termsDesc: string;
  privacyTitle: string;
  privacyDesc: string;
  quickPrompt1: string;
  quickPrompt2: string;
  quickPrompt3: string;
  attachImageAria: string;
  imagePlaceholderLabel: string;
  tipLabel: string;
  /** チャット初回アシスタント（表示言語に合わせる） */
  chatWelcomeBody: string;
  chatWelcomeCulturalNote: string;
  chatWelcomeTipsNote: string;
  /** 画像プレースホルダー用メッセージ */
  chatImageBody: string;
  chatImageCulturalNote: string;
  chatImageTipsNote: string;
  chatFetchError: string;
  imageFileFallback: string;
  ariaFuriganaOn: string;
  ariaFuriganaOff: string;
  ariaReplyTone: string;
  ariaPlayAudio: string;
  ariaMainMenu: string;
  ariaClose: string;
  cancel: string;
  addToVocabulary: string;
  addingToVocabulary: string;
  alertSignInVocab: string;
  alertCouldNotSaveWord: string;
  alertAddedVocab: string;
  alertSignInSettings: string;
  alertSettingsSaved: string;
  alertSignInReset: string;
  alertDisplayResetOk: string;
  alertSignInCommunityPost: string;
};

const SETTINGS_EN: PrototypeSettingsText = {
  title: "Settings",
  subtitle: "Adjust learning experience and app preferences here.",
  section: "Display / Language / Region",
  basicLanguage: "Basic language",
  basicLanguageDesc: "Switch the app display language.",
  region: "Region",
  regionDesc: "Daily prompts can be tailored by region.",
  chooseLanguageTitle: "Choose display language",
  chooseRegionTitle: "Choose your region",
  save: "Save",
  reset: "Reset to first language",
};

const UI_EN: PrototypeUiText = {
  home: "Home",
  community: "Community",
  chat: "Chat",
  record: "Record",
  settings: "Settings",
  dailyMission: "Daily Mission",
  thisWeek: "This week",
  askInChat: "Ask in chat",
  japaneseChat: "Japanese Chat",
  coachLine: "Japanese Chat · Cultural Coach",
  featureLine:
    "Furigana · Tone · Culture notes · Vocabulary · Voice in one view.",
  furigana: "Furigana",
  tone: "How Yomu sounds",
  casual: "Like a friend",
  casualHint: "plain & warm",
  neutral: "Everyday polite",
  neutralHint: "natural & clear",
  business: "Work-ready",
  businessHint: "extra formal",
  sending: "Sending…",
  send: "Send",
  inputPlaceholder:
    "Type Japanese or the expression you want to learn…",
  region: "Region",
  regionEastAsia: "East Asia",
  regionSoutheastAsia: "Southeast Asia",
  regionSouthAsia: "South Asia",
  regionCentralWestAsia: "Central / West Asia",
  regionNorthAmerica: "North America",
  regionEurope: "Europe",
  regionOceania: "Oceania",
  regionLatinAmerica: "Latin America",
  regionMiddleEastAfrica: "Middle East / Africa",
  recentWords: "Recent vocabulary",
  noRecentWords:
    "No words yet. Save expressions from chat to see them here.",
  missionCompleted: "Completed",
  streakToday: "Today",
  streakDayOtherTemplate: "Day {n}",
  growthLogTitle: "Growth log",
  growthLogSubtitle:
    "Your progress this week and your personal vocabulary live here.",
  recordEmptyTitle: "No entries yet",
  recordEmptyBody:
    "Start chatting and tap “Add to vocabulary” on phrases you like. Your first saved word will show up here.",
  recordEmptyCta: "Open chat and save your first word",
  patternStreakLabel: "Pattern streak",
  daysShort: "days",
  studiedThisWeekCaption: "Days you studied this week",
  skillChartTitle: "Skill chart · four axes",
  skillVocabTitle: "Vocabulary",
  skillVocabDesc: "Estimated from how many words you have saved.",
  skillNaturalTitle: "Naturalness",
  skillNaturalDesc:
    "Based on consecutive study days and your growing intuition.",
  skillGrammarTitle: "Grammar",
  skillGrammarDesc:
    "Estimated from patterns in AI-generated example sentences.",
  skillPaceTitle: "Pace",
  skillPaceDesc: "Reflects your text-to-speech speed setting.",
  myVocabularyHeading: "My vocabulary",
  vocabSavedLine: "{n} words saved",
  savedOnPrefix: "Saved",
  weekCheerTitle: "This week’s cheer",
  weekCheerTemplate:
    "You've saved {n} {words}—great pace. Add your own “when I'd use this” scenario to each phrase, and Japanese will start to feel like your language.",
  weekCheerWordOne: "word",
  weekCheerWordMany: "words",
  reflectWeekInChat: "Reflect on this week in chat",
  communitySubtitle:
    "Share phrases you want to try—in Japanese and English—on this deep-navy board.",
  newPostBadge: "NEW POST",
  signedInOnly: "Signed-in users only",
  communityLabelJa: "Japanese",
  communityLabelEn: "English",
  communityPlaceholderJa:
    "e.g. 本日はお時間いただきありがとうございます。本日のゴールを、最初にすり合わせさせてください。",
  communityPlaceholderEn:
    "Example: Thank you so much for taking the time today. Before we start, I'd love to align on today's goal together.",
  communityFormFooterHint:
    "Picture a real situation, then write Japanese and English side by side.",
  post: "Post",
  posting: "Posting…",
  loadingPosts: "Loading posts…",
  noPostsYet: "No posts yet. Be the first to share one.",
  communityLoadError: "Could not load posts. Please try again later.",
  communityPostError: "Post failed. Check your network and try again.",
  loadingProfileSettings: "Loading current settings…",
  selectLangJa: "日本語",
  selectLangEn: "English",
  selectLangKo: "한국어",
  selectLangZh: "中文",
  learningSectionTitle: "Learning",
  furiganaSettingDesc: "Show readings above kanji to support reading.",
  toggleFuriganaAria: "Toggle furigana",
  jlptLevelTitle: "JLPT level",
  jlptLevelDesc: "Tune example difficulty to your target level (coming soon).",
  showTranslationsTitle: "Show translations",
  showTranslationsDesc:
    "Show English and other glosses in vocabulary and notes.",
  toggleTranslationsAria: "Toggle translations",
  voiceSectionTitle: "Voice",
  speechRateTitle: "Speech rate",
  speechRateDesc: "Slow down or speed up Japanese text-to-speech.",
  slower: "Slower",
  faster: "Faster",
  aboutSectionTitle: "About",
  contactTitle: "Contact",
  contactDesc: "Report bugs or share feedback via email.",
  termsTitle: "Terms of service",
  termsDesc: "Read the conditions for using Yomu.",
  privacyTitle: "Privacy policy",
  privacyDesc: "How we handle data and protect your privacy.",
  quickPrompt1: "Meaning of Itadakimasu（いただきます）",
  quickPrompt2: "Explain Otsukaresama in English（お疲れ様）",
  quickPrompt3: "Keigo vs casual Japanese",
  attachImageAria: "Attach image",
  imagePlaceholderLabel: "Image placeholder:",
  tipLabel: "Tip:",
  chatWelcomeBody:
    "Hi, I'm Yomu. Let's learn Japanese together—including the culture behind the language. Send any phrase you're curious about, like Itadakimasu, Otsukaresama, or Yoroshiku onegaishimasu.",
  chatWelcomeCulturalNote:
    "Everyday Japanese phrases often carry cultural meaning about gratitude, relationships, and shared time.",
  chatWelcomeTipsNote:
    "Start with the overall feeling of a sentence, then zoom in on keywords you want to remember.",
  chatImageBody:
    "Let's unpack what's in this image—Japanese names, manners, and cultural context. First, imagine where you might see it.",
  chatImageCulturalNote:
    "In the full product, the AI would describe the object's name, how it is used politely in Japan, and manners around gifting, receiving, or displaying it.",
  chatImageTipsNote:
    "Try describing the image in simple Japanese yourself first—even if it feels rough. That warms up your intuition before reading the AI's explanation.",
  chatFetchError:
    "Sorry, I couldn't get a reply. Please try again in a moment.",
  imageFileFallback: "Uploaded image",
  ariaFuriganaOn: "Turn furigana on",
  ariaFuriganaOff: "Turn furigana off",
  ariaReplyTone: "Reply tone",
  ariaPlayAudio: "Play or stop audio",
  ariaMainMenu: "Main menu",
  ariaClose: "Close",
  cancel: "Cancel",
  addToVocabulary: "Add to vocabulary",
  addingToVocabulary: "Adding…",
  alertSignInVocab: "Sign in to save words to My Vocabulary.",
  alertCouldNotSaveWord: "Could not save.",
  alertAddedVocab: "Added to My Vocabulary! 🌸",
  alertSignInSettings: "Sign in to save settings.",
  alertSettingsSaved: "Settings saved! 🌸",
  alertSignInReset: "Sign in to reset.",
  alertDisplayResetOk:
    "Display language reset to your first language! 🌸",
  alertSignInCommunityPost: "Sign in to post to the community.",
};

const SETTINGS_JA: PrototypeSettingsText = {
  title: "設定",
  subtitle: "表示言語や地域など、学習体験の好みをここで調整できます。",
  section: "表示 / 言語 / 地域",
  basicLanguage: "表示言語",
  basicLanguageDesc: "アプリの画面表示に使う言語を選びます。",
  region: "地域",
  regionDesc: "おすすめのお題などを地域に合わせて調整できます。",
  chooseLanguageTitle: "表示言語を選ぶ",
  chooseRegionTitle: "地域を選ぶ",
  save: "保存",
  reset: "開始言語に戻す",
};

const UI_JA: PrototypeUiText = {
  home: "ホーム",
  community: "コミュニティ",
  chat: "チャット",
  record: "記録",
  settings: "設定",
  dailyMission: "今日のミッション",
  thisWeek: "今週",
  askInChat: "チャットで聞く",
  japaneseChat: "日本語チャット",
  coachLine: "日本語チャット · 文化コーチ",
  featureLine:
    "ふりがな · トーン · 文化メモ · 語彙 · 音声をひと画面で。",
  furigana: "ふりがな",
  tone: "Yomuの話し方",
  casual: "友だち口調",
  casualHint: "タメ口であたたかく",
  neutral: "丁寧な日常会話",
  neutralHint: "自然でわかりやすく",
  business: "ビジネス向け",
  businessHint: "さらにフォーマル",
  sending: "送信中…",
  send: "送信",
  inputPlaceholder: "日本語や知りたい表現を入力…",
  region: "地域",
  regionEastAsia: "東アジア",
  regionSoutheastAsia: "東南アジア",
  regionSouthAsia: "南アジア",
  regionCentralWestAsia: "中央・西アジア",
  regionNorthAmerica: "北米",
  regionEurope: "ヨーロッパ",
  regionOceania: "オセアニア",
  regionLatinAmerica: "ラテンアメリカ",
  regionMiddleEastAfrica: "中東・アフリカ",
  recentWords: "最近の語彙",
  noRecentWords:
    "まだ語彙がありません。チャットから保存するとここに表示されます。",
  missionCompleted: "完了",
  streakToday: "今日",
  streakDayOtherTemplate: "第{n}日",
  growthLogTitle: "成長ログ",
  growthLogSubtitle:
    "今週の進捗とマイ語彙はここに集まります。",
  recordEmptyTitle: "まだ記録がありません",
  recordEmptyBody:
    "チャットで気に入った表現を「語彙に追加」してみましょう。最初の1語がここに表示されます。",
  recordEmptyCta: "チャットを開いて最初の語を保存",
  patternStreakLabel: "パターンストリーク",
  daysShort: "日",
  studiedThisWeekCaption: "今週学習した日数",
  skillChartTitle: "スキルチャート · 4軸",
  skillVocabTitle: "語彙",
  skillVocabDesc: "保存した語の数から推定しています。",
  skillNaturalTitle: "自然さ",
  skillNaturalDesc: "連続学習日と伸びしろから推定しています。",
  skillGrammarTitle: "文法",
  skillGrammarDesc: "AIの例文パターンから推定しています。",
  skillPaceTitle: "ペース",
  skillPaceDesc: "読み上げ速度の設定を反映しています。",
  myVocabularyHeading: "マイ語彙",
  vocabSavedLine: "{n}語を保存",
  savedOnPrefix: "保存",
  weekCheerTitle: "今週のひとこと",
  weekCheerTemplate:
    "今週は{n}語を保存しました。いいペースです。各表現に「いつ使うか」を自分の言葉でメモすると、日本語が身近になります。",
  weekCheerWordOne: "",
  weekCheerWordMany: "",
  reflectWeekInChat: "チャットで今週を振り返る",
  communitySubtitle:
    "試してみたいフレーズを、日本語と英語の両方でこのボードに共有しましょう。",
  newPostBadge: "新規投稿",
  signedInOnly: "ログインユーザーのみ",
  communityLabelJa: "日本語",
  communityLabelEn: "英語",
  communityPlaceholderJa:
    "例：本日はお時間いただきありがとうございます。本日のゴールを、最初にすり合わせさせてください。",
  communityPlaceholderEn:
    "例：Thank you so much for taking the time today. Before we start, I'd love to align on today's goal together.",
  communityFormFooterHint:
    "実際の場面をイメージして、日本語と英語を並べて書いてみましょう。",
  post: "投稿",
  posting: "投稿中…",
  loadingPosts: "投稿を読み込み中…",
  noPostsYet: "まだ投稿がありません。最初のシェアをしてみましょう。",
  communityLoadError: "投稿を読み込めませんでした。しばらくしてから再度お試しください。",
  communityPostError: "投稿に失敗しました。通信を確認して再度お試しください。",
  loadingProfileSettings: "設定を読み込み中…",
  selectLangJa: "日本語",
  selectLangEn: "English",
  selectLangKo: "한국어",
  selectLangZh: "中文",
  learningSectionTitle: "学習",
  furiganaSettingDesc: "漢字の上に読みを表示して読みをサポートします。",
  toggleFuriganaAria: "ふりがなの表示を切り替え",
  jlptLevelTitle: "JLPTレベル",
  jlptLevelDesc: "例文の難易度を目標レベルに合わせます（近日対応）。",
  showTranslationsTitle: "翻訳を表示",
  showTranslationsDesc: "語彙やメモに英語などの訳を表示します。",
  toggleTranslationsAria: "翻訳表示を切り替え",
  voiceSectionTitle: "音声",
  speechRateTitle: "読み上げ速度",
  speechRateDesc: "日本語の読み上げを遅く・速く調整します。",
  slower: "遅く",
  faster: "速く",
  aboutSectionTitle: "アプリについて",
  contactTitle: "お問い合わせ",
  contactDesc: "不具合やご意見はメールでお知らせください。",
  termsTitle: "利用規約",
  termsDesc: "Yomu の利用条件を確認できます。",
  privacyTitle: "プライバシーポリシー",
  privacyDesc: "データの取り扱いとプライバシーの保護について。",
  quickPrompt1: "「いただきます」の意味を教えて",
  quickPrompt2: "「お疲れ様」を英語で説明して",
  quickPrompt3: "敬語とタメ口の違い",
  attachImageAria: "画像を添付",
  imagePlaceholderLabel: "画像（プレースホルダー）:",
  tipLabel: "ヒント:",
  chatWelcomeBody:
    "こんにちは、Yomu です。日本語と、そのうしろにある文化や空気をいっしょに味わいながら学んでいきましょう。気になるフレーズ（「いただきます」「お疲れ様」「よろしくお願いします」など）を送ってみてください。",
  chatWelcomeCulturalNote:
    "日常の日本語には、感謝や関係性、共有の時間など、文化的なニュアンスが重なっていることがよくあります。",
  chatWelcomeTipsNote:
    "まずは文章全体の「空気」をつかみ、あとからキーワードに寄って学ぶと続けやすいです。",
  chatImageBody:
    "この画像に映っているものについて、日本語の呼び方・マナー・文化的背景をいっしょに整理してみましょう。まずは、どんな場面で見かけそうか想像してみてください。",
  chatImageCulturalNote:
    "本番では、AI が物の名称、日本での丁寧な使い方、贈答や受け取り・飾り方にまつわるマナーなどを説明します。",
  chatImageTipsNote:
    "説明を読む前に、簡単な日本語で自分の言葉で描写してみてください。たとえぎこちなくても、学びの入口になります。",
  chatFetchError:
    "返信を取得できませんでした。しばらくしてからもう一度お試しください。",
  imageFileFallback: "アップロード画像",
  ariaFuriganaOn: "ふりがなをオン",
  ariaFuriganaOff: "ふりがなをオフ",
  ariaReplyTone: "返信のトーン",
  ariaPlayAudio: "音声の再生または停止",
  ariaMainMenu: "メインメニュー",
  ariaClose: "閉じる",
  cancel: "キャンセル",
  addToVocabulary: "語彙に追加",
  addingToVocabulary: "追加中…",
  alertSignInVocab: "マイ語彙に保存するにはサインインしてください。",
  alertCouldNotSaveWord: "保存できませんでした。",
  alertAddedVocab: "マイ語彙に追加しました！🌸",
  alertSignInSettings: "設定を保存するにはサインインしてください。",
  alertSettingsSaved: "設定を保存しました！🌸",
  alertSignInReset: "リセットするにはサインインしてください。",
  alertDisplayResetOk: "表示言語を開始言語に合わせました！🌸",
  alertSignInCommunityPost: "コミュニティに投稿するにはサインインしてください。",
};

const SETTINGS_KO: PrototypeSettingsText = {
  title: "설정",
  subtitle: "표시 언어와 지역 등 학습 경험과 앱 환경을 조정합니다.",
  section: "표시 / 언어 / 지역",
  basicLanguage: "표시 언어",
  basicLanguageDesc: "앱 화면에 사용할 언어를 선택합니다.",
  region: "지역",
  regionDesc: "오늘의 주제 등을 지역에 맞게 조정할 수 있습니다.",
  chooseLanguageTitle: "표시 언어 선택",
  chooseRegionTitle: "지역 선택",
  save: "저장",
  reset: "시작 언어로 되돌리기",
};

const UI_KO: PrototypeUiText = {
  home: "홈",
  community: "커뮤니티",
  chat: "채팅",
  record: "기록",
  settings: "설정",
  dailyMission: "오늘의 미션",
  thisWeek: "이번 주",
  askInChat: "채팅에서 물어보기",
  japaneseChat: "일본어 채팅",
  coachLine: "일본어 채팅 · 문화 코치",
  featureLine:
    "후리가나 · 말투 · 문화 메모 · 어휘 · 음성을 한 화면에서.",
  furigana: "후리가나",
  tone: "Yomu 말투",
  casual: "친구처럼",
  casualHint: "편하고 따뜻하게",
  neutral: "일상 존댓말",
  neutralHint: "자연스럽고 명확하게",
  business: "비즈니스용",
  businessHint: "더 격식 있게",
  sending: "전송 중…",
  send: "보내기",
  inputPlaceholder: "일본어 또는 배우고 싶은 표현을 입력…",
  region: "지역",
  regionEastAsia: "동아시아",
  regionSoutheastAsia: "동남아시아",
  regionSouthAsia: "남아시아",
  regionCentralWestAsia: "중앙·서아시아",
  regionNorthAmerica: "북미",
  regionEurope: "유럽",
  regionOceania: "오세아니아",
  regionLatinAmerica: "라틴 아메리카",
  regionMiddleEastAfrica: "중동·아프리카",
  recentWords: "최근 어휘",
  noRecentWords:
    "아직 어휘가 없습니다. 채팅에서 저장하면 여기에 표시됩니다.",
  missionCompleted: "완료",
  streakToday: "오늘",
  streakDayOtherTemplate: "{n}일차",
  growthLogTitle: "성장 기록",
  growthLogSubtitle:
    "이번 주 진행 상황과 나만의 어휘가 여기에 모입니다.",
  recordEmptyTitle: "아직 기록이 없습니다",
  recordEmptyBody:
    "채팅에서 마음에 드는 표현을 눌러 ‘어휘에 추가’해 보세요. 첫 단어가 여기에 나타납니다.",
  recordEmptyCta: "채팅을 열고 첫 단어 저장하기",
  patternStreakLabel: "패턴 스트릭",
  daysShort: "일",
  studiedThisWeekCaption: "이번 주 공부한 날",
  skillChartTitle: "스킬 차트 · 4축",
  skillVocabTitle: "어휘",
  skillVocabDesc: "저장한 단어 수를 바탕으로 추정합니다.",
  skillNaturalTitle: "자연스러움",
  skillNaturalDesc: "연속 학습일과 성장 감각을 바탕으로 합니다.",
  skillGrammarTitle: "문법",
  skillGrammarDesc: "AI 예문 패턴을 바탕으로 추정합니다.",
  skillPaceTitle: "속도",
  skillPaceDesc: "음성 읽기 속도 설정을 반영합니다.",
  myVocabularyHeading: "내 어휘",
  vocabSavedLine: "{n}개 단어 저장됨",
  savedOnPrefix: "저장",
  weekCheerTitle: "이번 주 응원",
  weekCheerTemplate:
    "이번 주에 {n}개의 단어를 저장했어요—좋은 페이스예요. 각 표현에 ‘내가 쓸 때’를 적어 두면 일본어가 더 가까워집니다.",
  weekCheerWordOne: "",
  weekCheerWordMany: "",
  reflectWeekInChat: "채팅에서 이번 주 돌아보기",
  communitySubtitle:
    "일본어와 영어로 시도해 보고 싶은 표현을 이 보드에 나눠 보세요.",
  newPostBadge: "새 글",
  signedInOnly: "로그인 사용자만",
  communityLabelJa: "일본어",
  communityLabelEn: "영어",
  communityPlaceholderJa:
    "예: 本日はお時間いただきありがとうございます。本日のゴールを、最初にすり合わせさせてください。",
  communityPlaceholderEn:
    "예: Thank you so much for taking the time today. Before we start, I'd love to align on today's goal together.",
  communityFormFooterHint:
    "실제 상황을 떠올리며 일본어와 영어를 나란히 적어 보세요.",
  post: "게시",
  posting: "게시 중…",
  loadingPosts: "게시물 불러오는 중…",
  noPostsYet: "아직 게시물이 없습니다. 첫 번째로 공유해 보세요.",
  communityLoadError: "게시물을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
  communityPostError: "게시에 실패했습니다. 네트워크를 확인 후 다시 시도해 주세요.",
  loadingProfileSettings: "설정 불러오는 중…",
  selectLangJa: "日本語",
  selectLangEn: "English",
  selectLangKo: "한국어",
  selectLangZh: "中文",
  learningSectionTitle: "학습",
  furiganaSettingDesc: "한자 위에 읽기를 표시해 읽기를 돕습니다.",
  toggleFuriganaAria: "후리가나 켜기/끄기",
  jlptLevelTitle: "JLPT 레벨",
  jlptLevelDesc: "예문 난이도를 목표 레벨에 맞춥니다(곧 제공).",
  showTranslationsTitle: "번역 표시",
  showTranslationsDesc: "어휘와 메모에 영어 등 번역을 표시합니다.",
  toggleTranslationsAria: "번역 표시 전환",
  voiceSectionTitle: "음성",
  speechRateTitle: "읽기 속도",
  speechRateDesc: "일본어 음성 읽기를 느리게 또는 빠르게 조절합니다.",
  slower: "느리게",
  faster: "빠르게",
  aboutSectionTitle: "정보",
  contactTitle: "문의",
  contactDesc: "버그나 의견을 이메일로 알려 주세요.",
  termsTitle: "이용약관",
  termsDesc: "Yomu 이용 조건을 확인합니다.",
  privacyTitle: "개인정보 처리방침",
  privacyDesc: "데이터 처리와 개인정보 보호에 대해 설명합니다.",
  quickPrompt1: "「いただきます」의 의미 설명",
  quickPrompt2: "「お疲れ様」を 영어로 설명",
  quickPrompt3: "경어와 캐주얼 일본어 비교",
  attachImageAria: "이미지 첨부",
  imagePlaceholderLabel: "이미지(플레이스홀더):",
  tipLabel: "팁:",
  chatWelcomeBody:
    "안녕하세요, Yomu입니다. 일본어와 그 뒤에 있는 문화를 함께 익혀 가요. 「いただきます」「お疲れ様」「よろしくお願いします」처럼 궁금한 표현을 보내 주세요.",
  chatWelcomeCulturalNote:
    "일상 일본어에는 감사, 관계, 함께 보낸 시간 등 문화적 뉘앙스가 담기는 경우가 많습니다.",
  chatWelcomeTipsNote:
    "먼저 문장 전체의 느낌을 잡고, 그다음 기억하고 싶은 단어로 좁혀 가면 좋습니다.",
  chatImageBody:
    "이 이미지에 나온 것에 대해 일본어 이름·매너·문화적 배경을 함께 정리해 봅시다. 먼저 어떤 장면에서 볼 수 있을지 상상해 보세요.",
  chatImageCulturalNote:
    "완성 버전에서는 AI가 사물 이름, 일본에서의 정중한 쓰임, 선물·수령·진열 매너 등을 설명합니다.",
  chatImageTipsNote:
    "설명을 읽기 전에 간단한 일본어로 스스로 묘사해 보세요. 어색해도 학습의 출발점이 됩니다.",
  chatFetchError:
    "답변을 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.",
  imageFileFallback: "업로드한 이미지",
  ariaFuriganaOn: "후리가나 켜기",
  ariaFuriganaOff: "후리가나 끄기",
  ariaReplyTone: "답장 말투",
  ariaPlayAudio: "음성 재생 또는 중지",
  ariaMainMenu: "메인 메뉴",
  ariaClose: "닫기",
  cancel: "취소",
  addToVocabulary: "어휘에 추가",
  addingToVocabulary: "추가 중…",
  alertSignInVocab: "내 어휘에 저장하려면 로그인하세요.",
  alertCouldNotSaveWord: "저장할 수 없습니다.",
  alertAddedVocab: "내 어휘에 추가했습니다! 🌸",
  alertSignInSettings: "설정을 저장하려면 로그인하세요.",
  alertSettingsSaved: "설정을 저장했습니다! 🌸",
  alertSignInReset: "초기화하려면 로그인하세요.",
  alertDisplayResetOk: "표시 언어를 시작 언어에 맞췄습니다! 🌸",
  alertSignInCommunityPost: "커뮤니티에 게시하려면 로그인하세요.",
};

const SETTINGS_ZH: PrototypeSettingsText = {
  title: "设置",
  subtitle: "在此调整显示语言、地区等学习体验与应用偏好。",
  section: "显示 / 语言 / 地区",
  basicLanguage: "显示语言",
  basicLanguageDesc: "选择应用界面使用的语言。",
  region: "地区",
  regionDesc: "可根据地区调整每日推荐主题等。",
  chooseLanguageTitle: "选择显示语言",
  chooseRegionTitle: "选择地区",
  save: "保存",
  reset: "恢复为起始语言",
};

const UI_ZH: PrototypeUiText = {
  home: "首页",
  community: "社区",
  chat: "聊天",
  record: "记录",
  settings: "设置",
  dailyMission: "今日任务",
  thisWeek: "本周",
  askInChat: "在聊天中提问",
  japaneseChat: "日语聊天",
  coachLine: "日语聊天 · 文化教练",
  featureLine: "注音 · 语气 · 文化笔记 · 词汇 · 语音，一屏搞定。",
  furigana: "注音（ふりがな）",
  tone: "Yomu 的语气",
  casual: "像朋友",
  casualHint: "随意、亲切",
  neutral: "日常礼貌",
  neutralHint: "自然、清楚",
  business: "职场正式",
  businessHint: "更郑重",
  sending: "发送中…",
  send: "发送",
  inputPlaceholder: "输入日语或你想学的表达…",
  region: "地区",
  regionEastAsia: "东亚",
  regionSoutheastAsia: "东南亚",
  regionSouthAsia: "南亚",
  regionCentralWestAsia: "中亚/西亚",
  regionNorthAmerica: "北美",
  regionEurope: "欧洲",
  regionOceania: "大洋洲",
  regionLatinAmerica: "拉丁美洲",
  regionMiddleEastAfrica: "中东/非洲",
  recentWords: "最近词汇",
  noRecentWords: "暂无词汇。在聊天中保存表达后会显示在这里。",
  missionCompleted: "已完成",
  streakToday: "今天",
  streakDayOtherTemplate: "第{n}天",
  growthLogTitle: "成长记录",
  growthLogSubtitle: "本周进度与个人词汇汇集于此。",
  recordEmptyTitle: "还没有记录",
  recordEmptyBody:
    "去聊天里点击喜欢的表达并「加入词汇」。保存的第一个词会显示在这里。",
  recordEmptyCta: "打开聊天并保存第一个词",
  patternStreakLabel: "连续打卡",
  daysShort: "天",
  studiedThisWeekCaption: "本周学习天数",
  skillChartTitle: "技能图 · 四轴",
  skillVocabTitle: "词汇",
  skillVocabDesc: "根据已保存词条数量估算。",
  skillNaturalTitle: "自然度",
  skillNaturalDesc: "结合连续学习日与语感成长估算。",
  skillGrammarTitle: "语法",
  skillGrammarDesc: "根据 AI 生成例句的模式估算。",
  skillPaceTitle: "节奏",
  skillPaceDesc: "反映文字转语音的速度设置。",
  myVocabularyHeading: "我的词汇",
  vocabSavedLine: "已保存 {n} 个词",
  savedOnPrefix: "保存于",
  weekCheerTitle: "本周加油",
  weekCheerTemplate:
    "本周你已保存 {n} 个词——节奏很棒。给每个表达加上「我会在什么时候用」，日语会越来越像你的语言。",
  weekCheerWordOne: "",
  weekCheerWordMany: "",
  reflectWeekInChat: "在聊天里回顾本周",
  communitySubtitle:
    "把你想尝试的说法用日语和英语一起分享在这块深海军蓝看板上。",
  newPostBadge: "新帖",
  signedInOnly: "仅登录用户",
  communityLabelJa: "日语",
  communityLabelEn: "英语",
  communityPlaceholderJa:
    "例：本日はお時間いただきありがとうございます。本日のゴールを、最初にすり合わせさせてください。",
  communityPlaceholderEn:
    "例：Thank you so much for taking the time today. Before we start, I'd love to align on today's goal together.",
  communityFormFooterHint: "先想象真实场景，再并排写日语和英语。",
  post: "发布",
  posting: "发布中…",
  loadingPosts: "加载帖子中…",
  noPostsYet: "还没有帖子，来发第一条吧。",
  communityLoadError: "无法加载帖子，请稍后再试。",
  communityPostError: "发布失败，请检查网络后重试。",
  loadingProfileSettings: "正在加载当前设置…",
  selectLangJa: "日本語",
  selectLangEn: "English",
  selectLangKo: "한국어",
  selectLangZh: "中文",
  learningSectionTitle: "学习",
  furiganaSettingDesc: "在汉字上方显示读音以辅助阅读。",
  toggleFuriganaAria: "切换注音显示",
  jlptLevelTitle: "JLPT 等级",
  jlptLevelDesc: "按目标等级调整例句难度（即将推出）。",
  showTranslationsTitle: "显示翻译",
  showTranslationsDesc: "在词汇与笔记中显示英语等译文。",
  toggleTranslationsAria: "切换翻译显示",
  voiceSectionTitle: "语音",
  speechRateTitle: "朗读速度",
  speechRateDesc: "调慢或加快日语文字转语音。",
  slower: "更慢",
  faster: "更快",
  aboutSectionTitle: "关于",
  contactTitle: "联系",
  contactDesc: "通过邮件反馈问题或建议。",
  termsTitle: "服务条款",
  termsDesc: "查看使用 Yomu 的条件。",
  privacyTitle: "隐私政策",
  privacyDesc: "了解我们如何处理数据并保护隐私。",
  quickPrompt1: "解释「いただきます」的含义",
  quickPrompt2: "用英语解释「お疲れ様」",
  quickPrompt3: "敬语与口语日语对比",
  attachImageAria: "添加图片",
  imagePlaceholderLabel: "图片（占位）:",
  tipLabel: "提示:",
  chatWelcomeBody:
    "你好，我是 Yomu。让我们一起学习日语以及语言背后的文化。请发送你感兴趣的表达，例如「いただきます」「お疲れ様」「よろしくお願いします」等。",
  chatWelcomeCulturalNote:
    "日常日语里常常叠着感谢、人际关系与共同时间等文化层面的意味。",
  chatWelcomeTipsNote:
    "先抓住整句话的感觉，再聚焦你想记住的关键词，会更容易坚持下去。",
  chatImageBody:
    "我们来一起整理这张图片里的物品：日语说法、礼仪与文化背景。先想象一下你可能在什么场景看到它。",
  chatImageCulturalNote:
    "完整版中，AI 会说明物品名称、在日本如何礼貌使用，以及与赠答、接收、摆放相关的礼仪。",
  chatImageTipsNote:
    "在读说明前，试着用简单的日语自己描述一下画面——哪怕生硬也没关系，这是启动语感的好步骤。",
  chatFetchError:
    "暂时无法获取回复，请稍后再试。",
  imageFileFallback: "已上传图片",
  ariaFuriganaOn: "打开注音",
  ariaFuriganaOff: "关闭注音",
  ariaReplyTone: "回复语气",
  ariaPlayAudio: "播放或停止语音",
  ariaMainMenu: "主菜单",
  ariaClose: "关闭",
  cancel: "取消",
  addToVocabulary: "加入词汇",
  addingToVocabulary: "添加中…",
  alertSignInVocab: "登录后即可保存到「我的词汇」。",
  alertCouldNotSaveWord: "无法保存。",
  alertAddedVocab: "已加入我的词汇！🌸",
  alertSignInSettings: "登录后即可保存设置。",
  alertSettingsSaved: "设置已保存！🌸",
  alertSignInReset: "登录后即可重置。",
  alertDisplayResetOk: "显示语言已与起始语言对齐！🌸",
  alertSignInCommunityPost: "登录后即可发布到社区。",
};

const SETTINGS_BY_LANG: Record<Lang, PrototypeSettingsText> = {
  en: SETTINGS_EN,
  ja: SETTINGS_JA,
  ko: SETTINGS_KO,
  zh: SETTINGS_ZH,
};

const UI_BY_LANG: Record<Lang, PrototypeUiText> = {
  en: UI_EN,
  ja: UI_JA,
  ko: UI_KO,
  zh: UI_ZH,
};

export function getPrototypeCopy(lang: Lang): {
  settingsText: PrototypeSettingsText;
  uiText: PrototypeUiText;
} {
  const safe = SETTINGS_BY_LANG[lang] ? lang : "en";
  return {
    settingsText: SETTINGS_BY_LANG[safe],
    uiText: UI_BY_LANG[safe],
  };
}

const REGION_VALUE_TO_UI_KEY: Record<
  Region,
  | "regionEastAsia"
  | "regionSoutheastAsia"
  | "regionSouthAsia"
  | "regionCentralWestAsia"
  | "regionNorthAmerica"
  | "regionEurope"
  | "regionOceania"
  | "regionLatinAmerica"
  | "regionMiddleEastAfrica"
> = {
  "East Asia": "regionEastAsia",
  "Southeast Asia": "regionSoutheastAsia",
  "South Asia": "regionSouthAsia",
  "Central / West Asia": "regionCentralWestAsia",
  "North America": "regionNorthAmerica",
  Europe: "regionEurope",
  Oceania: "regionOceania",
  "Latin America": "regionLatinAmerica",
  "Middle East / Africa": "regionMiddleEastAfrica",
};

/** 地域の内部値を、現在の表示言語（appLang）向けのラベルに変換 */
export function regionLabelForLang(region: Region, lang: Lang): string {
  const { uiText } = getPrototypeCopy(lang);
  const key = REGION_VALUE_TO_UI_KEY[region];
  return uiText[key];
}

export function formatWeekCheer(ui: PrototypeUiText, n: number): string {
  let s = ui.weekCheerTemplate.replaceAll("{n}", String(n));
  if (s.includes("{words}")) {
    s = s.replace(
      "{words}",
      n === 1 ? ui.weekCheerWordOne : ui.weekCheerWordMany,
    );
  }
  return s;
}

export function formatVocabSavedLine(ui: PrototypeUiText, n: number): string {
  return ui.vocabSavedLine.replace("{n}", String(n));
}

export function dateLocaleForLang(lang: Lang): string {
  if (lang === "ja") return "ja-JP";
  if (lang === "ko") return "ko-KR";
  if (lang === "zh") return "zh-CN";
  return "en-US";
}
