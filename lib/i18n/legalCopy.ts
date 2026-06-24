import type { Lang } from "@/src/utils/i18n/types";

export const CONTACT_EMAIL = "frensei.jp@gmail.com";

export type FooterCopy = {
  terms: string;
  privacy: string;
  contact: string;
  feedback: string;
};

export type LegalArticle = {
  title: string;
  body?: string[];
  bullets?: string[];
};

export type TermsCopy = {
  eyebrow: string;
  title: string;
  lastUpdatedLabel: string;
  lastUpdated: string;
  versionLabel: string;
  version: string;
  intro: string;
  articles: LegalArticle[];
  contactBlock: string;
  contactHours: string;
  agreeCta: string;
  backToTop: string;
};

export type PrivacyCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalArticle[];
  contactTitle: string;
  contactBody: string;
  contactPageLink: string;
  backHome: string;
  backToTop: string;
  mailSubject: string;
};

export type ContactCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  contactTitle: string;
  emailLabel: string;
  replyNote: string;
  relatedTitle: string;
  relatedFeedback: string;
  relatedFeedbackDesc: string;
  relatedPrivacy: string;
  relatedPrivacyDesc: string;
  relatedTerms: string;
  backHome: string;
  mailSubject: string;
};

const FOOTER: Record<Lang, FooterCopy> = {
  en: { terms: "Terms of Service", privacy: "Privacy Policy", contact: "Contact", feedback: "Feedback" },
  ja: { terms: "利用規約", privacy: "プライバシーポリシー", contact: "お問い合わせ", feedback: "感想" },
  ko: { terms: "이용약관", privacy: "개인정보 처리방침", contact: "문의", feedback: "피드백" },
  zh: { terms: "服务条款", privacy: "隐私政策", contact: "联系我们", feedback: "反馈" },
};

