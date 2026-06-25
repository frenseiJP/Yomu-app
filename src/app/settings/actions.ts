"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import { isMissingTableError } from "@/src/utils/supabase/schema-errors";
import { EXPLICIT_LANG_COOKIE } from "@/lib/i18n/resolveLanguage";
import type { Lang } from "@/src/utils/i18n/types";
import { PROFILE_ICON_DEFAULT } from "@/lib/profile/icon";

const ALLOWED_DISPLAY_LANG: Lang[] = ["en", "ja", "ko", "zh"];

function parseDisplayLang(raw: string): Lang {
  return ALLOWED_DISPLAY_LANG.includes(raw as Lang) ? (raw as Lang) : "en";
}

async function persistSettingsLanguage(userId: string, nextLang: Lang, email?: string | null) {
  const supabase = await createClient();
  const { data: row, error: readErr } = await supabase
    .from("user_profiles")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (readErr && !isMissingTableError(readErr, "user_profiles")) {
    console.error("[settings] language read:", readErr);
    throw readErr;
  }

  if (row) {
    const { error } = await supabase
      .from("user_profiles")
      .update({ settings_language: nextLang })
      .eq("user_id", userId);
    if (error && !isMissingTableError(error, "user_profiles")) {
      console.error("[settings] language update:", error);
      throw error;
    }
    return;
  }

  const { error: insertErr } = await supabase.from("user_profiles").insert({
    user_id: userId,
    display_name: email?.split("@")[0]?.trim() || "Frensei",
    icon: PROFILE_ICON_DEFAULT,
    kokuseki: "OTHER",
    settings_language: nextLang,
  });
  if (insertErr && !isMissingTableError(insertErr, "user_profiles")) {
    console.error("[settings] language insert:", insertErr);
    throw insertErr;
  }
}

export async function saveLanguageAction(formData: FormData) {
  const nextLang = parseDisplayLang(String(formData.get("lang") ?? ""));

  cookies().set("yomu_lang", nextLang, {
    path: "/",
    sameSite: "lax",
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365,
  });
  cookies().set(EXPLICIT_LANG_COOKIE, "1", {
    path: "/",
    sameSite: "lax",
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365,
  });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  try {
    await persistSettingsLanguage(user.id, nextLang, user.email);
  } catch (err) {
    console.error("[settings] saveLanguageAction failed:", err);
    redirect("/settings?lang_error=1");
  }

  redirect("/settings");
}
