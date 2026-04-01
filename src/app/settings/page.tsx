import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/src/utils/supabase/server";
import { isMissingTableError } from "@/src/utils/supabase/schema-errors";
import { Activity, Mail, Sparkles } from "lucide-react";
import { getLangServer } from "@/src/utils/i18n/serverLang";
import { t } from "@/src/utils/i18n/t";
import type { Lang } from "@/src/utils/i18n/types";
import { regionLabelForLang } from "@/src/utils/i18n/prototypeCopy";
import {
  REGION_CHOICES,
  REGION_COOKIE_KEY,
  normalizeRegion,
} from "@/src/utils/region/region";
import LanguageSelectClient from "./LanguageSelectClient";
import GeneratePromptButton from "./GeneratePromptButton";

export default async function SettingsPage() {
  const supabase = await createClient();
  const lang = getLangServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { count: postCount } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { data: lastPosts } = await supabase
    .from("posts")
    .select("created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  const lastPostAt = lastPosts?.[0]?.created_at
    ? new Date(lastPosts[0].created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  // user_profiles: ユーザー固有のプロフィール情報（母国語など）
  const { data: profileRows, error: profileLoadErr } = await supabase
    .from("user_profiles")
    .select("native_language, region, settings_language, first_language")
    .eq("user_id", user.id)
    .limit(1);

  if (
    profileLoadErr &&
    !isMissingTableError(profileLoadErr, "user_profiles")
  ) {
    console.error("[settings] user_profiles load:", profileLoadErr);
  }

  const profileNativeLanguage = profileRows?.[0]?.native_language;
  const currentNativeLanguage =
    profileNativeLanguage === "en" ||
    profileNativeLanguage === "zh" ||
    profileNativeLanguage === "ko" ||
    profileNativeLanguage === "vi"
      ? profileNativeLanguage
      : "en";

  const currentRegion = normalizeRegion(profileRows?.[0]?.region);

  const langCookie = cookies().get("yomu_lang")?.value;
  const profileSettingsLanguage = profileRows?.[0]?.settings_language;

  const allowedDisplayLang: Lang[] = ["ja", "en", "ko", "zh"];
  const langCookieRaw: Lang | null =
    langCookie && allowedDisplayLang.includes(langCookie as Lang)
      ? (langCookie as Lang)
      : null;

  const profileLangRaw: Lang =
    allowedDisplayLang.includes(profileSettingsLanguage as Lang)
      ? (profileSettingsLanguage as Lang)
      : "en";

  const currentDisplayLang: Lang = langCookieRaw ?? profileLangRaw;

  async function handleSaveLanguage(formData: FormData) {
    "use server";

    const value = String(formData.get("lang") ?? "");
    const nextLang: Lang = allowedDisplayLang.includes(value as Lang)
      ? (value as Lang)
      : "en";

    cookies().set("yomu_lang", nextLang, {
      path: "/",
      sameSite: "lax",
      httpOnly: false,
      // 1年保持（必要なら調整してください）
      maxAge: 60 * 60 * 24 * 365,
    });

    // 言語選択をSupabaseにも保存（次回以降も維持しやすくする）
    const supabaseForAction = await createClient();
    const {
      data: { user: actionUser },
    } = await supabaseForAction.auth.getUser();
    if (!actionUser) redirect("/login");
    const { error: langUpsertErr } = await supabaseForAction
      .from("user_profiles")
      .upsert(
        [
          {
            user_id: actionUser.id,
            settings_language: nextLang,
          },
        ],
        { onConflict: "user_id" },
      );
    if (
      langUpsertErr &&
      !isMissingTableError(langUpsertErr, "user_profiles")
    ) {
      console.error("[settings] user_profiles upsert (lang):", langUpsertErr);
    }

    redirect("/settings");
  }

  async function handleResetToFirstLanguage() {
    "use server";
    const cookieFirst = cookies().get("yomu_first_lang")?.value ?? "";
    const profileFirstLanguage = profileRows?.[0]?.first_language;
    const first = cookieFirst || profileFirstLanguage || "ja";
    const nextLang: Lang = first === "en" ? "en" : "ja";

    cookies().set("yomu_lang", nextLang, {
      path: "/",
      sameSite: "lax",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 365,
    });

    const supabaseForAction = await createClient();
    const {
      data: { user: actionUser },
    } = await supabaseForAction.auth.getUser();
    if (!actionUser) redirect("/login");
    const { error: resetUpsertErr } = await supabaseForAction
      .from("user_profiles")
      .upsert(
        [
          {
            user_id: actionUser.id,
            settings_language: nextLang,
          },
        ],
        { onConflict: "user_id" },
      );
    if (
      resetUpsertErr &&
      !isMissingTableError(resetUpsertErr, "user_profiles")
    ) {
      console.error("[settings] user_profiles upsert (reset):", resetUpsertErr);
    }

    redirect("/settings");
  }

  async function handleSaveNativeLanguage(formData: FormData) {
    "use server";
    const raw = String(formData.get("native_lang") ?? "");

    const nextNativeLanguage =
      raw === "en" || raw === "zh" || raw === "ko" || raw === "vi" ? raw : "en";

    const supabaseForAction = await createClient();
    const {
      data: { user: actionUser },
    } = await supabaseForAction.auth.getUser();
    if (!actionUser) redirect("/login");
    const { error: nativeUpsertErr } = await supabaseForAction
      .from("user_profiles")
      .upsert(
        [
          {
            user_id: actionUser.id,
            native_language: nextNativeLanguage,
            // 片方だけ更新して既存値を欠落させないために現在の region も同時保存
            region: currentRegion,
          },
        ],
        { onConflict: "user_id" },
      );
    if (
      nativeUpsertErr &&
      !isMissingTableError(nativeUpsertErr, "user_profiles")
    ) {
      console.error(
        "[settings] user_profiles upsert (native):",
        nativeUpsertErr,
      );
    }

    redirect("/settings");
  }

  async function handleSaveRegion(formData: FormData) {
    "use server";
    const raw = String(formData.get("region") ?? "");
    const nextRegion = normalizeRegion(raw);

    cookies().set(REGION_COOKIE_KEY, nextRegion, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });

    const supabaseForAction = await createClient();
    const {
      data: { user: actionUser },
    } = await supabaseForAction.auth.getUser();
    if (!actionUser) redirect("/login");
    const { error: regionUpsertErr } = await supabaseForAction
      .from("user_profiles")
      .upsert(
        [
          {
            user_id: actionUser.id,
            region: nextRegion,
            // 片方だけ更新して既存値を欠落させないために現在の native_language も同時保存
            native_language: currentNativeLanguage,
          },
        ],
        { onConflict: "user_id" },
      );
    if (
      regionUpsertErr &&
      !isMissingTableError(regionUpsertErr, "user_profiles")
    ) {
      console.error(
        "[settings] user_profiles upsert (region):",
        regionUpsertErr,
      );
    }

    redirect(`/settings?region=${encodeURIComponent(nextRegion)}`);
  }

  return (
    <div
      className="min-h-screen bg-yomu-bg text-slate-100 antialiased"
      style={{ background: "#020617" }}
    >
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-6">
          <h1 className="font-wa-serif text-lg font-semibold text-slate-50 sm:text-xl">
            {t(lang, "settingsTitle")}
          </h1>
          <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">
            {t(lang, "settingsDescription")}
          </p>
        </header>

        <section className="space-y-4">
          {/* ログインユーザー */}
          <section className="glass-panel rounded-3xl border border-slate-800/70 bg-slate-950/90 p-4 backdrop-blur-xl sm:p-5">
            <div className="mb-3 flex items-center gap-2">
              <Mail className="h-4 w-4 text-wa-ruri" />
              <span className="font-wa-serif text-[11px] font-semibold tracking-[0.18em] text-slate-400">
                {t(lang, "userSectionLabel")}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-medium text-slate-400">
                {t(lang, "emailLabel")}
              </p>
              <p className="break-all rounded-2xl border border-slate-800/70 bg-slate-900/50 px-3 py-2 text-[13px] text-slate-100">
                {user.email ?? "—"}
              </p>
            </div>
          </section>

          {/* 活動実績 */}
          <section className="glass-panel rounded-3xl border border-slate-800/70 bg-slate-950/90 p-4 backdrop-blur-xl sm:p-5">
            <div className="mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-wa-kinari" />
              <span className="font-wa-serif text-[11px] font-semibold tracking-[0.18em] text-slate-400">
                {t(lang, "communityActivityTitle")}
              </span>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-pink-500/20 bg-pink-500/10 px-2 py-0.5 text-[10px] text-pink-200">
                <Sparkles className="h-3 w-3" />
                {t(lang, "accentTag")}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800/70 bg-slate-900/45 p-3">
                <p className="text-[11px] font-medium text-slate-400">
                  {t(lang, "postsCountLabel")}
                </p>
                <p className="mt-1 text-[20px] font-semibold text-slate-50">
                  {postCount ?? 0}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800/70 bg-slate-900/45 p-3">
                <p className="text-[11px] font-medium text-slate-400">
                  {t(lang, "lastPostAtLabel")}
                </p>
                <p className="mt-1 text-[13px] text-slate-100">
                  {lastPostAt ?? "—"}
                </p>
              </div>
            </div>
          </section>

          {/* AI お題生成 */}
          <section className="glass-panel rounded-3xl border border-slate-800/70 bg-slate-950/90 p-4 backdrop-blur-xl sm:p-5">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-300" />
              <span className="font-wa-serif text-[11px] font-semibold tracking-[0.18em] text-slate-400">
                {t(lang, "generatePromptSectionTitle")}
              </span>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-violet-500/25 bg-violet-500/10 px-2 py-0.5 text-[10px] text-violet-200">
                AI
              </span>
            </div>
            <p className="mb-4 text-[11px] leading-relaxed text-slate-400">
              {t(lang, "generatePromptDescription")}
            </p>
            <GeneratePromptButton
              buttonLabel={t(lang, "generatePromptButton")}
              loadingLabel={t(lang, "generatePromptLoading")}
              successMessage={t(lang, "promptUpdatedSuccess")}
              errorMessage={t(lang, "generatePromptFailed")}
            />
          </section>

          {/* 言語設定 */}
          <section className="glass-panel rounded-3xl border border-slate-800/70 bg-slate-950/90 p-4 backdrop-blur-xl sm:p-5">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-pink-300" />
              <span className="font-wa-serif text-[11px] font-semibold tracking-[0.18em] text-slate-400">
                {t(lang, "languageTitle")}
              </span>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-pink-500/20 bg-pink-500/10 px-2 py-0.5 text-[10px] text-pink-200">
                {t(lang, "accentTag")}
              </span>
            </div>

            <LanguageSelectClient
              currentDisplayLang={currentDisplayLang}
              displayLanguageLabel={t(lang, "displayLanguageLabel")}
              saveLanguageButtonLabel={t(lang, "saveLanguageButton")}
              saveAction={handleSaveLanguage}
            />
          </section>

          {/* 母国語（ユーザー要望によりUI非表示） */}

          {/* 地域（Region） */}
          <section className="glass-panel rounded-3xl border border-slate-800/70 bg-slate-950/90 p-4 backdrop-blur-xl sm:p-5">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-wa-kinari" />
              <span className="font-wa-serif text-[11px] font-semibold tracking-[0.18em] text-slate-400">
                {t(lang, "regionLabel")}
              </span>
            </div>

            <form action={handleSaveRegion} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                {REGION_CHOICES.map((r, idx) => {
                  const id = `region_${idx}`;
                  const checked = currentRegion === r.value;
                  return (
                    <div key={r.value} className="flex items-stretch">
                      <input
                        id={id}
                        type="radio"
                        name="region"
                        value={r.value}
                        defaultChecked={checked}
                        className="peer sr-only"
                      />
                      <label
                        htmlFor={id}
                        className={[
                          "cursor-pointer flex w-full items-center gap-2 rounded-2xl border px-3 py-2.5 text-[13px] transition",
                          "border-slate-800/70 bg-[#020617] text-slate-300",
                          "hover:border-wa-ruri/60",
                          "peer-checked:border-pink-500/70 peer-checked:bg-pink-500/20 peer-checked:text-white",
                        ].join(" ")}
                      >
                        <span className="truncate">
                          {regionLabelForLang(r.value, lang)}
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>

              <button
                type="submit"
                className="btn-wa-hover btn-wa-hover-ruri inline-flex w-full items-center justify-center rounded-2xl bg-pink-500/90 px-4 py-3 text-[12px] font-medium text-white shadow-[0_18px_60px_rgba(236,72,153,0.25)] transition hover:bg-pink-400"
              >
                {t(lang, "saveRegionButton")}
              </button>
            </form>
          </section>

          {/* ログアウトボタンはユーザー要望により非表示 */}
        </section>
      </main>
    </div>
  );
}