const TERMS: Record<Lang, TermsCopy> = {
  ja: {
    eyebrow: "FRENSEI BETA TERMS",
    title: "利用規約（ベータ版）",
    lastUpdatedLabel: "最終更新日",
    lastUpdated: "2026年4月2日",
    versionLabel: "バージョン",
    version: "Beta 1.0",
    intro:
      "ご利用前に必ずお読みください。本サービス「Frensei」はベータ版（試験提供段階）のAIサービスです。ベータ期間中はサービスの品質・内容・機能が予告なく変更される場合があります。本規約に同意いただいた上でご利用ください。",
    articles: [
      {
        title: "第1条 総則",
        body: [
          "1. 本利用規約（以下「本規約」）は、Frensei（以下「当社」または「運営者」）が提供する日本語学習AIサービス「Frensei」（以下「本サービス」）の利用条件を定めるものです。",
          "2. ユーザー（以下「利用者」）は、本サービスにアクセスまたは利用を開始した時点で、本規約に同意したものとみなします。",
          "3. 本サービスはベータ版として提供されており、本番リリース版とは品質・機能・安定性が異なる場合があります。",
        ],
      },
      {
        title: "第2条 ベータ版サービスの性質",
        bullets: [
          "AIによる日本語学習支援の精度・正確性は保証されません。",
          "サービスの内容・機能・仕様は予告なく変更・追加・削除される場合があります。",
          "サービスの中断・停止が予告なく発生する場合があります。",
          "ベータ期間終了後、サービスの提供条件が変更される場合があります。",
          "ベータ版のデータ・学習履歴は、正式版への移行時に引き継がれない場合があります。",
        ],
      },
      {
        title: "第3条 免責事項（重要）",
        body: [
          "3-1 AIの回答精度に関する免責: Frenseiが提供するAIによる日本語学習支援は参考情報として提供されるものです。その内容の正確性・完全性・最新性を当社は一切保証しません。",
          "3-2 学習成果に関する免責: 本サービスの利用により特定の日本語能力の習得・向上を保証するものではありません。",
          "3-3 サービス停止・データ損失に関する免責: システム障害等によるサービスの中断・停止、および利用者データの消失・破損について、当社は一切責任を負いません。",
          "3-4 第三者サービスとの連携に関する免責: 外部API等の第三者サービスに起因する不具合等による損害について、当社は責任を負いません。",
          "3-5 損害賠償の制限: 当社の賠償責任は直接かつ通常の損害に限られ、賠償総額は直近3か月分の利用料金（無償利用時は1,000円）を上限とします。",
        ],
      },
      {
        title: "第4条 利用者の責任",
        bullets: [
          "本サービスを日本語学習の補助ツールとして適切に利用すること。",
          "AIの回答を盲目的に信頼せず、重要な場面では必ず公式情報を確認すること。",
          "本サービスを不正・違法な目的に使用しないこと。",
          "他の利用者または第三者の権利を侵害しないこと。",
          "本サービスのシステムに対して過度な負荷をかける行為を行わないこと。",
        ],
      },
      {
        title: "第5条 知的財産権",
        body: [
          "本サービスに含まれるコンテンツの著作権その他知的財産権は当社または正当な権利者に帰属します。利用者は個人的な学習目的の範囲内でのみ使用できるものとし、無断での複製・転載・二次利用は禁止します。",
        ],
      },
      {
        title: "第6条 プライバシーと個人情報",
        body: [
          "当社は、利用者の個人情報を別途定める「Frenseiプライバシーポリシー」に従い適切に取り扱います。",
        ],
      },
      {
        title: "第7条 規約の変更",
        body: ["当社は、必要に応じて本規約をいつでも変更できるものとします。変更後の規約は本サービス上に掲示された時点で効力を生じます。"],
      },
      {
        title: "第8条 サービスの終了",
        body: ["当社は、ベータ版サービスをいつでも予告の有無にかかわらず終了できるものとします。"],
      },
      {
        title: "第9条 準拠法および管轄",
        body: [
          "本規約は日本法に準拠し、紛争が生じた場合、当社所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。",
        ],
      },
    ],
    contactBlock: "お問い合わせ：Frensei サポート窓口（frensei.jp@gmail.com）",
    contactHours: "受付時間：平日 10:00〜18:00（日本時間）",
    agreeCta: "同意して利用を開始する",
    backToTop: "トップへ戻る",
  },
  en: {
    eyebrow: "FRENSEI BETA TERMS",
    title: "Terms of Service (Beta)",
    lastUpdatedLabel: "Last updated",
    lastUpdated: "April 2, 2026",
    versionLabel: "Version",
    version: "Beta 1.0",
    intro:
      "Please read before use. Frensei is an AI Japanese learning service provided as a beta (trial) release. Features, quality, and content may change without notice during the beta period. By using the service, you agree to these terms.",
    articles: [
      {
        title: "Article 1 — General",
        body: [
          "1. These Terms of Service govern your use of Frensei, an AI Japanese learning service operated by Frensei.",
          "2. By accessing or using the service, you are deemed to have agreed to these Terms.",
          "3. The service is provided as a beta version and may differ in quality, features, and stability from a future production release.",
        ],
      },
      {
        title: "Article 2 — Nature of the Beta Service",
        bullets: [
          "Accuracy of AI-powered Japanese learning support is not guaranteed.",
          "Content, features, and specifications may change, be added, or removed without notice.",
          "Service interruptions or shutdowns may occur without notice.",
          "Service conditions may change after the beta period ends.",
          "Beta data and learning history may not carry over to a future release.",
        ],
      },
      {
        title: "Article 3 — Disclaimers (Important)",
        body: [
          "3-1 AI accuracy: AI-generated explanations, translations, and examples are for reference only. We do not guarantee accuracy, completeness, or timeliness.",
          "3-2 Learning outcomes: We do not guarantee any specific improvement in Japanese ability.",
          "3-3 Service outages and data loss: We are not liable for interruptions, data loss, or corruption due to outages, maintenance, or unforeseen events.",
          "3-4 Third-party services: We are not liable for issues caused by external APIs or third-party providers.",
          "3-5 Limitation of liability: Our liability is limited to direct, ordinary damages, capped at fees paid in the prior three months (or ¥1,000 if free).",
        ],
      },
      {
        title: "Article 4 — User Responsibilities",
        bullets: [
          "Use the service appropriately as a supplementary Japanese learning tool.",
          "Do not blindly trust AI answers; verify important information from official sources.",
          "Do not use the service for unlawful or abusive purposes.",
          "Do not infringe the rights of others.",
          "Do not place excessive load on the service systems.",
        ],
      },
      {
        title: "Article 5 — Intellectual Property",
        body: [
          "Content in the service belongs to us or rightful owners. You may use it only for personal learning; unauthorized copying or redistribution is prohibited.",
        ],
      },
      {
        title: "Article 6 — Privacy",
        body: ["We handle personal information according to our Privacy Policy."],
      },
      {
        title: "Article 7 — Changes to Terms",
        body: ["We may change these Terms at any time. Updated Terms take effect when posted on the service."],
      },
      {
        title: "Article 8 — Termination",
        body: ["We may terminate the beta service at any time, with or without notice."],
      },
      {
        title: "Article 9 — Governing Law and Jurisdiction",
        body: [
          "These Terms are governed by the laws of Japan. Disputes shall be subject to the exclusive jurisdiction of the courts where we are located.",
        ],
      },
    ],
    contactBlock: "Contact: Frensei Support (frensei.jp@gmail.com)",
    contactHours: "Hours: Weekdays 10:00–18:00 (Japan time)",
    agreeCta: "Agree and start using",
    backToTop: "Back to top",
  },
  ko: {
    eyebrow: "FRENSEI BETA TERMS",
    title: "이용약관 (베타)",
    lastUpdatedLabel: "최종 업데이트",
    lastUpdated: "2026년 4월 2일",
    versionLabel: "버전",
    version: "Beta 1.0",
    intro:
      "이용 전 반드시 읽어 주세요. Frensei는 베타(시험 제공) 단계의 AI 일본어 학습 서비스입니다. 베타 기간 중 품질·기능·내용이 예고 없이 변경될 수 있습니다.",
    articles: [
      {
        title: "제1조 총칙",
        body: [
          "1. 본 이용약관은 Frensei가 제공하는 AI 일본어 학습 서비스의 이용 조건을 정합니다.",
          "2. 서비스에 접속하거나 이용을 시작하면 본 약관에 동의한 것으로 봅니다.",
          "3. 본 서비스는 베타 버전으로 제공되며 정식 출시 버전과 품질·기능·안정성이 다를 수 있습니다.",
        ],
      },
      {
        title: "제2조 베타 서비스의 성격",
        bullets: [
          "AI 일본어 학습 지원의 정확성은 보장되지 않습니다.",
          "서비스 내용·기능·사양은 예고 없이 변경·추가·삭제될 수 있습니다.",
          "서비스 중단·종료가 예고 없이 발생할 수 있습니다.",
          "베타 종료 후 제공 조건이 변경될 수 있습니다.",
          "베타 데이터·학습 기록은 정식 버전으로 이전되지 않을 수 있습니다.",
        ],
      },
      {
        title: "제3조 면책 (중요)",
        body: [
          "3-1 AI 정확성: AI가 제공하는 설명·번역·예문은 참고용이며 정확성을 보장하지 않습니다.",
          "3-2 학습 성과: 특정 일본어 능력 향상을 보장하지 않습니다.",
          "3-3 서비스 중단·데이터 손실: 장애·유지보수 등으로 인한 중단·데이터 손실에 대해 책임지지 않습니다.",
          "3-4 제3자 서비스: 외부 API 등 제3자 서비스로 인한 손해에 대해 책임지지 않습니다.",
          "3-5 손해배상 한도: 직접적·통상적 손해로 한정하며, 최근 3개월 이용료(무료 시 1,000엔)를 상한으로 합니다.",
        ],
      },
      {
        title: "제4조 이용자 책임",
        bullets: [
          "일본어 학습 보조 도구로 적절히 이용할 것.",
          "AI 답변을 맹신하지 말고 중요한 경우 공식 정보를 확인할 것.",
          "불법·부정한 목적으로 사용하지 않을 것.",
          "타인의 권리를 침해하지 않을 것.",
          "시스템에 과도한 부하를 주지 않을 것.",
        ],
      },
      {
        title: "제5조 지적재산권",
        body: ["서비스 콘텐츠의 저작권 등은 당사 또는 정당한 권리자에게 귀속됩니다. 개인 학습 목적 범위 내에서만 이용할 수 있습니다."],
      },
      { title: "제6조 개인정보", body: ["개인정보는 별도의 개인정보 처리방침에 따라 처리합니다."] },
      { title: "제7조 약관 변경", body: ["필요 시 약관을 변경할 수 있으며, 게시 시점부터 효력이 발생합니다."] },
      { title: "제8조 서비스 종료", body: ["베타 서비스는 예고 여부와 관계없이 종료할 수 있습니다."] },
      { title: "제9조 준거법 및 관할", body: ["본 약관은 일본법을 준거법으로 하며, 분쟁은 당사 소재지 관할 법원을 전속 관할로 합니다."] },
    ],
    contactBlock: "문의: Frensei 지원 (frensei.jp@gmail.com)",
    contactHours: "접수: 평일 10:00–18:00 (일본 시간)",
    agreeCta: "동의하고 이용 시작",
    backToTop: "맨 위로",
  },
  zh: {
    eyebrow: "FRENSEI BETA TERMS",
    title: "服务条款（测试版）",
    lastUpdatedLabel: "最后更新",
    lastUpdated: "2026年4月2日",
    versionLabel: "版本",
    version: "Beta 1.0",
    intro:
      "使用前请仔细阅读。Frensei 是以测试版（试用阶段）提供的 AI 日语学习服务。测试期间服务质量、内容和功能可能随时变更。使用即表示同意本条款。",
    articles: [
      {
        title: "第1条 总则",
        body: [
          "1. 本服务条款适用于 Frensei 提供的 AI 日语学习服务。",
          "2. 访问或使用本服务即视为同意本条款。",
          "3. 本服务以测试版提供，与正式版的品质、功能和稳定性可能不同。",
        ],
      },
      {
        title: "第2条 测试版性质",
        bullets: [
          "不保证 AI 日语学习支持的准确性。",
          "服务内容、功能和规格可能随时变更、增加或删除。",
          "服务可能无预告中断或停止。",
          "测试期结束后提供条件可能变更。",
          "测试版数据和学习记录可能无法迁移至正式版。",
        ],
      },
      {
        title: "第3条 免责声明（重要）",
        body: [
          "3-1 AI 准确性：AI 提供的解释、翻译和例句仅供参考，不保证准确、完整或最新。",
          "3-2 学习成果：不保证特定日语能力提升。",
          "3-3 服务中断与数据丢失：对故障、维护等导致的中断或数据丢失不承担责任。",
          "3-4 第三方服务：对外部 API 等第三方服务引起的问题不承担责任。",
          "3-5 赔偿限制：赔偿责任限于直接通常损失，上限为近三个月费用（免费时为 1,000 日元）。",
        ],
      },
      {
        title: "第4条 用户责任",
        bullets: [
          "将本服务作为日语学习的辅助工具合理使用。",
          "不要盲目相信 AI 回答，重要场合请查阅官方信息。",
          "不得用于违法或不正当目的。",
          "不得侵害他人权利。",
          "不得对系统施加过度负载。",
        ],
      },
      { title: "第5条 知识产权", body: ["服务内容版权归我们或权利人所有。仅限个人学习使用，禁止未经授权复制或转载。"] },
      { title: "第6条 隐私", body: ["个人信息按照隐私政策处理。"] },
      { title: "第7条 条款变更", body: ["我们可随时变更本条款，变更后条款自发布时生效。"] },
      { title: "第8条 服务终止", body: ["我们可随时终止测试版服务，无论是否预告。"] },
      { title: "第9条 适用法律与管辖", body: ["本条款适用日本法律，争议由我们所在地法院专属管辖。"] },
    ],
    contactBlock: "联系：Frensei 支持（frensei.jp@gmail.com）",
    contactHours: "受理时间：工作日 10:00–18:00（日本时间）",
    agreeCta: "同意并开始使用",
    backToTop: "返回顶部",
  },
};

