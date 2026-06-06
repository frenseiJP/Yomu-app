import type { LearnPhrase } from "@/lib/learn/types";

const PHRASES: LearnPhrase[] = [
  {
    slug: "itadakimasu",
    topic: "いただきます",
    reading: "いただきます",
    title: "Itadakimasu — More Than \"Let's Eat\"",
    seoTitle: "Itadakimasu Meaning: How to Use いただきます Naturally | Frensei",
    seoDescription:
      "Learn what itadakimasu (いただきます) really means, when Japanese people say it, and how to sound natural—not like a textbook.",
    meaningEn: "I humbly receive (said before eating)",
    level: "N5",
    nuance:
      "Itadakimasu expresses gratitude to everyone involved in the meal—farmers, cooks, and dining companions. It is not simply \"bon appétit.\"",
    culturalNote:
      "Said once before the first bite, with hands together briefly. Skipping it in a group can feel awkward; saying it alone at a convenience store is optional but polite.",
    examples: [
      { ja: "いただきます。", en: "Thank you for this meal.", context: "Before eating with colleagues" },
      { ja: "では、いただきます。", en: "Well then, let's eat.", context: "Casual lunch with friends" },
    ],
    commonMistakes: [
      "Saying it after you already started eating",
      "Translating it as \"Enjoy your meal\" to the cook (that is 召し上がれ)",
    ],
    relatedSlugs: ["arigatou-gozaimasu", "otsukaresama"],
    tryPrompt: "What does いただきます mean beyond \"let's eat\"?",
  },
  {
    slug: "otsukaresama",
    topic: "お疲れ様",
    reading: "おつかれさま",
    title: "Otsukaresama — Japan's Daily \"Good Job\"",
    seoTitle: "Otsukaresama (お疲れ様): Meaning, Usage & Examples | Frensei",
    seoDescription:
      "Otsukaresama is said constantly at work in Japan. Learn when to use お疲れ様です vs お疲れ, and what it really means.",
    meaningEn: "Thanks for your hard work / good job",
    level: "N5",
    nuance:
      "Acknowledges shared effort and fatigue. Used when leaving work, finishing a task, or greeting someone after their shift.",
    culturalNote:
      "お疲れ様です is safer at work; お疲れ alone is casual among peers. Saying it to a superior leaving first can feel odd—usually they say it to you.",
    examples: [
      { ja: "お疲れ様でした。", en: "Thank you for your hard work today.", context: "End of the workday" },
      { ja: "お疲れ！また明日。", en: "Good job—see you tomorrow.", context: "Casual among teammates" },
    ],
    commonMistakes: [
      "Using it like \"hello\" with strangers on the street",
      "Forgetting です in formal workplaces",
    ],
    relatedSlugs: ["yoroshiku-onegaishimasu", "sumimasen"],
    tryPrompt: "When should I say お疲れ様です at work?",
  },
  {
    slug: "yoroshiku-onegaishimasu",
    topic: "よろしくお願いします",
    reading: "よろしくおねがいします",
    title: "Yoroshiku Onegaishimasu — The Untranslatable Greeting",
    seoTitle: "Yoroshiku Onegaishimasu Meaning & When to Say It | Frensei",
    seoDescription:
      "よろしくお願いします appears in introductions, requests, and goodbyes. Learn what it really communicates in Japanese culture.",
    meaningEn: "Please treat me well / I look forward to working with you",
    level: "N5",
    nuance:
      "Bundles goodwill, cooperation, and a soft request. Context decides whether it means \"nice to meet you\" or \"please handle this.\"",
    culturalNote:
      "Self-introductions almost always end with this phrase. In emails, it softens requests without sounding demanding.",
    examples: [
      { ja: "田中です。よろしくお願いします。", en: "I'm Tanaka. Pleased to work with you.", context: "First day at a new job" },
      { ja: "では、よろしくお願いします。", en: "Well then, I'm counting on you.", context: "Closing a meeting" },
    ],
    commonMistakes: [
      "Over-translating as \"please\" in every situation",
      "Dropping it in formal introductions",
    ],
    relatedSlugs: ["otsukaresama", "onegaishimasu"],
    tryPrompt: "How do I use よろしくお願いします in a self-introduction?",
  },
  {
    slug: "sumimasen",
    topic: "すみません",
    reading: "すみません",
    title: "Sumimasen — Excuse Me, Sorry, and Thanks",
    seoTitle: "Sumimasen (すみません): 3 Uses Explained with Examples | Frensei",
    seoDescription:
      "すみません works for calling staff, apologizing, and thanking. Learn the three situations and how it differs from ごめんなさい.",
    meaningEn: "Excuse me / I'm sorry / Thank you (light)",
    level: "N5",
    nuance:
      "Lighter than ごめんなさい and more versatile than 申し訳ございません. The Swiss Army knife of daily Japanese.",
    culturalNote:
      "Restaurant staff calls, bumping someone on a train, and thanking someone who went out of their way—all use すみません.",
    examples: [
      { ja: "すみません、メニューをください。", en: "Excuse me, may I have the menu?", context: "Calling a waiter" },
      { ja: "すみません、ぶつかってしまいました。", en: "Sorry, I bumped into you.", context: "On a crowded train" },
    ],
    commonMistakes: [
      "Using ごめんなさい for bumping a stranger (too personal)",
      "Using すみません in a formal business apology (too light)",
    ],
    relatedSlugs: ["sumimasen-vs-gomennasai", "arigatou-gozaimasu"],
    tryPrompt: "When do I use すみません vs ごめんなさい?",
  },
  {
    slug: "sumimasen-vs-gomennasai",
    topic: "すみません vs ごめんなさい",
    reading: "すみません / ごめんなさい",
    title: "Sumimasen vs Gomennasai — Which Sorry to Use",
    seoTitle: "Sumimasen vs Gomennasai: Which \"Sorry\" to Use in Japanese | Frensei",
    seoDescription:
      "Compare すみません and ごめんなさい with real situations. Learn which apology sounds natural to native speakers.",
    meaningEn: "Excuse me / light sorry vs personal apology",
    level: "N5",
    nuance:
      "すみません = social friction with strangers or light regret. ごめんなさい = personal guilt toward someone you have a relationship with.",
    culturalNote:
      "On a train, すみません. To your partner after forgetting a date, ごめんなさい. Mixing them up is a common learner tell.",
    examples: [
      { ja: "すみません、通ります。", en: "Excuse me, I'm passing through.", context: "Crowded aisle" },
      { ja: "ごめんなさい、遅れました。", en: "I'm sorry I'm late.", context: "Apologizing to a friend" },
    ],
    commonMistakes: [
      "Saying ごめんなさい to a shop clerk",
      "Using すみません for a serious personal mistake",
    ],
    relatedSlugs: ["sumimasen", "gomennasai"],
    tryPrompt: "What's the difference between すみません and ごめんなさい?",
  },
  {
    slug: "arigatou-gozaimasu",
    topic: "ありがとうございます",
    reading: "ありがとうございます",
    title: "Arigatou Gozaimasu — Thank You That Lands",
    seoTitle: "Arigatou Gozaimasu: Polite Thank You in Japanese | Frensei",
    seoDescription:
      "Learn when to use ありがとうございます vs ありがとう, and how to sound genuinely grateful—not robotic.",
    meaningEn: "Thank you (polite)",
    level: "N5",
    nuance:
      "Polite default in shops, offices, and with strangers. ありがとう alone is for close friends and casual moments.",
    culturalNote:
      "Bow slightly or nod when saying it to staff. Repeating it when leaving (お邪魔しました + ありがとうございました) is common.",
    examples: [
      { ja: "ありがとうございます。", en: "Thank you very much.", context: "After receiving change at a store" },
      { ja: "いつもありがとうございます。", en: "Thank you as always.", context: "Regular client or teammate" },
    ],
    commonMistakes: [
      "Using casual ありがとう with customers or superiors",
      "Forgetting past tense ありがとうございました after a completed favor",
    ],
    relatedSlugs: ["sumimasen", "itadakimasu"],
    tryPrompt: "When is ありがとう too casual?",
  },
  {
    slug: "onegaishimasu",
    topic: "お願いします",
    reading: "おねがいします",
    title: "Onegaishimasu — The Polite Way to Ask",
    seoTitle: "Onegaishimasu (お願いします): How to Request in Japanese | Frensei",
    seoDescription:
      "お願いします turns orders and requests into polite Japanese. Learn restaurant, shopping, and workplace usage.",
    meaningEn: "Please (I ask of you)",
    level: "N5",
    nuance:
      "Softens requests without ください's directness. Common when ordering, asking for help, or starting a working relationship.",
    culturalNote:
      "At restaurants, point and say これをお願いします. In sports or work, it means \"I'm counting on you.\"",
    examples: [
      { ja: "ラーメンをお願いします。", en: "Ramen, please.", context: "Ordering food" },
      { ja: "資料をお願いします。", en: "The document, please.", context: "Office request" },
    ],
    commonMistakes: [
      "Using only ください in every service situation",
      "Omitting it when handing over payment or documents",
    ],
    relatedSlugs: ["kore-kudasai", "yoroshiku-onegaishimasu"],
    tryPrompt: "How do I order food with お願いします?",
  },
  {
    slug: "kore-kudasai",
    topic: "これをください",
    reading: "これをください",
    title: "Kore o Kudasai — How to Buy Anything",
    seoTitle: "Kore o Kudasai: Shopping Japanese for Beginners | Frensei",
    seoDescription:
      "これをください is the fastest way to buy things in Japan. Learn variations with numbers and polite upgrades.",
    meaningEn: "This one, please",
    level: "N5",
    nuance:
      "Direct but acceptable in shops. Upgrading to お願いします sounds smoother in restaurants.",
    culturalNote:
      "Point with an open hand, not a single finger, when saying これ. Staff often appreciate 〜をお願いします even more.",
    examples: [
      { ja: "これをください。", en: "This one, please.", context: "Convenience store counter" },
      { ja: "二つください。", en: "Two, please.", context: "Buying two items" },
    ],
    commonMistakes: [
      "Pointing with one finger at people or items",
      "Saying これはください (wrong particle)",
    ],
    relatedSlugs: ["onegaishimasu", "sumimasen"],
    tryPrompt: "Is これをください rude in a restaurant?",
  },
  {
    slug: "daijoubu-desu",
    topic: "だいじょうぶです",
    reading: "だいじょうぶです",
    title: "Daijoubu desu — OK, No Thanks, I'm Fine",
    seoTitle: "Daijoubu desu Meaning: OK, No Thanks & I'm Fine | Frensei",
    seoDescription:
      "だいじょうぶです means OK, I'm fine, or no thank you—depending on context. Learn to read the situation.",
    meaningEn: "It's fine / I'm okay / no thank you",
    level: "N5",
    nuance:
      "Context-dependent: reassurance, declining an offer, or confirming safety. Tone and situation matter more than the words.",
    culturalNote:
      "A shop clerk offers a bag—you can decline with だいじょうぶです. A friend asks if you're hurt—same phrase, different meaning.",
    examples: [
      { ja: "大丈夫です、結構です。", en: "No thanks, I'm fine.", context: "Declining a sales offer" },
      { ja: "大丈夫ですか？— はい、大丈夫です。", en: "Are you okay?— Yes, I'm fine.", context: "Checking on someone" },
    ],
    commonMistakes: [
      "Assuming it always means \"yes\"",
      "Using it to refuse a boss's offer without softer phrasing",
    ],
    relatedSlugs: ["sumimasen", "arigatou-gozaimasu"],
    tryPrompt: "How do I politely decline with だいじょうぶです?",
  },
  {
    slug: "gomennasai",
    topic: "ごめんなさい",
    reading: "ごめんなさい",
    title: "Gomennasai — Personal Apology",
    seoTitle: "Gomennasai (ごめんなさい): When to Apologize Personally | Frensei",
    seoDescription:
      "ごめんなさい is for people you know. Learn when it beats すみません and how casual ごめん works with friends.",
    meaningEn: "I'm sorry (personal)",
    level: "N5",
    nuance:
      "Implies you feel responsible toward someone close. Too heavy for bumping strangers; right for friends, family, partners.",
    culturalNote:
      "Casual ごめん among friends; full ごめんなさい shows sincerity. Children learn this before business keigo.",
    examples: [
      { ja: "ごめんなさい、忘れてた。", en: "Sorry, I forgot.", context: "Apologizing to a friend" },
      { ja: "本当にごめんなさい。", en: "I'm truly sorry.", context: "Serious personal mistake" },
    ],
    commonMistakes: [
      "Using ごめんなさい with strangers in public",
      "Saying only ごめん to a client",
    ],
    relatedSlugs: ["sumimasen-vs-gomennasai", "sumimasen"],
    tryPrompt: "Is ごめんなさい too strong for small mistakes?",
  },
  {
    slug: "ohayou-gozaimasu",
    topic: "おはようございます",
    reading: "おはようございます",
    title: "Ohayou Gozaimasu — Morning Greetings at Work",
    seoTitle: "Ohayou Gozaimasu: Japanese Good Morning Greeting | Frensei",
    seoDescription:
      "Learn おはようございます for workplaces and おはよう for friends. Sound natural in the morning.",
    meaningEn: "Good morning (polite)",
    level: "N5",
    nuance:
      "Used in the morning until roughly late morning at work—even if you arrive at noon for a shift, colleagues may still say it on first meeting.",
    culturalNote:
      "Saying おはようございます when entering the office marks you as culturally aware. Skipping it can seem cold.",
    examples: [
      { ja: "おはようございます。", en: "Good morning.", context: "Entering the office" },
      { ja: "おはよう！", en: "Morning!", context: "Texting a close friend" },
    ],
    commonMistakes: [
      "Using こんにちは in the morning at work",
      "Using おはよう with a client",
    ],
    relatedSlugs: ["konnichiwa", "otsukaresama"],
    tryPrompt: "Can I say おはようございます after 11am?",
  },
  {
    slug: "konnichiwa",
    topic: "こんにちは",
    reading: "こんにちは",
    title: "Konnichiwa — Not Your Default Hello",
    seoTitle: "Konnichiwa: When Japanese People Actually Say こんにちは | Frensei",
    seoDescription:
      "こんにちは is less common in daily life than textbooks suggest. Learn when it sounds natural—and when it doesn't.",
    meaningEn: "Hello / good afternoon",
    level: "N5",
    nuance:
      "Textbook default, but real life favors situational phrases (おはよう, はじめまして, お久しぶり). こんにちは fits afternoon greetings to acquaintances.",
    culturalNote:
      "Kids and service staff use it more. Among coworkers you see daily, a nod or お疲れ様 is more typical than こんにちは.",
    examples: [
      { ja: "こんにちは。", en: "Hello.", context: "Afternoon, meeting a neighbor" },
      { ja: "先生、こんにちは。", en: "Hello, teacher.", context: "Student greeting" },
    ],
    commonMistakes: [
      "Saying こんにちは to coworkers every afternoon",
      "Using it on the phone (もしもし is standard)",
    ],
    relatedSlugs: ["ohayou-gozaimasu", "konbanwa"],
    tryPrompt: "Do Japanese people really say こんにちは every day?",
  },
  {
    slug: "konbanwa",
    topic: "こんばんは",
    reading: "こんばんは",
    title: "Konbanwa — Evening Hello",
    seoTitle: "Konbanwa (こんばんは): Good Evening in Japanese | Frensei",
    seoDescription:
      "Learn when to say こんばんは, how it differs from こんにちは, and natural evening greetings.",
    meaningEn: "Good evening",
    level: "N5",
    nuance: "Used after dusk for greetings. Less common in close relationships where conversation starts without a time-specific hello.",
    culturalNote: "Formal events, meeting someone in the evening, or entering a restaurant at night—konbanwa fits.",
    examples: [
      { ja: "こんばんは。", en: "Good evening.", context: "Arriving at an evening party" },
      { ja: "こんばんは、予約しています。", en: "Good evening, I have a reservation.", context: "Restaurant arrival" },
    ],
    commonMistakes: ["Using こんにちは at night", "Overusing it with family at home"],
    relatedSlugs: ["konnichiwa", "ohayou-gozaimasu"],
    tryPrompt: "What time should I switch from こんにちは to こんばんは?",
  },
  {
    slug: "shitsurei-shimasu",
    topic: "失礼します",
    reading: "しつれいします",
    title: "Shitsurei Shimasu — Entering and Leaving Right",
    seoTitle: "Shitsurei Shimasu: Office Japanese for Entering & Leaving | Frensei",
    seoDescription:
      "失礼します signals you're entering or leaving someone's space. Essential for offices, interviews, and video calls.",
    meaningEn: "Excuse me for leaving / entering (formal)",
    level: "N4",
    nuance:
      "Said when entering a room, leaving early, hanging up after a call, or passing in front of someone.",
    culturalNote:
      "Leaving the office: お先に失礼します (I leave before you—sorry). A core office phrase.",
    examples: [
      { ja: "お先に失礼します。", en: "I'm leaving before you—excuse me.", context: "Leaving work while others stay" },
      { ja: "失礼します。", en: "Excuse me.", context: "Entering a meeting room" },
    ],
    commonMistakes: [
      "Leaving without any phrase",
      "Using さようなら when leaving the office",
    ],
    relatedSlugs: ["otsukaresama", "ojamashimasu"],
    tryPrompt: "What do I say when leaving the office before my team?",
  },
  {
    slug: "ojamashimasu",
    topic: "お邪魔します",
    reading: "おじゃまします",
    title: "Ojamashimasu — Visiting Someone's Home",
    seoTitle: "Ojamashimasu: What to Say When Visiting in Japan | Frensei",
    seoDescription:
      "お邪魔します means \"sorry for intruding.\" Learn the full visit ritual: entering, gifting, and leaving.",
    meaningEn: "Sorry for disturbing you (visiting)",
    level: "N4",
    nuance:
      "Said when entering someone's home. Pairs with お邪魔しました when leaving.",
    culturalNote:
      "Bring a small gift (お土産). Remove shoes at the genkan. These rituals matter as much as the phrase.",
    examples: [
      { ja: "お邪魔します。", en: "Sorry to intrude.", context: "Entering a friend's apartment" },
      { ja: "お邪魔しました。ありがとうございました。", en: "Thanks for having me.", context: "Leaving after a visit" },
    ],
    commonMistakes: [
      "Skipping the phrase when entering",
      "Forgetting お邪魔しました on the way out",
    ],
    relatedSlugs: ["sumimasen", "arigatou-gozaimasu"],
    tryPrompt: "What do I say when visiting a Japanese friend's home?",
  },
  {
    slug: "moshi-moshi",
    topic: "もしもし",
    reading: "もしもし",
    title: "Moshi Moshi — Answering the Phone",
    seoTitle: "Moshi Moshi (もしもし): How to Answer Phone Calls in Japanese | Frensei",
    seoDescription:
      "もしもし is the standard phone greeting in Japan. Learn business vs casual phone openers.",
    meaningEn: "Hello (on the phone only)",
    level: "N5",
    nuance: "Almost exclusively for phone and sometimes video calls—not for in-person hellos.",
    culturalNote:
      "Business: state company + name after もしもし. Casual: もしもし alone is fine.",
    examples: [
      { ja: "もしもし、田中です。", en: "Hello, this is Tanaka.", context: "Personal call" },
      { ja: "もしもし、株式会社〇〇の佐藤です。", en: "Hello, Sato from XX Corporation.", context: "Business call" },
    ],
    commonMistakes: [
      "Saying もしもし when meeting someone face-to-face",
      "Using こんにちは on phone calls",
    ],
    relatedSlugs: ["konnichiwa", "sumimasen"],
    tryPrompt: "How do I answer a business phone call in Japanese?",
  },
  {
    slug: "chotto-matte",
    topic: "ちょっと待って",
    reading: "ちょっとまって",
    title: "Chotto Matte — Wait a Moment",
    seoTitle: "Chotto Matte: How to Say \"Wait\" Naturally in Japanese | Frensei",
    seoDescription:
      "ちょっと待って is casual; learn polite versions for work and service situations.",
    meaningEn: "Wait a moment (casual)",
    level: "N5",
    nuance:
      "ちょっと softens the request. Polite upgrades: ちょっとお待ちください, 少々お待ちください.",
    culturalNote:
      "Holding up a finger with ちょっと待って is common among friends. With clients, avoid casual matte.",
    examples: [
      { ja: "ちょっと待って。", en: "Wait a sec.", context: "Friend is walking ahead" },
      { ja: "少々お待ちください。", en: "Please wait a moment.", context: "Shop staff to customer" },
    ],
    commonMistakes: [
      "Saying 待って to a customer",
      "Using ちょっと待って in formal email",
    ],
    relatedSlugs: ["sumimasen", "onegaishimasu"],
    tryPrompt: "What's the polite way to say \"wait a moment\"?",
  },
  {
    slug: "wakarimashita",
    topic: "わかりました",
    reading: "わかりました",
    title: "Wakarimashita — I Understand (Politely)",
    seoTitle: "Wakarimashita: Saying \"I Understand\" at Work | Frensei",
    seoDescription:
      "わかりました confirms you understood instructions. Learn alternatives like 承知しました for business.",
    meaningEn: "I understand / got it (polite)",
    level: "N5",
    nuance:
      "Standard acknowledgment in offices and lessons. 了解です is casual; 承知しました is more formal.",
    culturalNote:
      "Nodding while saying わかりました shows attentiveness. Silence alone can seem like you did not hear.",
    examples: [
      { ja: "わかりました。すぐやります。", en: "Understood. I'll do it right away.", context: "Boss assigns a task" },
      { ja: "わかった。", en: "Got it.", context: "Casual among friends" },
    ],
    commonMistakes: [
      "Using わかった with superiors",
      "Saying only はい without confirming understanding",
    ],
    relatedSlugs: ["onegaishimasu", "arigatou-gozaimasu"],
    tryPrompt: "What's more formal than わかりました at work?",
  },
  {
    slug: "sayounara",
    topic: "さようなら",
    reading: "さようなら",
    title: "Sayounara — Why Japanese Rarely Say Goodbye",
    seoTitle: "Sayounara: When Japanese People Actually Say Goodbye | Frensei",
    seoDescription:
      "さようなら sounds final—like a long farewell. Learn what natives say instead: じゃあね, お疲れ様, また明日.",
    meaningEn: "Goodbye (formal/final)",
    level: "N5",
    nuance:
      "Implies you may not see someone for a long time. Daily partings use じゃあね, またね, お疲れ様, or バイバイ.",
    culturalNote:
      "Teachers and children use さようなら more. Adults leaving work almost never say it—they say お先に失礼します.",
    examples: [
      { ja: "さようなら。", en: "Goodbye.", context: "Graduation ceremony" },
      { ja: "じゃあ、また明日。", en: "See you tomorrow.", context: "Leaving coworkers" },
    ],
    commonMistakes: [
      "Saying さようなら every day to the same coworkers",
      "Using it at the end of a phone call with friends (バイバイ is common)",
    ],
    relatedSlugs: ["otsukaresama", "shitsurei-shimasu"],
    tryPrompt: "What should I say instead of さようなら after work?",
  },
  {
    slug: "tabun",
    topic: "たぶん",
    reading: "たぶん",
    title: "Tabun — Softening \"Maybe\" in Japanese",
    seoTitle: "Tabun (たぶん): Saying \"Maybe\" Naturally in Japanese | Frensei",
    seoDescription:
      "たぶん softens statements and avoids sounding too direct. Learn placement and polite alternatives.",
    meaningEn: "Maybe / probably",
    level: "N5",
    nuance:
      "Placed before the predicate to hedge. Japanese prefers soft certainty over blunt yes/no in many social contexts.",
    culturalNote:
      "たぶん大丈夫 means \"probably fine\"—often used to reassure without overcommitting.",
    examples: [
      { ja: "たぶん大丈夫です。", en: "It's probably fine.", context: "Reassuring a worried friend" },
      { ja: "たぶん雨が降る。", en: "It'll probably rain.", context: "Casual weather guess" },
    ],
    commonMistakes: [
      "Giving absolute yes/no answers when たぶん would soften appropriately",
      "Using たぶん in formal written reports without おそらく",
    ],
    relatedSlugs: ["daijoubu-desu", "wakarimashita"],
    tryPrompt: "How do I soften my Japanese so it sounds less direct?",
  },
  {
    slug: "gochisousama",
    topic: "ごちそうさま",
    reading: "ごちそうさま",
    title: "Gochisousama — After-Meal Gratitude",
    seoTitle: "Gochisousama (ごちそうさま): Meaning & When to Say It | Frensei",
    seoDescription:
      "ごちそうさま thanks everyone who made the meal possible. Learn the polite form ごちそうさまでした and pairing with いただきます.",
    meaningEn: "Thank you for the feast / that was a great meal",
    level: "N5",
    nuance:
      "Mirrors いただきます after eating. Acknowledges effort and ingredients—not flattery about taste alone.",
    culturalNote:
      "Say once when finished, especially when leaving a restaurant or someone's home. ごちそうさまでした is safer with hosts.",
    examples: [
      { ja: "ごちそうさまでした。", en: "Thank you for the meal.", context: "Leaving a friend's dinner" },
      { ja: "ごちそうさま。", en: "Thanks for food.", context: "Casual with close friends" },
    ],
    commonMistakes: [
      "Saying it before eating (that is いただきます)",
      "Skipping it when someone cooked for you",
    ],
    relatedSlugs: ["itadakimasu", "arigatou-gozaimasu"],
    tryPrompt: "When do I say ごちそうさまでした?",
  },
  {
    slug: "ganbatte",
    topic: "頑張って",
    reading: "がんばって",
    title: "Ganbatte — Cheer Someone On Naturally",
    seoTitle: "Ganbatte (頑張って): Meaning, Usage & Polite Alternatives | Frensei",
    seoDescription:
      "頑張って encourages effort before exams, sports, or tough days. Learn when it helps—and when お大事に is better.",
    meaningEn: "Do your best / hang in there",
    level: "N5",
    nuance:
      "Signals solidarity, not orders. Tone matters—can feel warm or intense depending on relationship.",
    culturalNote:
      "Common before tests and presentations. After illness, お大事に or お大事にしてください is more appropriate than 頑張って.",
    examples: [
      { ja: "明日の試験、頑張って。", en: "Good luck on tomorrow's exam.", context: "Text to a classmate" },
      { ja: "みんな、頑張りましょう。", en: "Let's all do our best.", context: "Team meeting" },
    ],
    commonMistakes: [
      "Telling someone sick to 頑張って (sounds harsh)",
      "Overusing it when quiet support is enough",
    ],
    relatedSlugs: ["otsukaresama", "daijoubu-desu"],
    tryPrompt: "Is 頑張って appropriate before a job interview?",
  },
  {
    slug: "ikura-desu-ka",
    topic: "いくらですか",
    reading: "いくらですか",
    title: "Ikura Desu Ka — Asking Price Politely",
    seoTitle: "Ikura Desu Ka: How to Ask \"How Much?\" in Japanese | Frensei",
    seoDescription:
      "いくらですか works in shops and markets. Learn casual いくら？ and how to sound polite at souvenir stores.",
    meaningEn: "How much is it?",
    level: "N5",
    nuance:
      "ですか keeps it neutral-polite. Pointing at items while asking is normal; bargaining is rare except flea markets.",
    culturalNote:
      "At konbini prices are fixed—asking is odd. At department stores staff may walk you to the register instead of quoting verbally.",
    examples: [
      { ja: "これはいくらですか。", en: "How much is this?", context: "Souvenir shop" },
      { ja: "全部でいくら？", en: "How much for everything?", context: "Casual market stall" },
    ],
    commonMistakes: [
      "Using overly casual いくら？ with luxury shop staff",
      "Forgetting を when specifying an item (これはいくらですか)",
    ],
    relatedSlugs: ["kore-kudasai", "sumimasen"],
    tryPrompt: "How do I ask the price politely in a department store?",
  },
  {
    slug: "doko-desu-ka",
    topic: "どこですか",
    reading: "どこですか",
    title: "Doko Desu Ka — Asking Where Things Are",
    seoTitle: "Doko Desu Ka: Asking \"Where?\" in Japanese | Frensei",
    seoDescription:
      "どこですか helps you navigate stations, restrooms, and meeting spots. Learn patterns with トイレはどこですか.",
    meaningEn: "Where is it?",
    level: "N5",
    nuance:
      "Place the topic before どこ: 駅はどこですか. どこにありますか is slightly more formal/locational.",
    culturalNote:
      "Staff often gesture or walk you partway—following quickly is polite. Say ありがとうございます after.",
    examples: [
      { ja: "トイレはどこですか。", en: "Where is the restroom?", context: "Restaurant" },
      { ja: "出口はどこ？", en: "Where's the exit?", context: "Casual with friends" },
    ],
    commonMistakes: [
      "Only saying どこ？ without context to strangers",
      "Confusing どこに行きますか (where are you going) when asking location",
    ],
    relatedSlugs: ["sumimasen", "chotto-matte"],
    tryPrompt: "How do I ask where the station exit is politely?",
  },
  {
    slug: "suki-desu",
    topic: "好きです",
    reading: "すきです",
    title: "Suki Desu — Likes, Food, and Soft Confessions",
    seoTitle: "Suki Desu (好きです): Saying \"I Like\" in Japanese | Frensei",
    seoDescription:
      "好きです covers hobbies, food, and feelings. Learn 〜が好きです patterns and how directness differs from English.",
    meaningEn: "I like (it / you)",
    level: "N5",
    nuance:
      "が marks the liked thing: ラーメンが好きです. Romantic 好きです is short and weighty—context does the work.",
    culturalNote:
      "Japanese often expresses preference indirectly. Listing specifics (銀座の寿司が好き) sounds more natural than global statements.",
    examples: [
      { ja: "日本料理が好きです。", en: "I like Japanese food.", context: "Self-introduction" },
      { ja: "この曲、好き。", en: "I like this song.", context: "Casual chat" },
    ],
    commonMistakes: [
      "Using を instead of が (×日本料理を好き)",
      "Saying 好きです to a boss about their hobby (can sound too personal)",
    ],
    relatedSlugs: ["konnichiwa", "arigatou-gozaimasu"],
    tryPrompt: "How do I say I like ramen without sounding like a textbook?",
  },
  {
    slug: "mou-ichido",
    topic: "もう一度",
    reading: "もういちど",
    title: "Mou Ichido — \"One More Time\" Politely",
    seoTitle: "Mou Ichido (もう一度): Asking Someone to Repeat | Frensei",
    seoDescription:
      "もう一度 is essential in language learning and meetings. Learn softer もう一度お願いします and casual もう一回.",
    meaningEn: "Once more / one more time",
    level: "N5",
    nuance:
      "お願いします softens requests. In classrooms teachers expect もう一度言ってください from learners.",
    culturalNote:
      "Covering your mouth slightly and nodding after a repeat shows you are trying—not just demanding.",
    examples: [
      { ja: "もう一度お願いします。", en: "Could you say that again?", context: "Language exchange" },
      { ja: "もう一回。", en: "One more time.", context: "Casual with friends" },
    ],
    commonMistakes: [
      "Demanding もう一度！ without お願いします to superiors",
      "Using English \"repeat\" loanwords in formal settings",
    ],
    relatedSlugs: ["sumimasen", "wakarimashita"],
    tryPrompt: "What's a polite way to ask my teacher to repeat in Japanese?",
  },
  {
    slug: "kekkou-desu",
    topic: "結構です",
    reading: "けっこうです",
    title: "Kekkou Desu — Declining Offers Gracefully",
    seoTitle: "Kekkou Desu (結構です): Saying \"No Thank You\" in Japanese | Frensei",
    seoDescription:
      "結構です softly declines second helpings or sales pitches. Learn pairing with a bow and when いいえ alone sounds harsh.",
    meaningEn: "No thank you / I'm fine",
    level: "N4",
    nuance:
      "Implies you are satisfied already. Softer than blunt いらないです in many service contexts.",
    culturalNote:
      "At meals, refusing more rice with 結構です is standard. Smile and hand gesture (palms forward) help.",
    examples: [
      { ja: "お代わりは結構です。", en: "No more refills, thank you.", context: "Restaurant" },
      { ja: "今日は結構です。", en: "I'm good for today.", context: "Declining a drink offer" },
    ],
    commonMistakes: [
      "Using 結構です to mean \"quite good\" without context (it has both senses)",
      "Flat いいえ alone to a host offering food",
    ],
    relatedSlugs: ["daijoubu-desu", "arigatou-gozaimasu"],
    tryPrompt: "How do I politely decline more food in Japanese?",
  },
  {
    slug: "tetsudatte-kudasai",
    topic: "手伝ってください",
    reading: "てつだってください",
    title: "Tetsudatte Kudasai — Asking for Help",
    seoTitle: "Tetsudatte Kudasai: How to Ask for Help in Japanese | Frensei",
    seoDescription:
      "手伝ってください requests assistance clearly but politely. Learn shorter 手伝って and workplace お手伝いしましょうか.",
    meaningEn: "Please help me",
    level: "N4",
    nuance:
      "ください frames it as a request, not an order. Adding すみませんが first softens further.",
    culturalNote:
      "Offering help uses different grammar: 手伝いましょうか. Accepting with お願いします completes the exchange.",
    examples: [
      { ja: "すみません、手伝ってください。", en: "Excuse me, please help me.", context: "Moving luggage" },
      { ja: "ちょっと手伝って。", en: "Give me a hand.", context: "Casual with roommate" },
    ],
    commonMistakes: [
      "Using 手伝ってください for trivial favors without thanks afterward",
      "Confusing with 助けて (emergency help!)",
    ],
    relatedSlugs: ["onegaishimasu", "sumimasen"],
    tryPrompt: "How do I ask a coworker for help politely in Japanese?",
  },
  {
    slug: "odaiji-ni",
    topic: "お大事に",
    reading: "おだいじに",
    title: "Odaiji Ni — When Someone Is Sick",
    seoTitle: "Odaiji Ni (お大事に): Get Well Wishes in Japanese | Frensei",
    seoDescription:
      "お大事に is the standard get-well phrase. Learn お大事にしてください for extra care and why 頑張って can sound wrong.",
    meaningEn: "Take care / get well",
    level: "N5",
    nuance:
      "Wishes recovery, not effort. お大事にしてください adds polite distance for colleagues and clients.",
    culturalNote:
      "Sent in LINE messages with short updates expected later. Visiting with omiyage is common for close friends.",
    examples: [
      { ja: "お大事にしてください。", en: "Please take care of yourself.", context: "Email to sick colleague" },
      { ja: "お大事に！", en: "Get well soon!", context: "Text to a friend" },
    ],
    commonMistakes: [
      "Saying 頑張って to someone with fever",
      "Using お疲れ様 to someone resting at home sick",
    ],
    relatedSlugs: ["ganbatte", "daijoubu-desu"],
    tryPrompt: "What should I text a friend who caught a cold in Japanese?",
  },
  {
    slug: "tanoshimi-ni",
    topic: "楽しみにしています",
    reading: "たのしみにしています",
    title: "Tanoshimi Ni Shiteimasu — Looking Forward To It",
    seoTitle: "Tanoshimi Ni Shiteimasu: \"Looking Forward\" in Japanese | Frensei",
    seoDescription:
      "楽しみにしています closes emails and plans warmly. Learn shorter 楽しみにしてる and business 楽しみにしております.",
    meaningEn: "I'm looking forward to it",
    level: "N4",
    nuance:
      "Shows positive anticipation for meetings, trips, or collaborations. しております elevates formality.",
    culturalNote:
      "Common after confirming a dinner date or project kickoff. Pairs well with よろしくお願いします in emails.",
    examples: [
      { ja: "来週のイベント、楽しみにしています。", en: "I'm looking forward to next week's event.", context: "Work chat" },
      { ja: "楽しみにしてる！", en: "Can't wait!", context: "Casual with friends" },
    ],
    commonMistakes: [
      "Using 楽しみです alone in formal email (やや幼い印象)",
      "Forgetting to follow up if plans cancel",
    ],
    relatedSlugs: ["yoroshiku-onegaishimasu", "arigatou-gozaimasu"],
    tryPrompt: "How do I say I'm looking forward to our meeting in polite Japanese?",
  },
];

const bySlug = new Map(PHRASES.map((p) => [p.slug, p]));

export function getAllPhrases(): LearnPhrase[] {
  return PHRASES;
}

export function getPhraseBySlug(slug: string): LearnPhrase | undefined {
  return bySlug.get(slug);
}

export function getAllPhraseSlugs(): string[] {
  return PHRASES.map((p) => p.slug);
}
