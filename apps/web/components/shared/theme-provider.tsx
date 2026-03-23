"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import type { ReactNode } from "react";

type AppThemeProviderProps = ThemeProviderProps & {
  children?: ReactNode;
};

export const ThemeProvider = ({
  children,
  ...props
}: AppThemeProviderProps) => (
  <NextThemesProvider {...props}>{children}</NextThemesProvider>
);
