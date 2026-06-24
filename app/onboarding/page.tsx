import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import { getLangServer } from "@/src/utils/i18n/serverLang";
import { t } from "@/src/utils/i18n/t";
import PendingGuestNote from "@/components/onboarding/PendingGuestNote";
import ProfileAvatarField from "@/components/profile/ProfileAvatarField";
import CountrySelect from "@/components/profile/CountrySelect";
import { normalizeProfileIcon, PROFILE_ICON_DEFAULT } from "@/lib/profile/icon";

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

function countryLocale(lang: string): string {
  if (lang === "ja") return "ja";
  if (lang === "ko") return "ko";
  if (lang === "zh") return "zh";
  return "en";
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
    const icon = normalizeProfileIcon(String(formData.get("icon") ?? ""));
    const kokuseki = String(formData.get("kokuseki") ?? "").trim();
    const firstLanguage = String(formData.get("first_language") ?? "").trim();
    const settingsLanguage = String(formData.get("settings_language") ?? "").trim();
    const goalWhy = String(formData.get("goal_why") ?? "").trim();
    const goalHardest = String(formData.get("goal_hardest") ?? "").trim();
    const goalMinutes = String(formData.get("goal_minutes") ?? "").trim();

    if (!displayName || !kokuseki || !firstLanguage) {
      redirect("/onboarding");
    }

    const allowed: Array<"ja" | "en" | "ko" | "zh"> = ["ja", "en", "ko", "zh"];
    const langCookie = allowed.includes(settingsLanguage as "ja" | "en" | "ko" | "zh")
      ? (settingsLanguage as "ja" | "en" | "ko" | "zh")
      : firstLanguage === "en"
        ? "en"
        : "ja";

    const supabaseForAction = await createClient();
    const {
      data: { user: currentUser },
    } = await supabaseForAction.auth.getUser();

    if (!currentUser) redirect("/login");

    cookies().set("yomu_lang", langCookie, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });

    cookies().set("yomu_first_lang", firstLanguage === "en" ? "en" : "ja", {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });

    if (goalWhy) {
      cookies().set("yomu_goal_why", goalWhy, { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });
    }
    if (goalHardest) {
      cookies().set("yomu_goal_hardest", goalHardest, {
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
      });
    }
    if (goalMinutes) {
      cookies().set("yomu_goal_minutes", goalMinutes, {
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    await supabaseForAction.from("user_profiles").upsert(
      [
        {
          user_id: currentUser.id,
          display_name: displayName,
          icon: icon || PROFILE_ICON_DEFAULT,
          kokuseki,
          first_language: firstLanguage === "en" ? "en" : "ja",
          settings_language: langCookie,
        },
      ],
      { onConflict: "user_id" },
    );

    redirect("/chat");
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 antialiased">
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <PendingGuestNote />
        <header className="mb-6">
          <h1 className="font-wa-serif text-lg font-semibold text-slate-50 sm:text-xl">
            {t(lang, "onboardingTitle")}
          </h1>
          <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">
            {t(lang, "onboardingDescription")}
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
                placeholder={t(lang, "onboardingNamePlaceholder")}
                maxLength={40}
              />
            </div>

            <div className="space-y-2">
              <p className="font-wa-serif text-[12px] font-semibold text-slate-200">
                {t(lang, "onboardingIconLabel")}
              </p>
              <ProfileAvatarField
                choosePhotoLabel={t(lang, "onboardingChoosePhoto")}
                defaultHintLabel={t(lang, "onboardingAvatarDefaultHint")}
                uploadingLabel={t(lang, "onboardingAvatarUploading")}
                uploadErrorLabel={t(lang, "onboardingAvatarUploadError")}
              />
            </div>

            <div className="space-y-2">
              <p className="font-wa-serif text-[12px] font-semibold text-slate-200">
                {t(lang, "onboardingKokusekiLabel")}
              </p>
              <CountrySelect
                locale={countryLocale(lang)}
                defaultValue="JP"
                searchPlaceholder={t(lang, "onboardingCountrySearchPlaceholder")}
              />
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
                  <option value="en">English</option>
                  <option value="ja">日本語</option>
                  <option value="ko">한국어</option>
                  <option value="zh">中文</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
              <p className="font-wa-serif text-[12px] font-semibold text-slate-200">
                {lang === "ja" ? "学習の目的" : "Why are you learning Japanese?"}
              </p>
              <select
                name="goal_why"
                defaultValue="travel"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-[13px]"
              >
                <option value="travel">{lang === "ja" ? "旅行" : "Travel"}</option>
                <option value="anime">{lang === "ja" ? "アニメ" : "Anime"}</option>
                <option value="work">{lang === "ja" ? "仕事" : "Work"}</option>
                <option value="living">{lang === "ja" ? "日本での生活" : "Living in Japan"}</option>
                <option value="friends">{lang === "ja" ? "友人・家族" : "Friends & Family"}</option>
              </select>
              <select
                name="goal_hardest"
                defaultValue="speaking"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-[13px]"
              >
                <option value="speaking">{lang === "ja" ? "話すこと" : "Speaking"}</option>
                <option value="listening">{lang === "ja" ? "聞くこと" : "Listening"}</option>
                <option value="grammar">{lang === "ja" ? "文法" : "Grammar"}</option>
                <option value="vocabulary">{lang === "ja" ? "語彙" : "Vocabulary"}</option>
                <option value="confidence">{lang === "ja" ? "自信" : "Confidence"}</option>
              </select>
              <select
                name="goal_minutes"
                defaultValue="5"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-[13px]"
              >
                <option value="2">2 min / day</option>
                <option value="5">5 min / day</option>
                <option value="10">10 min / day</option>
                <option value="20">20+ min / day</option>
              </select>
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