const PRIVACY: Record<Lang, PrivacyCopy> = {
  ja: {
    eyebrow: "FRENSEI PRIVACY POLICY",
    title: "プライバシーポリシー",
    intro:
      "Frensei（ベータ版）における個人情報および利用データの取り扱い方針を定めます。Amazonアソシエイト・プログラムへの参加および Cookie を用いた広告配信についても説明します。",
    sections: [
      { title: "1. 取得する情報", body: ["アカウント情報、利用ログ、学習履歴、AIとの会話データ等を、サービス提供に必要な範囲で取得することがあります。"] },
      { title: "2. 利用目的", body: ["本人確認、サービス提供、品質向上、不具合対応、利用状況分析、セキュリティ確保の目的で利用します。"] },
      {
        title: "3. Amazonアソシエイト・プログラムについて",
        body: [
          "当サイトは Amazon アソシエイト・プログラムの参加者です。",
          "本サービス内に Amazon へのリンクが掲載される場合があり、条件を満たした購入により紹介料を受け取ることがあります。",
          "商品の購入契約は利用者と Amazon（または出品者）との間で成立し、当社は契約当事者ではありません。",
        ],
      },
      {
        title: "4. Cookie および広告配信について",
        body: [
          "利用状況の把握、利便性向上、セキュリティ、広告配信・効果測定のため Cookie 等を使用する場合があります。",
          "第三者の広告・分析サービスにより、興味に応じた広告が表示されることがあります。",
          "ブラウザ設定で Cookie を無効化できますが、一部機能が動作しない場合があります。",
        ],
      },
      {
        title: "5. ベータ版におけるデータ利用",
        body: ["サービス改善のために学習ログおよび会話データを分析する場合があります。", "分析結果は品質向上に活用され、個人を特定しない形で統計化することがあります。"],
      },
      { title: "6. 第三者提供", body: ["法令に基づく場合を除き、本人の同意なく個人情報を第三者へ提供しません。"] },
      { title: "7. 安全管理", body: ["不正アクセス、漏えい、滅失、毀損の防止に向け、技術的・組織的な安全管理措置を実施します。"] },
      { title: "8. 開示・訂正・削除等", body: ["法令に従い、自己情報の開示・訂正・利用停止・削除等を請求できます。"] },
      { title: "9. ポリシーの改定", body: ["法令改正やサービス変更等に応じて本ポリシーを改定することがあります。"] },
    ],
    contactTitle: "お問い合わせ",
    contactBody: "本ポリシーに関するご質問は、",
    contactPageLink: "お問い合わせページ",
    backHome: "トップへ戻る",
    backToTop: "ページ上部へ",
    mailSubject: "プライバシーポリシーに関するお問い合わせ",
  },
  en: {
    eyebrow: "FRENSEI PRIVACY POLICY",
    title: "Privacy Policy",
    intro:
      "This policy describes how Frensei (beta) handles personal information and usage data, including participation in the Amazon Associates Program and use of cookies for advertising.",
    sections: [
      { title: "1. Information we collect", body: ["We may collect account information, usage logs, learning history, and AI conversation data as needed to provide the service."] },
      { title: "2. How we use information", body: ["For identity verification, service delivery, quality improvement, bug fixes, analytics, and security."] },
      {
        title: "3. Amazon Associates Program",
        body: [
          "We participate in the Amazon Associates Program.",
          "Amazon links may appear in the service; we may earn referral fees on qualifying purchases.",
          "Purchase contracts are between you and Amazon (or sellers); we are not a party to those contracts.",
        ],
      },
      {
        title: "4. Cookies and advertising",
        body: [
          "We may use cookies and similar technologies for analytics, convenience, security, and ad delivery/measurement.",
          "Third-party ad/analytics providers may show interest-based ads.",
          "You can disable cookies in your browser, but some features may not work correctly.",
        ],
      },
      {
        title: "5. Beta data use",
        body: ["During beta, we may analyze learning logs and conversation data to improve the service.", "Results may be aggregated without identifying individuals."],
      },
      { title: "6. Third-party sharing", body: ["We do not share personal data with third parties without consent, except as required by law."] },
      { title: "7. Security", body: ["We implement technical and organizational measures to prevent unauthorized access, leakage, loss, or damage."] },
      { title: "8. Access, correction, deletion", body: ["You may request access, correction, suspension, or deletion of your data as permitted by law."] },
      { title: "9. Policy updates", body: ["We may update this policy due to legal or service changes; updates take effect when posted."] },
    ],
    contactTitle: "Contact",
    contactBody: "For questions about this policy, email ",
    contactPageLink: "Contact page",
    backHome: "Back to home",
    backToTop: "Back to top",
    mailSubject: "Privacy Policy inquiry",
  },
  ko: {
    eyebrow: "FRENSEI PRIVACY POLICY",
    title: "개인정보 처리방침",
    intro:
      "Frensei(베타)의 개인정보 및 이용 데이터 처리 방침입니다. Amazon 어소시에이트 프로그램 참여 및 Cookie 기반 광고에 대해서도 설명합니다.",
    sections: [
      { title: "1. 수집하는 정보", body: ["서비스 제공에 필요한 범위에서 계정 정보, 이용 로그, 학습 기록, AI 대화 데이터 등을 수집할 수 있습니다."] },
      { title: "2. 이용 목적", body: ["본인 확인, 서비스 제공, 품질 개선, 오류 대응, 이용 분석, 보안 확보 목적으로 이용합니다."] },
      {
        title: "3. Amazon 어소시에이트 프로그램",
        body: [
          "당사는 Amazon 어소시에이트 프로그램 참가자입니다.",
          "서비스 내 Amazon 링크를 통해 조건을 충족한 구매 시 소개 수수료를 받을 수 있습니다.",
          "구매 계약은 이용자와 Amazon(또는 판매자) 간에 성립하며 당사는 당사자가 아닙니다.",
        ],
      },
      {
        title: "4. Cookie 및 광고",
        body: [
          "이용 파악, 편의성, 보안, 광고 배송·효과 측정을 위해 Cookie 등을 사용할 수 있습니다.",
          "제3자 광고·분석 서비스로 관심 기반 광고가 표시될 수 있습니다.",
          "브라우저에서 Cookie를 비활성화할 수 있으나 일부 기능이 작동하지 않을 수 있습니다.",
        ],
      },
      {
        title: "5. 베타 데이터 이용",
        body: ["서비스 개선을 위해 학습 로그 및 대화 데이터를 분석할 수 있습니다.", "분석 결과는 개인을 특정하지 않는 형태로 통계화될 수 있습니다."],
      },
      { title: "6. 제3자 제공", body: ["법령에 따른 경우를 제외하고 동의 없이 제3자에게 제공하지 않습니다."] },
      { title: "7. 안전 관리", body: ["부정 접근, 유출, 멸실, 훼손 방지를 위한 기술적·조직적 조치를 시행합니다."] },
      { title: "8. 열람·정정·삭제", body: ["법령에 따라 자신의 정보에 대한 열람·정정·이용 정지·삭제를 요청할 수 있습니다."] },
      { title: "9. 방침 개정", body: ["법령 개정이나 서비스 변경에 따라 본 방침을 개정할 수 있습니다."] },
    ],
    contactTitle: "문의",
    contactBody: "본 방침에 관한 문의는 ",
    contactPageLink: "문의 페이지",
    backHome: "홈으로",
    backToTop: "맨 위로",
    mailSubject: "개인정보 처리방침 문의",
  },
  zh: {
    eyebrow: "FRENSEI PRIVACY POLICY",
    title: "隐私政策",
    intro:
      "本政策说明 Frensei（测试版）如何处理个人信息和使用数据，包括参与 Amazon 联盟计划及使用 Cookie 进行广告投放。",
    sections: [
      { title: "1. 收集的信息", body: ["我们可能在提供服务所需的范围内收集账户信息、使用日志、学习记录和 AI 对话数据。"] },
      { title: "2. 使用目的", body: ["用于身份验证、提供服务、改进质量、故障处理、使用分析和安全保障。"] },
      {
        title: "3. Amazon 联盟计划",
        body: [
          "我们参与 Amazon 联盟计划。",
          "服务中可能显示 Amazon 链接，符合条件的购买可能产生推荐佣金。",
          "购买合同在您与 Amazon（或卖家）之间成立，我们并非合同当事方。",
        ],
      },
      {
        title: "4. Cookie 与广告",
        body: [
          "我们可能使用 Cookie 等技术进行使用分析、提升便利性、安全保障及广告投放/效果测量。",
          "第三方广告/分析服务可能展示兴趣相关广告。",
          "您可在浏览器中禁用 Cookie，但部分功能可能无法正常使用。",
        ],
      },
      {
        title: "5. 测试版数据使用",
        body: ["测试期间可能分析学习日志和对话数据以改进服务。", "分析结果可能以不识别个人的统计形式使用。"],
      },
      { title: "6. 向第三方提供", body: ["除法律规定外，未经同意不向第三方提供个人信息。"] },
      { title: "7. 安全管理", body: ["我们采取技术和组织措施防止未经授权的访问、泄露、丢失或损毁。"] },
      { title: "8. 查阅、更正、删除", body: ["您可依法请求查阅、更正、停止使用或删除您的信息。"] },
      { title: "9. 政策修订", body: ["我们可能因法律或服务变更而修订本政策，修订后自发布时生效。"] },
    ],
    contactTitle: "联系我们",
    contactBody: "有关本政策的问题，请发送邮件至 ",
    contactPageLink: "联系页面",
    backHome: "返回首页",
    backToTop: "返回顶部",
    mailSubject: "隐私政策咨询",
  },
};

