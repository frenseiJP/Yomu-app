"use client";

import { useState } from "react";
import ProfileAvatarField from "@/components/profile/ProfileAvatarField";
import CountrySelect from "@/components/profile/CountrySelect";
import { t } from "@/src/utils/i18n/t";
import type { Lang } from "@/src/utils/i18n/types";

type Props = {
  lang: Lang;
  locale: string;
  initialDisplayName: string;
  initialIcon: string;
  initialKokuseki: string;
  saveAction: (formData: FormData) => Promise<void>;
};

export default function ProfileSettingsClient({
  lang,
  locale,
  initialDisplayName,
  initialIcon,
  initialKokuseki,
  saveAction,
}: Props) {
  const [displayName, setDisplayName] = useState(initialDisplayName);

  return (
    <form action={saveAction} className="space-y-4">
      <div className="space-y-2">
        <p className="text-[11px] font-medium text-slate-400">
          {t(lang, "onboardingUserNameLabel")}
        </p>
        <input
          name="display_name"
          required
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full rounded-2xl border border-slate-800/70 bg-slate-900/50 px-3 py-2.5 text-[13px] text-slate-100 placeholder:text-slate-500 focus:border-wa-ruri focus:outline-none focus:ring-1 focus:ring-wa-ruri/60"
          placeholder={t(lang, "onboardingNamePlaceholder")}
          maxLength={40}
        />
      </div>

      <div className="space-y-2">
        <p className="text-[11px] font-medium text-slate-400">
          {t(lang, "onboardingIconLabel")}
        </p>
        <ProfileAvatarField
          initialIcon={initialIcon}
          choosePhotoLabel={t(lang, "onboardingChoosePhoto")}
          defaultHintLabel={t(lang, "onboardingAvatarDefaultHint")}
          uploadingLabel={t(lang, "onboardingAvatarUploading")}
          uploadErrorLabel={t(lang, "onboardingAvatarUploadError")}
        />
      </div>

      <div className="space-y-2">
        <p className="text-[11px] font-medium text-slate-400">
          {t(lang, "onboardingKokusekiLabel")}
        </p>
        <CountrySelect
          locale={locale}
          defaultValue={initialKokuseki}
          searchPlaceholder={t(lang, "onboardingCountrySearchPlaceholder")}
        />
      </div>

      <button
        type="submit"
        className="btn-wa-hover btn-wa-hover-ruri inline-flex w-full items-center justify-center rounded-2xl bg-pink-500/90 px-4 py-3 text-[12px] font-medium text-white shadow-[0_18px_60px_rgba(236,72,153,0.25)] transition hover:bg-pink-400"
      >
        {t(lang, "profileSaveButton")}
      </button>
    </form>
  );
}
