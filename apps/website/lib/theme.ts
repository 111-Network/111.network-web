/**
 * Theme utilities and constants
 */

export const THEME_STORAGE_KEY = "111-network-theme";

export type Theme = "light" | "dark" | "system";

export const themes: Theme[] = ["light", "dark", "system"];

/**
 * Get the effective theme (resolves "system" to actual theme)
 */
export function getEffectiveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  }
  return theme;
}
