import { vi } from "vitest";

interface ThemeMock {
  forcedTheme: undefined;
  resolvedTheme: string;
  setTheme: (theme: string) => void;
  systemTheme: "light" | "dark";
  theme: string;
  themes: string[];
}

export const useTheme: () => ThemeMock = vi.fn(() => ({
  forcedTheme: undefined,
  resolvedTheme: "light",
  setTheme: vi.fn(),
  systemTheme: "light" as const,
  theme: "light",
  themes: ["light", "dark"],
}));
