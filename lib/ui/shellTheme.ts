/** Shared light/dark tokens for the in-app shell (nav, chat, progress, more). */
export function shellTheme(isLight: boolean) {
  return {
    nav: isLight
      ? "border-neutral-200/90 bg-white/95 backdrop-blur-xl"
      : "border-slate-800/60 bg-slate-950 backdrop-blur-xl",
    navActive: "text-wa-ruri",
    navInactive: isLight ? "text-neutral-500 hover:text-neutral-800" : "text-slate-500 hover:text-slate-300",
    navChatInactive: isLight ? "text-neutral-600" : "text-slate-300",
    pageTitle: isLight ? "text-neutral-900" : "text-slate-50",
    pageMuted: isLight ? "text-neutral-500" : "text-slate-400",
    card: isLight
      ? "border-neutral-200/90 bg-white/90"
      : "border-slate-800/70 bg-slate-950/80",
    chatHeaderBorder: isLight ? "border-neutral-200/80" : "border-slate-800/20",
    chatTitle: isLight ? "text-neutral-900" : "text-slate-50",
    chatPanel: isLight
      ? "border-neutral-200/80 bg-neutral-50/60"
      : "border-slate-800/20 bg-slate-950/20",
    chatIconBtn: isLight
      ? "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
      : "border-slate-700/60 bg-slate-900/50 text-slate-300",
    chatSettingsBtn: isLight
      ? "border-neutral-300 bg-white text-neutral-800 hover:border-neutral-400"
      : "border-slate-700/80 bg-slate-900/50 text-slate-200 hover:border-slate-600",
    chatSettingsBtnActive: isLight
      ? "border-wa-ruri/50 bg-sky-50 text-wa-ruri"
      : "border-wa-ruri/60 bg-wa-ruri/15 text-wa-asagi",
    select: isLight
      ? "border-neutral-300 bg-white text-neutral-900 focus:ring-wa-ruri"
      : "border-slate-700 bg-slate-900/80 text-slate-100 focus:ring-wa-ruri",
    glassPill: isLight
      ? "border-neutral-200 bg-neutral-50/90"
      : "border-yomu-glassBorder bg-yomu-glass",
  };
}
