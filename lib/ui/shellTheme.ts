/** Shared light/dark tokens for the in-app shell (nav, chat, progress, more). */
export function shellTheme(isLight: boolean) {
  return {
    nav: isLight
      ? "border-slate-200 bg-white/95 backdrop-blur-xl"
      : "border-slate-800/60 bg-slate-950 backdrop-blur-xl",
    navActive: isLight ? "text-blue-600" : "text-wa-ruri",
    navInactive: isLight ? "text-slate-600 hover:text-slate-900" : "text-slate-500 hover:text-slate-300",
    navChatInactive: isLight ? "text-slate-700" : "text-slate-300",
    navChatFab: isLight
      ? "bg-blue-600 ring-2 ring-blue-200 shadow-md"
      : "bg-gradient-to-br from-wa-ruri to-wa-asagi ring-2 ring-wa-asagi/60 shadow-glass",
    pageTitle: isLight ? "text-slate-900" : "text-slate-50",
    pageMuted: isLight ? "text-slate-600" : "text-slate-400",
    card: isLight ? "border-slate-200 bg-white shadow-sm" : "border-slate-800/70 bg-slate-950/80",
    chatHeaderBorder: isLight ? "border-slate-200" : "border-slate-800/20",
    chatTitle: isLight ? "text-slate-900" : "text-slate-50",
    chatPanel: isLight
      ? "border-slate-200 bg-white shadow-sm"
      : "border-slate-800/20 bg-slate-950/20",
    chatIconBtn: isLight
      ? "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
      : "border-slate-700/60 bg-slate-900/50 text-slate-300",
    chatSettingsBtn: isLight
      ? "border-slate-300 bg-white text-slate-800 hover:border-slate-400"
      : "border-slate-700/80 bg-slate-900/50 text-slate-200 hover:border-slate-600",
    chatSettingsBtnActive: isLight
      ? "border-blue-400 bg-blue-50 text-blue-700"
      : "border-wa-ruri/60 bg-wa-ruri/15 text-wa-asagi",
    chatSettingsPanel: isLight
      ? "border-slate-200 bg-slate-50"
      : "border-slate-700/45 bg-slate-900/35",
    select: isLight
      ? "border-slate-300 bg-white text-slate-900 focus:ring-blue-500"
      : "border-slate-700 bg-slate-900/80 text-slate-100 focus:ring-wa-ruri",
    glassPill: isLight
      ? "border-slate-200 bg-slate-50"
      : "border-frensei-glassBorder bg-frensei-glass",
    brandIcon: isLight ? "bg-blue-600" : "bg-gradient-to-br from-wa-ruri to-wa-asagi",
    userBubble: isLight
      ? "rounded-br-md border border-blue-600 bg-blue-600 text-white shadow-sm"
      : "rounded-br-md border border-wa-ruri/35 bg-wa-ruri/20 text-slate-50 shadow-sm",
    assistantBubble: isLight
      ? "rounded-bl-md border border-slate-200 bg-slate-100 text-slate-800 shadow-sm"
      : "rounded-bl-md border border-slate-700/45 bg-slate-800/50 text-slate-100 shadow-sm",
    ringOffset: isLight ? "ring-offset-slate-50" : "ring-offset-slate-950",
    coachNote: isLight
      ? "border-blue-200 bg-blue-50 text-blue-900"
      : "border-pink-500/30 bg-pink-500/10 text-pink-50",
    coachNoteTitle: isLight ? "text-blue-800" : "text-pink-100",
    starterChip: isLight
      ? "border-slate-200 bg-white text-slate-800 hover:border-blue-300 hover:bg-blue-50"
      : "border-pink-500/25 bg-pink-500/8 text-slate-100 hover:border-pink-500/45 hover:bg-pink-500/15",
    starterChipRecommended: isLight
      ? "border-blue-300 bg-blue-50 text-slate-900 ring-1 ring-blue-200 hover:border-blue-400 hover:bg-blue-100"
      : "border-violet-400/45 bg-violet-500/15 text-slate-100 ring-1 ring-violet-400/25 hover:border-violet-400/60 hover:bg-violet-500/22",
    composer: isLight
      ? "border-slate-300 bg-white shadow-sm"
      : "border-slate-700/55 bg-slate-950/95 shadow-lg backdrop-blur-md",
    composerInput: isLight
      ? "text-slate-900 placeholder:text-slate-400"
      : "text-slate-100 placeholder:text-slate-500",
    sendBtn: isLight
      ? "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-300 disabled:text-slate-500"
      : "bg-wa-ruri hover:bg-wa-asagi text-slate-50 disabled:bg-wa-hai/50 disabled:text-slate-400",
    typingBubble: isLight
      ? "border-slate-200 bg-white"
      : "border-frensei-glassBorder bg-frensei-glass",
    metaMuted: isLight ? "text-slate-500" : "text-slate-500",
    iconBtnGhost: isLight
      ? "border-slate-300 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700"
      : "border-slate-700/50 bg-slate-900/40 text-slate-300 hover:border-wa-ruri hover:text-slate-50",
  };
}
