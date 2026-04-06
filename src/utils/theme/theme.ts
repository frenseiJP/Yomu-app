export type UiTheme = "dark" | "light";

export const UI_THEME_STORAGE_KEY = "frensei_ui_theme";

export function normalizeUiTheme(value: unknown): UiTheme {
  return value === "light" ? "light" : "dark";
}

export function getStoredUiTheme(): UiTheme {
  if (typeof window === "undefined") return "dark";
  try {
    return normalizeUiTheme(window.localStorage.getItem(UI_THEME_STORAGE_KEY));
  } catch {
    return "dark";
  }
}

export function setStoredUiTheme(theme: UiTheme): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(UI_THEME_STORAGE_KEY, theme);
  } catch {
    // noop
  }
}

