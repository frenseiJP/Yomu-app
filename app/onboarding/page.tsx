import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import { getLangServer } from "@/src/utils/i18n/serverLang";
import { EXPLICIT_LANG_COOKIE, LANG_POLICY_VERSION } from "@/lib/i18n/resolveLanguage";
import { t } from "@/src/utils/i18n/t";
import PendingGuestNote from "@/components/onboarding/PendingGuestNote";
import ProfileAvatarField from "@/components/profile/ProfileAvatarField";
import CountrySelect from "@/components/profile/CountrySelect";
import { normalizeProfileIcon, PROFILE_ICON_DEFAULT } from "@/lib/profile/icon";
import { normalizeOnboardingResponse } from "@/lib/onboarding/schema";
import { getOnboardingGoalCopy } from "@/lib/i18n/onboardingCopy";

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
  const goalCopy = getOnboardingGoalCopy(lang);
  const defaultFirstLang = "en";
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
      : "en";

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

    cookies().set("yomu_lang_rev", LANG_POLICY_VERSION, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });

    cookies().set(EXPLICIT_LANG_COOKIE, "1", {
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

    const onboarding = normalizeOnboardingResponse({
      why: goalWhy,
      hardest: goalHardest,
      minutes: goalMinutes,
    });
    if (onboarding.why || onboarding.hardest || onboarding.minutes) {
      await supabaseForAction.from("user_onboarding_responses").upsert(
        {
          user_id: currentUser.id,
          why_learning: onboarding.why || null,
          hardest_area: onboarding.hardest || null,
          minutes_per_day: onboarding.minutes || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );
    }

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
                  defaultValue={defaultFirstLang}
                  className="w-full appearance-none rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-[13px] text-slate-100 focus:border-wa-ruri focus:outline-none focus:ring-1 focus:ring-wa-ruri/60"
                >
                  <option value="ja">{goalCopy.firstLanguageJa}</option>
                  <option value="en">{goalCopy.firstLanguageEn}</option>
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
                  <option value="en">{goalCopy.displayLanguage.en}</option>
                  <option value="ja">{goalCopy.displayLanguage.ja}</option>
                  <option value="ko">{goalCopy.displayLanguage.ko}</option>
                  <option value="zh">{goalCopy.displayLanguage.zh}</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
              <p className="font-wa-serif text-[12px] font-semibold text-slate-200">
                {goalCopy.goalSectionTitle}
              </p>
              <select
                name="goal_why"
                defaultValue="travel"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-[13px]"
              >
                {Object.entries(goalCopy.goalWhy).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                name="goal_hardest"
                defaultValue="speaking"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-[13px]"
              >
                {Object.entries(goalCopy.goalHardest).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                name="goal_minutes"
                defaultValue="5"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-[13px]"
              >
                {Object.entries(goalCopy.goalMinutes).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
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
