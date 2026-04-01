import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import { getLangServer } from "@/src/utils/i18n/serverLang";
import { t } from "@/src/utils/i18n/t";

const ICON_CHOICES = [
  { value: "🌸", label: "Cherry" },
  { value: "🌻", label: "Sunflower" },
  { value: "🍁", label: "Maple" },
  { value: "❄️", label: "Snow" },
  { value: "🌊", label: "Ocean" },
];

const KOKUSEKI_CHOICES = [
  { value: "JP", label: "Japan", emoji: "🇯🇵" },
  { value: "US", label: "United States", emoji: "🇺🇸" },
  { value: "KR", label: "Korea", emoji: "🇰🇷" },
  { value: "CN", label: "China", emoji: "🇨🇳" },
  { value: "OTHER", label: "Other / Global", emoji: "🌏" },
];

type UserProfile = {
  user_id: string;
};

async function getExistingProfileUserId(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_profiles")
    .select("user_id")
    .eq("user_id", userId)
    .limit(1);
  return (data?.[0] as UserProfile | undefined)?.user_id ?? null;
}

export default async function OnboardingPage() {
  const supabase = await createClient();
  const lang = getLangServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const existing = await getExistingProfileUserId(user.id);
  if (existing) redirect("/chat");

  async function saveProfile(formData: FormData) {
    "use server";

    const displayName = String(formData.get("display_name") ?? "").trim();
    const icon = String(formData.get("icon") ?? "").trim();
    const kokuseki = String(formData.get("kokuseki") ?? "").trim();
    const firstLanguage = String(formData.get("first_language") ?? "").trim();
    const settingsLanguage = String(formData.get("settings_language") ?? "").trim();

    // UI 上では設定言語も選べるが、「開始言語に統一」を優先するため settingsLanguage は必須にしない
    if (!displayName || !icon || !kokuseki || !firstLanguage) {
      redirect("/onboarding");
    }

    const supabaseForAction = await createClient();
    const {
      data: { user: currentUser },
    } = await supabaseForAction.auth.getUser();

    if (!currentUser) redirect("/login");

    // cookie: settings language（yomu_lang）は開始言語に統一
    const lang = firstLanguage === "en" ? "en" : "ja";

    cookies().set("yomu_lang", lang, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });

    // cookie: first language（今後の初期表示最適化で利用）
    cookies().set("yomu_first_lang", firstLanguage === "en" ? "en" : "ja", {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });

    await supabaseForAction.from("user_profiles").upsert(
      [
        {
          user_id: currentUser.id,
          display_name: displayName,
          icon,
          kokuseki,
          first_language: firstLanguage === "en" ? "en" : "ja",
          settings_language: lang,
        },
      ],
      { onConflict: "user_id" },
    );

    redirect("/chat");
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 antialiased">
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <header className="mb-6">
          <h1 className="font-wa-serif text-lg font-semibold text-slate-50 sm:text-xl">
            {t(lang, "onboardingTitle")}
          </h1>
          <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">
            Set up your profile and display language to match your learning style.
          </p>
        </header>

        <section className="glass-panel rounded-3xl border border-slate-800/70 bg-slate-950/90 p-4 shadow-[0_22px_80px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-6">
          <form action={saveProfile} className="space-y-6">
            <div className="space-y-2">
              <p className="font-wa-serif text-[12px] font-semibold text-slate-200">
                {t(lang, "onboardingUserNameLabel")}
              </p>
              <input
                name="display_name"
                required
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-[13px] text-slate-100 placeholder:text-slate-500 focus:border-wa-ruri focus:outline-none focus:ring-1 focus:ring-wa-ruri/60"
                placeholder="e.g. Sota"
                maxLength={40}
              />
            </div>

            <div className="space-y-2">
              <p className="font-wa-serif text-[12px] font-semibold text-slate-200">
                {t(lang, "onboardingIconLabel")}
              </p>
              <div className="grid grid-cols-5 gap-2">
                {ICON_CHOICES.map((i) => (
                  <label
                    key={i.value}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/70 py-3 text-slate-300 transition hover:border-wa-ruri/60"
                  >
                    <input type="radio" name="icon" value={i.value} defaultChecked={i.value === "🌸"} className="sr-only" />
                    <span className="text-2xl">{i.value}</span>
                    <span className="mt-1 text-[10px]">{i.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-wa-serif text-[12px] font-semibold text-slate-200">
                {t(lang, "onboardingKokusekiLabel")}
              </p>
              <select
                name="kokuseki"
                required
                defaultValue="OTHER"
                className="w-full appearance-none rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-[13px] text-slate-100 focus:border-wa-ruri focus:outline-none focus:ring-1 focus:ring-wa-ruri/60"
              >
                {KOKUSEKI_CHOICES.map((k) => (
                  <option key={k.value} value={k.value}>
                    {k.emoji} {k.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="font-wa-serif text-[12px] font-semibold text-slate-200">
                  {t(lang, "onboardingFirstLanguageLabel")}
                </p>
                <select
                  name="first_language"
                  required
                  defaultValue="en"
                  className="w-full appearance-none rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-[13px] text-slate-100 focus:border-wa-ruri focus:outline-none focus:ring-1 focus:ring-wa-ruri/60"
                >
                  <option value="ja">Japanese</option>
                  <option value="en">English (UI)</option>
                </select>
              </div>

              <div className="space-y-2">
                <p className="font-wa-serif text-[12px] font-semibold text-slate-200">
                  {t(lang, "onboardingSettingsLanguageLabel")}
                </p>
                <select
                  name="settings_language"
                  required
                  defaultValue="en"
                  className="w-full appearance-none rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-[13px] text-slate-100 focus:border-wa-ruri focus:outline-none focus:ring-1 focus:ring-wa-ruri/60"
                >
                  <option value="ja">Japanese</option>
                  <option value="en">English (UI)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn-wa-hover btn-wa-hover-ruri w-full rounded-2xl bg-pink-500/90 px-4 py-3 text-[12px] font-medium text-white shadow-[0_18px_60px_rgba(236,72,153,0.25)] transition hover:bg-pink-400"
            >
              {t(lang, "onboardingSubmitButton")}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

