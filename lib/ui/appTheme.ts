/** Frensei app-wide light theme tokens (LP, auth, app shell, legal). */
export const mkt = {
  page: "min-h-screen bg-slate-50 text-slate-900",
  heading: "text-slate-900",
  body: "text-slate-700",
  muted: "text-slate-600",
  faint: "text-slate-500",
  card: "rounded-2xl border border-slate-200 bg-white shadow-sm",
  cardSoft: "rounded-2xl border border-slate-200 bg-slate-100",
  cardHero: "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8",
  navLink: "rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900",
  cta:
    "inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
  ctaSm:
    "inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700",
  ctaFull: "w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60",
  secondaryBtn:
    "inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50",
  link: "font-medium text-blue-700 hover:text-blue-800",
  accent: "text-blue-700",
  accentIcon: "text-blue-600",
  badge: "text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-700",
  eyebrow: "text-xs tracking-[0.18em] text-blue-700",
  icon: "text-blue-600",
  field:
    "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100",
  fieldLg:
    "w-full rounded-xl border border-slate-300 bg-white py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100",
  select:
    "w-full appearance-none rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100",
  spinner: "h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600",
  brandIcon: "flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm",
  articleTitle: "text-base font-bold text-blue-800 sm:text-lg",
  alertInfo: "rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs leading-relaxed text-blue-900",
  alertWarn: "rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-900",
  alertError: "rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800",
  alertSuccess: "rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800",
  footerBand: "rounded-3xl bg-slate-900 px-8 py-12 text-center sm:px-12",
  footerBandTitle: "text-2xl font-bold text-white sm:text-3xl",
  footerBandBody: "text-sm text-slate-200",
} as const;