const CONTACT: Record<Lang, ContactCopy> = {
  ja: {
    eyebrow: "FRENSEI CONTACT",
    title: "お問い合わせ",
    intro:
      "本サービスに関するご質問、不具合のご報告、Amazonアソシエイト掲載に関するお問い合わせなどは、下記メールアドレスまでご連絡ください。",
    contactTitle: "連絡先",
    emailLabel: "メールアドレス：",
    replyNote: "返信まで数日かかる場合があります。内容によってはお答えできないこともありますので、あらかじめご了承ください。",
    relatedTitle: "関連ページ",
    relatedFeedback: "感想",
    relatedFeedbackDesc: "（フィードバック・ご意見）",
    relatedPrivacy: "プライバシーポリシー",
    relatedPrivacyDesc: "（Cookie・広告・アソシエイトについて）",
    relatedTerms: "利用規約",
    backHome: "トップへ戻る",
    mailSubject: "Frensei に関するお問い合わせ",
  },
  en: {
    eyebrow: "FRENSEI CONTACT",
    title: "Contact",
    intro:
      "For questions about the service, bug reports, or Amazon Associates listings, please email us at the address below.",
    contactTitle: "Contact details",
    emailLabel: "Email: ",
    replyNote: "Replies may take several days. We may not be able to answer every inquiry.",
    relatedTitle: "Related pages",
    relatedFeedback: "Feedback",
    relatedFeedbackDesc: " (bugs, ideas, comments)",
    relatedPrivacy: "Privacy Policy",
    relatedPrivacyDesc: " (cookies, ads, affiliates)",
    relatedTerms: "Terms of Service",
    backHome: "Back to home",
    mailSubject: "Frensei inquiry",
  },
  ko: {
    eyebrow: "FRENSEI CONTACT",
    title: "문의",
    intro: "서비스 관련 질문, 버그 신고, Amazon 어소시에이트 관련 문의는 아래 이메일로 연락해 주세요.",
    contactTitle: "연락처",
    emailLabel: "이메일: ",
    replyNote: "답변까지 며칠 걸릴 수 있습니다. 모든 문의에 답변드리지 못할 수 있습니다.",
    relatedTitle: "관련 페이지",
    relatedFeedback: "피드백",
    relatedFeedbackDesc: " (버그, 아이디어, 의견)",
    relatedPrivacy: "개인정보 처리방침",
    relatedPrivacyDesc: " (Cookie, 광고, 어소시에이트)",
    relatedTerms: "이용약관",
    backHome: "홈으로",
    mailSubject: "Frensei 문의",
  },
  zh: {
    eyebrow: "FRENSEI CONTACT",
    title: "联系我们",
    intro: "有关本服务的问题、故障报告或 Amazon 联盟相关咨询，请通过下方邮箱联系我们。",
    contactTitle: "联系方式",
    emailLabel: "邮箱：",
    replyNote: "回复可能需要数日，我们可能无法回答所有咨询，敬请谅解。",
    relatedTitle: "相关页面",
    relatedFeedback: "反馈",
    relatedFeedbackDesc: "（错误、建议、意见）",
    relatedPrivacy: "隐私政策",
    relatedPrivacyDesc: "（Cookie、广告、联盟）",
    relatedTerms: "服务条款",
    backHome: "返回首页",
    mailSubject: "Frensei 咨询",
  },
};

export function getFooterCopy(lang: Lang): FooterCopy {
  return FOOTER[lang] ?? FOOTER.en;
}

export function getTermsCopy(lang: Lang): TermsCopy {
  return TERMS[lang] ?? TERMS.en;
}

export function getPrivacyCopy(lang: Lang): PrivacyCopy {
  return PRIVACY[lang] ?? PRIVACY.en;
}

export function getContactCopy(lang: Lang): ContactCopy {
  return CONTACT[lang] ?? CONTACT.en;
}
