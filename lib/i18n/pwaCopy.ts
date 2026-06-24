import type { Lang } from "@/src/utils/i18n/types";

export type PwaCopy = {
  installBody: string;
  installButton: string;
  lineHintAndroid: string;
  lineHintIos: string;
  openExternal: string;
  dismiss: string;
};

const COPY: Record<Lang, PwaCopy> = {
  en: {
    installBody: "Add Frensei to your home screen for faster access.",
    installButton: "Install app",
    lineHintAndroid:
      "You're in the LINE in-app browser. Open in Chrome or Safari from the menu for a better experience.",
    lineHintIos:
      "LINE's browser can feel cramped. Open in Safari from the menu for a smoother experience.",
    openExternal: "Open in browser",
    dismiss: "Dismiss",
  },
  ja: {
    installBody: "ホーム画面に追加すると、すぐに Frensei を開けます。",
    installButton: "アプリをインストール",
    lineHintAndroid:
      "LINE内ブラウザで開いています。メニューから Chrome / Safari で開くと快適です。",
    lineHintIos:
      "LINE内ブラウザだと操作しづらいです。右上メニューから Safari で開くと使いやすくなります。",
    openExternal: "外部ブラウザで開く",
    dismiss: "閉じる",
  },
  ko: {
    installBody: "홈 화면에 추가하면 Frensei에 더 빠르게 접근할 수 있어요.",
    installButton: "앱 설치",
    lineHintAndroid:
      "LINE 인앱 브라우저입니다. 메뉴에서 Chrome이나 Safari로 열면 더 편해요.",
    lineHintIos:
      "LINE 브라우저에서는 불편할 수 있어요. 메뉴에서 Safari로 열어 보세요.",
    openExternal: "브라우저에서 열기",
    dismiss: "닫기",
  },
  zh: {
    installBody: "添加到主屏幕，更快打开 Frensei。",
    installButton: "安装应用",
    lineHintAndroid: "当前在 LINE 内置浏览器中。从菜单用 Chrome 或 Safari 打开体验更好。",
    lineHintIos: "LINE 内置浏览器可能不太顺手。从菜单用 Safari 打开会更流畅。",
    openExternal: "在浏览器中打开",
    dismiss: "关闭",
  },
};

export function getPwaCopy(lang: Lang): PwaCopy {
  return COPY[lang] ?? COPY.en;
}
