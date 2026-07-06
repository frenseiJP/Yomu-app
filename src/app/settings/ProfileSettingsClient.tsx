"use client";

import { useState } from "react";
import ProfileAvatarField from "@/components/profile/ProfileAvatarField";
import CountrySelect from "@/components/profile/CountrySelect";
import { t } from "@/src/utils/i18n/t";
import type { Lang } from "@/src/utils/i18n/types";
import { mkt } from "@/lib/ui/appTheme";

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
        <p className={`text-[11px] font-medium ${mkt.faint}`}>{t(lang, "onboardingUserNameLabel")}</p>
        <input
          name="display_name"
          required
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className={mkt.field}
          placeholder={t(lang, "onboardingNamePlaceholder")}
          maxLength={40}
        />
      </div>

      <div className="space-y-2">
        <p className={`text-[11px] font-medium ${mkt.faint}`}>{t(lang, "onboardingIconLabel")}</p>
        <ProfileAvatarField
          initialIcon={initialIcon}
          choosePhotoLabel={t(lang, "onboardingChoosePhoto")}
          defaultHintLabel={t(lang, "onboardingAvatarDefaultHint")}
          uploadingLabel={t(lang, "onboardingAvatarUploading")}
          uploadErrorLabel={t(lang, "onboardingAvatarUploadError")}
        />
      </div>

      <div className="space-y-2">
        <p className={`text-[11px] font-medium ${mkt.faint}`}>{t(lang, "onboardingKokusekiLabel")}</p>
        <CountrySelect
          locale={locale}
          defaultValue={initialKokuseki}
          searchPlaceholder={t(lang, "onboardingCountrySearchPlaceholder")}
        />
      </div>

      <button type="submit" className={mkt.ctaFull}>
        {t(lang, "profileSaveButton")}
      </button>
    </form>
  );
}
