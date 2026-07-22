import type { CSSProperties } from "react";

export type DashboardThemeId = "light" | "midnight" | "ocean" | "forest" | "sunset";

export interface DashboardTheme {
  label: string;
  accent: string;
  accentSoft: string;
  canvas: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
}

export const DASHBOARD_THEMES: Record<DashboardThemeId, DashboardTheme> = {
  light: { label: "SellFlow Light", accent: "#7C3AED", accentSoft: "#F3E8FF", canvas: "#F8FAFC", surface: "#FFFFFF", text: "#0F172A", muted: "#64748B", border: "#E2E8F0" },
  midnight: { label: "Midnight", accent: "#A78BFA", accentSoft: "#2E2250", canvas: "#090E1A", surface: "#111827", text: "#F8FAFC", muted: "#94A3B8", border: "#263244" },
  ocean: { label: "Ocean", accent: "#0284C7", accentSoft: "#E0F2FE", canvas: "#F0F9FF", surface: "#FFFFFF", text: "#0C4A6E", muted: "#5B7C8D", border: "#BAE6FD" },
  forest: { label: "Forest", accent: "#15803D", accentSoft: "#DCFCE7", canvas: "#F0FDF4", surface: "#FFFFFF", text: "#14532D", muted: "#5C7764", border: "#BBF7D0" },
  sunset: { label: "Sunset", accent: "#EA580C", accentSoft: "#FFEDD5", canvas: "#FFF7ED", surface: "#FFFFFF", text: "#431407", muted: "#8A6759", border: "#FED7AA" },
};

export const DASHBOARD_THEME_EVENT = "sellflow:dashboard-theme";
const STORAGE_KEY = "sellflow:dashboard-theme";

export function getDashboardThemeId(): DashboardThemeId {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved && saved in DASHBOARD_THEMES ? saved as DashboardThemeId : "light";
}

export function saveDashboardTheme(id: DashboardThemeId) {
  window.localStorage.setItem(STORAGE_KEY, id);
  window.dispatchEvent(new CustomEvent(DASHBOARD_THEME_EVENT, { detail: id }));
}

export function dashboardThemeVariables(theme: DashboardTheme): CSSProperties {
  return {
    "--dashboard-accent": theme.accent,
    "--dashboard-accent-soft": theme.accentSoft,
    "--dashboard-canvas": theme.canvas,
    "--dashboard-surface": theme.surface,
    "--dashboard-text": theme.text,
    "--dashboard-muted": theme.muted,
    "--dashboard-border": theme.border,
  } as CSSProperties;
}
