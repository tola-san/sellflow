import { twMerge } from "tailwind-merge";

type ClassDictionary = Record<string, boolean | null | undefined>;
type ClassValue = string | false | null | undefined | ClassDictionary;

export function cn(...inputs: ClassValue[]): string {
  return twMerge(
    inputs
      .flatMap((input) => {
        if (!input) return [];
        if (typeof input === "string") return [input];
        return Object.entries(input)
          .filter(([, enabled]) => Boolean(enabled))
          .map(([className]) => className);
      })
      .join(" "),
  );
}
