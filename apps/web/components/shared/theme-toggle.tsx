"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const THEME_ICON_CONFIG = {
  dark: {
    Icon: Moon,
    exitRotation: -180,
    iconClassName: "text-primary",
    initialRotation: 180,
    key: "moon",
    nextTheme: "light",
  },
  light: {
    Icon: Sun,
    exitRotation: 180,
    iconClassName: "text-yellow-500",
    initialRotation: -180,
    key: "sun",
    nextTheme: "dark",
  },
} as const;

export const ThemeToggle = () => {
  const { setTheme, theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const currentTheme = theme === "system" ? systemTheme : theme;
  const themeMode = currentTheme === "light" ? "light" : "dark";
  const iconConfig = THEME_ICON_CONFIG[themeMode];
  const { Icon } = iconConfig;
  const handleThemeToggle = useCallback(() => {
    setTheme(iconConfig.nextTheme);
  }, [iconConfig.nextTheme, setTheme]);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button className="size-11" size="icon" variant="ghost" />;
  }

  return (
    <Button
      className="group relative size-11 hover:bg-transparent"
      onClick={handleThemeToggle}
      size="icon"
      variant="ghost"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          animate={{ rotate: 0, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center"
          exit={{ rotate: iconConfig.exitRotation, scale: 0 }}
          initial={{ rotate: iconConfig.initialRotation, scale: 0 }}
          key={iconConfig.key}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <Icon
            className={`${iconConfig.iconClassName} size-4 transition-transform group-hover:scale-110`}
          />
        </motion.div>
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
