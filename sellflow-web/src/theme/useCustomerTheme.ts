import { useEffect, useState, type CSSProperties } from "react";
import type { ThemeSettings } from "../types/theme";
import { CUSTOMER_THEMES, isCustomerTheme, type CustomerThemeId } from "./customerThemes";

export type CustomerThemeSelection = CustomerThemeId | "store";

function readSelection(slug: string): CustomerThemeSelection {
  const saved = window.localStorage.getItem(`sellflow:storefront-theme:${slug}`);
  return saved && isCustomerTheme(saved) ? saved : "store";
}

export function useCustomerTheme(slug: string) {
  const [selection, setSelection] = useState<CustomerThemeSelection>(() => readSelection(slug));

  useEffect(() => {
    setSelection(readSelection(slug));
  }, [slug]);

  const select = (value: CustomerThemeSelection) => {
    setSelection(value);
    const key = `sellflow:storefront-theme:${slug}`;
    if (value === "store") window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  };

  return { selection, select };
}

export function resolveCustomerTheme(published: ThemeSettings, selection: CustomerThemeSelection) {
  return selection === "store" ? published : CUSTOMER_THEMES[selection];
}

export function customerThemeVariables(theme: ThemeSettings): CSSProperties {
  const fontFamily = theme.font_family === "classic"
    ? "'Kantumruy Pro', Georgia, Cambria, serif"
    : "'Kantumruy Pro', 'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif";
  return {
    "--customer-primary": theme.primary_color,
    "--customer-secondary": theme.secondary_color,
    "--customer-background": theme.background_color,
    "--customer-surface": theme.surface_color,
    "--customer-text": theme.text_color,
    "--customer-muted": theme.muted_color,
    "--customer-border": `${theme.muted_color}35`,
    "--customer-radius": theme.button_style === "pill" ? "9999px" : theme.button_style === "square" ? "6px" : "16px",
    backgroundColor: theme.background_color,
    color: theme.text_color,
    fontFamily,
  } as CSSProperties;
}
