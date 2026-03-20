"use client";

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";
import type { ReactNode } from "react";

type AppThemeProviderProps = ThemeProviderProps & {
  children?: ReactNode;
};

export const ThemeProvider = ({
  children,
  ...props
}: AppThemeProviderProps) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};
