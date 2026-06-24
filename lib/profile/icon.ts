/** Sentinel stored in user_profiles.icon when no custom photo is set. */
export const PROFILE_ICON_DEFAULT = "default";

export function normalizeProfileIcon(value: string | null | undefined): string {
  const v = (value ?? "").trim();
  if (!v || v === "🌸") return PROFILE_ICON_DEFAULT;
  return v;
}

export function isProfilePhotoUrl(icon: string | null | undefined): boolean {
  const v = normalizeProfileIcon(icon);
  return v !== PROFILE_ICON_DEFAULT && /^https?:\/\//i.test(v);
}
