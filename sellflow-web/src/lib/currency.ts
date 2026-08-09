export type StoreCurrency = "USD" | "KHR";

export const STORE_CURRENCIES: ReadonlyArray<{ value: StoreCurrency; label: string }> = [
  { value: "USD", label: "USD — US Dollar ($)" },
  { value: "KHR", label: "KHR — Cambodian Riel (៛)" },
];

export function normalizeCurrency(currency?: string | null): StoreCurrency {
  return currency === "KHR" ? "KHR" : "USD";
}

export function currencySymbol(currency?: string | null): string {
  return normalizeCurrency(currency) === "KHR" ? "៛" : "$";
}

export function currencyDecimals(currency?: string | null): number {
  return normalizeCurrency(currency) === "KHR" ? 0 : 2;
}

export function activeStoreCurrency(): StoreCurrency {
  if (typeof window === "undefined") return "USD";
  try {
    const user = JSON.parse(window.sessionStorage.getItem("user") || "null") as { business?: { currency?: string } } | null;
    return normalizeCurrency(user?.business?.currency);
  } catch {
    return "USD";
  }
}

export function formatCurrency(value: number | string, currency?: string | null, compact = false): string {
  const code = normalizeCurrency(currency);
  const decimals = currencyDecimals(code);

  return new Intl.NumberFormat(code === "KHR" ? "km-KH" : "en-US", {
    style: "currency",
    currency: code,
    currencyDisplay: "narrowSymbol",
    notation: compact ? "compact" : "standard",
    minimumFractionDigits: compact ? 0 : decimals,
    maximumFractionDigits: compact ? 1 : decimals,
  }).format(Number(value) || 0);
}
